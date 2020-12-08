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
    public $credentials; //= pm_get_settings('asana_credentials');
    public $asana;
    private $imported;
    private $importing;
    private $sections;

    public function __construct()
    {
        parent::__construct();
        add_action('init', [$this, 'after_load_wp'] );

    }

    public function after_load_wp(){
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
        if(isset($project_data->data)){
            $project = $project_data->data;
            error_log(print_r($project, true));
//            $hasProject = Project::where('title', '=', trim($project->name))->get();
//            if(isset($hasProject->title)) {
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
                $this->fetchAndSaveLists($project_id, $pm_project->id);

                error_log($pm_project->name);
//            }
        }

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
            $this->sections['inbox'] = $pm_board->id;

            $asana_sections_data = $this->asana->getAsana('projects/'.$project_id.'/sections');
            if(isset($asana_sections_data->data)) {
                foreach ($asana_sections_data->data as $section) {
                    $pm_board_pre = new Board();
                    $pm_board_pre->title = $section->name;
                    $pm_board_pre->description = "";
                    $pm_board_pre->order = "1";
                    $pm_board_pre->type = "task_list";
                    $pm_board_pre->status = 1;//$list['closed'];
                    $pm_board_pre->project_id = $pm_project_id;
                    $pm_board_pre->created_by = get_current_user_id();
                    $pm_board_pre->updated_by = get_current_user_id();
                    $pm_board_pre->save();
                    $this->sections[$section->gid] = $pm_board_pre->id;
                }

                $this->fetchAndSaveTasks($project_id, $pm_project_id);
            }

    }

    /**
     * Converting asana cards to pm tasks
     * @param $list_id
     * @param $pm_project_id
     */
    public function fetchAndSaveTasks($asana_project_id, $pm_project_id){
        $task_data = $this->asana->getAsana('projects/'.$asana_project_id.'/tasks');
        $tasks = $task_data->data;
        if (is_array($tasks)) {
            if (count($tasks) > 0) {
                foreach ($tasks as $task_minimal) {
                    $task_d = $this->asana->getAsana('tasks/'.$task_minimal->gid);
                    sleep(3);
                    error_log('task imported : '.print_r($task_d, true));
                    if(isset($task_d->data)){
                    $task = $task_d->data;
                        if($task->resource_subtype == "default_task") {
                            $pm_taks = new Task();
                            $pm_taks->title = $task->name;
                            $pm_taks->description = $task->notes;
                            $pm_taks->estimation = 0;
                            $pm_taks->start_at = $task->start_on;
                            $pm_taks->due_date = $task->due_on;
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
                                $this->sectionType($task->memberships[0]->section),
                                $pm_taks->id
                            );

                            if (is_array($task->followers)) {
                                $this->migrateTaskFollowers($task->followers, $pm_project_id, $pm_taks->id);
                            }
                            $subtasks = $this->asana->getAsana('tasks/'.$task->id.'/subtasks');
                            sleep(3);
                            error_log('subtask imported : '.print_r($subtasks, true));
                            //migrating checklists to sub_task
                            if (is_array($subtasks->data)) {
                                $this->migrateSubTasks($subtasks->data, $boardid, $pm_project_id, $pm_taks->id);
                            }

                            $task_stories = $this->asana->getAsana('tasks/'.$task->gid.'/stories');
                            sleep(3);
                            error_log('subtask detailed to import : '.print_r($subtasks, true));
                            //migrating comments to discussion
                            if (is_array($task_stories->data)) {
                                $this->migrateTaskStories($task_stories->data, $pm_project_id, $pm_taks->id);
                            }

                        }
                    }

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
     * migrating asana project members to cpm project user
     * @param $members
     * @param $project_id
     */

    public function migrateprojectsMembers($asana_project_members,$pm_project_id){
        error_log('entered project Members');
        error_log(print_r($asana_project_members, true));
        foreach ($asana_project_members as $member){
            $user_id = null;
            $user_role = array();
            $user_data = $this->asana->getAsana('users/'.$member->id);
            sleep(3);
            if(isset($user_data->data)){
                $credentials = $user_data->data;
                if($credentials->email){
                    $email = sanitize_email( $credentials->email );
                    error_log($email);
                    $user_id = $this->getOrCreateUserId($credentials->name, $email);
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
    }

    /**
     * @param $asana_task_follower
     * @param $pm_project_id
     * @param $pm_task_id
     */
    public function migrateTaskFollowers($asana_task_follower, $pm_project_id, $pm_task_id){
        error_log('entered Card Members');
        if(count($asana_task_follower) > 0) {
            foreach ($asana_task_follower as $member) {
                $user_id = null;
                $assignee = array();
                $credentials = $this->asana->getAsana('users/'.$member->id);
                sleep(5);
                if(isset($credentials->data)) {
                    if ($credentials->data->email) {
                        $user_id = $this->getOrCreateUserId($credentials->data->name, $credentials->data->email);
                    } else {
                        $user_id = $this->getOrCreateUserId($credentials->data->name, $this->makeFakeEmail($credentials->data->name));
                    }

                    if ($user_id !== null) {
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

    }

    /**
     * @param $asana_card_Comments
     * @param $pm_project_id
     * @param $pm_task_id
     */
    public function migrateTaskStories($task_stories, $pm_project_id, $pm_task_id){
        error_log('entered Tasks Comments');

        foreach ($task_stories as $comment) {
            if($comment->type == "comment") {
                $credentials = $this->asana->getAsana('users/'.$comment->created_by->gid);
                sleep(5);
                if(isset($credentials->data)) {
                    $user_id = $this->getOrCreateUserId(
                        $credentials->data->name,
                        $credentials->data->email
                    );
                    global $wpdb;
                    $com_id = $wpdb->insert($wpdb->prefix . 'pm_comments', array(
                        'content' => $comment->text,
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
        }


    }

    /**
     * @param $asana_card_Checklists
     * @param $pm_project_id
     * @param $pm_task_id
     */
    public function migrateSubTasks($asanaSubTasks, $boardid, $pm_project_id, $pm_task_id){
    error_log('entered Sub Task');
    if(count($asanaSubTasks) > 0) {
        foreach ($asanaSubTasks as $a_subtask) {
            $task_d = $this->asana->getAsana('tasks/'.$a_subtask->gid);
            sleep(3);
                if(isset($task_d->data)) {
                    $task = $task_d->data;
                    $subtask = array(
                        'title' => $task->name,
                        'description' => $task->notes,
                        'estimation' => "0",
                        'start_at' => $task->start_on,
                        'due_date' => $task->due_on,
                        'complexity' => 0,
                        'priority' => 1,
                        'payable' => 0,
                        'recurrent' => 9,
                        'status' => 0,
                        'project_id' => $pm_project_id,
                        'completed_by' => null,
                        'completed_at' => null,
                        'parent_id' => $pm_task_id,
                        'created_by' => get_current_user_id(),
                        'updated_by' => get_current_user_id()
                    );
                    $__sub_task = Task::create($subtask);

                    $projectable = array(
                        'board_id' => $boardid,
                        'board_type' => "task_list",
                        'boardable_id' => $__sub_task->id,
                        'boardable_type' => "sub_task",
                        'order' => "1",
                        'created_by' => get_current_user_id(),
                        'updated_by' => get_current_user_id(),
                    );
                    Boardable::create($projectable);

                    if (is_array($task->followers)) {
                        $this->migrateTaskFollowers($task->followers, $pm_project_id, $__sub_task->id);
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
        $email = sanitize_email( $email );
        return $email;
    }

    public function makeBoardable($asana_section_type, $pm_task_id){
//        $board_id = $this->sections['index'];
        error_log('index : '.$asana_section_type);
        error_log(print_r($this->sections, TRUE));
        $board_id = $this->sections[$asana_section_type];
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

    public function sectionType($section){
        if(is_null($section)){
            return "inbox";
        } else {
            return $section->gid;
        }
    }

}
