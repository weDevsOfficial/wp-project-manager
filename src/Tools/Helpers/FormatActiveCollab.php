<?php
/**
 * Created by PhpStorm.
 * User: wedevs-macbook-2
 * Date: 30/1/19
 * Time: 2:12 PM
 */

// namespace WeDevs\PM\Tools\Helpers;

// use WP_Background_Process;
// use ActiveCollab\SDK\Client;
// use ActiveCollab\SDK\Token;
// use Carbon\Carbon;

// class FormatActiveCollab extends WP_Background_Process
// {
//     protected $action = 'activecol_format';
//     private $token;
//     private $client;
//     private $fd;
//     private $status;
//     private $credentials;
//     public $projects;


//     public function __construct()
//     {
//         parent::__construct();
//         add_action('init', [$this, 'initFormat'] );


//     }

//     public function initFormat() {
//         $this->status = pm_get_setting('activecol_formatted');
//         error_log($this->status);
//         if(!$this->status){
//             pm_set_settings('activecol_formatted', 0);
//         }
//     }

//     public function formatData(){

//         $this->credentials = pm_get_setting('activecol_credentials');

//         if(!$this->credentials){
//             pm_set_settings('activecol_credentials', array('token' => '', 'url' => '', 'accID' => ''));
//         } else {
//             if(array_key_exists('token', $this->credentials)) {
//                 $this->token = new Token($this->credentials['token'],$this->credentials['url']);
//                 $this->client = new Client($this->token);
//             }

//         }
//         $this->fd = new FileData();
//         $aclprojects = $this->client->get('projects')->getJson();

//         foreach ($aclprojects as $aclproject){
//             error_log($aclproject['name']);
//             $project_details = $this->client->get('projects/'.$aclproject['id'].'/tasks')->getJson();
//             $project = $project_details['project'];
//             $pm_project['id'] = $project['id'];
//             $pm_project['title'] = $project['name'];
//             $pm_project['description'] = $project['body'];
//             $pm_project['status'] = ($project['is_completed'] == '')? 0 : 1;
//             $pm_project['budget'] = $project['budget'];
//             $pm_project['pay_rate'] = 0;
//             $pm_project['est_completion_date'] = null;
//             $pm_project['color_code'] = '#fcfcfc';
//             $pm_project['order'] = '2';
//             $pm_project['projectable_type'] = null;
//             $pm_project['completed_at'] = empty($project['completed_on'])? null : Carbon::createFromTimestamp($project['updated_on'])->toDateTimeString();
//             $pm_project['created_by'] = $project['created_by_email'];
//             $pm_project['updated_by'] = $project['updated_by_id'];
//             $pm_project['created_at'] = Carbon::createFromTimestamp($project['created_on'])->toDateTimeString();
//             $pm_project['updated_at'] = empty($project['updated_on'])? null : Carbon::createFromTimestamp($project['updated_on'])->toDateTimeString();
// //            error_log(print_r($project['members'], true));
//             $pm_project['members'] = $this->getProjectMembers($project['members']);
// //            error_log(print_r($project_details['task_lists'], true));
//             $pm_project['tasks_lists'] = $this->getProjectTaskLists($project_details['task_lists']);
// //            error_log(print_r($project_details['tasks'], true));
//             $pm_project['tasks'] = $this->getProjectTasks($project_details['tasks']);


//             $this->fd->save_contents('acl/active_collab_project_'.$project['id'].'.wppm', $pm_project);

//             error_log($pm_project['title']);
//         }
//     }

//     public function getProjectMembers($projectMembers){
//         $members = [];
//         foreach ($projectMembers as $member){
//             $single = $this->client->get('/users/'.$member)->getJson();
//             $single_member['id'] = $single['single']['id'];
//             $single_member['role'] = $single['single']['class'];
//             $single_member['name'] = strtolower(str_replace(' ', '_', $single['single']['display_name']));
//             $single_member['email'] = $single['single']['email'];

//             array_push($members, $single_member);
//         }
//         return $members;
//     }

//     public function getProjectTaskLists($projectTaskLists){
//         $tasklists = [];
//         foreach ($projectTaskLists as $acTaskList){
//             $tl['id'] = $acTaskList['id'];
//             $tl['title'] = $acTaskList['name'];
//             $tl['created_by'] = $acTaskList['created_by_email'];
//             $tl['created_at'] = Carbon::createFromTimestamp($acTaskList['created_on'])->toDateTimeString();
//             $tl['updated_at'] = empty($acTaskList['updated_on'])? null : Carbon::createFromTimestamp($acTaskList['updated_on'])->toDateTimeString();

//             array_push($tasklists, $tl);
//         }
//         return $tasklists;
//     }

//     public function getProjectTasks($projectTasks){
//         $tasks = [];
//         foreach ($projectTasks as $acTask){
//             $task['id'] = $acTask['id'];
//             $task['task_list_id'] = $acTask['task_list_id'];
//             $task['assignee_id'] = $acTask['assignee_id'];
//             $task['title'] = $acTask['name'];
//             $task['status'] = 1;
//             $task['description'] = $acTask['body'];
//             $task['created_by_id'] = $acTask['created_by_email'];
//             $task['created_by_name'] = $acTask['created_by_email'];
//             $task['start_at'] = empty($acTask['start_on']) ? null : Carbon::createFromTimestamp($acTask['start_on'])->toDateTimeString();
//             $task['due_date'] = empty($acTask['due_on']) ? null : Carbon::createFromTimestamp($acTask['due_on'])->toDateTimeString();
//             $task['created_at'] = Carbon::createFromTimestamp($acTask['created_on'])->toDateTimeString();
//             $task['updated_at'] = empty($acTask['updated_on']) ? null : Carbon::createFromTimestamp($acTask['updated_on'])->toDateTimeString();
//             $task['comments'] = $this->getTasksComments($acTask['id']);
//             $task['subtasks'] = $this->getProjectTasksSubs($acTask['project_id'] ,$acTask['id']);
//             array_push($tasks, $task);
//         }
//         return $tasks;
//     }


//     public function getProjectTasksSubs($projectid,$taskid){
//         $subs = $this->client->get('projects/'.$projectid.'/tasks/'.$taskid.'/subtasks')->getJson();
//         $subtasks = [];
//         foreach ($subs as $sub){
//             $subtask['id'] = $sub['id'];
//             $subtask['title'] = $sub['name'];
//             $subtask['assignee_id'] = $sub['assignee_id'];
//             $subtask['status'] = $sub['is_completed'];
//             $subtask['created_at'] = empty($sub['created_on']) ? null : Carbon::createFromTimestamp($sub['created_on'])->toDateTimeString();
//             $subtask['updated_at'] = empty($sub['updated_on']) ? null : Carbon::createFromTimestamp($sub['updated_on'])->toDateTimeString();
//             array_push($subtasks, $subtask);
//         }
//         return $subtasks;
//     }

//     public function getTasksComments($taskid){
//         $taskcomments = $this->client->get('comments/task/'.$taskid)->getJson();

//         $comments = [];
//         foreach ($taskcomments as $taskscomment){
//             $name = explode(" ", $taskscomment['created_by_name']);
//             $comment['id'] = $taskscomment['id'];
//             $comment['content'] = $taskscomment['body'];
//             $comment['commentable_type'] = 'task';
//             $comment['user_name'] = strtolower($name[0]);
//             $comment['user_email'] =  $taskscomment['created_by_email'];
//             $comment['created_at'] = empty($taskscomment['created_on']) ? null : Carbon::createFromTimestamp($taskscomment['created_on'])->toDateTimeString();
//             $comment['updated_at'] = empty($taskscomment['updated_on']) ? null : Carbon::createFromTimestamp($taskscomment['updated_on'])->toDateTimeString();
//             array_push($comments, $comment);
//         }
//         return $comments;

//     }



//     /**
//      * Task
//      *
//      * Override this method to perform any actions required on each
//      * queue item. Return the modified item for further processing
//      * in the next pass through. Or, return false to remove the
//      * item from the queue.
//      *
//      * @param mixed $item Queue item to iterate over
//      *
//      * @return mixed
//      */
//     protected function task( $item ) {
//         if($item == 'acl'){
//             $this->formatData($this->projects);
//             pm_set_settings('activecol_formatted', 1);
//         }
//         return false;
//     }

//     /**
//      * Complete
//      *
//      * Override if applicable, but ensure that the below actions are
//      * performed, or, call parent::complete().
//      */
//     protected function complete() {
//         parent::complete();

//         // Show notice to user or perform some other arbitrary task...
//     }

//     /**
//      * Handle cron healthcheck
//      *
//      * Restart the background process if not already running
//      * and data exists in the queue.
//      */
//     public function handle_cron_healthcheck() {
//         if ( $this->is_process_running() ) {
//             // Background process already running.
//             return;
//         }

//         if ( $this->is_queue_empty() ) {
//             // No data to process.
//             $this->clear_scheduled_event();
//             return;
//         }

//         $this->handle();
//     }

// }
