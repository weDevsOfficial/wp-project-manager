<?php
/**
 * Created by PhpStorm.
 * User: wedevs-macbook-2
 * Date: 18/12/18
 * Time: 5:48 PM
 */

namespace WeDevs\PM\Tools\Helpers;
use Carbon\Carbon;
use WP_Background_Process;
use WP_Query;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Role\Models\Role;
use WeDevs\PM\User\Models\User_Role;
use WeDevs\PM_Pro\User\Models\User;
use WeDevs\PM\Milestone\Models\Milestone;
use WeDevs\PM\Common\Models\Meta;
use WeDevs\PM\Common\Models\Board;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Common\Models\Assignee;
use WeDevs\PM\File\Models\File;
use WeDevs\PM\Comment\Models\Comment;
use WeDevs\PM\Settings\Models\Settings;
use WeDevs\PM\Category\Models\Category;
use WeDevs\PM\Activity\Models\Activity;

use WeDevs\PM\Tools\Library\PM_ActiveCol;

class ImportActivecollab extends WP_Background_Process
{
    /**
     * @var string
     */
    protected $action = 'activecol_import';
    private $credentials; //= pm_get_settings('activecol_credentials');
    private $activecol;
    private $imported;
    private $importing;
    private $projectDetails;
    private $taskLists;
    private $members;

    public function __construct()
    {
        parent::__construct();
        add_action('init', [$this, 'after_load_wp'] );
//        $this->after_load_wp();
    }

    public function after_load_wp() {
        $this->credentials = pm_get_setting('activecol_credentials');
        if(!$this->credentials){
            pm_set_settings('activecol_credentials', array('token' => '', 'url' => '', 'accID' => ''));
        } else {
            if(array_key_exists('token', $this->credentials)) {
                $this->activecol = new PM_ActiveCol($this->credentials['url'],$this->credentials['token']);

            }
            $this->imported = get_option('imported_from_activecol');
            $this->importing = get_option('importing_from_activecol');
            if(!$this->imported){
                add_option('imported_from_activecol', array());
            }
            if(!$this->importing){
                add_option('importing_from_activecol', array());
            }
        }

        new FormatActiveCollab();

    }

    /**
     * Task
     *
     * Override this method to perform any actions required on each
     * queue item. Return the modified item for further processing
     * in the next pass through. Or, return false to remove the
     * item from the queue.
     *
     * @param mixed $item Queue item to iterate over
     *
     * @return mixed
     */
    protected function task( $item ) {
        // Actions to perform
        if(!in_array($item, $this->imported)) {
            $this->fetchAndSaveactivecol($item);
            array_push($this->imported, $item);
            if (in_array($item, $this->importing)) {
                $key = array_search($item, $this->importing);
                unset($this->importing[$key]);
                update_option('importing_from_activecol', $this->importing);
            }
            update_option('imported_from_activecol', $this->imported);
        }
        return false;
    }

    /**
     * Complete
     *
     * Override if applicable, but ensure that the below actions are
     * performed, or, call parent::complete().
     */
    protected function complete() {
        parent::complete();

        // Show notice to user or perform some other arbitrary task...
    }

    /**
     * Handle cron healthcheck
     *
     * Restart the background process if not already running
     * and data exists in the queue.
     */
    public function handle_cron_healthcheck() {
        if ( $this->is_process_running() ) {
            // Background process already running.
            return;
        }

        if ( $this->is_queue_empty() ) {
            // No data to process.
            $this->clear_scheduled_event();
            return;
        }

        $this->handle();
    }

    /**
     * takes activecol board id and fetch all boards
     * from API
     * @param $project_id
     */

    public function fetchAndSaveactivecol($project_id) {
        $fr = new FileData();
        $this->projectDetails = $fr->get_content('acl/active_collab_project_'.$project_id.'.wppm');
        $this->migrateProjectMembers($this->projectDetails['members'], $project_id);
        $pm_project = new Project();
        $pm_project->title = $this->projectDetails['title'];
        $pm_project->description = $this->projectDetails['description'];
        $pm_project->status = $this->projectDetails['status'];
        $pm_project->budget = $this->projectDetails['budget'];
        $pm_project->pay_rate = $this->projectDetails['pay_rate'];
        $pm_project->est_completion_date = $this->projectDetails['est_completion_date'];
        $pm_project->color_code = $this->projectDetails['color_code'];
        $pm_project->order = $this->projectDetails['order'];
        $pm_project->projectable_type = $this->projectDetails['projectable_type'];
        $pm_project->completed_at = $this->projectDetails['completed_at'];
        $pm_project->created_by = $this->getOrCreateUserId($this->makeUname($this->projectDetails['created_by']), $this->projectDetails['created_by']);
        $pm_project->updated_by = $this->getOrCreateUserId('xyz123', $this->projectDetails['created_by']);
        $pm_project->created_at = $this->projectDetails['created_at'];
        $pm_project->updated_at = $this->projectDetails['updated_at'];
        $pm_project->save();
        $this->fetchAndSaveLists($this->projectDetails['tasks_lists'], $project_id, $pm_project->id);

        error_log($this->projectDetails['title']);

    }

    /**
     * converting activecol lists to cpm boards
     * fetching all lists from activecol API against its board
     * activecol lists to cpm boards
     * @param $project_id
     * @param $pm_project_id
     */

    public function fetchAndSaveLists( $taskLists, $aclPID, $pm_project_id ){

        $pm_board = new Board();
        $pm_board->title = "inbox";
        $pm_board->description = "";
        $pm_board->order = "1";
        $pm_board->type = "task_list";
        $pm_board->status = 1;//$list['closed'];
        $pm_board->project_id = $pm_project_id;
        $pm_board->created_by = get_current_user_id();
        $pm_board->updated_by = get_current_user_id();
        $pm_board->save();
        $this->taskLists['inbox'] = $pm_board->id;


            foreach ($taskLists as $taskList) {
                $pm_board_pre = new Board();
                $pm_board_pre->title = $taskList['title'];
                $pm_board_pre->description = "";
                $pm_board_pre->order = "1";
                $pm_board_pre->type = "task_list";
                $pm_board_pre->status = 1;//$list['closed'];
                $pm_board_pre->project_id = $pm_project_id;
                $pm_board_pre->created_by = $this->getOrCreateUserId($this->makeUname($taskList['created_by']),$taskList['created_by']);
                $pm_board_pre->updated_by = $this->getOrCreateUserId($this->makeUname($taskList['created_by']),$taskList['created_by']);
                $pm_board_pre->save();
                $this->taskLists[$taskList['id']] = $pm_board_pre->id;
            }

            $this->fetchAndSaveTasks($this->projectDetails['tasks'], $pm_project_id);

    }

    /**
     * Converting activecol cards to pm tasks
     * @param $list_id
     * @param $pm_board_id
     */
    public function fetchAndSaveTasks($tasks, $pm_project_id){

        foreach ($tasks as $task) {
            $pm_taks = new Task();
            $pm_taks->title = $task['title'];
            $pm_taks->description = $task['description'];
            $pm_taks->estimation = 0;
            $pm_taks->start_at = $task['start_at'];
            $pm_taks->due_date = $task['due_date'];
            $pm_taks->complexity = 0;
            $pm_taks->priority = 1;
            $pm_taks->payable = null;
            $pm_taks->recurrent = 0;
            $pm_taks->status = 0;
            $pm_taks->project_id = $pm_project_id;
            $pm_taks->completed_by = null;
            $pm_taks->completed_at = null;
            $pm_taks->parent_id = 0;
            $pm_taks->created_at = $task['created_at'];
            $pm_taks->updated_at = $task['updated_at'];
            $pm_taks->save();

            $boardid = $this->makeBoardable(
                $this->taskLists[$task['task_list_id']],
                $pm_taks->id
            );
            $this->setAssignee($task['assignee_id'], $pm_taks->id, $pm_project_id);

            $this->migrateTaskComments($task['comments'], $pm_project_id, $pm_taks->id);

            $this->migrateTaskSubs($task['subtasks'], $boardid, $pm_project_id, $pm_taks->id);

        }
    }

    public function migrateTaskSubs($tasksubs,$pm_board_id, $pm_project_id, $pm_task_id){

        foreach ($tasksubs as $tasksub) {

            $subtask = array(
                'title' => $tasksub['title'],
                'description' => "",
                'estimation' => "0",
                'start_at' => null,
                'due_date' => null,
                'complexity' => 0,
                'priority' => 1,
                'payable' => 0,
                'recurrent' => 9,
                'status' => $tasksub['status'] == false ? '0' : '1' ,
                'project_id' => $pm_project_id,
                'completed_by' => null,
                'completed_at' => null,
                'parent_id' => $pm_task_id,
                'created_at' => $tasksub['created_at'],
                'updated_at' => $tasksub['updated_at']
            );
            $__sub_task =Task::create($subtask);

            $boardable = array(
                'board_id' => $pm_board_id,
                'board_type' => "task_list",
                'boardable_id' => $__sub_task->id,
                'boardable_type' => "sub_task",
                'order' => "1",
                'created_by' => 0,
                'updated_by' => 0,
            );
            Boardable::create($boardable);

            $this->setAssignee($tasksub['assignee_id'], $__sub_task->id, $pm_project_id);
        }

    }

    public function makeBoardable($board_id, $pm_task_id){

        $boardable = new Boardable();
        $boardable->board_id = $board_id;
        $boardable->board_type = "task_list";
        $boardable->boardable_id = $pm_task_id;
        $boardable->boardable_type = "task";
        $boardable->order = 1;
        $boardable->created_by = 0;
        $boardable->updated_by = 0;
        $boardable->save();
        return $board_id;
    }

    public function setAssignee($user_id,$pm_task_id,$pm_project_id){
        if(array_key_exists($user_id, $this->members)){
            $assignee = array(
                'task_id' => $pm_task_id,
                'assigned_to' => $this->members[$user_id],
                'status' => '0',
                'project_id' => $pm_project_id
            );
            Assignee::create($assignee);
        }
    }
    /**
     * @param $username
     * @param $email
     * @return int|\WP_Error
     */
    public function getOrCreateUserId($username, $email){
        $email = sanitize_email( $email );
//        error_log('entered create user email : '.$email);
//        $hasUser = get_user_by( 'email', $email);

        $username_exists = username_exists( $username );
        $email_exists = email_exists( $email );

        if( ! $email_exists && ! $username_exists ){
            $newUser = wp_create_user( strtolower($username), wp_generate_password(10), $email);

//            wp_send_new_user_notifications($newUser);
            return $newUser;

        } else if ( $username_exists ) {
            return $username_exists;
        } else {
            return $email_exists;
        }
    }

    /**
     * migrating activecol board members to cpm project user
     * @param $members
     * @param $project_id
     */

    public function migrateProjectMembers($activecol_board_members,$pm_project_id){
        error_log('entered ACP Members');
        $activecol_board_members = $this->repairStringArray($activecol_board_members);
        foreach ($activecol_board_members as $member){
            $user_id = null;
            $user_role = array();
            if($member['email']){
                $user_id = $this->getOrCreateUserId($member['name'],$member['email']);
            } else {
                $user_id = $this->getOrCreateUserId($member['name'],$this->makeFakeEmail($member['name']));
            }

            if($user_id !== null){
                $user_role = array(
                    'user_id' => $user_id,
                    'role_id' => $this->convertRole($member['role']),
                    'project_id' => $pm_project_id,
                    'assigned_by' => '0',
                );
                User_Role::create($user_role);
            }
            $this->members[$member['id']] = $user_id;

        }
    }

    /**
     * @param $activecol_card_members
     * @param $pm_project_id
     * @param $pm_task_id
     */
    public function migrateCardMembers($activecol_card_members, $pm_project_id, $pm_task_id){
        error_log('entered Card Members');
        $activecol_card_members = $this->repairStringArray($activecol_card_members);
        if(count($activecol_card_members) > 0) {
            foreach ($activecol_card_members as $member) {
                $user_id = null;
                $assignee = array();
                $credentials = $this->activecol->getMemberInfo($member['id']);
                if ($credentials['email']) {
                    $user_id = $this->getOrCreateUserId($credentials['username'], $credentials['email']);
                } else {
                    $user_id = $this->getOrCreateUserId($credentials['username'], $this->makeFakeEmail($credentials['username']));
                }

                if($user_id !== null){
                    $assignee = array(
                        'task_id' => $pm_task_id,
                        'assigned_to' => $user_id,
                        'status' => '0',
                        'project_id' => $pm_project_id
                    );
                    Assignee::create($assignee);
                }
            }
        }

    }

    /**
     * @return string
     */
    public function makeUname($email)
    {
        $email = sanitize_email($email);
        $uname = explode("@", $email);

        return $uname[0];
    }

    /**
     * @param $activecol_card_Comments
     * @param $pm_project_id
     * @param $pm_task_id
     */
    public function migrateTaskComments($task_comments, $pm_project_id, $pm_task_id){
        error_log('entered Tasks Comments');

    foreach ($task_comments as $comment) {

                $user_id = $this->getOrCreateUserId(
                    $comment['user_name'],
                    $comment['user_email']
                );
                global $wpdb;
                $com_id = $wpdb->insert($wpdb->prefix . 'pm_comments', array(
                    'content' => $comment['content'],
                    'mentioned_users' => null,
                    'commentable_id' => $pm_task_id,
                    'commentable_type' => 'task',
                    'project_id' => $pm_project_id,
                    'created_by' => $user_id,
                    'updated_by' => $user_id
                ));
                error_log('comment_id : ' . $com_id);
            }

        }





    /**
     * @param $activecol_card_Checklists
     * @param $pm_project_id
     * @param $pm_task_id
     */
    public function migrateCardChecklists($activecol_card_Checklists,$pm_board_id, $pm_project_id, $pm_task_id){
        error_log('entered Card Comments');
        if(count($activecol_card_Checklists) > 0) {
            foreach ($activecol_card_Checklists as $checklist) {
                $list_item = $checklist['checkItems'];
                if(count($list_item) > 0) {
                    foreach ($list_item as $item){

                        $subtask = array(
                            'title' => $item['name'],
                            'description' => "",
                            'estimation' => "0",
                            'start_at' => null,
                            'due_date' => null,
                            'complexity' => 0,
                            'priority' => 1,
                            'payable' => 0,
                            'recurrent' => 9,
                            'status' => $item['state'] == 'incomplete'? '0' : '1' ,
                            'project_id' => $pm_project_id,
                            'completed_by' => null,
                            'completed_at' => null,
                            'parent_id' => $pm_task_id,
                            'created_by' => get_current_user_id(),
                            'updated_by' => get_current_user_id()
                        );
                        $__sub_task =Task::create($subtask);

                        $projectable = array(
                            'board_id' => $pm_board_id,
                            'board_type' => "task_list",
                            'boardable_id' => $__sub_task->id,
                            'boardable_type' => "sub_task",
                            'order' => "1",
                            'created_by' => get_current_user_id(),
                            'updated_by' => get_current_user_id(),
                        );
                        Boardable::create($projectable);
                    }
                }
            }
        }

    }

    public function convertRole($role){
        if($role == 'Owner'){
            return '1';
        } else {
            return '2';
        }
    }

    public function makeFakeEmail($name){
        $email = '';
        $mailuser = str_replace(' ', '', $name);
        $mailuser = preg_replace('/[^A-Za-z0-9\-]/', '', $mailuser);
        $hostname = str_replace('http', '',get_site_url());
        $hostname = str_replace('://', '',$hostname);
        echo $hostname;
        if (strpos($hostname, ".")) {
            $email = 'activecol_'.$mailuser.'@'.$hostname;
        } else {
            $email = 'activecol_'.$mailuser.'@'.$hostname.'.com';
        }
        $email = sanitize_email( $email );
        return $email;
    }

    public function repairStringArray($stringArray){
        if(is_string ($stringArray)){
            return json_decode($stringArray, true);
        } else {
            return $stringArray;
        }
    }

}

