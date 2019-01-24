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
    private $taskLists;

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

        $project = $this->activecol->getProject($project_id);
//        $project_members = $this->activecol->getBoardMemberships($project_id);
        // activecol board to cpm project
        $pm_project = new Project();
        $pm_project->title = $project['single']['name'];
        $pm_project->description = $project['single']['body'];
        $pm_project->status = $project['single']['is_completed'];
        $pm_project->budget = null;
        $pm_project->pay_rate = null;
        $pm_project->est_completion_date = null;
        $pm_project->color_code = null;
        $pm_project->order = null;
        $pm_project->projectable_type = null;
        $pm_project->completed_at = null;
        $pm_project->created_by = get_current_user_id();
        $pm_project->updated_by = get_current_user_id();
        $pm_project->save();

        //migrating members to user
//        $this->migrateBoardsMembers($project_members, $pm_project->id);
        // activecol lists to cpm boards
        $this->fetchAndSaveLists($project['task_lists'], $project_id, $pm_project->id);

        error_log($project['single']['name']);

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
                $pm_board_pre->title = $taskList['name'];
                $pm_board_pre->description = "";
                $pm_board_pre->order = "1";
                $pm_board_pre->type = "task_list";
                $pm_board_pre->status = 1;//$list['closed'];
                $pm_board_pre->project_id = $pm_project_id;
                $pm_board_pre->created_by = get_current_user_id();
                $pm_board_pre->updated_by = get_current_user_id();
                $pm_board_pre->save();
                $this->taskLists[$taskList['id']] = $pm_board_pre->id;
            }

            $this->fetchAndSaveTasks($aclPID, $pm_project_id);


    }

    /**
     * Converting activecol cards to pm tasks
     * @param $list_id
     * @param $pm_board_id
     */
    public function fetchAndSaveTasks($aclPID, $pm_project_id){
        $tasks = $this->activecol->getItem('/projects/'.$aclPID.'/tasks');

        foreach ($tasks['tasks'] as $task) {
            $pm_taks = new Task();
            $pm_taks->title = $task['name'];
            $pm_taks->description = $task['body'];
            $pm_taks->estimation = 0;
            $pm_taks->start_at = Carbon::createFromTimestamp($task['start_on'])->toDateString();
            $pm_taks->due_date = Carbon::createFromTimestamp($task['due_on'])->toDateString();;
            $pm_taks->complexity = 0;
            $pm_taks->priority = 1;
            $pm_taks->payable = null;
            $pm_taks->recurrent = NULL;
            $pm_taks->status = 0;
            $pm_taks->project_id = $pm_project_id;
            $pm_taks->completed_by = null;
            $pm_taks->completed_at = null;
            $pm_taks->parent_id = 0;
            $pm_taks->created_by = get_current_user_id();
            $pm_taks->updated_by = get_current_user_id();
            $pm_taks->save();

            $boardid = $this->makeBoardable(
                $this->taskLists[$task['task_list_id']],
                $pm_taks->id
            );

//                    if (is_array($task->followers)) {
//                        $this->migrateTaskFollowers($task->followers, $pm_project_id, $pm_taks->id);
//                    }
//                    $subtasks = $this->asana->getAsana('tasks/'.$task->id.'/subtasks');
//                    sleep(3);
//                    error_log('subtask imported : '.print_r($subtasks, true));
//                    //migrating checklists to sub_task
//                    if (is_array($subtasks->data)) {
//                        $this->migrateSubTasks($subtasks->data, $boardid, $pm_project_id, $pm_taks->id);
//                    }
//
//                    $task_stories = $this->asana->getAsana('tasks/'.$task->gid.'/stories');
//                    sleep(3);
//                    error_log('subtask detailed to import : '.print_r($subtasks, true));
//                    //migrating comments to discussion
//                    if (is_array($task_stories->data)) {
//                        $this->migrateTaskStories($task_stories->data, $pm_project_id, $pm_taks->id);
//                    }




        }
    }

    public function makeBoardable($board_id, $pm_task_id){

        $boardable = new Boardable();
        $boardable->board_id = $board_id;
        $boardable->board_type = "task_list";
        $boardable->boardable_id = $pm_task_id;
        $boardable->boardable_type = "task";
        $boardable->order = 1;
        $boardable->created_by = get_current_user_id();
        $boardable->updated_by = get_current_user_id();
        $boardable->save();
        return $board_id;
    }
    /**
     * @param $username
     * @param $email
     * @return int|\WP_Error
     */
//    public function getOrCreateUserId($username, $email){
//        $email = sanitize_email( $email );
//        error_log(print_r( 'username: ' . $username, true));
//        error_log(print_r( 'email: ' . $email, true));
//
//        $user = get_user_by( 'email', $email);
//
//        if( ! $user ){
//           $user_id = wp_create_user( $username, wp_generate_password(10), $email);
//
//           error_log(print_r($user_id, true));
//
//           wp_send_new_user_notifications( $user_id );
//
//           return $user_id;
//        } else {
//           return $user->ID;
//        }
//    }

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

    public function migrateBoardsMembers($activecol_board_members,$pm_project_id){
        error_log('entered Board Members');
        $activecol_board_members = $this->repairStringArray($activecol_board_members);
        foreach ($activecol_board_members as $member){
            $user_id = null;
            $user_role = array();
            $credentials = $this->activecol->getMemberInfo($member['idMember']);
            if($credentials['email']){
                $user_id = $this->getOrCreateUserId($credentials['username'],$credentials['email']);
            } else {
                $user_id = $this->getOrCreateUserId($credentials['username'],$this->makeFakeEmail($credentials['username']));
            }

            if($user_id !== null){
                $user_role = array(
                    'user_id' => $user_id,
                    'role_id' => $this->convertRole($member['memberType']),
                    'project_id' => $pm_project_id,
                    'assigned_by' => '0',
                );
                User_Role::create($user_role);
            }
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
     * @param $activecol_card_Comments
     * @param $pm_project_id
     * @param $pm_task_id
     */
    public function migrateCommentCards($activecol_card_Comments, $pm_project_id, $pm_task_id){
        $activecol_card_Comments = $this->repairStringArray($activecol_card_Comments);
        error_log('entered Card Comments');
        if(count($activecol_card_Comments) > 0) {
            foreach ($activecol_card_Comments as $comment) {
                $user_id = null;
                $comments = array();
                $user_id = $this->getOrCreateUserId(
                    $comment['memberCreator']['username'],
                    $this->makeFakeEmail($comment['memberCreator']['username'])
                );

                if($user_id !== null && $comment['type'] == 'commentCard'){
                    $textComment = array(
                        'content' => $comment['data']['text'],
                        'mentioned_users' => null,
                        'commentable_id' => $pm_task_id,
                        'commentable_type' => 'task',
                        'project_id' => $pm_project_id
                    );
                    Comment::create($textComment);
                }
            }
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
        if($role == 'admin'){
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

