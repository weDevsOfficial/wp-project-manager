<?php
/**
 * Created by PhpStorm.
 * User: wedevs-macbook-2
 * Date: 18/12/18
 * Time: 5:48 PM
 */

namespace WeDevs\PM\Tools\Helpers;

use WeDevs\PM\Tools\Library\PM_Asana;
use WP_Background_Process;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Role\Models\Role;
use WeDevs\PM\User\Models\User_Role;
use WeDevs\PM\Common\Models\Board;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Common\Models\Assignee;
use WeDevs\PM\Comment\Models\Comment;


class ImportAsana extends WP_Background_Process
{
    /**
     * @var string
     */
    protected $action = 'asana_import';
    private $credentials; //= pm_get_settings('asana_credentials');
    public $asana;
    private $imported;
    private $importing;

    public function __construct()
    {
        parent::__construct();

        $this->credentials = pm_get_setting('asana_credentials');
        if(!$this->credentials){
            pm_set_settings('asana_credentials', array('token' => ''));
        } else {
            if(array_key_exists('token', $this->credentials)) {
                if(!empty($this->credentials['token'])){
                    $this->asana = new PM_Asana([
                        'personalAccessToken' => base64_decode($this->credentials['token'])
                    ]);
                }
            }
            $this->imported = get_option('imported_from_asana');
            $this->importing = get_option('importing_from_asana');
            if(!$this->imported){
                add_option('imported_from_asana', array());
            }
            if(!$this->importing){
                add_option('importing_from_asana', array());
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
            $this->fetchAndSaveasana($item);
            array_push($this->imported, $item);
            if (($key = array_search($item, $this->importing)) !== false) {
                unset($this->importing[$key]);
                update_option('importing_from_asana', $this->importing);
            }
            update_option('imported_from_asana', $this->imported);
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
     * takes asana project id and fetch all projects
     * from API
     * @param $project_id
     */

    public function fetchAndSaveasana($project_id) {

        $project_data = $this->asana->getAsana('projects/'.$project_id);
        $project = $project_data->data;
        $project_members = $project->members;
        // asana project to cpm project
        $pm_project = new Project();
        $pm_project->title = $project->name;
        $pm_project->description = $project->notes;
        $pm_project->status = $project->archived;
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
        $this->migrateprojectsMembers($project_members, $pm_project->id);
        // asana lists to cpm projects
        $this->fetchAndSaveLists($project_id,$pm_project->id);

        error_log($project->name);

    }

    /**
     * converting asana lists to cpm projects
     * fetching all lists from asana API against its project
     * asana lists to cpm projects
     * @param $project_id
     * @param $pm_project_id
     */

    public function fetchAndSaveLists( $project_id, $pm_project_id ){

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

            // trello Cards to cpm Tasks
            $this->fetchAndSaveTasks($project_id, $pm_board->id, $pm_project_id);

    }

    /**
     * Converting asana cards to pm tasks
     * @param $list_id
     * @param $pm_project_id
     */
    public function fetchAndSaveTasks($asana_project_id, $pm_project_id, $pm_preject_id){
        $task_data = $this->asana->getAsana('projects/'.$asana_project_id.'/tasks');
        $tasks = $task_data->data;
        if (is_array($tasks)) {
            if (count($tasks) > 0) {
                foreach ($tasks as $task) {
                    $pm_taks = new Task();
                    $pm_taks->title = $task->name;
                    $pm_taks->description = "";
                    $pm_taks->estimation = 0;
                    $pm_taks->start_at = null;
                    $pm_taks->due_date = null;
                    $pm_taks->complexity = 0;
                    $pm_taks->priority = 1;
                    $pm_taks->payable = null;
                    $pm_taks->recurrent = NULL;
                    $pm_taks->status = 1;
                    $pm_taks->project_id = $pm_preject_id;
                    $pm_taks->completed_by = null;
                    $pm_taks->completed_at = null;
                    $pm_taks->parent_id = 0;
                    $pm_taks->created_by = get_current_user_id();
                    $pm_taks->updated_by = get_current_user_id();
                    $pm_taks->save();

                    $projectable = new Boardable();
                    $projectable->board_id = $pm_project_id;
                    $projectable->board_type = "task_list";
                    $projectable->boardable_id = $pm_taks->id;
                    $projectable->boardable_type = "task";
                    $projectable->order = 1;
                    $projectable->created_by = get_current_user_id();
                    $projectable->updated_by = get_current_user_id();
                    $projectable->save();

//                    $card_members = $this->asana->getCardMembers($card['id']);
//                    $card_actions = $this->asana->getCardActions($card['id']);
//                    $card_checklists = $this->asana->getCardChecklists($card['id']);
//
//                    //migrating members to user
//                    if (is_array($card_members)) {
//                        $this->migrateCardMembers($card_members, $pm_preject_id, $pm_taks->id);
//                    }
//
//                    //migrating comments to discussion
//                    if (is_array($card_actions)) {
//                        $this->migrateCommentCards($card_actions, $pm_preject_id, $pm_taks->id);
//                    }
//
//                    //migrating checklists to sub_task
//                    if (is_array($card_checklists)) {
//                        $this->migrateCardChecklists($card_checklists, $pm_project_id, $pm_preject_id, $pm_taks->id);
//                    }
                }
            }
        }
    }

    /**
     * @param $username
     * @param $email
     * @return int|\WP_Error
     */
    public function getOrCreateUserId($username, $email){
        $hasUser = get_user_by( 'email', $email);
        if(!$hasUser){
            $newUser = wp_create_user( $username, wp_generate_password(10), $email);
            wp_send_new_user_notifications($newUser);
            return $newUser;
        } else {
            return $hasUser->ID;
        }
    }

    /**
     * migrating asana project members to cpm project user
     * @param $members
     * @param $project_id
     */

    public function migrateprojectsMembers($asana_project_members,$pm_project_id){
        error_log('entered project Members');
        foreach ($asana_project_members as $member){
            $user_id = null;
            $user_role = array();
            $user_data = $this->asana->getAsana('users/'.$member->id);
            $credentials = $user_data->data;
            if($credentials->email){
                $user_id = $this->getOrCreateUserId($credentials->name,$credentials->email);
            } else {
                $user_id = $this->getOrCreateUserId($credentials->name,$this->makeFakeEmail($credentials->name));
            }

            if($user_id !== null){
                $user_role = array(
                    'user_id' => $user_id,
                    'role_id' => '2', //$this->convertRole($member['memberType']),
                    'project_id' => $pm_project_id,
                    'assigned_by' => '0',
                );
                User_Role::create($user_role);
            }
        }
    }

    /**
     * @param $asana_card_members
     * @param $pm_project_id
     * @param $pm_task_id
     */
    public function migrateCardMembers($asana_card_members, $pm_project_id, $pm_task_id){
        error_log('entered Card Members');
        if(count($asana_card_members) > 0) {
            foreach ($asana_card_members as $member) {
                $user_id = null;
                $assignee = array();
                $credentials = $this->asana->getMemberInfo($member['id']);
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
     * @param $asana_card_Comments
     * @param $pm_project_id
     * @param $pm_task_id
     */
    public function migrateCommentCards($asana_card_Comments, $pm_project_id, $pm_task_id){
        error_log('entered Card Comments');
        if(count($asana_card_Comments) > 0) {
            foreach ($asana_card_Comments as $comment) {
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
     * @param $asana_card_Checklists
     * @param $pm_project_id
     * @param $pm_task_id
     */
    public function migrateCardChecklists($asana_card_Checklists,$pm_project_id, $pm_project_id, $pm_task_id){
        error_log('entered Card Comments');
        if(count($asana_card_Checklists) > 0) {
            foreach ($asana_card_Checklists as $checklist) {
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
                            'project_id' => $pm_project_id,
                            'project_type' => "task_list",
                            'projectable_id' => $__sub_task->id,
                            'projectable_type' => "sub_task",
                            'order' => "1",
                            'created_by' => get_current_user_id(),
                            'updated_by' => get_current_user_id(),
                        );
                        projectable::create($projectable);
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
            $email = 'asana_'.$mailuser.'@'.$hostname;
        } else {
            $email = 'asana_'.$mailuser.'@'.$hostname.'.com';
        }
        return $email;
    }


}

