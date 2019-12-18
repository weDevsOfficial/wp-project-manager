<?php
namespace WeDevs\PM\Core\Upgrades;

use WP_Background_Process;

/**
 *   Upgrade project manager 2.2.2
 */
class Upgrade_2_3 extends WP_Background_Process {
    /**
     * @var string
     */
    protected $action = 'pm_tasks_boards_update_2_3';
    private $count_tasks;
    private $count_boards;

    function __construct() {
        parent::__construct();
        
        add_action('admin_notices', array( $this, 'notification' ) );
        add_filter( 'heartbeat_received', array( $this, 'receive_heartbeat' ), 10, 2 );
        add_filter( $this->identifier . '_memory_exceeded', array( $this, 'memory_exceeded' ) );
    }

    function receive_heartbeat($response, $data) {
        if( !isset($data['pm_migration_notice_2_3']) ) {
            return $response;
        }
        $response['is_complete']            = get_option( 'pm_migration_notice_2_3' );
        $response['is_background_compelte'] = get_option( 'pm_db_migration_2_3' );
        $response['total_queue']            = get_option( 'pm_total_queue_2_3' );
        $response['total_queue']            = empty( $response['total_queue'] ) ? 1 : $response['total_queue'];
        $response['completed_queue']        = get_option( 'pm_queue_complete_2_3' );
        $response['percentage']             = (100*$response['completed_queue'])/$response['total_queue'];

        return $response;
    }
    

    public function upgrade_init ( ) {
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $this->crate_capabilities_table();
        $this->crate_role_projects_table();
        $this->crate_role_project_capabilities_table();
        $this->crate_role_project_users_table();
        $this->crate_task_private_column();
        $this->crate_board_private_column();

        $this->update_capabilities_table();
        $this->update_role_project_table();
        $this->update_role_project_capabilities();
        $this->update_role_project_users();

        //$this->delete_queue_batch();
        $this->set_queue();

        update_option( 'pm_migration_start_2_3', 'yes' );
    }

    public function notification() {
        // delete_option( 'pm_migration_start_2_3' );
        // delete_option( 'pm_migration_notice_2_3' );
        // delete_option( 'pm_db_migration_2_3' );
        // delete_option( 'pm_total_queue_2_3' );
        // delete_option( 'pm_queue_complete_2_3' );
        // update_option( 'pm_db_version', '2.2.2' );
        // delete_option('pm_capabilities');
        // delete_option('update_role_project_table');
        // delete_option('update_role_project_capabilities');
        // delete_option('update_role_project_users');

        $is_migrating  = get_option( 'pm_migration_start_2_3' );
        
        if( $is_migrating != 'yes' ) {
            return;
        }

        $home                   = home_url();
        $url_prefix             = rest_get_url_prefix();
        $is_complete            = get_option( 'pm_migration_notice_2_3' );
        $is_background_compelte = get_option( 'pm_db_migration_2_3' );
        $total_queue            = get_option( 'pm_total_queue_2_3' );
        $total_queue            = empty( $total_queue ) ? 1 : $total_queue;
        $completed_queue        = get_option( 'pm_queue_complete_2_3' );
        $percentage             = intval( (100*$completed_queue)/$total_queue );
        
        if( $completed_queue < 1 && $percentage < 1 && $total_queue > 0 ) {
            $percentage  = 20;
        } 

        if( $is_complete == 'complete' ) {
            return;
        }
        
        echo '<div class="wrap">
            <div class="pm-db-migration-2-3 updated pm-update-progress-notice"></div>
        </div>';
        ?>
        <script type="text/javascript">

            var home          = "<?php echo esc_html_e( $home ); ?>";
            var url_prefix    = "<?php echo esc_html_e( $url_prefix ); ?>";
            var bg_complete   = "<?php echo esc_html_e( $is_background_compelte ); ?>";
            var percentage    = "<?php echo esc_html_e( $percentage ); ?>";
            var perctnage_txt = "<?php echo esc_html_e( $percentage ); ?>";

            perctnage_txt = percentage == 0 ? '' : Math.ceil(percentage)+'%';

            var cross_btn = bg_complete == 'complete' ? '<span class="cancel">&#10006;</span>' : '';
            
            pmRemoveNotice();
            pmProgressStatus(percentage, cross_btn);

            jQuery( document ).on( 'heartbeat-send', function ( event, data ) {
                data.pm_migration_notice_2_3 = 'processing';
            });

            jQuery( document ).on( 'heartbeat-tick', function ( event, data ) {
                var complete = data.is_complete;
                var bg_complete = data.is_background_compelte;
                var percentage = data.percentage;

                if(complete == 'complete') {
                    return;
                }

                perctnage_txt = percentage == 0 ? '' : Math.ceil(percentage)+'%';

                var cross_btn = bg_complete == 'complete' ? '<span class="cancel">&#10006;</span>' : '';
                
                //pmRemoveNotice();
                pmProgressStatus(percentage, cross_btn);

            });
            
            function pmProgressStatus( percentage, cross_btn, callBack ) {
                
                var tmpl = '<div class="progress-wrap">'+
                    cross_btn+
                    '<div class="progress-bar" style="width:'+percentage+'%">'+
                        '<span class="percentage">'+perctnage_txt+'</span>'+
                    '</div></div>';
                jQuery('.pm-update-progress-notice').html(tmpl);

                if (typeof callBack !== 'undefined') {
                    callBack();
                }
            }

            function pmRemoveNotice () {
                jQuery( document ).ready(function() {
                    jQuery('.pm-db-migration-2-3').on( 'click', '.emoji', function() {
                        jQuery('.progress-wrap').slideUp( 300, function() {
                            jQuery('.progress-wrap').remove();
                        });
                        
                        jQuery.ajax({
                            type: 'POST',
                            url: home +'/'+ url_prefix +'/pm/v2/settings/notice',
                            data: {
                                action: 'pm_migration_notice_2_3',
                            }
                        });
                    });
                });
            }

        </script>
        <style>
            
            .progress-wrap {
              background: #ddd;
              margin: 20px 0;
              overflow: hidden;
              position: relative;
              width: 100%;
              height: 30px;
            }
            /*linear-gradient(to bottom, #ffa238, #e8912d, #d06f00)*/
            .progress-wrap .progress-bar {
                background: #1a9ed5; /*linear-gradient(to bottom, #acd3f7, #8ab5dc, #6b9ac3);*/
                left: 0;
                position: absolute;
                top: 0;
                height: 30px;
                text-align: center;
            }
            .progress-wrap .progress-bar .percentage {
                text-align: center;
                line-height: 30px;
                color: #fff;
            }

            .progress-wrap .cancel {
                position: absolute;
                right: 0;
                line-height: 30px;
                margin-right: 10px;
                cursor: pointer;
                z-index: 9;
            }
            
            .pm-db-migration-2-3 {
                padding: 0 !important;
                border-left: 0 !important;
            }
        </style>
        <?php
    }

    function memory_exceeded() {
        $memory_limit   = $this->get_memory_limit() * 0.5; // 90% of max memory
        $current_memory = memory_get_usage( true );
        $return         = false;

        if ( $current_memory >= $memory_limit ) {
            $return = true;
        }

        return $return;
    }

    /**
     * task funciotn run on background over time
     * comes form WP_Background_Process abstruct    
     * @param   $item 
     * @return 
     */
    function task( $item ) {
        

        if ( $item['type'] == 'task' ) {
            $is_private = $this->set_task_is_private( $item['id'] );

            if ( $is_private ) {
                $this->update_task_privacy( $item['id'] );
            }
        }

        if ( $item['type'] == 'board' ) {
            $is_private = $this->set_board_is_private( $item['id'] );

            if ( $is_private ) {
                $this->update_board_privacy( $item['id'] );
            }
        }

        $query_completed = get_option( 'pm_queue_complete_2_3', 0 );
        $query_completed = $query_completed+1;

        update_option( 'pm_queue_complete_2_3', $query_completed );
        
        return false;
    }

    /**
     * Complete function for WP_Background_Process
     *
     */
    function complete() {
        update_option( 'pm_db_migration_2_3', 'complete' );
    }

    private function update_board_privacy( $id ) {
        global $wpdb;
        $tb_boards = $wpdb->prefix . 'pm_boards';

        $query = "UPDATE $tb_boards SET `is_private` = %d WHERE $tb_boards.`id` = %d";
        $wpdb->query( $wpdb->prepare( "UPDATE {$wpdb->prefix}pm_boards SET `is_private` = %d WHERE {$wpdb->prefix}pm_boards.`id` = %d", 1, $id ) );
    }

    private function update_task_privacy( $id ) {
        global $wpdb;
        $tb_tasks = $wpdb->prefix . 'pm_tasks';

        $query = "UPDATE $tb_tasks SET `is_private` = %d WHERE $tb_tasks.`id` = %d";
        $wpdb->query( $wpdb->prepare( "UPDATE {$wpdb->prefix}pm_tasks SET `is_private` = %d WHERE {$wpdb->prefix}pm_tasks.`id` = %d", 1, $id ) );
    }

    private function set_task_is_private( $id ) {
        $private = $this->get_meta_value( $id, 'task' );

        return $private == 1 ? true : false;
    }

    private function set_board_is_private( $id ) {
        $private = $this->get_board_meta_value( $id );

        return $private == 1 ? true : false;
    }

    private function get_board_meta_value( $id ) {
        global $wpdb;
        $tb_meta = $wpdb->prefix . 'pm_meta';

        $query = "SELECT meta_value FROM {$wpdb->prefix}pm_meta 
            WHERE entity_id=%d 
            AND entity_type IN ('task_list', 'milestone', 'discussion_board')
            AND meta_key=%s";

        return $wpdb->get_var( $wpdb->prepare( "SELECT meta_value FROM {$wpdb->prefix}pm_meta 
            WHERE entity_id=%d 
            AND entity_type IN ('task_list', 'milestone', 'discussion_board')
            AND meta_key=%s", $id, 'privacy'  ) );
    }

    private function get_meta_value( $id, $type ) {
        global $wpdb;
        $tb_meta = $wpdb->prefix . 'pm_meta';

        $query = "SELECT meta_value FROM {$wpdb->prefix}pm_meta 
            WHERE entity_id=%d 
            AND entity_type=%s 
            AND meta_key=%s";

        return $wpdb->get_var( $wpdb->prepare( "SELECT meta_value FROM {$wpdb->prefix}pm_meta 
            WHERE entity_id=%d 
            AND entity_type=%s 
            AND meta_key=%s", $id, $type, 'privacy'  ) );
    }

    private function set_queue() {
        $tasks = $this->get_tasks_queue();
        $boards = $this->get_boards_queue();

        $queues = array_merge( $tasks, $boards );

        update_option( 'pm_total_queue_2_3', count( $queues ) );

        foreach ( $queues as $queue ) {
            $this->push_to_queue( $queue );
        }

        $this->save()->dispatch();
    }

    private function get_boards_queue() {
        global $wpdb;
        $queue = [];
        $tb_tasks = $wpdb->prefix . 'pm_boards';

        $ids = $wpdb->get_results( "SELECT id FROM {$wpdb->prefix}pm_boards}", ARRAY_A );

        if ( is_wp_error( $ids ) ) {
            return;
        }

        $ids = wp_list_pluck( $ids, 'id' ); 
        $this->count_boards = count( $ids );
        
        //pm_log('board_count', $this->count_boards);
        foreach ( $ids as $id ) {
            $id = intval( $id );
            if ( empty( $id ) ) {
                continue;
            }
            $queue[] = [ 'id' => $id, 'type' => 'board' ];
        }

        return $queue;
    }

    private function get_tasks_queue() {
        global $wpdb;
        $queue = [];
        $tb_tasks = $wpdb->prefix . 'pm_tasks';
        $ids = $wpdb->get_results( "SELECT id FROM {$wpdb->prefix}pm_tasks", ARRAY_A );

        if ( is_wp_error( $ids ) ) {
            return;
        }

        $ids = wp_list_pluck( $ids, 'id' ); 
        $this->count_tasks = count( $ids );
        
        //pm_log('task_count', $this->count_tasks);
        foreach ( $ids as $id ) {
            $id = intval( $id );
            if ( empty( $id ) ) {
                continue;
            }

            $queue[] = [ 'id' => $id, 'type' => 'task' ];
        }

        return $queue;
    }

    /**
     * Get batch
     *
     * @return stdClass Return the first batch from the queue
     */
    private function delete_queue_batch() {
        global $wpdb;

        $table        = $wpdb->options;
        $column       = 'option_name';
        

        if ( is_multisite() ) {
            $table        = $wpdb->sitemeta;
            $column       = 'meta_key';

            $key   = $wpdb->esc_like( $this->identifier . '_batch_' ) . '%';
            $query = $wpdb->query( $wpdb->prepare( "DELETE FROM $wpdb->sitemeta WHERE meta_key LIKE %s ", $key ) );   
        } else {
            $key   = $wpdb->esc_like( $this->identifier . '_batch_' ) . '%';
            $query = $wpdb->query( $wpdb->prepare( "DELETE FROM $wpdb->options WHERE option_name LIKE %s ", $key ) );
        }
        
    }

    private function crate_task_private_column() {
        global $wpdb;
        $table = $wpdb->prefix . 'pm_tasks';
        $result = $wpdb->get_results ( $wpdb->prepare( "SHOW COLUMNS FROM {$wpdb->prefix}pm_tasks LIKE %s", 'is_private' ) );
        
        if( !$result ) {
            $wpdb->query( "ALTER TABLE {$wpdb->prefix}pm_tasks ADD `is_private` tinyint(2) unsigned default 0 AFTER `status`" );
        }
    }

    private function crate_board_private_column() {
        global $wpdb;
        $table = $wpdb->prefix . 'pm_boards';
        $result = $wpdb->get_results ( $wpdb->prepare( "SHOW COLUMNS FROM {$wpdb->prefix}pm_boards LIKE %s", 'is_private' ) );
        
        if( !$result ) {
            $wpdb->query( "ALTER TABLE {$wpdb->prefix}pm_boards ADD `is_private` tinyint(2) unsigned default 0 AFTER `status`" );
        }
    }

    private function crate_capabilities_table() {

        global $wpdb;
        $table_name = $wpdb->prefix . 'pm_capabilities';

        $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}pm_capabilities (
              `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT,
              `name` varchar(100) NOT NULL,
              PRIMARY KEY (`id`)
            ) DEFAULT CHARSET=utf8";

        dbDelta($sql);
    }

    private function update_capabilities_table() {
        global $wpdb;

        if( ! empty( get_option( 'pm_capabilities' ) ) ) {
            return;
        }
        $table_name = $wpdb->prefix . 'pm_capabilities';
        $sql = "INSERT INTO {$wpdb->prefix}pm_capabilities (name)
               VALUES
                ('Message Create'),
                ('Message Private'),
                ('Task List Create'),
                ('Task List Private'),
                ('Milestone Create'),
                ('Milestone Private'),
                ('Task Create'),
                ('Task Private'),
                ('File Create'),
                ('File Private')";

        $wpdb->query( $wpdb->prepare( "INSERT INTO {$wpdb->prefix}pm_capabilities (name)
               VALUES
                ('Message Create'),
                ('Message Private'),
                ('Task List Create'),
                ('Task List Private'),
                ('Milestone Create'),
                ('Milestone Private'),
                ('Task Create'),
                ('Task Private'),
                ('File Create'),
                ('File Private')" ) );

        update_option( 'pm_capabilities', 'done' );
    }

    private function crate_role_projects_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'pm_role_project';

        $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}pm_role_project (
              `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT,
              `project_id` int(20) UNSIGNED NOT NULL,
              `role_id` int(20) UNSIGNED NOT NULL,
              PRIMARY KEY (`id`)
            ) DEFAULT CHARSET=utf8";


        dbDelta($sql);
    }

    function update_role_project_table() {
        if( ! empty( get_option( 'update_role_project_table' ) ) ) {
            return;
        }

        global $wpdb;

        $table = $wpdb->prefix . 'pm_projects';

        $sql = "SELECT DISTINCT pj.id FROM {$wpdb->prefix}pm_projects as pj";

        $projects = $wpdb->get_results( $wpdb->prepare( "SELECT DISTINCT pj.id FROM {$wpdb->prefix}pm_projects as pj" ) );
        $projects = wp_list_pluck( $projects, 'id' );

        $value = '';

        foreach ( $projects as $id ) {
            $value .= "($id, 1),";
            $value .= "($id, 2),";
            $value .= "($id, 3),";
        }

        $value = rtrim( $value, ',' );
        $table = $wpdb->prefix . 'pm_role_project';

        $insert_query = "INSERT INTO {$wpdb->prefix}pm_role_project (project_id, role_id)
            VALUES {$value}";

        $wpdb->query( $wpdb->prepare( "INSERT INTO {$wpdb->prefix}pm_role_project (project_id, role_id)
            VALUES %s", $value ) );

        update_option( 'update_role_project_table', 'done' );
    }

    private function crate_role_project_capabilities_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'pm_role_project_capabilities';

        $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}pm_role_project_capabilities (
              `role_project_id` int(20) UNSIGNED NOT NULL,
              `capability_id` int(20) UNSIGNED NOT NULL,
              KEY `role_project_id` (`role_project_id`)
            ) DEFAULT CHARSET=utf8";


        dbDelta($sql);
    }

    private function update_role_project_capabilities() {
        if( ! empty( get_option( 'update_role_project_capabilities' ) ) ) {
            return;
        }

        global $wpdb;

        $tb_projects = $wpdb->prefix . 'pm_projects';
        $tb_settings = $wpdb->prefix . 'pm_settings';
        $tb_role_projects = $wpdb->prefix . 'pm_role_project';
        $tb_role_project_cap = $wpdb->prefix . 'pm_role_project_capabilities';

        $query = "SELECT pj.id, st.value FROM {$wpdb->prefix}pm_projects as pj
            LEFT JOIN {$wpdb->prefix}pm_settings as st ON st.project_id=pj.id
            WHERE st.key='capabilities'";

        $results = $wpdb->get_results( $wpdb->prepare( "SELECT pj.id, st.value FROM {$wpdb->prefix}pm_projects as pj
            LEFT JOIN {$wpdb->prefix}pm_settings as st ON st.project_id=pj.id
            WHERE st.key='capabilities'" ) );
        
        $new_reslts = [];

        foreach ( $results as $key => $result ) {
            $new_reslts[$result->id] = maybe_unserialize( $result->value );
        }

        $query = "SELECT * FROM {$wpdb->prefix}pm_role_project";

        $role_projects = $wpdb->get_results($wpdb->prepare( "SELECT * FROM {$wpdb->prefix}pm_role_project" ) );

        foreach ( $role_projects as $key => $role_project ) {
            $project_id = $role_project->project_id;

            if ( $role_project->role_id == 2 ) {
                if( !empty( $new_reslts[$project_id] ) ) {
                    $caps = $new_reslts[$project_id]['co_worker'];
                    foreach ( $caps as $cap_key => $cap ) {

                        if ( $cap == 'true' || $cap === true ) {
                            $cap_id = $this->get_cap_id( $cap_key );
                            $role_project->caps[] = $cap_id;
                        }

                    }
                } else {
                    $role_project->caps = [1,2,3,4,5,6,7,8,9,10];
                }
            }

            if ( $role_project->role_id == 3 ) {
                if( !empty( $new_reslts[$project_id] ) ) {
                    $caps = $new_reslts[$project_id]['client'];
                    foreach ( $caps as $cap_key => $cap ) {

                        if ( $cap == 'true' || $cap === true ) {
                            $cap_id = $this->get_cap_id( $cap_key );
                            $role_project->caps[] = $cap_id;
                        }

                    }
                } else {
                    $role_project->caps = [1,3,7,5,9];
                }
            }

            if ( $role_project->role_id == 1 ) {
                $role_project->caps = [1,2,3,4,5,6,7,8,9,10];
            }
        }

        $query_string = '';

        foreach ( $role_projects as $key => $role_project ) {
            if ( ! empty( $role_project->caps ) ) {
                foreach ( $role_project->caps as $key => $cap ) {
                    $query_string .= "($role_project->id, $cap),";
                }
            }
        }

        $value = rtrim( $query_string, ',' );

        $insert_query = "INSERT INTO {$wpdb->prefix}pm_role_project_capabilities (role_project_id, capability_id)
            VALUES {$value}";

        $wpdb->query( $wpdb->prepare("INSERT INTO {$wpdb->prefix}pm_role_project_capabilities (role_project_id, capability_id)
            VALUES %s", $value ) );

        update_option( 'update_role_project_capabilities', 'done' );

    }

    private function crate_role_project_users_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'pm_role_project_users';

        $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}pm_role_project_users (
              `role_project_id` int(20) UNSIGNED NOT NULL,
              `user_id` int(20) UNSIGNED NOT NULL,
              KEY `role_project_id` (`role_project_id`)
            ) DEFAULT CHARSET=utf8";

        dbDelta($sql);
    }

    public function update_role_project_users() {
         if( ! empty( get_option( 'update_role_project_users' ) ) ) {
            return;
        }
        global $wpdb;

        $tb_role_users = $wpdb->prefix . 'pm_role_user';
        $tb_role_projects = $wpdb->prefix . 'pm_role_project';
        $tb_new_role_user = $wpdb->prefix . 'pm_role_project_users';

        $query = "SELECT DISTINCT rp.id as role_project_id, ru.user_id as user_id, ru.project_id as project_id
            FROM {$wpdb->prefix}pm_role_user as ru
            LEFT JOIN {$wpdb->prefix}pm_role_project as rp ON rp.project_id=ru.project_id
            WHERE ru.role_id=2 AND rp.role_id=2";

        $client_projects = $wpdb->get_results( $wpdb->prepare( "SELECT DISTINCT rp.id as role_project_id, ru.user_id as user_id, ru.project_id as project_id
            FROM {$wpdb->prefix}pm_role_user as ru
            LEFT JOIN {$wpdb->prefix}pm_role_project as rp ON rp.project_id=ru.project_id
            WHERE ru.role_id=2 AND rp.role_id=2" ) );

        $query = "SELECT DISTINCT rp.id as role_project_id, ru.user_id as user_id, ru.project_id as project_id
            FROM {$wpdb->prefix}pm_role_user as ru
            LEFT JOIN {$wpdb->prefix}pm_role_project as rp ON rp.project_id=ru.project_id
            WHERE ru.role_id=3 AND rp.role_id=3";

        $co_worker_projects = $wpdb->get_results($wpdb->prepare( "SELECT DISTINCT rp.id as role_project_id, ru.user_id as user_id, ru.project_id as project_id
            FROM {$wpdb->prefix}pm_role_user as ru
            LEFT JOIN {$wpdb->prefix}pm_role_project as rp ON rp.project_id=ru.project_id
            WHERE ru.role_id=3 AND rp.role_id=3" ) );

        $query = "SELECT DISTINCT rp.id as role_project_id, ru.user_id as user_id, ru.project_id as project_id
            FROM {$wpdb->prefix}pm_role_user as ru
            LEFT JOIN {$wpdb->prefix}pm_role_project as rp ON rp.project_id=ru.project_id
            WHERE ru.role_id=1 AND rp.role_id=1";

        $manager_projects = $wpdb->get_results($wpdb->prepare( "SELECT DISTINCT rp.id as role_project_id, ru.user_id as user_id, ru.project_id as project_id
            FROM {$wpdb->prefix}pm_role_user as ru
            LEFT JOIN {$wpdb->prefix}pm_role_project as rp ON rp.project_id=ru.project_id
            WHERE ru.role_id=1 AND rp.role_id=1" ));

        $role_projects = array_merge( $client_projects, $co_worker_projects, $manager_projects );

        $query_string = '';

        foreach ( $role_projects as $key => $role_project ) {
            $query_string .= "($role_project->role_project_id, $role_project->user_id),";
        }

        $value = rtrim( $query_string, ',' );

        $insert_query = "INSERT INTO {$wpdb->prefix}pm_role_project_users (role_project_id, user_id)
            VALUES {$value}";

        $wpdb->query( $wpdb->prepare( "INSERT INTO {$wpdb->prefix}pm_role_project_users (role_project_id, user_id)
            VALUES %s", $value ) );

        update_option( 'update_role_project_users', 'done' );
    }

    public function get_cap_id( $key ) {

        $cap = [
            'create_message'         => 1, //'Message Create',
            'view_private_message'   => 2, //'Message Private',
            'create_list'            => 3, //'Task List Create',
            'view_private_list'      => 4, //'Task List Private',
            'create_milestone'       => 5, //'Milestone Create',
            'view_private_milestone' => 6, //'Milestone Private',
            'create_task'            => 7, //'Task Create',
            'view_private_task'      => 8, //'Task Private',
            'create_file'            => 9, //'File Create',
            'view_private_file'      => 10, //'File Private',
        ];

        return $cap[$key];
    }

}
