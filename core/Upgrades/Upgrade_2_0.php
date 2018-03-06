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
use WeDevs\PM\Category\Models\Category;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM_Pro\Modules\time_tracker\src\Models\Time_Tracker;
use WeDevs\PM_Pro\Modules\Gantt\src\Models\Gantt;
use WeDevs\PM_Pro\Modules\invoice\src\Models\Invoice;

/**
*   Upgrade project manager 2.0     
*/
class Upgrade_2_0 extends WP_Background_Process
{
    /**
     * @var string
     */
    protected $action = 'pm_db_migration_2_0';

    public $isProcessRuning = false;
    

    /**
     * task funciotn run on background over time
     * comes form WP_Background_Process abstruct    
     * @param   $item 
     * @return 
     */
    function task( $item ) {

        if ( empty( absint( $item ) ) ) {
            return false;
        }

        pm_log( 'migrations', $item );

        $this->isProcessRuning = true;
        $this->upgrade_projects($item);

        return false;
    }


    /**
     * Complete function for WP_Background_Process
     *
     */
    function complete() {
        parent::complete();
        $this->isProcessRuning = false;
        $this->migrate_category();
        $this->set_settings();
        
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
     * Get batch
     *
     * @return stdClass Return the first batch from the queue
     */
    protected function delete_queue_batch() {
        global $wpdb;

        $table        = $wpdb->options;
        $column       = 'option_name';
        $key_column   = 'option_id';
        $value_column = 'option_value';

        if ( is_multisite() ) {
            $table        = $wpdb->sitemeta;
            $column       = 'meta_key';
            $key_column   = 'meta_id';
            $value_column = 'meta_value';
        }

        $key = $wpdb->esc_like( $this->identifier . '_batch_' ) . '%';

        $query = $wpdb->query( $wpdb->prepare( "
            DELETE 
            FROM {$table}
            WHERE {$column} LIKE %s
        ", $key ) );
    }


    /**
     * initialize upgrade
     * Get all Project id and push into queue 
     * @return [type] [description]
     */
    public function upgrade_init ( ) {
        $this->delete_queue_batch(); 

        global $wpdb;
        $ids = $wpdb->get_results( "SELECT ID FROM $wpdb->posts WHERE post_type = 'cpm_project'", ARRAY_A );

        if ( is_wp_error( $ids ) ) {
            return;
        }

        $ids = wp_list_pluck($ids, 'ID'); 
        
        foreach ($ids as $id) {
            if ( empty( absint( $id ) ) ) {
                continue;
            }
            $this->push_to_queue( $id );
        }

        $this->save()->dispatch();
    }

    /**
     * start upgrade project 
     * @param  ini $project_id 
     * @return Object          new project model object 
     */
    public function upgrade_projects( $project_id ) {

        $project_ids = get_site_option( "pm_db_migration", array() );
        
        if( in_array( $project_id, array_keys( $project_ids ) ) ) {
            return false;
        }

        $project_ids[$project_id] = 0;
        update_site_option("pm_db_migration", $project_ids);

        $project = $this->create_project($project_id);

        if( $project ) {
            $project_ids[$project_id] = $project->id;
            update_site_option( "pm_db_migration", $project_ids );
        }
        
    }

    /**
     * retrive old project and push into new database
     * @param  int $project_id 
     * @return Object             new Project model object
     */
    function create_project( $project_id ) {
        global $wpdb;
        if( !$project_id && !is_int( $project_id ) ){
            return ;
        }

        $oldProject = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $wpdb->posts WHERE ID=%d", $project_id ) );

        $newProject = $this->save_object( new Project, [
            'title'       => $oldProject->post_title,
            'description' => $oldProject->post_content,
            'status'      => get_post_meta($project_id, '_project_active', true) == 'yes' ? 0 : 1,
            'created_by'  => $oldProject->post_author,
            'updated_by'  => $oldProject->post_author,
            'created_at'  => $oldProject->post_date,
            'updated_at'  => $oldProject->post_modified,
        ] );

        $this->create_project_role( $project_id, $newProject->id, $oldProject->post_author );

        $milestons = $this->get_milestones( $project_id, $newProject->id );
        $discuss   = $this->get_discuss( $project_id, $newProject->id, $milestons );
        $commnetd  = $this->get_comments( $discuss, $newProject->id, 'discussion_board' );
        $taskLists = $this->get_task_list( $project_id, $newProject->id, $milestons );
        $commenttl = $this->get_comments( $taskLists, $newProject->id, 'task_list' );
        list( $tasks, $parents )  = $this->get_tasks( $newProject->id, $taskLists );
        $commnett  = $this->get_comments( $tasks, $newProject->id, 'task' );

        $this->get_activity( $project_id, $newProject->id, $discuss, $taskLists, $tasks, array_merge( (array) $commnetd, (array)$commenttl, (array)$commnett ) );

        $this->get_file( $project_id, $newProject->id );

        if( !empty( $parents ) ) {
            // for sub task
           $this->get_tasks( $newProject->id, $tasks, $taskLists, $parents ); 
        }

        $this->add_time_tracker( $project_id, $newProject->id, $taskLists, $tasks );

        $this->set_project_settings( $project_id, $newProject );
        $this->set_bp_group( $project_id, $newProject );
        $this->get_kanboard( $project_id, $newProject, $tasks );
        $this->gantt_upgrate( $taskLists, $tasks, $parents );
        $this->get_invoice( $project_id, $newProject );
        return $newProject;
    }

    /**
     * create project role 
     * @param  init $oldProjectId
     * @param  init $newProjectID       
     * @param  init $assigned_by 
     * @return void              
     */
    function create_project_role( $oldProjectId, $newProjectID, $assigned_by ){
        if( !$oldProjectId ){
            return ;
        }
        global $wpdb;
        $table    = $wpdb->prefix . 'cpm_user_role';
        $oldroles = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $table WHERE project_id=%d", $oldProjectId ), ARRAY_A );
        if ( is_wp_error( $oldroles ) ) {
            return;
        }
        foreach ($oldroles as $role ) {
            if ( $role['role']       == 'manager' ){
                $role_id = 1;
            }else if ( $role['role'] == 'co_worker' ){
                $role_id = 2;
            }else{
                $role_id = 3; 
            }
            $this->save_object( new User_Role, [
                'user_id'       => $role['user_id'],
                'role_id'       => $role_id,
                'project_id'    => $newProjectID,
                'assigned_by'   => $assigned_by,
            ] );
        }
    }


    function get_milestones( $oldProjectId, $newProjectID  ) {
        if( !$oldProjectId ){
            return ;
        }
        global $wpdb;

        $oldMilestones   = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $wpdb->posts WHERE post_parent=%d AND post_type in ('cpm_milestne', 'cpm_milestone') AND post_status=%s", $oldProjectId, 'publish' ), ARRAY_A );

        $milestons  = [];

        foreach ( $oldMilestones as $post ) {
            $milestons[ $post[ 'ID' ] ] = $this->create_milestone( $post, $newProjectID );
        }

        return $milestons;
    }

    /**
     * create milestone 
     * @param  init $project_id 
     * @param  object $newProject new project Model
     * @return arrat             old milestone and new milestone 
     */
    function create_milestone( $milestone, $newProjectID ) {
        if( !$milestone ){
            return ;
        }

        $newMilestone = $this->add_board( $milestone, 'milestone',  $newProjectID );
        $completed_at = get_post_meta( $milestone['ID'], '_completed_on', true );
        $meta = [
            'achieve_date' => get_post_meta( $milestone['ID'], '_due', true ),
            'status'       => get_post_meta( $milestone['ID'], '_completed' , true ) == 1 ? 2 : 1,
        ];
        if( !empty( $completed_at ) ) {
            $meta['completed_at'] = $completed_at;
        }

        $mil_pri = get_post_meta( $milestone['ID'], '_milestone_privac', true );
        if( isset( $mil_pri ) && $mil_pri == 'yes' ){
            $meta['privacy'] = 1;
        }


        if ( $newMilestone->id && isset( $meta ) ) {
            $this->add_meta( $meta, $newMilestone, $newProjectID );
        }
        
        return $newMilestone->id;
    }
    /**
     * get Dsicuss and create from
     * @param  int $oldProjectId 
     * @param  int $newProjectID 
     * @param  array $milestons    
     * @return array               new and old milestone array
     */
    function get_discuss( $oldProjectId, $newProjectID, $milestons ) {
        if( !$oldProjectId ){
            return ;
        }
        global $wpdb;

        $oldDiscuss   = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $wpdb->posts WHERE post_parent=%d AND post_type=%s AND post_status=%s", $oldProjectId, 'cpm_message', 'publish' ), ARRAY_A );

        $discuss  = [];

        foreach ( $oldDiscuss as $post ) {
            $discuss[$post['ID']] = $this->create_discuss( $post, $newProjectID, $milestons );
        }
        return $discuss;
    }

    /**
     * Create disusss from old discuss
     */
    function create_discuss( $post, $newProjectID, $milestons ) {
        if( !$post ) {
            return ;
        }
        $newDiscuss = $this->add_board( $post, 'discussion_board', $newProjectID );
        $mid        = get_post_meta( $post['ID'], '_milestone', true );

        if ( $mid && !empty( $milestons ) ) {
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

        $mag_pri = get_post_meta( $post['ID'], '_message_privacy', true );
        if( isset( $mag_pri ) && $mag_pri == 'yes' ){
            $meta['privacy'] = 1;
        }

        if ( isset( $meta ) && !empty( $meta )) {
            $this->add_meta( $meta,  $newDiscuss, $newProjectID );
        }

        $files = get_post_meta( $post['ID'], '_files', true);
        if ( !empty( $files )) {
            foreach ( $files as $file ) {
                
                $this->add_file( [
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
     * @param  int $newProjectID 
     * @param  array $milestons    
     * @return array               new and old milestone array
     */
    function get_task_list( $oldProjectId, $newProjectID, $milestons ) {
        if( !$oldProjectId ){
            return ;
        }
        global $wpdb;

        $oldTaskList   = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $wpdb->posts WHERE post_parent=%d AND post_type=%s AND post_status=%s", $oldProjectId, 'cpm_task_list', 'publish' ), ARRAY_A );

        $taskList  = [];

        foreach ( $oldTaskList as $post ) {
            $taskList[$post['ID']] = $this->create_task_list( $post, $newProjectID, $milestons );
        }
        return $taskList;
    }


    /**
     * Create disusss from old discuss
     */
    function create_task_list( $post, $newProjectID, $milestons ) {
        if( !$post ) {
            return ;
        }
        $taskList = $this->add_board( $post, 'task_list', $newProjectID );
        $mid      = get_post_meta( $post['ID'], '_milestone', true );
        $mid      = intval( $mid );
        if ( !empty( $mid ) && $mid != -1 && !empty( $milestons ) ) {
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
        $meta = array();
        $list_pri = get_post_meta( $post['ID'], '_tasklist_privacy', true );
        if( isset( $list_pri ) && $list_pri == 'on' ){
            $meta['privacy'] = 1;
        }
        
        if ( !empty( $meta ) ) {
            $this->add_meta( $meta,  $taskList, $newProjectID );
        }

        return  $taskList->id;
    }

    function get_tasks( $newProjectID, $listitems, $list = null, $parent = null ) {
        if( empty( $listitems ) ) {
            return ;
        }
        global $wpdb;
        if( $parent == null ){
            $post_type = 'cpm_task';
        }else{
            $post_type = 'cpm_sub_task';
        }
        
        $in         = implode( ',', array_keys( $listitems  ));
        $oldTask    = $wpdb->get_results( "SELECT * FROM {$wpdb->posts} WHERE post_parent IN({$in}) AND  post_type='{$post_type}' AND post_status='publish'", ARRAY_A );
        $tasks      = [];
        $taskParent = [];

        foreach ( $oldTask as $post ) {
            $tasks[$post['ID']]      = $this->create_task( $post, $newProjectID,  $listitems, $list,  $parent );
            if( $post['post_type'] == 'cpm_task' ){
                $taskParent[$post['ID']] = $post['post_parent'];
            }
            
        }
        return array( $tasks, $taskParent );
    }

    function create_task( $post, $newProjectID,  $listitems, $list=null, $parent = null ) {
        if( !$post ){
            return ;
        }
        $newTask  = $this->save_object( new Task, [
            'title'       => $post['post_title'],
            'description' => $post['post_content'],
            'status'      => get_post_meta( $post['ID'], '_completed', true),
            'project_id'  => $newProjectID, 
            'start_at'    => get_post_meta( $post['ID'], '_start', true),
            'due_date'    => get_post_meta( $post['ID'], '_due', true),
            'parent_id'   => $post['post_type'] === 'cpm_task' ? 0: $listitems[$post['post_parent']],
            'created_by'  => $post['post_author'],
            'updated_by'  => $post['post_author'],
            'created_at'  => $post['post_date'],
            'updated_at'  => $post['post_modified'],
        ] );

        if( !empty( $post['post_parent'] ) ) {

            if( $parent !== null ) {
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
            $meta     = array();
            $task_pri = get_post_meta( $post['ID'], '_task_privacy', true );
            if ( !empty( $task_pri ) && $task_pri == 'yes' ){
                $meta['privacy'] = 1;
            }

            if ( $newTask->id && !empty( $meta ) ) {
                $this->add_meta( $meta,  $newTask, $newProjectID, $boardable_type );
            }
        }
        $this->add_assignee( $newTask, $post['ID'] );

        return $newTask->id;
    }

    function add_assignee( $task, $post_id ) {
        if ( !$post_id ){
            return ;
        }
        $assignees = get_post_meta( $post_id, '_assigned' );

        if ( empty( $assignees ) || array_keys( $assignees, '-1' )) {
            return ;
        }

        foreach ( $assignees as $assignee ) {

            $completd_by = get_post_meta( $post_id, '_completed_by', true );
            $completed_at = null;
            if ( !empty( $completd_by )  && $assignee == $completd_by ) {
                $completed_at = get_post_meta( $post_id, '_completed_on', true);
                $completed_at = !empty( $completed_at ) ? $completed_at: null;
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
            ] );
        }
    }

    function get_comments( $ids, $newProjectID, $commentable_type ) {
        if( empty( $ids ) ){
            return ;
        }
        global $wpdb;
        $in        = implode(',', array_keys( $ids ) );
        $OComments = $wpdb->get_results( "SELECT * FROM {$wpdb->comments} WHERE comment_post_ID IN({$in})", ARRAY_A );
        
        $comments  = [];

        foreach ( $OComments as $comment ) {
            $comments[$comment[ 'comment_ID' ]] = $this->create_comments( $comment, $newProjectID, $commentable_type, $ids[$comment['comment_post_ID']] );
        }

        return $comments;
    }

    function create_comments( $comment, $newProjectID, $commentable_type, $commentable_id ) {
        if( !$comment ){
            return ;
        }
        $newComment = $this->save_object( new Comment, [
            'content'          => $comment['comment_content'],
            'mentioned_users'  => null,
            'commentable_id'   => $commentable_id,
            'commentable_type' => $commentable_type,
            'project_id'       => $newProjectID,
            'created_by'       => $comment['user_id'],
            'updated_by'       => $comment['user_id'],
            'updated_by'       => $comment['user_id'],
            'updated_by'       => $comment['user_id'],
            'created_at'       => $comment['comment_date'],
            'updated_at'       => $comment['comment_date'],
        ] );

        $files = get_comment_meta( $comment['comment_ID'], '_files', true );
        if ( !empty( $files ) ) {
            foreach ( $files as $file ) {
                
                $this->add_file( [
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


    function get_file( $OldProjectId, $newProjectID ) {
        if ( !$OldProjectId ){
            return ;
        }
        global $wpdb;
        $table   = $wpdb->prefix . 'cpm_file_relationship';
        $files   = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$table} WHERE project_id=%d ORDER BY `id` ASC", $OldProjectId ), ARRAY_A );
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

            $newFile = $this->add_file( [
                'fileable_id'   => null,
                'fileable_type' => 'file',
                'parent'        => $parent,
                'type'          => $type,
                'attachment_id' => $file['attachment_id'],
                'project_id'    => $newProjectID,
                'created_by'    => $file['created_by'],
                'updated_by'    => $file['created_by'],
                'created_at'    => $file['created_at'],
                'updated_at'    => $file['updated_at'],
            ] );

            if( $file['post_id'] ){
                $meta = $this->get_doc_meta( $file['post_id'], $newFile->id, $newProjectID );
                $comments[$file['post_id']] = $newFile->id;
            }elseif ( $file['attachment_id'] ) {
                $comments[$file['attachment_id']] = $newFile->id;
            }

            $fileArr[$file['id']] = $newFile->id;
            $meta['private']      = $file['private'] == 'yes' ? 1 : 0;

            if ( !empty( $file['dir_name'] ) ){
                $meta['title']   = $file['dir_name'];
            }

            $this->add_meta( $meta, $newFile, $newProjectID, 'file' );
        }

        $this->set_post_attachment( $comments, $newProjectID );
        $this->get_comments( $comments, $newProjectID, 'file' );
        $this->get_revision( $comments, $newProjectID );

        return $fileArr;
        
    }

    function get_doc_meta( $post_id, $docid, $newProjectID ) {
        if ( !$post_id ) {
            return ;
        }
        global $wpdb;
        $post = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$wpdb->posts} WHERE ID=%d", $post_id ) );
        $meta = [];
        $meta['title'] = $post->post_title;
        $meta['description'] = $post->post_content;
        if( !empty( $post->post_excerpt ) ){
            $meta['url'] = $post->post_excerpt;
        }

        return $meta;
    }

    function set_post_attachment( $ids, $newProjectID ) {
        if( empty( $ids ) ){
            return ;
        }
        global $wpdb;
        $in        = implode(',', array_keys($ids));
        $attachments = $wpdb->get_results( "SELECT * FROM {$wpdb->posts} WHERE post_parent IN({$in}) and post_type='attachment'", ARRAY_A);

        foreach ( $attachments as $attachment ){
            $this->add_file([
                'fileable_id'   => $ids[$attachment['post_parent']],
                'fileable_type' => 'file',
                'parent'        => $ids[$attachment['post_parent']],
                'type'          => 'doc',
                'attachment_id' => $attachment["ID"],
                'project_id'    => $newProjectID,
                'created_by'    => $attachment['post_author'],
                'updated_by'    => $attachment['post_author'],
                'created_at'    => $attachment['post_date'],
                'updated_at'    => $attachment['post_date'],
            ]);
        }
    }
    
    function get_revision( $ids, $newProjectID ) {
        if( empty( $ids ) ){
            return ;
        }
        global $wpdb;
        $in        = implode(',', array_keys($ids));
        $revisions = $wpdb->get_results( "SELECT * FROM {$wpdb->posts} WHERE post_parent IN({$in}) and post_type='revision'", ARRAY_A);
        
        foreach( $revisions as $revision ){
            $meta=[];
            $newFile = $this->add_file([
                'fileable_id'   => null,
                'fileable_type' => 'file',
                'parent'        => $ids[$revision['post_parent']],
                'type'          => 'revision',
                'attachment_id' => null,
                'project_id'    => $newProjectID,
                'created_by'    => $revision['post_author'],
                'updated_by'    => $revision['post_author'],
                'created_at'    => $revision['post_date'],
                'updated_at'    => $revision['post_date'],
            ]);

            $meta['title'] = $revision['post_title'];
            $meta['description'] = $revision['post_content'];
            if( !empty( $revision['post_excerpt'] ) ){
                $meta['url'] = $revision ['post_excerpt'];
            }

            $this->add_meta( $meta, $newFile, $newProjectID, 'file' );
        }
    }

    function get_invoice( $oldProjectId, $newProject ) {
        if( !$oldProjectId ){
            return ;
        }
        if( !class_exists( 'WeDevs\PM_Pro\Modules\invoice\src\Models\Invoice' ) ){
            return ;
        }
        if( function_exists('pm_pro_is_module_inactive') || pm_pro_is_module_inactive('invoice/invoice.php') ) {
            return ;
        }
        global $wpdb;

        $oldInvoice   = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $wpdb->posts WHERE post_parent=%d AND post_type=%s AND post_status=%s", $oldProjectId, 'cpm_invoice', 'publish' ), ARRAY_A );

        $invoice  = [];

        foreach ( $oldInvoice as $post ) {
            $invoice[$post['ID']] = $this->create_invoice( $post, $newProject );
        }
        return $invoice;
    }

    function create_invoice( $post, $newProject ) {
        $invoiceArr =[
            'client_id'      => get_post_meta( $post['ID'], 'client_id', true ),
            'title'          => $post['post_title'] ,
            'start_at'       => $post['post_date'],
            'due_date'       => get_post_meta( $post['ID'], 'due_date', true ),
            'discount'       => get_post_meta( $post['ID'], 'discount', true ),
            'partial'        => get_post_meta( $post['ID'], 'partial_payment', true ) == 'yes' ? 1 : 0,
            'partial_amount' => get_post_meta( $post['ID'], 'partial_amount', true ),
            'terms'          => get_post_meta( $post['ID'], 'terms', true ),
            'client_note'    => $post['post_content'],
            'items'          => serialize( $this->get_invoice_item( $post, $newProject ) ),
            'project_id'     => $newProject->id,
            'status'         => get_post_meta( $post['ID'], 'statue', true ) == 'paid' ? 1 : 0,
            'created_by'     => $post['post_author'],
            'updated_by'     => $post['post_author'],
            'created_at'     => $post['post_date'],
            'updated_at'     => $post['post_modified'],
        ];

        $invoice = $this->save_object(new Invoice, $invoiceArr );

        $payments = get_post_meta( $post['ID'], 'cpmi_payment', true );

        if( !empty($payments) ) {
            foreach ( $payments as $payment ) {
                $payment_date = empty( $payment['date'] ) ? $post['post_modified'] : $payment['date'];

                $data = [
                    'entity_id'   => $invoice->id,
                    'entity_type' => 'invoice',
                    'meta_key'    => 'invoice_payment',
                    'meta_value'  => maybe_serialize([
                        'amount'  => floatval( $payment['amount'] ),
                        'date'    => date( 'Y-m-d', strtotime( $payment_date ) ),
                        'notes'   => $payment['notes'],
                        'gateway' => $payment['method']
                    ]),
                    'project_id' => $newProject->id,
                    'created_by'  => $invoice->client_id,
                    'updated_by'  => $invoice->client_id,
                    'created_at'  => $payment_date,
                    'updated_at'  => $payment_date,
                ];
                $this->save_object( New Meta, $data );
                
            }
        }

        

        return $invoice->id;
    }

    function get_invoice_item( $post, $newProject ) {
        $items = get_post_meta( $post['ID'], 'item', true );
        $hours = get_post_meta( $post['ID'], 'hour', true );
        $newItem = array();

        foreach ( $items as $item ) {
            $arr = [];
            $arr['task'] = $this->get_task_by_title( $item->name, $newProject ); // find id, title time
            $arr['description']  = $item->details;
            $arr['amount']  = $item->amount;
            $arr['quantity']  = $item->qty;
            $arr['tax']  = $item->tax_percent;
            $arr['descriptionField']  = isset($item->details);

            $newItem['entryNames'][] = $arr;
        }

        foreach ( $hours as $item ) {
            $arr = [];
            $arr['task'] = $this->get_task_by_title( $item->name, $newProject  ); // find id, title time
            $arr['description']  = $item->details;
            $arr['amount']  = $item->amount;
            $arr['hour']  = $item->qty;
            $arr['tax']  = $item->tax_percent;
            $arr['descriptionField']  = isset($item->details);

            $newItem['entryTasks'][] = $arr;
        }
       return $newItem; 
    }

    function get_task_by_title( $title , $newProject  ) {
        if( empty( $title ) ) {
            return [];
        }

        $task = Task::where('title', $title )->where( 'project_id', $newProject->id )->first();

        if( ! $task->id ) {
            return [];
        }

        $arr['id'] = $task->id;
        $arr['title'] = $task->title;
        $arr['time'] = [
            'hour' => 0
        ];

        return $arr;
    }

    function set_project_settings( $oldProjectId, $newProject ) {

        $settings = get_post_meta( 27, '_settings', true);
        if ( empty( $sections ) ) {
            return ;
        }

        $co_worker = array();
        $client    = array();
        $oldCW     = $settings['co_worker'];
        $oldClient = $settings['client'];

        $co_worker['create_message']         = ( isset( $oldCW['create_message'] ) && $oldCW['create_message'] == 'yes' ) ? true : false;
        $co_worker['view_private_message']   = ( isset( $oldCW['msg_view_private'] ) && $oldCW['msg_view_private'] == 'yes' ) ? true : false;
        $co_worker['create_list']            = ( isset( $oldCW['create_todolist'] ) && $oldCW['create_todolist'] == 'yes' ) ? true : false;
        $co_worker['view_private_list']      = ( isset( $oldCW['tdolist_view_private'] ) && $oldCW['tdolist_view_private'] == 'yes' ) ? true : false;
        $co_worker['create_task']            = ( isset( $oldCW['create_todo'] ) && $oldCW['create_todo'] == 'yes' ) ? true : false;
        $co_worker['view_private_task']      = ( isset( $oldCW['todo_view_private'] ) && $oldCW['todo_view_private'] == 'yes' ) ? true : false;
        $co_worker['create_milestone']       = ( isset( $oldCW['create_milestone'] ) && $oldCW['create_milestone'] == 'yes' ) ? true : false;
        $co_worker['view_private_milestone'] = ( isset( $oldCW['milestone_view_private'] ) && $oldCW['milestone_view_private'] == 'yes' ) ? true : false;
        $co_worker['create_file']            = ( isset( $oldCW['upload_file_doc'] ) && $oldCW['upload_file_doc'] == 'yes' ) ? true : false;
        $co_worker['view_private_file']      = ( isset( $oldCW['file_view_private'] ) && $oldCW['file_view_private'] == 'yes' ) ? true : false;
        
        $client['create_message']         = ( isset( $oldClient['create_message'] ) && $oldClient['create_message'] == 'yes' ) ? true : false;
        $client['view_private_message']   = ( isset( $oldClient['msg_view_private'] ) && $oldClient['msg_view_private'] == 'yes' ) ? true : false;
        $client['create_list']            = ( isset( $oldClient['create_todolist'] ) && $oldClient['create_todolist'] == 'yes' ) ? true : false;
        $client['view_private_list']      = ( isset( $oldClient['tdolist_view_private'] ) && $oldClient['tdolist_view_private'] == 'yes' ) ? true : false;
        $client['create_task']            = ( isset( $oldClient['create_todo'] ) && $oldClient['create_todo'] == 'yes' ) ? true : false;
        $client['view_private_task']      = ( isset( $oldClient['todo_view_private'] ) && $oldClient['todo_view_private'] == 'yes' ) ? true : false;
        $client['create_milestone']       = ( isset( $oldClient['create_milestone'] ) && $oldClient['create_milestone'] == 'yes' ) ? true : false;
        $client['view_private_milestone'] = ( isset( $oldClient['milestone_view_private'] ) && $oldClient['milestone_view_private'] == 'yes' ) ? true : false;
        $client['create_file']            = ( isset( $oldClient['upload_file_doc'] ) && $oldClient['upload_file_doc'] == 'yes' ) ? true : false;
        $client['view_private_file']      = ( isset( $oldClient['file_view_private'] ) && $oldClient['file_view_private'] == 'yes' ) ? true : false;


        $newSetings = [
            'co_worker' => $co_worker,
            'client'    => $client
        ];

        $this->save_object( new Settings, [
            'key'        => 'capabilities',
            'value'      => $newSetings,
            'project_id' => $newProject->id,
            'created_by' => $newProject->created_by,
            'updated_by' => $newProject->updated_by,
            'created_at'  => $newProject->created_at,
            'updated_at'  => $newProject->updated_at,
        ] );
    }

    function set_bp_group( $oldProjectId, $newProject ) {
        $group_id = get_post_meta( $oldProjectId, '_bp_group_id', true );
        if ( empty( $group_id )) {
            return ;
        }

        $metaObj = $this->save_object( new Meta, [
            'entity_id'   => $group_id,
            'entity_type' => 'pm_buddypress',
            'meta_key'    => 'group_id',
            'meta_value'  => $group_id,
            'project_id'  => $newProject->id,
            'created_by'  => $newProject->created_by,
            'updated_by'  => $newProject->updated_by,
            'created_at'  => $newProject->created_at,
            'updated_at'  => $newProject->updated_at,
        ] );

    }

    function get_kanboard( $oldProjectId, $newProject, $tasks ) {
        $sections    = get_post_meta( $oldProjectId, '_custom_section', true );
        $newSections = array();

        if( empty( $sections ) || !is_array( $sections ) ) {
            return ;
        }

        foreach( $sections as $section ) {
            $newBoard = $this->save_object( new Board, [
                'title'       => $section['name'],
                'description' => null,
                'order'       => $section['order'],
                'type'        => 'kanboard',
                'project_id'  => $newProject->id,
                'created_by'  => $newProject->created_by,
                'updated_by'  => $newProject->updated_by,
                'created_at'  => $newProject->created_at,
                'updated_at'  => $newProject->updated_at,
            ]);
            $newSections[$section['section_id']] = $newBoard->id;
        }
        if( is_array( $tasks ) && !empty( $tasks ) ) {
            foreach ( $tasks as $oldTaskId => $newTaskId ) {
                $section_id = get_post_meta( $oldTaskId, '_section_id', true );
                $order = get_post_meta( $oldTaskId, '_kanboard_order', true );

                if ( empty( $section_id ) ){
                    continue ;
                }

                $this->save_object( new Boardable, [
                    'board_id'       => $newSections[$section_id],
                    'board_type'     => 'kanboard',
                    'boardable_id'   => $newTaskId,
                    'boardable_type' => 'task',
                    'order'          => $order,
                    'created_by'     => $newProject->created_by,
                    'updated_by'     => $newProject->updated_by,
                    'created_at'     => $newProject->created_at,
                    'updated_at'     => $newProject->updated_at,
                ] ); 
            }
        }
        
    }

    function gantt_upgrate( $taskLists, $tasks, $taskParent ) {
        if(!class_exists( 'WeDevs\PM_Pro\Modules\Gantt\src\Models\Gantt' ) ) {
            return ;
        }

        if( function_exists('pm_pro_is_module_inactive') && pm_pro_is_module_inactive('gantt/gantt.php') ) {
            return ;
        }

        // $this->set_gantt_data( $taskLists, $taskLists, $tasks );
        // $this->set_gantt_data( $tasks, $taskLists, $tasks );
        if( is_array( $tasks ) ){
            foreach ( $tasks as $old => $new ) {
                $links = get_post_meta( $old, '_link', true );
                if( empty( $links ) ) {
                    continue ;
                }
                
                foreach ( $links as $link ) {
                    if ( array_key_exists( $link, $tasks ) ) {
                        $this->save_object( new Gantt, [
                            'source' => $new,
                            'target' => $tasks[$link],
                            'type'   => 1,
                        ]);
                    }
                }
            }
        }
        // if( !empty( $taskParent ) ) {
        //     foreach ( $taskParent as $task => $list ) {
        //         $this->save_object( new Gantt, [
        //             'source' => $taskLists[$list],
        //             'target' => $tasks[$task],
        //             'type'   => 2,
        //         ]);
        //     }
        // }
    }

    function set_gantt_data( $items, $taskLists, $tasks  ) {

        if(!is_array( $items ) && empty( $items ) ) {
            return ;
        }

        foreach ( $items as $old => $new ) {
            $links = get_post_meta( $old, '_link', true );

            if( empty( $links ) ) {
                continue ;
            }

            foreach ( $links as $link ) {
                // if ( array_key_exists( $link, $taskLists ) ) {
                //     $this->save_object( new Gantt, [
                //         'source' => $new,
                //         'target' => $taskLists[$link],
                //         'type'   => 1,
                //     ]);
                // }
                if ( array_key_exists( $link, $tasks ) ) {
                    $this->save_object( new Gantt, [
                        'source' => $new,
                        'target' => $tasks[$link],
                        'type'   => 1,
                    ]);
                }
            }
        }
    }

    function get_activity( $oldProjectId, $newProjectId, $discuss, $tasklist, $tasks, $comments ) {
        if( !$oldProjectId ) {
            return ;
        }
        global $wpdb;
        $activities = $wpdb->get_results( "SELECT * FROM $wpdb->comments WHERE  comment_post_ID = {$oldProjectId} AND comment_type='cpm_activity' ORDER BY `comment_ID` ASC", ARRAY_A );
        
        foreach ( $activities as $activity ) {

            list( $attr, $newCntent ) = $this->get_attr_array( $activity['comment_content'] );
            $meta                     = [ 'text' => $newCntent ];
            $resource_type            = "";
            $resource_id              = 0;

            foreach ( $attr as $key => $value ) {

                if( !empty( $value['title'] ) ) {
                    $title = $value['title'];
                }else {
                    $title = '';
                }

                switch ( $key ) {
                   
                    case 'cpm_msg_url':
                        if ( empty( $discuss[$value['id']] ) ) {
                            break;
                        }

                        $resource_id                    = $discuss[$value['id']];
                        $resource_type                  = 'discussion_board';
                        $meta['discussion_board_title'] = $title;

                        break;
                    case 'cpm_tasklist_url':
                        if ( empty( $tasklist[$value['id']] ) ) {
                            break;
                        }
                        
                        $resource_id             = $tasklist[$value['id']];
                        $resource_type           = 'task_list';
                        $meta['task_list_title'] = $title;

                        break;
                    case 'cpm_task_url': 
                        if ( empty( $tasks[$value['id']] ) ) {
                            break;
                        }                        
                        $resource_id        = $tasks[$value['id']];
                        $resource_type      = 'task';
                        $meta['task_title'] = $title;

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
            $this->created_activity( $activity, $resource_id, $resource_type, $meta, $newProjectId );
              
        }
        
        
    }

    function created_activity( $activity, $resource_id, $resource_type, $meta, $newProjectId ) {
        $this->save_object( new Activity, [
            'actor_id'      => $activity['user_id'],
            'action'        => 'cpm_migration',
            'action_type'   => 'migrated',
            'resource_id'   => $resource_id,
            'resource_type' => $resource_type,
            'meta'          => $meta,
            'project_id'    => $newProjectId,
            'created_at'    => $activity['comment_date'],
            'updated_at'    => $activity['comment_date'],
        ] );
    }


    function get_attr_array( $str ) {
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

            if( empty( $attr[$match[2]]['title'] )){
                if( strpos($match[0], 'title=') !== false ){
                   $title = substr( $match[0], strpos($match[0], 'title=') + 7, -2);
                   $title = preg_replace("/[\"\'\}\]]/m", '' , $title);
                   $attr[$match[2]]['title'] = $title;
                }
            }
        }, $str );

        return array($attr, $text);
    }

    function add_time_tracker( $oldProjectId, $newProjectID, $taskList, $tasks ) {
        if ( !$oldProjectId ){
            return ;
        }

        if(!class_exists( 'WeDevs\PM_Pro\Modules\time_tracker\src\Models\Time_Tracker' ) ) {
            return ;
        }

        if( function_exists('pm_pro_is_module_inactive') && pm_pro_is_module_inactive('time_tracker/time_tracker.php') ) {
            return ;
        }

        global $wpdb;
        $table = $wpdb->prefix. 'cpm_time_tracker';
        $timetracker = $wpdb->get_results( "SELECT * FROM {$table} WHERE  project_id = {$oldProjectId}", ARRAY_A );
        if ( is_wp_error( $timetracker ) ) {
            return;
        }
        foreach( $timetracker as $time ){
            $this->save_object( new Time_Tracker, [
                'user_id'    => $time['user_id'],
                'project_id' => $newProjectID,
                'list_id'    => $taskList[$time['tasklist_id']],
                'task_id'    => $tasks[$time['task_id']],
                'start'      => $time['start'],
                'stop'       => $time['stop'],
                'total'      => $time['total'],
                'run_status' => $time['run_status'] == 'no' ? 0 : 1 
            ] );
        }



    }

    function add_file( $arr ) {
        return $this->save_object( new File, $arr );
    }

    function add_board( $post , $board_type, $newProjectID ) {
        $newBoard = $this->save_object( new Board, [
            'title'       => $post['post_title'],
            'description' => $post['post_content'],
            'order'       => $post['menu_order'],
            'type'        => $board_type,
            'project_id'  => $newProjectID,
            'created_by'  => $post['post_author'],
            'updated_by'  => $post['post_author'],
            'created_at'  => $post['post_date'],
            'updated_at'  => $post['post_modified'],
        ]);

        return $newBoard;
    }

    function add_meta( $meta , $object, $newProjectID, $entity_type = null ) {
        $meta_ids = [];
        foreach ( $meta as $key => $value ) {
            if( empty( $value ) ){
                continue ;
            }
            $metaObj = $this->save_object( new Meta, [
                'entity_id'   => $object->id,
                'entity_type' => $entity_type !== null? $entity_type : $object->type,
                'meta_key'    => $key,
                'meta_value'  => $value,
                'project_id'  => $newProjectID,
                'created_by'  => $object->created_by,
                'updated_by'  => $object->updated_by,
                'created_at'  => $object->created_at,
                'updated_at'  => $object->updated_at,
            ] );

            $meta_ids[] = $metaObj->id;
        }

        return $meta_ids;
    }

    function set_settings() {
        $genral          = get_site_option( 'cpm_general', array() );
        $mail            = get_site_option( 'cpm_mails', array() );
        $page            = get_site_option( 'cpm_page', array() );
        $woo_projects    = get_site_option( 'cpmwoo_settings', array() );
        $cpm_integration = get_site_option( 'cpm_integration', array() );
        $projects        = get_site_option( 'pm_upgrade', array() );
        $invoice         = get_site_option( 'cpm_invoice', array() );
        $newSettings     = array();
        $woo_project     = array();
        
        if ( is_array( $woo_projects ) && !empty( $woo_projects ) ){
            foreach ( $woo_projects as $wp ) {
                $role = [];
                if ( is_array( $wp['role'] ) && !empty( $wp['role'] ) ) {
                    foreach ( $wp['role'] as $key => $value ) {
                        $role[] = [
                            'user_id' => $key,
                            'role_id' => $value !== 'co_worker' ? 1 : 2,
                        ];
                    }
                }
                
                $woo_project[] = [
                    'action'      => $wp['type'],
                    'product_ids' => array($wp['product_id']),
                    'project_id'  => $projects[$wp['project_id']],
                    'assignees'   => $role
                ];
            }
        }
        if( isset( $genral['project_manage_role'] ) ) {
            $newSettings['managing_capability'] = array_values( $genral['project_manage_role'] );
        }
        if( isset( $genral['project_create_role'] ) ) {
            $newSettings['project_create_capability'] = array_values( $genral['project_create_role'] );
        }
        if( !empty( $woo_project ) ) {
            $newSettings['woo_project'] = $woo_project;
        }

        if( !empty( $genral ) ){
            $this->set_new_setting( $newSettings, 'upload_limit', $genral, 'upload_limit' );
            $this->set_new_setting( $newSettings, 'project_per_page', $genral, 'pagination' );
            $this->set_new_setting( $newSettings, 'list_per_page', $genral, 'show_todo' );
            $this->set_new_setting( $newSettings, 'list_show', $genral, 'todolist_show' );
            $this->set_new_setting( $newSettings, 'incomplete_tasks_per_page', $genral, 'show_incomplete_tasks' );
            $this->set_new_setting( $newSettings, 'complete_tasks_per_page', $genral, 'show_completed_tasks' );
            $this->set_new_setting( $newSettings, 'task_start_field', $genral, 'task_start_field', 'on' );
            $this->set_new_setting( $newSettings, 'daily_digest', $genral, 'daily_digest', 'on' );
        }

        if ( !empty($mail) ) {
            $this->set_new_setting( $newSettings, 'from_email', $mail, 'email_from' );
            $this->set_new_setting( $newSettings, 'link_to_backend', $mail, 'email_url_link', 'backend' );
            $this->set_new_setting( $newSettings, 'email_type', $mail, 'email_type' );
            $this->set_new_setting( $newSettings, 'enable_bcc', $mail, 'email_bcc_enable', 'on' );
        }

        if( !empty( $page ) ) {
            $this->set_new_setting( $newSettings, 'project', $page, 'project' );
            $this->set_new_setting( $newSettings, 'my_task', $page, 'my_task' );
            $this->set_new_setting( $newSettings, 'calendar', $page, 'calendar' );
        }

        if ( !empty( $cpm_integration ) ) {
            $this->set_new_setting( $newSettings, 'after_order_complete', $cpm_integration, 'woo_duplicate', 'paid' );
        }  

        if ( !empty( $invoice ) ) {
            $this->set_new_setting( $newSettings['invoice'], 'theme_color', $invoice, 'theme_color' );
            $this->set_new_setting( $newSettings['invoice'], 'currency_code', $invoice, 'currency' );
            $this->set_new_setting( $newSettings['invoice'], 'paypal', $invoice, 'payment_gateway', 'paypal' );
            $this->set_new_setting( $newSettings['invoice'], 'paypal_mail', $invoice, 'paypal_email' );
            $this->set_new_setting( $newSettings['invoice'], 'sand_box_mode', $invoice, 'paypal_sand_box', 'on' );
            $this->set_new_setting( $newSettings['invoice'], 'paypal_instruction', $invoice, 'gate_instruct_paypal' );
            $this->set_new_setting( $newSettings['invoice'], 'organization', $invoice, 'organization' );
            $this->set_new_setting( $newSettings['invoice'], 'address_line_1', $invoice, 'address_line_1' );
            $this->set_new_setting( $newSettings['invoice'], 'address_line_2', $invoice, 'address_line_2' );
            $this->set_new_setting( $newSettings['invoice'], 'city', $invoice, 'city' );
            $this->set_new_setting( $newSettings['invoice'], 'sate_province', $invoice, 'state' );
            $this->set_new_setting( $newSettings['invoice'], 'zip_code', $invoice, 'zip' );
            $this->set_new_setting( $newSettings['invoice'], 'country_code', $invoice, 'country' );
        }

        foreach ( $newSettings as $key => $value ) {
            $settings = Settings::firstOrCreate([
                'key' => $key
            ]);
            $settings->update_model( ['key'=>$key, 'value'=> $value] );
        }
        
    }

    function set_new_setting( &$settings, $newkey, $oldsettings, $oldkey, $willtrue = null ) {

        if( !isset( $oldsettings[$oldkey] ) || empty( $oldsettings[$oldkey] ) ) {
            return ;
        }
        if( $willtrue != null ) {
            $settings[$newkey] = $oldsettings[$oldkey] == $willtrue ? true : false;
        }
        $settings[$newkey] = $oldsettings[$oldkey];
    }

    function migrate_category() {
        global $wpdb;
        $terms = get_terms( 
            [
                'taxonomy' => 'cpm_project_category',
                'hide_empty' => false,
            ]
        );

        $categories = [];

        if ( is_wp_error( $terms ) ) {
            return;
        }

        $object = wp_list_pluck($terms, 'term_taxonomy_id' );
        $object = implode(',', $object);
        
        $terms_releation = $wpdb->get_results( "SELECT * FROM {$wpdb->term_relationships} WHERE  term_taxonomy_id in({$object})", ARRAY_A );
        $terms_releation = collect( $terms_releation );

        foreach ( $terms as $term ) {
            $cat = Category::firstOrCreate( [
                'title'            => $term->name , 
                'description'      => $term->description, 
                'categorible_type' =>'project',
            ]);
            $projects = get_site_option( "pm_db_migration", array() );

            $pterm = $terms_releation->where( 'term_taxonomy_id', $term->term_taxonomy_id )->pluck('object_id')->all();

            $arr = array_filter( $projects, function( $key ) use ( $pterm ){
                return in_array( $key, $pterm );
            }, ARRAY_FILTER_USE_KEY);

            $cat->projects()->attach( array_values( $arr ) );
            $categories[$term->term_taxonomy_id] = $cat->id;
        }
        return $categories;
    }

    /**
     * save object from model
     * @param  object $object new model
     * @param  array $arr    model data
     * @return object         new model
     */
    function save_object( $object,  $arr ) {
        foreach ($arr as $key => $value) {
            $object->{$key} = $value;
        }

        $object->unsetEventDispatcher();

        if( $object->save() ) {
            return $object;
        } 
    }
    
}