<?php
namespace WeDevs\PM\Core\Upgrades;
use WP_Background_Process;
use WP_Query;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\User\Models\User_Role;
use WeDevs\PM\Milestone\Models\Milestone;
use WeDevs\PM\Common\Models\Meta;
use WeDevs\PM\Common\Models\Board;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Common\Models\Assignee;
use WeDevs\PM\File\Models\File;
use WeDevs\PM\Comment\Models\Comment;
use WeDevs\PM\Settings\Models\Settings;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM_Pro\Modules\time_tracker\src\Models\Time_Tracker;
use WeDevs\PM\Category\Models\Category;

    
/**
*   Upgrade project manager 2.0     
*/
class Upgrade_2_0 extends WP_Background_Process
{
    /**
     * @var string
     */
    protected $action = 'upgrade';

    public $isProcessRuning = false;
    

    /**
     * task funciotn run on background over time
     * comes form WP_Background_Process abstruct    
     * @param   $item 
     * @return 
     */
    protected function task( $item ) {
        $this->isProcessRuning = true;
        $this->upgrade_projects($item);

        return false;
    }


    /**
     * Complete function for WP_Background_Process
     *
     */
    protected function complete() {
        parent::complete();
        $this->isProcessRuning = false;
        $this->migrate_category();
        $this->set_settings();
        error_log("task complete");
        // upgrade complete function
    }

    /**
     * Is the updater running?
     * @return boolean
     */
    public function is_updating() {
        return false === $this->is_queue_empty();
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
     * initialize upgrade
     * Get all Project id and push into queue 
     * @return [type] [description]
     */
    public function upgrade_init ( ) {
        global $wpdb;
        $ids = $wpdb->get_results( "SELECT ID FROM $wpdb->posts WHERE post_type = 'cpm_project'", ARRAY_A );
        foreach ($ids as $id) {
            $this->push_to_queue( $id['ID'] );
        }

        $this->save()->dispatch();
    }

    /**
     * start upgrade project 
     * @param  ini $project_id 
     * @return Object          new project model object 
     */
    public function upgrade_projects ( $project_id ) {
        $data = get_site_option("pm_upgrade", array());
        if ( !in_array($project_id, array_keys($data))){
            $data[$project_id] = 1;
            update_site_option("pm_upgrade", $data);

            $project = $this->create_project($project_id);

            if( $project ) {
                $data[$project_id] = $project->id;
                update_site_option("pm_upgrade", $data);
            }
        }
        
    }

    /**
     * retrive old project and push into new database
     * @param  int $project_id 
     * @return Object             new Project model object
     */
    protected function create_project ( $project_id ) {
        global $wpdb;
        if( !$project_id && !is_int( $project_id ) ){
            return ;
        }

        $oldProject = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $wpdb->posts WHERE ID=%d", $project_id ));

        $newProject = $this->save_object( new Project, [
            'title'       => $oldProject->post_title,
            'description' => $oldProject->post_content,
            'status'      => get_post_meta($project_id, '_project_active', true) == 'yes' ? 0 : 1,
            'created_by'  => $oldProject->post_author,
            'updated_by'  => $oldProject->post_author,
            'created_at'  => $oldProject->post_date,
            'updated_at'  => $oldProject->post_modified,
        ]);

        $this->create_project_role( $project_id, $newProject->id, $oldProject->post_author );

        $milestons = $this->get_milestones( $project_id, $newProject->id );
        $discuss   = $this->get_discuss( $project_id, $newProject->id, $milestons );
        $commnetd  = $this->get_comments( $discuss, $newProject->id, 'discussion_board' );
        $taskLists = $this->get_task_list( $project_id, $newProject->id, $milestons );
        $commenttl = $this->get_comments( $taskLists, $newProject->id, 'task_list' );
        list($tasks, $parents )  = $this->get_tasks( $newProject->id, $taskLists );
        $commnett  = $this->get_comments( $tasks, $newProject->id, 'task' );

        $this->get_activity( $project_id, $newProject->id, $discuss, $taskLists, $tasks, array_merge( (array) $commnetd, (array)$commenttl, (array)$commnett) );

        $this->get_file( $project_id, $newProject->id );

        if( !empty( $parents ) ) {
            // for sub task
           $this->get_tasks( $newProject->id, $tasks, $taskLists, $parents ); 
        }

        $this->add_time_tracker( $project_id, $newProject->id, $taskLists, $tasks );

        $this->set_project_settings( $project_id, $newProject );

        return $newProject;
    }

    /**
     * create project role 
     * @param  init $oldProjectId
     * @param  init $newPorjectID       
     * @param  init $assigned_by 
     * @return void              
     */
    protected function create_project_role( $oldProjectId, $newPorjectID, $assigned_by ){
        if( !$oldProjectId ){
            return ;
        }
        global $wpdb;
        $table    = $wpdb->prefix . 'cpm_user_role';
        $oldroles = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $table WHERE project_id=%d", $oldProjectId ), ARRAY_A );

        foreach ($oldroles as $role ) {
            if ( $role['role']       == 'manager' ){
                $role_id = 1;
            }else if ( $role['role'] == 'co_worker' ){
                $role_id = 2;
            }else{
                $role_id = 3; 
            }
            $this->save_object(new User_Role, [
                'user_id'       => $role['user_id'],
                'role_id'       => $role_id,
                'project_id'    => $newPorjectID,
                'assigned_by'   => $assigned_by,
            ]);
        }
    }


    protected function get_milestones( $oldProjectId, $newPorjectID  ) {
        if( !$oldProjectId ){
            return ;
        }
        global $wpdb;

        $oldMilestones   = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $wpdb->posts WHERE post_parent=%d AND post_type=%s AND post_status=%s", $oldProjectId, 'cpm_milestone', 'publish' ), ARRAY_A );

        $milestons  = [];

        foreach ( $oldMilestones as $post ) {
            $milestons[$post['ID']] = $this->create_milestone( $post, $newPorjectID );
        }

        return $milestons;
    }

    /**
     * create milestone 
     * @param  init $project_id 
     * @param  object $newPorject new project Model
     * @return arrat             old milestone and new milestone 
     */
    protected function create_milestone( $milestone, $newPorjectID ) {
        if(!$milestone ){
            return ;
        }

        $newMilestone = $this->add_board( $milestone, 'milestone',  $newPorjectID );

        $metas = [
            'achieve_date' => get_post_meta( $milestone['ID'], '_due', true ),
            'completed_at' => get_post_meta( $milestone['ID'], '_completed_on', true ),
            'status'       => get_post_meta( $milestone['ID'], '_completed' , true ) == 1 ? 2 : 1,
            'privacy'      => get_post_meta( $milestone['ID'], '_milestone_privacy', true ) == 'yes' ? 1 : 0,
        ]; 

        if ( $newMilestone->id ) {
            $this->add_metas( $metas, $newMilestone, $newPorjectID );
        }
        
        return $newMilestone->id;
    }
    /**
     * get Dsicuss and create from
     * @param  int $oldProjectId 
     * @param  int $newPorjectID 
     * @param  array $milestons    
     * @return array               new and old milestone array
     */
    protected function get_discuss( $oldProjectId, $newPorjectID, $milestons ) {
        if( !$oldProjectId ){
            return ;
        }
        global $wpdb;

        $oldDiscuss   = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $wpdb->posts WHERE post_parent=%d AND post_type=%s AND post_status=%s", $oldProjectId, 'cpm_message', 'publish' ), ARRAY_A );

        $discuss  = [];

        foreach ( $oldDiscuss as $post ) {
            $discuss[$post['ID']] = $this->create_discuss( $post, $newPorjectID, $milestons );
        }
        return $discuss;
    }

    /**
     * Create disusss from old discuss
     */
    protected function create_discuss( $post, $newPorjectID, $milestons ) {
        if( !$post ) {
            return ;
        }
        $newDiscuss = $this->add_board($post, 'discussion_board', $newPorjectID);
        $mid        = get_post_meta( $post['ID'], '_milestone', true);

        if ( $mid ) {
            $this->save_object( new Boardable, [
                'board_id'       => $milestons[$mid],
                'board_type'     => 'milestone',
                'boardable_id'   => $newDiscuss->id,
                'boardable_type' => 'discussion_board',
                'order'          => $post['menu_order'],
                'created_by'     => $post['post_author'],
                'updated_by'     => $post['post_author'],
                'created_at'     => $post['post_date'],
                'updated_at'     => $post['post_modified'],
            ] );
        }

        $metas = [
            'privacy'      => get_post_meta( $post['ID'], '_message_privacy', true ) == 'yes' ? 1 : 0,
        ]; 

        if ( $newDiscuss->id ) {
            $this->add_metas( $metas,  $newDiscuss, $newPorjectID );
        }

        $files = get_post_meta($post['ID'], '_files', true);
        if ( !empty( $files )) {
            foreach ( $files as $file ) {
                
                $this->add_file([
                    'fileable_id'   => $newDiscuss->id,
                    'fileable_type' => 'discussion_board',
                    'parent'        => $newDiscuss->id,
                    'type'          => 'discussion_board',
                    'attachment_id' => $file,
                    'project_id'    => $newDiscuss->project_id,
                    'created_by'    => $newDiscuss->created_by,
                    'updated_by'    => $newDiscuss->updated_by,
                ] );
            }
        }
        
        return $newDiscuss->id;
    }

    /**
     * get Task list and create from
     * @param  int $oldProjectId 
     * @param  int $newPorjectID 
     * @param  array $milestons    
     * @return array               new and old milestone array
     */
    protected function get_task_list( $oldProjectId, $newPorjectID, $milestons ) {
        if( !$oldProjectId ){
            return ;
        }
        global $wpdb;

        $oldTaskList   = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $wpdb->posts WHERE post_parent=%d AND post_type=%s AND post_status=%s", $oldProjectId, 'cpm_task_list', 'publish' ), ARRAY_A );

        $taskList  = [];

        foreach ( $oldTaskList as $post ) {
            $taskList[$post['ID']] = $this->create_task_list( $post, $newPorjectID, $milestons );
        }
        return $taskList;
    }


    /**
     * Create disusss from old discuss
     */
    protected function create_task_list( $post, $newPorjectID, $milestons ) {
        if( !$post ) {
            return ;
        }
        $taskList = $this->add_board($post, 'task_list', $newPorjectID);
        $mid      = get_post_meta( $post['ID'], '_milestone', true);

        if ( !empty( $mid ) && $mid != -1 ) {
            $this->save_object( new Boardable, [
                'board_id'       => $milestons[$mid],
                'board_type'     => 'milestone',
                'boardable_id'   => $taskList->id,
                'boardable_type' => 'task_list',
                'order'          => $post['menu_order'],
                'created_by'     => $post['post_author'],
                'updated_by'     => $post['post_author'],
                'created_at'     => $post['post_date'],
                'updated_at'     => $post['post_modified'],
            ] );
        }

        $metas = [
            'privacy'      => get_post_meta( $post['ID'], '_tasklist_privacy', true ) == 'yes' ? 1 : 0,
        ]; 

        if ( $taskList->id ) {
            $this->add_metas( $metas,  $taskList, $newPorjectID );
        }

        return  $taskList->id;
    }

    protected function get_tasks ( $newPorjectID, $listitems, $list = null, $parent = null ) {
        if( empty($listitems)){
            return ;
        }
        global $wpdb;
        if( $parent == null ){
            $post_type = 'cpm_task';
        }else{
            $post_type = 'cpm_sub_task';
        }
        

        $in      = implode(',', array_keys($listitems));
        $oldTask = $wpdb->get_results( "SELECT * FROM {$wpdb->posts} WHERE post_parent IN({$in}) AND  post_type='{$post_type}' AND post_status='publish'", ARRAY_A );
        
        $tasks   = [];
        $taskParent = [];
        foreach ( $oldTask as $post ) {
            $tasks[$post['ID']]      = $this->create_task( $post, $newPorjectID,  $listitems, $list,  $parent );
            if( $post['post_type'] == 'cpm_task' ){
                $taskParent[$post['ID']] = $post['post_parent'];
            }
            
        }
        return array( $tasks, $taskParent );
    }

    protected function create_task( $post, $newPorjectID,  $listitems, $list=null, $parent = null ) {
        if( !$post ){
            return ;
        }
        $newTask  = $this->save_object( new Task, [
            'title'       => $post['post_title'],
            'description' => $post['post_content'],
            'status'      => get_post_meta( $post['ID'], '_completed', true),
            'project_id'  => $newPorjectID, 
            'start_at'    => get_post_meta( $post['ID'], '_start', true),
            'due_date'    => get_post_meta( $post['ID'], '_due', true),
            'parent_id'   => $post['post_type'] === 'cpm_task' ? 0: $listitems[$post['post_parent']],
            'created_by'  => $post['post_author'],
            'updated_by'  => $post['post_author'],
            'created_at'  => $post['post_date'],
            'updated_at'  => $post['post_modified'],
        ] );

        if ( !empty($post['post_parent']) ) {

            if ( $parent !== null ){
                $board_id = $list[$parent[$post['post_parent']]];
                $boardable_type = 'sub_task';
            }else {
                $board_id = $listitems[$post['post_parent']];
                $boardable_type = 'task';
            }
            $this->save_object( new Boardable, [
                'board_id'       => $board_id,
                'board_type'     => 'task_list',
                'boardable_id'   => $newTask->id,
                'boardable_type' => $boardable_type,
                'order'          => $post['menu_order'],
                'created_by'     => $post['post_author'],
                'updated_by'     => $post['post_author'],
                'created_at'     => $post['post_date'],
                'updated_at'     => $post['post_modified'],
            ] );
        }

        if ( $post['post_type'] == 'cpm_task' ){
            $metas = [
                'privacy'      => get_post_meta( $post['ID'], '_task_privacy', true ) == 'yes' ? 1 : 0,
            ];

            if ( $newTask->id && $metas ) {
                $this->add_metas( $metas,  $newTask, $newPorjectID, $boardable_type );
            }
        }
        $this->add_assignee( $newTask, $post['ID'] );

        return $newTask->id;
    }

    protected function add_assignee($task, $post_id ) {
        if ( !$post_id ){
            return ;
        }
        $assignees = get_post_meta($post_id, '_assigned');

        if ( empty( $assignees ) || array_keys($assignees, '-1')) {
            return ;
        }

        foreach ( $assignees as $assignee ) {

            $completd_by = get_post_meta( $post_id, '_completed_by', true);
            $completed_at = null;
            if ( !empty($completd_by)  && $assignee == $completd_by ) {
                $completed_at = get_post_meta( $post_id, '_completed', true); 
                $completed_at = !empty($completed_at) ? $completed_at: null;
            }
            $this->save_object( new Assignee, [
                'task_id'      => $task->id,
                'assigned_to'  => (int)$assignee,
                'assigned_at'  => $task->created_at,
                'completed_at' => $completed_at,
                'created_by'   => $task->created_by,
                'updated_by'   => $task->updated_by,
                'created_at'   => $task->created_at,
                'updated_at'   => $task->updated_at,
                'project_id'   => $task->project_id,
            ]);
        }
    }

    protected function get_comments($ids, $newPorjectID, $commentable_type ) {
        if( empty( $ids ) ){
            return ;
        }
        global $wpdb;
        $in        = implode(',', array_keys($ids));
        $OComments = $wpdb->get_results( "SELECT * FROM {$wpdb->comments} WHERE comment_post_ID IN({$in})", ARRAY_A );
        
        $comments  = [];

        foreach ($OComments as $comment ) {
            $comments[$comment['comment_ID']] = $this->create_comments( $comment, $newPorjectID, $commentable_type, $ids[$comment['comment_post_ID']] );
        }

        return $comments;
    }

    protected function create_comments( $comment, $newPorjectID, $commentable_type, $commentable_id ) {
        if( !$comment ){
            return ;
        }
        $newComment = $this->save_object( new Comment, [
            'content'          => $comment['comment_content'],
            'mentioned_users'  => null,
            'commentable_id'   => $commentable_id,
            'commentable_type' => $commentable_type,
            'project_id'       => $newPorjectID,
            'created_by'       => $comment['user_id'],
            'updated_by'       => $comment['user_id'],
            'updated_by'       => $comment['user_id'],
            'updated_by'       => $comment['user_id'],
            'created_at'       => $comment['comment_date'],
            'updated_at'       => $comment['comment_date'],
        ] );

        $files = get_comment_meta($comment['comment_ID'], '_files', true);
        if ( !empty( $files ) ) {
            foreach ( $files as $file ) {
                
                $this->add_file([
                    'fileable_id'   => $newComment->id,
                    'fileable_type' => 'comment',
                    'parent'        => $newComment->id,
                    'type'          => 'file',
                    'attachment_id' => $file,
                    'project_id'    => $newComment->project_id,
                    'created_by'    => $newComment->created_by,
                    'updated_by'    => $newComment->updated_by,
                ] );
            }
        }

        return $newComment->id;
    }


    protected function get_file ( $OldProjectId, $newPorjectID ){
        if ( !$OldProjectId ){
            return ;
        }
        global $wpdb;
        $table   = $wpdb->prefix . 'cpm_file_relationship';
        $files   = $wpdb->get_results( $wpdb->prepare("SELECT * FROM {$table} WHERE project_id=%d ORDER BY `id` ASC", $OldProjectId ), ARRAY_A );
        $fileArr = [];
        $comments = [];
        
        foreach ( $files as $file ) {
            $metas =[];
            $parent  = !empty( $fileArr[$file['parent_id']] ) ? $fileArr[$file['parent_id']]: 0;
            if( $file['is_dir'] == 1 ) {
                $type = 'folder';
            }elseif ( $file['type'] == 'doc' ) {
                $type = 'doc';
            }elseif ( $file['type'] == 'google_doc') {
                $type = 'link';
            }else{
                $type = 'pro_file';
            }

            $newFile = $this->add_file([
                'fileable_id'   => null,
                'fileable_type' => 'file',
                'parent'        => $parent,
                'type'          => $type,
                'attachment_id' => $file['attachment_id'],
                'project_id'    => $newPorjectID,
                'created_by'    => $file['created_by'],
                'updated_by'    => $file['created_by'],
                'created_at'    => $file['created_at'],
                'updated_at'    => $file['updated_at'],
            ]);

            if( $file['post_id'] ){
                $metas = $this->get_doc_meta($file['post_id'], $newFile->id, $newPorjectID );
                $comments[$file['post_id']] = $newFile->id;
            }elseif ( $file['attachment_id'] ) {
                $comments[$file['attachment_id']] = $newFile->id;
            }

            $fileArr[$file['id']] = $newFile->id;
            $metas['private']     = $file['private'] == 'yes' ? 1 : 0;

            if ( !empty( $file['dir_name'] ) ){
                $metas['title']   = $file['dir_name'];
            }

            $this->add_metas( $metas, $newFile, $newPorjectID, 'file' );
        }

        $this->set_post_attachment( $comments, $newPorjectID );
        $this->get_comments($comments, $newPorjectID, 'file' );
        $this->get_revision($comments, $newPorjectID );

        return $fileArr;
        
    }

    protected function get_doc_meta($post_id, $docid, $newPorjectID ){
        if ( !$post_id ) {
            return ;
        }
        global $wpdb;
        $post = $wpdb->get_row( $wpdb->prepare("SELECT * FROM {$wpdb->posts} WHERE ID=%d", $post_id ));
        $meta = [];
        $meta['title'] = $post->post_title;
        $meta['description'] = $post->post_content;
        if( !empty( $post->post_excerpt ) ){
            $meta['url'] = $post->post_excerpt;
        }

        return $meta;
    }

    protected function set_post_attachment( $ids, $newPorjectID ){
        if( empty( $ids ) ){
            return ;
        }
        global $wpdb;
        $in        = implode(',', array_keys($ids));
        $attachments = $wpdb->get_results( "SELECT * FROM {$wpdb->posts} WHERE post_parent IN({$in}) and post_type='attachment'", ARRAY_A);

        foreach ($attachments as $attachment ){
            $this->add_file([
                'fileable_id'   => $ids[$attachment['post_parent']],
                'fileable_type' => 'file',
                'parent'        => $ids[$attachment['post_parent']],
                'type'          => 'doc',
                'attachment_id' => $attachment["ID"],
                'project_id'    => $newPorjectID,
                'created_by'    => $attachment['post_author'],
                'updated_by'    => $attachment['post_author'],
                'created_at'    => $attachment['post_date'],
                'updated_at'    => $attachment['post_date'],
            ]);
        }
    }
    protected function get_revision ( $ids, $newPorjectID ){
        if( empty( $ids ) ){
            return ;
        }
        global $wpdb;
        $in        = implode(',', array_keys($ids));
        $revisions = $wpdb->get_results( "SELECT * FROM {$wpdb->posts} WHERE post_parent IN({$in}) and post_type='revision'", ARRAY_A);
        foreach( $revisions as $revision ){
            $metas=[];
            $newFile = $this->add_file([
                'fileable_id'   => null,
                'fileable_type' => 'file',
                'parent'        => $ids[$revision['post_parent']],
                'type'          => 'revision',
                'attachment_id' => null,
                'project_id'    => $newPorjectID,
                'created_by'    => $revision['post_author'],
                'updated_by'    => $revision['post_author'],
                'created_at'    => $revision['post_date'],
                'updated_at'    => $revision['post_date'],
            ]);

            $metas['title'] = $revision['post_title'];
            $metas['description'] = $revision['post_content'];
            if( !empty( $revision['post_excerpt'] ) ){
                $metas['url'] = $revision ['post_excerpt'];
            }

            $this->add_metas( $metas, $newFile, $newPorjectID, 'file' );
        }
    }

    protected function set_project_settings( $oldProjectId, $newProject ) {
        if( !$oldProjectId ){
            return ;
        }
        $settings = get_post_meta( $oldProjectId, '_settings', true);
        $this->save_object( new Settings, [
            'key'        => 'user_capabilities',
            'value'      => $settings,
            'project_id' => $newProject->id,
            'created_by' => $newProject->created_by,
            'updated_by' => $newProject->updated_by,
            'created_at'  => $newProject->created_at,
            'updated_at'  => $newProject->updated_at,
        ] );
    }

    protected function get_activity( $oldProjectId, $newProjectId, $discuss, $tasklist, $tasks, $comments ) {
        if( !$oldProjectId ){
            return ;
        }
        global $wpdb;
        $activities = $wpdb->get_results( "SELECT * FROM $wpdb->comments WHERE  comment_post_ID = {$oldProjectId} AND comment_type='cpm_activity' ORDER BY `comment_ID` ASC", ARRAY_A );
        
        foreach ($activities as $activity) {

            list( $attr, $newCntent ) = $this->get_attr_array( $activity['comment_content'] );
            $meta                     = ['text' => $newCntent ];
            $resource_type            = "";
            $resource_id              = 0;

            foreach ($attr as $key => $value) {

                switch ($key) {
                   
                    case 'cpm_msg_url':
                            $resource_id                    = $discuss[$value['id']];
                            $resource_type                  = 'discussion_board';
                            $meta['discussion_board_title'] = $value['title'];
                        break;
                    case 'cpm_tasklist_url':
                            $resource_id             = $tasklist[$value['id']];
                            $resource_type           = 'task_list';
                            $meta['task_list_title'] = $value['title'];
                        break;
                    case 'cpm_task_url': 
                            $resource_id        = $tasks[$value['id']];
                            $resource_type      = 'task';
                            $meta['task_title'] = $value['title'];
                        break;
                    case 'cpm_comment_url':
                            $resource_id        = $value['id'];
                            $resource_type      = 'comment';
                            $meta['comment_id'] = $value['id'];
                        break;
                    case 'cpm_user_url':
                        break;  
                       
                }
            }
            $this->created_activity($activity, $resource_id, $resource_type, $meta, $newProjectId );
              
        }
        
        
    }

    protected function created_activity( $activity, $resource_id, $resource_type, $meta, $newProjectId ) {
        $this->save_object(new Activity, [
            'actor_id'      => $activity['user_id'],
            'action'        => 'cpm_migration',
            'action_type'   => 'migrated',
            'resource_id'   => $resource_id,
            'resource_type' => $resource_type,
            'meta'          => $meta,
            'project_id'    => $newProjectId,
            'created_at'    => $activity['comment_date'],
            'updated_at'    => $activity['comment_date'],
        ]);
    }


    protected function get_attr_array( $str ) {
        $attr = [];
        $arr  = [
            'cpm_msg_url'      => '{{meta.discussion_board_title}}',
            'cpm_user_url'     => '{{actor.data.display_name}}',
            'cpm_task_url'     => '{{meta.task_title}}',
            'cpm_tasklist_url' => '{{meta.task_list_title}}',
            'cpm_comment_url'  => '{{meta.comment_id}}'
        ];
        $text = $str;
        $pattern = get_shortcode_regex();
            
        $sdf     = preg_replace_callback( "/$pattern/s", function ( $match ) use ( &$attr, $arr, &$text ) {

            $text = str_replace($match[0], $arr[$match[2]], $text );

            $attr[$match[2]] = shortcode_parse_atts( $match[3] );

        }, $str );

        return array($attr, $text);
    }

    protected function add_time_tracker( $oldProjectId, $newPorjectID, $taskList, $tasks ) {
        if ( !$oldProjectId ){
            return ;
        }

        if(!class_exists('WeDevs\PM_Pro\Modules\time_tracker\src\Models\Time_Tracker')){
            return ;
        }

        global $wpdb;
        $table = $wpdb->prefix. 'cpm_time_tracker';
        $timetracker = $wpdb->get_results( "SELECT * FROM {$table} WHERE  project_id = {$oldProjectId}", ARRAY_A );

        foreach( $timetracker as $time ){
            $this->save_object(new Time_Tracker, [
                'user_id'    => $time['user_id'],
                'project_id' => $newPorjectID,
                'list_id'    => $taskList[$time['tasklist_id']],
                'task_id'    => $tasks[$time['task_id']],
                'start'      => $time['start'],
                'stop'       => $time['stop'],
                'total'      => $time['total'],
                'run_status' => $time['run_status'] == 'no' ? 0 : 1 
            ]);
        }



    }

    protected function add_file( $arr ) {
        return $this->save_object( new File, $arr );
    }

    protected function add_board( $post , $board_type, $newPorjectID ) {
        $newBoard = $this->save_object( new Board, [
            'title'       => $post['post_title'],
            'description' => $post['post_content'],
            'order'       => $post['menu_order'],
            'type'        => $board_type,
            'project_id'  => $newPorjectID,
            'created_by'  => $post['post_author'],
            'updated_by'  => $post['post_author'],
            'created_at'  => $post['post_date'],
            'updated_at'  => $post['post_modified'],
        ]);

        return $newBoard;
    }

    protected function add_metas( $metas , $object, $newPorjectID, $entity_type = null ) {
        $meta_ids = [];
        foreach ( $metas as $key => $value ) {
            $metaObj = $this->save_object( new Meta, [
                'entity_id'   => $object->id,
                'entity_type' => $entity_type !== null? $entity_type : $object->type,
                'meta_key'    => $key,
                'meta_value'  => $value,
                'project_id'  => $newPorjectID,
                'created_by'  => $object->created_by,
                'updated_by'  => $object->updated_by,
                'created_at'  => $object->created_at,
                'updated_at'  => $object->updated_at,
            ] );

            $meta_ids[] = $metaObj->id;
        }

        return $meta_ids;
    }

    protected function set_settings(){
        $genral          = get_site_option('cpm_general', array());
        $mail            = get_site_option('cpm_mails', array());
        $page            = get_site_option('cpm_page', array());
        $woo_projects    = get_site_option('cpmwoo_settings', array());
        $cpm_integration = get_site_option('cpm_integration', array());
        $projects        = get_site_option('pm_upgrade', array());
        $woo_project     = array();
        
        if ( is_array($woo_projects) && !empty($woo_projects) ){
            foreach ($woo_projects as $wp ) {
                $role =[];
                if ( is_array($wp['role']) && !empty($wp['role']) ) {
                    foreach ($wp['role'] as $key => $value) {
                        $role[] = [
                            'user_id' => $key,
                            'role_id' => $value !== 'co_worker' ? 1 : 2,
                        ];
                    }
                }
                
                $woo_project[]=[
                    'action'      => $wp['type'],
                    'product_ids' => array($wp['product_id']),
                    'project_id'  => $projects[$wp['project_id']],
                    'assignees'   => $role
                ];
            }
        }
        
        
        $newSettings = [
            'upload_limit'              => !empty($genral['upload_limit']) ? $genral['upload_limit']: 2,
            'project_per_page'          => !empty($genral['pagination']) ? $genral['pagination']: 10,
            'list_per_page'             => !empty($genral['show_todo']) ? $genral['show_todo']: 10,
            'list_show'                 => !empty($genral['todolist_show']) ? $genral['todolist_show'] : 'pagination' ,
            'incomplete_tasks_per_page' => !empty($genral['show_incomplete_tasks']) ? $genral['show_incomplete_tasks'] : 50 ,
            'complete_tasks_per_page'   => !empty($genral['show_completed_tasks']) ? $genral['show_completed_tasks'] : 50,
            'managing_capability'       => !empty($genral['project_manage_role']) ? array_values($genral['project_manage_role']): array('administrator', 'editor', 'author'),
            'project_create_capability' => !empty($genral['project_create_role'])? array_values($genral['project_create_role']) : array('administrator', 'editor', 'author'),
            'task_start_field'          => (!empty($genral['task_start_field']) &&  $genral['task_start_field']  == 'on' ) ? true : false,
            'daily_digest'              => (!empty($genral['daily_digest']) && $genral['daily_digest'] == 'on') ? true : false,
            'from_email'                => !empty($mail['email_from']) ? $mail['email_from'] : bloginfo('admin_email'),
            'link_to_backend'           => (!empty($mail['email_url_link']) && $mail['email_url_link'] == 'frontend') ? false: true,
            'email_type'                => !empty($mail['email_type']) ? $mail['email_type']: 'text/plain',
            'enable_bcc'                => (!empty($mail['email_bcc_enable']) && $mail['email_bcc_enable'] == 'on') ? true: false,
            'project'                   => !empty($page['project']) ? $page['project'] : '',
            'my_task'                   => !empty($page['my_task']) ? $page['my_task'] : '',
            'calendar'                  => !empty($page['calendar']) ? $page['calendar']: '',
            'woo_project'               => !empty($woo_project)? $woo_project: '',
            'after_order_complete'      => (!empty($cpm_integration['woo_duplicate']) && $cpm_integration['woo_duplicate'] == 'paid') ? true : false,
        ];

        foreach ($newSettings as $key => $value ) {
            $settings = Settings::firstOrCreate([
                'key' => $key
            ]);
            $settings->update_model( ['key'=>$key, 'value'=> $value] );
        }
        
    }

    protected function migrate_category() {
        global $wpdb;
        $terms = get_terms( array(
            'taxonomy' => 'cpm_project_category',
            'hide_empty' => false,
        ) );
        $categories = [];
        foreach ($terms as $term) {
            $cat = Category::firstOrCreate([
                'title'            => $term->name , 
                'description'      => $term->description, 
                'categorible_type' =>'project',
            ]);
            $projects = get_site_option("pm_upgrade", array());

            $prointrem = $wpdb->get_results( "SELECT object_id FROM {$wpdb->term_relationships} WHERE  term_taxonomy_id = {$term->term_taxonomy_id}", ARRAY_A );
            $pterm =[];
            foreach ($prointrem as $p) {
                $pterm[] = $p['object_id'];
            }


            $arr = array_filter($projects, function( $key ) use ($pterm){
                return in_array($key, $pterm);
            }, ARRAY_FILTER_USE_KEY);

            $cat->projects()->attach(array_values($arr));
            $categories[$term->term_taxonomy_id] = $cat->id;
        }
    }

    /**
     * save object from model
     * @param  object $object new model
     * @param  array $arr    model data
     * @return object         new model
     */
    protected function save_object( $object,  $arr ) {
        foreach ($arr as $key => $value) {
            $object->{$key} = $value;
        }

        $object->unsetEventDispatcher();

        if ($object->save()){
            return $object;
        } 
    }
    
}