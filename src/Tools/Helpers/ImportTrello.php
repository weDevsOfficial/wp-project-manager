<?php
/**
 * Created by PhpStorm.
 * User: wedevs-macbook-2
 * Date: 18/12/18
 * Time: 5:48 PM
 */

namespace WeDevs\PM\Tools\Helpers;
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

use WeDevs\PM\Tools\Library\PM_Trello;

class ImportTrello extends WP_Background_Process
{
    /**
     * @var string
     */
    protected $action = 'trello_import';
    private $credentials;
    public $trello;
    private $imported;
    private $importing;

    public function __construct()
    {
        parent::__construct();
        add_action('init', [$this, 'after_load_wp'] );

    }

    public function after_load_wp() {
        $this->credentials = pm_get_setting('trello_credentials');
        if(!$this->credentials){
            pm_set_settings('trello_credentials', array('api_key' => '', 'token' => ''));
        } else {
            if(array_key_exists('api_key', $this->credentials)) {
                $this->trello = new PM_Trello($this->credentials['api_key'], $this->credentials['token']);
            }
            $this->imported = get_option('imported_from_trello');
            $this->importing = get_option('importing_from_trello');
            if(!$this->imported){
                add_option('imported_from_trello', array());
            }
            if(!$this->importing){
                add_option('importing_from_trello', array());
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
            $this->fetchAndSaveTrello($item);
            array_push($this->imported, $item);
            if (in_array($item, $this->importing)) {
                $key = array_search($item, $this->importing);
                unset($this->importing[$key]);
                update_option('importing_from_trello', $this->importing);
            }
            update_option('imported_from_trello', $this->imported);
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
     * takes trello board id and fetch all boards
     * from API
     * @param $board_id
     */

    public function fetchAndSaveTrello($board_id) {

        $board = $this->trello->getBoard($board_id);
        $board_members = $this->trello->getBoardMemberships($board_id);
        // trello board to cpm project
        $pm_project = new Project();
        $pm_project->title = $board['name'];
        $pm_project->description = $board['desc'];
        $pm_project->status = $board['closed'];
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
        $this->migrateBoardsMembers($board_members, $pm_project->id);
        // trello lists to cpm boards
        $this->fetchAndSaveLists($board_id,$pm_project->id);

        error_log($board['name']);

    }

    /**
     * converting trello lists to cpm boards
     * fetching all lists from trello API against its board
     * trello lists to cpm boards
     * @param $board_id
     * @param $pm_project_id
     */

    public function fetchAndSaveLists( $board_id, $pm_project_id ){
        $lists = $this->trello->getLists( $board_id );

            $lists = $this->repairStringArray($lists);

            foreach ( $lists as $list ) {
                $pm_board = new Board();
                $pm_board->title = $list['name'];
                $pm_board->description = "";
                $pm_board->order = $list['pos'];
                $pm_board->type = "task_list";
                $pm_board->status = 1;//$list['closed'];
                $pm_board->project_id = $pm_project_id;
                $pm_board->created_by = get_current_user_id();
                $pm_board->updated_by = get_current_user_id();
                $pm_board->save();

                // trello Cards to cpm Tasks
                $this->fetchAndSaveCards($list['id'], $pm_board->id, $pm_project_id);
            }


    }

    /**
     * Converting trello cards to pm tasks
     * @param $list_id
     * @param $pm_board_id
     */
    public function fetchAndSaveCards($trello_list_id, $pm_board_id, $pm_preject_id){
        $cards = $this->trello->getCards($trello_list_id);
        if (is_array($cards)) {
            if (count($cards) > 0) {
                foreach ($cards as $card) {
                    $pm_taks = new Task();
                    $pm_taks->title = $card['name'];
                    $pm_taks->description = $card['desc'];
                    $pm_taks->estimation = 0;
                    $pm_taks->start_at = null;
                    $pm_taks->due_date = $card['due'];
                    $pm_taks->complexity = 0;
                    $pm_taks->priority = 1;
                    $pm_taks->payable = $card['due'];
                    $pm_taks->recurrent = $card['due'];
                    $pm_taks->status = $card['closed'];
                    $pm_taks->project_id = $pm_preject_id;
                    $pm_taks->completed_by = null;
                    $pm_taks->completed_at = null;
                    $pm_taks->parent_id = 0;
                    $pm_taks->created_by = get_current_user_id();
                    $pm_taks->updated_by = get_current_user_id();
                    $pm_taks->save();

                    $boardable = new Boardable();
                    $boardable->board_id = $pm_board_id;
                    $boardable->board_type = "task_list";
                    $boardable->boardable_id = $pm_taks->id;
                    $boardable->boardable_type = "task";
                    $boardable->order = 1;
                    $boardable->created_by = get_current_user_id();
                    $boardable->updated_by = get_current_user_id();
                    $boardable->save();

                    $card_members = $this->trello->getCardMembers($card['id']);
                    $card_actions = $this->trello->getCardActions($card['id']);
                    $card_checklists = $this->trello->getCardChecklists($card['id']);

                    //migrating members to user
                    if (is_array($card_members)) {
                        $this->migrateCardMembers($card_members, $pm_preject_id, $pm_taks->id);
                    }

                    //migrating comments to discussion
                    if (is_array($card_actions)) {
                        $this->migrateCommentCards($card_actions, $pm_preject_id, $pm_taks->id);
                    }

                    //migrating checklists to sub_task
                    if (is_array($card_checklists)) {
                        $this->migrateCardChecklists($card_checklists, $pm_board_id, $pm_preject_id, $pm_taks->id);
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

        $username_exists = username_exists( $username );
        $email_exists = email_exists( $email );

        if( ! $email_exists && ! $username_exists ){
            $newUser = wp_create_user( strtolower($username), wp_generate_password(10), $email);
            return $newUser;

        } else if ( $username_exists ) {
            return $username_exists;
        } else {
            return $email_exists;
        }
    }

    /**
     * migrating trello board members to cpm project user
     * @param $members
     * @param $board_id
     */

    public function migrateBoardsMembers($trello_board_members,$pm_project_id){
        $trello_board_members = $this->repairStringArray($trello_board_members);
        foreach ($trello_board_members as $member){
            $user_id = null;
            $user_role = array();
            $credentials = $this->trello->getMemberInfo($member['idMember']);
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
     * @param $trello_card_members
     * @param $pm_project_id
     * @param $pm_task_id
     */
    public function migrateCardMembers($trello_card_members, $pm_project_id, $pm_task_id){
        $trello_card_members = $this->repairStringArray($trello_card_members);
        if(count($trello_card_members) > 0) {
            foreach ($trello_card_members as $member) {
                $user_id = null;
                $assignee = array();
                $credentials = $this->trello->getMemberInfo($member['id']);
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
     * @param $trello_card_Comments
     * @param $pm_project_id
     * @param $pm_task_id
     */
    public function migrateCommentCards($trello_card_Comments, $pm_project_id, $pm_task_id){
        $trello_card_Comments = $this->repairStringArray($trello_card_Comments);
        if(count($trello_card_Comments) > 0) {
            foreach ($trello_card_Comments as $comment) {
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
     * @param $trello_card_Checklists
     * @param $pm_project_id
     * @param $pm_task_id
     */
    public function migrateCardChecklists($trello_card_Checklists,$pm_board_id, $pm_project_id, $pm_task_id){
        if(count($trello_card_Checklists) > 0) {
            foreach ($trello_card_Checklists as $checklist) {
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

                        $boardable = array(
                            'board_id' => $pm_board_id,
                            'board_type' => "task_list",
                            'boardable_id' => $__sub_task->id,
                            'boardable_type' => "sub_task",
                            'order' => "1",
                            'created_by' => get_current_user_id(),
                            'updated_by' => get_current_user_id(),
                        );
                        Boardable::create($boardable);
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
            $email = 'trello_'.$mailuser.'@'.$hostname;
        } else {
            $email = 'trello_'.$mailuser.'@'.$hostname.'.com';
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

