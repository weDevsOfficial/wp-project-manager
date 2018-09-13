<?php
namespace WeDevs\PM\Core\Upgrades;
use WP_Background_Process;
use WP_Query;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Role\Models\Role;
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
use PM_Create_Table;

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
    
    function __construct() {
        parent::__construct();
        add_action('admin_notices', array( $this, 'notification' ) );
    }

    /**
     * task funciotn run on background over time
     * comes form WP_Background_Process abstruct    
     * @param   $item 
     * @return 
     */
    function task( $item ) {
        $item = absint( $item );
        
        if ( empty( $item ) ) {
            return false;
        }
        $this->isProcessRuning = true;
        $this->upgrade_projects( $item );
        $this->upgrade_observe_migration( [
            'projects' => true
        ] );

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

        delete_option( 'pm_start_migration' );
        delete_option( 'cpm_db_version' );
        
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


    public function notification() {
        
        $is_active_notice = get_option('pm_migration_notice');

        if ( 
            empty( $is_active_notice ) 
                ||
            $is_active_notice == 'complete'
        ) {
           return;
        }
        
        echo '<div class="wrap"><div class="updated pm-update-progress-notice wrap"></div></div>';
        $db_observe = get_option( 'pm_observe_migration' );

        $observe = json_encode( $db_observe );
        $assets_url = config('frontend.assets_url');

        $result = array_diff( $db_observe['count'], $db_observe['migrate'] );
        
        $is_all_migrated = empty( $result ) ? true : false; 
        
        ?>
            <script type="text/javascript">
                var pm_is_all_migrated = <?php echo json_encode($is_all_migrated); ?>;

                jQuery( document ).on( 'heartbeat-send', function ( event, data ) {
                    data.pm_migration = true;
                });

                jQuery(document).ready(function() {
                    var migrateData = <?php echo $observe; ?>;
                    
                    
                    pmProgressStatus(migrateData, pm_is_all_migrated, function() {
                        pmRemoveNotice();
                    });
                });

                jQuery( document ).on( 'heartbeat-tick', function ( event, data ) {
                    // Check for our data, and use it.
                    if ( ! data.pm_migration ) {
                        return;
                    }

                    pmProgressStatus(data.pm_migration, data.pm_is_all_migrated, function() {
                        pmRemoveNotice();
                    });

                });

                function pmProgressStatus(migrateData, pm_is_all_migrated, callBack ) {
                    pm_is_all_migrated = pm_is_all_migrated || false;

                    var migrations = {
                        'project': {
                            label: 'Projects',
                            status: pmGetStatus(migrateData.count.projects, migrateData.migrate.projects),
                            count: migrateData.count.projects,
                            completed: migrateData.migrate.projects,
                        },
                        'task_list': {
                            label: 'Task Lists',
                            status: pmGetStatus(migrateData.count.lists, migrateData.migrate.lists),
                            count: migrateData.count.lists,
                            completed: migrateData.migrate.lists,
                        },
                        'task': {
                            label: 'Tasks',
                            status: pmGetStatus(migrateData.count.tasks, migrateData.migrate.tasks),
                            count: migrateData.count.tasks,
                            completed: migrateData.migrate.tasks,
                        },
                        'message': {
                            label: 'Messages',
                            status: pmGetStatus(migrateData.count.messages, migrateData.migrate.messages),
                            count: migrateData.count.messages,
                            completed: migrateData.migrate.messages,
                        },
                        'milestone': {
                            label: 'Milestones',
                            status: pmGetStatus(migrateData.count.milestons, migrateData.migrate.milestons),
                            count: migrateData.count.milestons,
                            completed: migrateData.migrate.milestons,
                        },
                        'comment': {
                            label: 'Comments',
                            status: pmGetStatus(migrateData.count.comments, migrateData.migrate.comments),
                            count: migrateData.count.comments,
                            completed: migrateData.migrate.comments,
                        },

                    };

                    var tmplInside = '';
                    var cross = pm_is_all_migrated ? '<button type="button" class="pm-notice-dismiss"></button>' : '';
                    var is_loading_active = !pm_is_all_migrated ? 'pm-spinner' : '';
                    
                    jQuery.each(migrations, function(key, val) {
                        var statuLogo = val.status ? 'pm-todo-migrate' : 'pm-todo-refresh';
                        
                        tmplInside = tmplInside + '<div class="pm-single-migrate-wrap"><span class="'+statuLogo+'"></sapn>'+val.label+': '+val.completed+ '/' + val.count+ '</div>';
                    });
                    
                    var tmpl = '<div>'+
                        '<p><strong>WP Project Manager: Migration Status<span class="'+is_loading_active+'"></span></strong></p>'+
                        cross+
                        tmplInside+'</div>';

                    jQuery('.pm-update-progress-notice').html(tmpl);

                    if (typeof callBack !== 'undefined') {
                        callBack();
                    }
                }

                function pmGetStatus(count, migrate) {
                    count = parseInt(count);
                    migrate = parseInt(migrate);

                    return count <= migrate ? true : false;
                }

                function pmRemoveNotice () {
                    jQuery('.pm-notice-dismiss').click(function() {
                        jQuery('.pm-update-progress-notice').slideUp( 300, function() {
                            
                            jQuery('.pm-update-progress-notice').remove();
                        });
                    
                        jQuery.ajax({
                            type: 'POST',
                            url: PM_Vars.base_url +'/'+ PM_Vars.rest_api_prefix +'/pm/v2/settings/notice',
                            data: {
                                action: 'pm_migration_notice',
                            }
                        });
                    });
                }
            

            </script>
            <style>
                .updated {
                    position: relative;
                } 
                .pm-notice-dismiss {
                    position: absolute;
                    top: 11px;
                    right: 1px;
                    border: none;
                    margin: 0;
                    padding: 9px;
                    background: none;
                    color: #72777c;
                    cursor: pointer;
                }
                .pm-notice-dismiss:before {
                    background: none;
                    color: #72777c;
                    content: "\f153";
                    display: block;
                    font: normal 16px/20px dashicons;
                    speak: none;
                    height: 20px;
                    text-align: center;
                    width: 20px;
                    -webkit-font-smoothing: antialiased;
                }
                .pm-single-migrate-wrap {
                    margin-bottom: 5px;
                    display: inline-block;
                    margin-right: 3%;
                    padding-top: 4px;
                    /*border-right: 1px solid #d2d2d2;*/
                }
                .pm-single-migrate-wrap:last-child {
                    border-right: none;
                }

                .ui-progressbar {
                    position: relative;
                }
                .hrm-progress-label {
                    position: absolute;
                    left: 50%;
                    top: 4px;
                    font-weight: bold;
                    text-shadow: 1px 1px 0 #fff;
                }

                .pm-todo-refresh {
                    background-image: url('<?php echo $assets_url; ?>images/refresh.svg');
                    padding-left: 28px;
                    background-size: 20px;
                    background-repeat: no-repeat;
                    padding-bottom: 4px;
                }
                .pm-todo-migrate {
                    background-image: url('<?php echo $assets_url; ?>images/todo_completed.svg');
                    padding-left: 28px;
                    background-size: 17px;
                    background-repeat: no-repeat;
                    padding-bottom: 4px;
                }
                .pm-spinner {
                  background: url("<?php echo $assets_url; ?>images/loading.gif") no-repeat scroll 0 0 rgba(0, 0, 0, 0);
                  height: 16px;
                  display: inline-block;
                  width: 16px;
                  margin-left: 10px;
                }
            </style>
        <?php
    }

    function start_update() {
        update_option( 'pm_start_migration', true );
        update_option( 'pm_migration_notice', 'incomplete' );
    }


    /**
     * initialize upgrade
     * Get all Project id and push into queue 
     * @return [type] [description]
     */
    public function upgrade_init ( ) {
        new PM_Create_Table;
        (new \RoleTableSeeder())->run();
        //create pro table 
        $this->create_gantt_chart_table();
        $this->create_invoice_table();
        $this->create_time_tracker_table();
        // end
        $this->start_update();
        $this->set_count();
        
        $this->delete_queue_batch(); 

        global $wpdb;
        $ids = $wpdb->get_results( "SELECT ID FROM $wpdb->posts WHERE post_type = 'cpm_project'", ARRAY_A );

        if ( is_wp_error( $ids ) ) {
            return;
        }

        $ids = wp_list_pluck($ids, 'ID'); 
        
        foreach ($ids as $id) {
            $id = absint( $id );
            if ( empty( $id ) ) {
                continue;
            }
            $this->push_to_queue( $id );
        }

        $this->save()->dispatch();
    }

    function upgrade_observe_migration( $args ) {
        $migration = get_option( 'pm_observe_migration' );

        if ( !empty( $args['projects'] ) ) {
            $migration['migrate']['projects'] =  $migration['migrate']['projects'] + 1;
        }

        if ( !empty( $args['lists'] ) ) {
            $migration['migrate']['lists'] =  $migration['migrate']['lists'] + 1;
        }

        if ( !empty( $args['tasks'] ) ) {
            $migration['migrate']['tasks'] =  $migration['migrate']['tasks'] + 1;
        }

        if ( !empty( $args['messages'] ) ) {
            $migration['migrate']['messages'] =  $migration['migrate']['messages'] + 1;
        }

        if ( !empty( $args['milestons'] ) ) {
            $migration['migrate']['milestons'] =  $migration['migrate']['milestons'] + 1;
        }

        if ( !empty( $args['comments'] ) ) {
            $migration['migrate']['comments'] =  $migration['migrate']['comments'] + 1;
        }

        update_option( 'pm_observe_migration', $migration );
    }

    public function set_count() {
        global $wpdb;

        $has_migration = get_option( 'pm_observe_migration' );
        $start_update = get_option( 'pm_start_migration', false );

        if ( ! empty( $has_migration ) || ! $start_update ) {
            return;
        }
        // decleat variables;
        $total_project   = 0;
        $total_milestone = 0;
        $total_message   = 0;
        $total_task_list = 0;
        $total_task      = 0;
        $total_comment   = 0;
        $comments_ids    = [];

        $projects = $wpdb->get_results( "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'cpm_project'", ARRAY_A );
        $total_project = $wpdb->num_rows;

        if ( $total_project ) {
            $ids = wp_list_pluck( $projects, 'ID' );
            $comments_ids = array_merge( $comments_ids, $ids );
            $ids = implode( ',', $ids );

            //milestone query
            $milestons = $wpdb->get_results( $wpdb->prepare( "SELECT ID FROM $wpdb->posts WHERE post_parent in ($ids) AND post_type in ('cpm_milestne', 'cpm_milestone') AND post_status=%s", 'publish' ), ARRAY_A );
            $total_milestone = $wpdb->num_rows;

            //message query
            $message = $wpdb->get_results( $wpdb->prepare( "SELECT ID FROM $wpdb->posts WHERE post_parent in ($ids) AND post_type=%s AND post_status=%s", 'cpm_message', 'publish' ), ARRAY_A );
            $total_message = $wpdb->num_rows;
            $comments_ids = array_merge( $comments_ids, wp_list_pluck( $message, 'ID' ) );

            // tasklist query
            $tasklist = $wpdb->get_results( $wpdb->prepare( "SELECT ID FROM $wpdb->posts WHERE post_parent in ($ids) AND post_type=%s AND post_status=%s", 'cpm_task_list', 'publish' ), ARRAY_A );
            $total_task_list = $wpdb->num_rows;

            if ( $total_task_list ) {
                $list_ids = wp_list_pluck( $tasklist, 'ID' );
                $comments_ids = array_merge( $comments_ids, $list_ids );
                $list_ids = implode( ',', $list_ids );

                // task query
                $tasks = $wpdb->get_results( $wpdb->prepare( "SELECT ID FROM $wpdb->posts WHERE post_parent in ($list_ids) AND post_type=%s AND post_status=%s", 'cpm_task', 'publish' ), ARRAY_A );
                $total_task = $wpdb->num_rows;

                if ( $total_task ) {
                    $task_ids = wp_list_pluck( $tasks, 'ID' );
                    $comments_ids = array_merge( $comments_ids, $task_ids );
                    $task_ids = implode( ',', $task_ids );

                    $tasks = $wpdb->get_results( $wpdb->prepare( "SELECT ID FROM $wpdb->posts WHERE post_parent in ($task_ids) AND post_type=%s AND post_status=%s", 'cpm_sub_task', 'publish' ), ARRAY_A );
                    $total_task =  $total_task + $wpdb->num_rows;

                }

            }

        }

        if ( ! empty( $comments_ids ) ) {
            $comments_ids = implode( ',', $comments_ids );
            $total_comment   = $wpdb->get_var( 
                "SELECT count(comment_ID) FROM {$wpdb->comments} WHERE comment_post_ID IN ($comments_ids)"
            );
        }

        $observe = [
            'count' => [
                'projects'  => $total_project,
                'lists'     => $total_task_list,
                'tasks'     => $total_task,
                'messages'  => $total_message,
                'milestons' => $total_milestone,
                'comments'  => $total_comment
            ],

            'migrate' => [
                'projects'  => 0,
                'lists'     => 0,
                'tasks'     => 0,
                'messages'  => 0,
                'milestons' => 0,
                'comments'  => 0
            ]
        ];

        update_option( 'pm_observe_migration', $observe );

        return $observe;
    }

    /**
     * start upgrade project 
     * @param  ini $project_id 
     * @return Object          new project model object 
     */
    public function upgrade_projects( $project_id ) {

        $project_ids = get_option( "pm_db_migration", [] );
        
        if ( array_key_exists( $project_id, $project_ids ) ) {
            return false;
        }

        $project_ids[$project_id] = 0;
        update_option("pm_db_migration", $project_ids);

        $project = $this->create_project( $project_id ); 
        
        if ( $project ) {
            $project_ids[$project_id] = $project->id;
            update_option( "pm_db_migration", $project_ids );
        }
    }

    /**
     * retrive old project and push into new database
     * @param  int $project_id 
     * @return Object             new Project model object
     */
    function create_project( $project_id ) {
        global $wpdb;
        if ( !$project_id && !is_int( $project_id ) ) {
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

        $milestons               = $this->get_milestones( $project_id, $newProject->id );
        $discuss                 = $this->get_discuss( $project_id, $newProject->id, $milestons );
        $commnetd                = $this->get_comments( $discuss, $newProject->id, 'discussion_board' );
        $taskLists               = $this->get_task_list( $project_id, $newProject->id, $milestons );
        $commenttl               = $this->get_comments( $taskLists, $newProject->id, 'task_list' );
        list( $tasks, $parents ) = $this->get_tasks( $newProject->id, $taskLists );
        $commnett                = $this->get_comments( $tasks, $newProject->id, 'task' );

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
        if ( !$oldProjectId ){
            return ;
        }
        global $wpdb;
        $table    = $wpdb->prefix . 'cpm_user_role';
        $oldroles = $wpdb->get_results( $wpdb->prepare ( "SELECT * FROM $table WHERE project_id=%d", $oldProjectId ), ARRAY_A );

        if ( is_wp_error( $oldroles ) ) {
            return;
        }
        $role_exit = $this->insert_client_role();
        foreach ( $oldroles as $role ) {

            if ( $role['role']       == 'manager' ){
                $role_id = 1;
            } else if ( $role['role'] == 'co_worker' ){
                $role_id = 2;
            } else if ( $role['role'] == 'client'  ) {
                if ( !$role_exit ) {
                    continue;
                }
                $role_id = 3; 
            }
            User_Role::firstOrCreate( [
                'user_id'       => $role['user_id'],
                'role_id'       => $role_id,
                'project_id'    => $newProjectID,
                'assigned_by'   => $assigned_by,
            ] );
        }

        // Assain project if not any user
        if ( empty( $oldroles ) ) {
             User_Role::firstOrCreate( [
                'user_id'       => $assigned_by,
                'role_id'       => 1,
                'project_id'    => $newProjectID,
                'assigned_by'   => $assigned_by,
            ] );
        }
    }


    function get_milestones( $oldProjectId, $newProjectID  ) {
        if ( !$oldProjectId ){
            return ;
        }
        global $wpdb;

        $oldMilestones   = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $wpdb->posts WHERE post_parent=%d AND post_type in ('cpm_milestne', 'cpm_milestone') AND post_status=%s", $oldProjectId, 'publish' ), ARRAY_A );

        $milestons  = [];

        foreach ( $oldMilestones as $post ) {
            $milestons[$post['ID']] = $this->create_milestone( $post, $newProjectID );
            
            $this->upgrade_observe_migration( [
                'milestons' => true
            ] );
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
        if ( !$oldProjectId ){
            return ;
        }
        global $wpdb;

        $oldDiscuss   = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $wpdb->posts WHERE post_parent=%d AND post_type=%s AND post_status=%s", $oldProjectId, 'cpm_message', 'publish' ), ARRAY_A );

        $discuss  = [];

        foreach ( $oldDiscuss as $post ) {
            $discuss[$post['ID']] = $this->create_discuss( $post, $newProjectID, $milestons );

            $this->upgrade_observe_migration( [
                'messages' => true
            ] );
        }
        return $discuss;
    }

    /**
     * Create disusss from old discuss
     */
    function create_discuss( $post, $newProjectID, $milestons ) {
        if ( !$post ) {
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
                    'parent'        => 0,
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
        if ( !$oldProjectId ) {
            return ;
        }
        global $wpdb;

        $oldTaskList   = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $wpdb->posts WHERE post_parent=%d AND post_type=%s AND post_status=%s", $oldProjectId, 'cpm_task_list', 'publish' ), ARRAY_A );

        $taskList  = [];

        foreach ( $oldTaskList as $post ) {
            $taskList[$post['ID']] = $this->create_task_list( $post, $newProjectID, $milestons );
            
            $this->upgrade_observe_migration( [
                'lists' => true
            ] );
        }
        return $taskList;
    }


    /**
     * Create disusss from old discuss
     */
    function create_task_list( $post, $newProjectID, $milestons ) {
        if ( !$post ) {
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


            
            if ( $post['post_type'] == 'cpm_task' ) {
                $taskParent[$post['ID']] = $post['post_parent'];
            }
            $this->upgrade_observe_migration( [
                'tasks' => true
            ] );
            
        }
        return array( $tasks, $taskParent );
    }

    function create_task( $post, $newProjectID,  $listitems, $list=null, $parent = null ) {
        if ( !$post ) {
            return ;
        }
        
        $description = ($parent === null) ? $post['post_content'] : '';

        $newTask  = $this->save_object( new Task, [
            'title'       => $post['post_title'],
            'description' => $description,
            'status'      => get_post_meta( $post['ID'], '_completed', true),
            'project_id'  => $newProjectID, 
            'start_at'    => get_post_meta( $post['ID'], '_start', true),
            'due_date'    => get_post_meta( $post['ID'], '_due', true),
            'parent_id'   => $post['post_type'] === 'cpm_task' ? 0: $listitems[$post['post_parent']],
            'completed_by' => get_post_meta($post['ID'], '_completed_by', true),
            'completed_at' => get_post_meta($post['ID'], '_completed_on', true),
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

            $this->upgrade_observe_migration( [
                'comments' => true
            ] );
        }

        return $comments;
    }

    function create_comments( $comment, $newProjectID, $commentable_type, $commentable_id ) {
        if ( !$comment ) {
            return ;
        }
        if ( isset( $comment['comment_type'] ) && $comment['comment_type'] == 'cpm_activity' ) {
            $commentable_type = 'task_activity';
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
                    'parent'        => 0,
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
        if ( !$OldProjectId ) {
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
        if ( empty( $ids ) ) {
            return ;
        }
        global $wpdb;
        $in        = implode( ',', array_keys( $ids ) );
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
        if ( empty( $ids ) ) {
            return ;
        }
        global $wpdb;
        $in        = implode( ',', array_keys( $ids ) );
        $revisions = $wpdb->get_results( "SELECT * FROM {$wpdb->posts} WHERE post_parent IN({$in}) and post_type='revision'", ARRAY_A);
        
        foreach( $revisions as $revision ){
            $meta=[];
            $newFile = $this->add_file( [
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
            ] );

            $meta['title'] = $revision['post_title'];
            $meta['description'] = $revision['post_content'];
            if( !empty( $revision['post_excerpt'] ) ){
                $meta['url'] = $revision ['post_excerpt'];
            }

            $this->add_meta( $meta, $newFile, $newProjectID, 'file' );
        }
    }

    function get_invoice( $oldProjectId, $newProject ) {
        if ( !$oldProjectId ) {
            return ;
        }

        global $wpdb;

        $oldInvoice   = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $wpdb->posts WHERE post_parent=%d AND post_type=%s", $oldProjectId, 'cpm_invoice' ), ARRAY_A );

        $invoice  = [];

        foreach ( $oldInvoice as $post ) {
            $invoice[$post['ID']] = $this->create_invoice( $post, $newProject );
        }
        return $invoice;
    }

    function create_invoice( $post, $newProject ) {
        global $wpdb;
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
        $inviceTable = $wpdb->prefix . 'pm_invoice';
        $invoice = $wpdb->insert( $inviceTable, $invoiceArr );
        $invoice_id = $wpdb->insert_id;

        $payments = get_post_meta( $post['ID'], 'cpmi_payment', true );

        if( !empty( $payments ) ) {
            foreach ( $payments as $payment ) {
                $payment_date = empty( $payment['date'] ) ? $post['post_modified'] : $payment['date'];

                $data = [
                    'entity_id'   => $invoice_id,
                    'entity_type' => 'invoice',
                    'meta_key'    => 'invoice_payment',
                    'meta_value'  => maybe_serialize([
                        'amount'  => floatval( $payment['amount'] ),
                        'date'    => date( 'Y-m-d', strtotime( $payment_date ) ),
                        'notes'   => $payment['notes'],
                        'gateway' => $payment['method']
                    ]),
                    'project_id' => $newProject->id,
                    'created_by'  => $invoiceArr['client_id'],
                    'updated_by'  => $invoiceArr['client_id'],
                    'created_at'  => $payment_date,
                    'updated_at'  => $payment_date,
                ];
                $this->save_object( New Meta, $data );
                
            }
        }

        return $invoice_id;
    }

    function get_invoice_item( $post, $newProject ) {
        $items = get_post_meta( $post['ID'], 'item', true );
        $hours = get_post_meta( $post['ID'], 'hour', true );
        $newItem = array();

        foreach ( $items as $item ) {
            $arr                     = [];
            $arr['task']             = $this->get_task_by_title( $item->name, $newProject ); // find id, title time
            $arr['description']      = $item->details;
            $arr['amount']           = $item->amount;
            $arr['quantity']         = $item->qty;
            $arr['tax']              = $item->tax_percent;
            $arr['descriptionField'] = isset($item->details);
            $newItem['entryNames'][] = $arr;
        }

        foreach ( $hours as $item ) {
            $arr                     = [];
            $arr['task']             = $this->get_task_by_title( $item->name, $newProject  ); // find id, title time
            $arr['description']      = $item->details;
            $arr['amount']           = $item->amount;
            $arr['hour']             = $item->qty;
            $arr['tax']              = $item->tax_percent;
            $arr['descriptionField'] = isset($item->details);
            $newItem['entryTasks'][] = $arr;
        }
       return $newItem; 
    }

    function get_task_by_title( $title , $newProject  ) {
        if ( empty( $title ) ) {
            return [];
        }

        $task = Task::where('title', $title )->where( 'project_id', $newProject->id )->first();

        if( ! $task->id ) {
            return [];
        }

        $arr['id']    = $task->id;
        $arr['title'] = $task->title;
        $arr['time']  = [
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

        if ( empty( $sections ) || !is_array( $sections ) ) {
            return ;
        }

        foreach ( $sections as $section ) {
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
        if ( is_array( $tasks ) && !empty( $tasks ) ) {
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
        global $wpdb;
        if( is_array( $tasks ) ){

            $ganttTable = $wpdb->prefix . 'pm_gantt_chart_links';
            $now      = date( 'Y-m-d', strtotime( current_time('mysql') ) );
            $user   = wp_get_current_user();

            foreach ( $tasks as $old => $new ) {
                $links = get_post_meta( $old, '_link', true );
                if( empty( $links ) ) {
                    continue ;
                }
                
                foreach ( $links as $link ) {
                    if ( array_key_exists( $link, $tasks ) ) {
                        $wpdb->insert( $ganttTable, [
                            'source'     => $new,
                            'target'     => $tasks[$link],
                            'type'       => 1,
                            'created_by' => $user->ID,
                            'updated_by' => $user->ID,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ]);
                    }
                }
            }
        }

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

                if ( !empty( $value['title'] ) ) {
                    $title = $value['title'];
                } else {
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

        $this->upgrade_observe_migration( [
            'comments' => true
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
        $pattern = '\[(\[?)(cpm_msg_url|cpm_user_url|cpm_task_url|cpm_tasklist_url|cpm_comment_url)(?![\w-])([^\]\/]*(?:\/(?!\])[^\]\/]*)*?)(?:(\/)\]|\](?:([^\[]*+(?:\[(?!\/\2\])[^\[]*+)*+)\[\/\2\])?)(\]?)';
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
        if ( !$oldProjectId ) {
            return ;
        }

        global $wpdb;
        $table = $wpdb->prefix. 'cpm_time_tracker';
        $timetracker = $wpdb->get_results( "SELECT * FROM {$table} WHERE  project_id = {$oldProjectId}", ARRAY_A );
        if ( is_wp_error( $timetracker ) ) {
            return;
        }
        $timetrackerTable = $wpdb->prefix . 'pm_time_tracker';
        $now      = date( 'Y-m-d', strtotime( current_time('mysql') ) );
        foreach( $timetracker as $time ){
            $wpdb->insert( 
                $timetrackerTable, 
                [
                    'user_id'    => $time['user_id'],
                    'project_id' => $newProjectID,
                    'list_id'    => $taskList[$time['tasklist_id']],
                    'task_id'    => $tasks[$time['task_id']],
                    'start'      => $time['start'],
                    'stop'       => $time['stop'],
                    'total'      => $time['total'],
                    'run_status' => $time['run_status'] == 'no' ? 0 : 1,
                    'created_by' => $time['user_id'],
                    'updated_by' => $time['user_id'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ] 
            );
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
        $genral          = get_option( 'cpm_general', array() );
        $mail            = get_option( 'cpm_mails', array() );
        $page            = get_option( 'cpm_page', array() );
        $woo_projects    = get_option( 'cpmwoo_settings', array() );
        $cpm_integration = get_option( 'cpm_integration', array() );
        $projects        = get_option( 'pm_upgrade', array() );
        $invoice         = get_option( 'cpm_invoice', array() );
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
            update_option( 'pm_pages', $page );
            // $this->set_new_setting( $newSettings, 'project', $page, 'project' );
            // $this->set_new_setting( $newSettings, 'my_task', $page, 'my_task' );
            // $this->set_new_setting( $newSettings, 'calendar', $page, 'calendar' );
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
        
        $terms = $wpdb->get_results( "SELECT a.term_taxonomy_id, a.taxonomy, a.description, a.term_id, b.name FROM {$wpdb->term_taxonomy} AS a INNER JOIN {$wpdb->terms} AS b ON a.term_id = b.term_id WHERE a.taxonomy = 'cpm_project_category'", ARRAY_A );

        $categories = [];

        $object = wp_list_pluck($terms, 'term_taxonomy_id' );
        if ( empty( $object ) ) {
            return;
        }
        $object = implode(',', $object);
        
        $terms_releation = $wpdb->get_results( "SELECT * FROM {$wpdb->term_relationships} WHERE  term_taxonomy_id in({$object})", ARRAY_A );
        
        $projects = get_option( "pm_db_migration", [] );
        
    
        foreach ( $terms as $term ) {
            $cat = Category::firstOrCreate( [
              'title'            => $term['name'], 
              'description'      => $term['description'], 
               'categorible_type' => 'project',
            ]);
            
            $pid = [];
            array_map( function ( $item ) use ( $term, $projects, &$pid ) {
                if($item['term_taxonomy_id'] == $term['term_taxonomy_id'] ) {
                    if( !empty( $projects[$item['object_id']] ) ) {
                        $pid[] =  $projects[$item['object_id']];
                    }
                    
                }
            }, $terms_releation);
            
            if( !empty( $pid ) ) {
                $cat->projects()->attach( $pid );
            }

            $categories[$term['term_taxonomy_id']] = $cat->id;
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

    function create_invoice_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'pm_invoice';
        // `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0: Incomplete; 1: Complete; 2: Partial',
        // `partial` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1: Partial; 0: Not Partial;',
        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        
        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `title` varchar(255) NOT NULL,
          `client_id` int(11) UNSIGNED NOT NULL,
          `project_id` int(11) UNSIGNED NOT NULL,
          `status` tinyint(4) NOT NULL DEFAULT 0,
          `start_at` timestamp NULL DEFAULT NULL,
          `due_date` timestamp NULL DEFAULT NULL,
          `discount` double(8,2) NOT NULL DEFAULT '0.00',
          `partial` tinyint(4) NOT NULL DEFAULT 0,
          `partial_amount` double(8,2) NOT NULL DEFAULT '0.00',
          `terms` text,
          `client_note` text,
          `items` longtext NOT NULL,
          `created_by` int(11) UNSIGNED DEFAULT NULL,
          `updated_by` int(11) UNSIGNED DEFAULT NULL,
          `created_at` timestamp NULL DEFAULT NULL,
          `updated_at` timestamp NULL DEFAULT NULL,
          PRIMARY KEY (`id`),
          KEY `project_id` (`project_id`),
          KEY `client_id` (`client_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        
        dbDelta( $sql );
    }

    function create_gantt_chart_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'pm_gantt_chart_links';
        
        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
              `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
              `source` int(11) UNSIGNED NOT NULL,
              `target` int(11) UNSIGNED NOT NULL,
              `type` int(11) UNSIGNED NOT NULL,
              `created_by` int(11) UNSIGNED DEFAULT NULL,
              `updated_by` int(11) UNSIGNED DEFAULT NULL,
              `created_at` timestamp NULL DEFAULT NULL,
              `updated_at` timestamp NULL DEFAULT NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );
    }
    

    function create_time_tracker_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'pm_time_tracker';
        
         // `run_status` tinyint(4) NOT NULL COMMENT '1: Running; 0: Stop;',

        
        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
              `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
              `user_id` int(11) UNSIGNED NOT NULL,
              `project_id` int(11) UNSIGNED NOT NULL,
              `list_id` int(11) UNSIGNED NOT NULL,
              `task_id` int(11) UNSIGNED NOT NULL,
              `start` int(11) UNSIGNED NOT NULL,
              `stop` int(11) UNSIGNED NOT NULL,
              `total` int(11) UNSIGNED NOT NULL,
              `run_status` tinyint(4) NOT NULL,
              `created_by` int(11) UNSIGNED DEFAULT NULL,
              `updated_by` int(11) UNSIGNED DEFAULT NULL,
              `created_at` timestamp NULL DEFAULT NULL,
              `updated_at` timestamp NULL DEFAULT NULL,
              PRIMARY KEY (`id`),
              KEY `task_id` (`task_id`),
              KEY `project_id` (`project_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );
    }

    function insert_client_role () {
        $user = wp_get_current_user();
        $now  = date( 'Y-m-d', strtotime( current_time('mysql') ) );
        if ( ! Role::where('slug', 'client')->exists() ) {
            Role::insert([
                [
                    'title'       => 'Client',
                    'slug'        => 'client',
                    'description' => 'Client is a person who provid the project.',
                    'status'      => 0,
                    'created_by'  => $user->ID,
                    'updated_by'  => $user->ID,
                    'created_at'  => $now,
                    'updated_at'  => $now,
                ],
            ]);
            return  true;
        }

        return true;
    }
}