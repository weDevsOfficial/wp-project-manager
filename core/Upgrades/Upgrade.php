<?php
namespace WeDevs\PM\Core\Upgrades;
class Upgrade {

    /** @var array DB updates that need to be run */
    private static $updates = [
        '2.0'    => 'Upgrade_2_0',
    ];

    public static $instance = null;
    /**
     * Current active erp modules
     *
     * @since 1.1.9
     *
     * @var array
     */
    private $active_modules = [];
    /**
     * Binding all events
     *
     * @since 0.1
     *
     * @return void
     */
    function __construct() {
        //var_dump(get_post_thumbnail_id('48'));
        //die();
        //$this->get_activity(7);
        add_action( 'admin_notices', array($this, 'show_update_notice') );
       
        add_action( 'admin_init', array( $this, 'init_upgrades' ) );
        add_action( 'admin_init', array( $this, 'do_updates' ) );
    }

    public function init_upgrades() {
        self::$updates = array_map( function ( $update ) {
            $class = str_replace( '/', '\\', __NAMESPACE__ );
            $class .= '\\' .$update;
            if ( class_exists( $class ) ){
                return $update = new $class();
            }
        }, self::$updates);
    }
    /**
     * Check if need any update
     *
     * @since 1.0
     *
     * @return boolean
     */
    public function is_needs_update() {
        $installed_version = !empty( get_option( 'cpm_db_version' ))? get_option( 'cpm_db_version' ) : get_option( 'pm_db_version' );
        $updatable_versions = config('db_version');
        // may be it's the first install
        if ( ! $installed_version ) {
            return false;
        }

        if ( version_compare( $installed_version, $updatable_versions , '<' ) ) {
            return true;
        }
        return false;
    }
    /**
     * Show update notice
     *
     * @since 1.0
     *
     * @return void
     */
    public function show_update_notice() {
       // require_once 'Upgrade_2_0.php';
        // if ( ! current_user_can( 'update_plugins' ) || ! $this->is_needs_update() ) {
        //     return;
        // }
        // $installed_version  = get_option( 'cpm_db_version' );
        // $updatable_versions = config('db_version');
        // if ( ! is_null( $installed_version ) && version_compare( $installed_version, end( $updatable_versions ), '<' ) ) {
            ?>
                <div class="notice notice-warning">
                   

                    <p><?php _e( '<strong>WP Project Manager Data Update Required</strong> &#8211; Please click the button below to update to the latest version.', 'pm' ) ?></p>

                    <form action="" method="post" style="padding-bottom: 10px;" class="PmUpgradeFrom">
                        <?php wp_nonce_field( '_nonce', 'pm_nonce' ); ?>
                        <input type="submit" class="button button-primary" name="pm_update" value="<?php _e( 'Run the Update', 'pm' ); ?>">
                    </form>
                </div>

                <script type="text/javascript">
                    jQuery('form.PmUpgradeFrom').submit(function(){
                        return confirm( '<?php _e( 'It is strongly recommended that you backup your database before proceeding. Are you sure you wish to run the updater now?', 'pm' ); ?>' );
                    });
                </script>
            <?php
        // } else {
        //     update_option( 'pm_db_version', $updatable_versions );
        // }
    }
    /**
     * Do all updates when Run updater btn click
     *
     * @since 1.0
     * @since 1.2.7 save plugin install date
     *
     * @return void
     */
    public function do_updates() {
        if ( ! isset( $_POST['pm_update'] ) ) {
            return;
        }
        if ( ! wp_verify_nonce( $_POST['pm_nonce'], '_nonce' ) ) {
            return;
        }

        $this->perform_updates();
    }
    /**
     * Perform all updates
     *
     * @since 1.0
     *
     * @return void
     */
    public function perform_updates() {

        // if ( ! $this->is_needs_update() ) {
        //     return;
        // }
        // $installed_version = get_option( 'pm_db_version' );

         foreach (self::$updates as $version => $object ) {
        //     //if ( version_compare( $installed_version, $version, '<' ) ) {

                if ( method_exists( $object, 'upgrade_init' ) ){
                    $object->upgrade_init();
                }
                
        //        // update_option( 'pm_db_version', $version );
        //     //}
        }
        //update_option( 'pm_db_version', config('db_version') );
        //exit();
    }

    protected function get_activity( $oldporjectId ) {
        global $wpdb;
        $activities = $wpdb->get_results( "SELECT * FROM $wpdb->comments WHERE  comment_post_ID = {$oldporjectId} AND comment_type='cpm_activity' ORDER BY `comment_ID` ASC", ARRAY_A );
        
        foreach ($activities as $activity) {
            list( $attr, $newCntent ) = $this->get_attr_array( $activity['comment_content'] );
            
            $meta = ['text' => $newCntent ];
            $resource_type = "";
            $resource_id   = 0;  
            foreach ($attr as $key => $value) {

                switch ($key) {
                   
                    case 'cpm_msg_url':
                            //$resource_id = $discuss[$value['id']];
                            $resource_type = 'discussion_board';
                            $meta['discussion_board_title'] = $value['title'];
                        break;
                    case 'cpm_tasklist_url':
                            //$resource_id = $tasklist[$value['id']];
                            $resource_type = 'task_list';
                            $meta['task_list_title'] = $value['title'];
                        break;
                    case 'cpm_task_url': 
                            //$resource_id = $tasks[$value['id']];
                            $resource_type = 'task_list';
                            $meta['task_title'] = $value['title'];
                        break;
                    case 'cpm_comment_url':
                            $resource_id = 0;
                            $resource_type = '';
                            $meta['comment_id'] = $value['id'];
                        break;
                    case 'cpm_user_url':
                        break;  
                       
                }
            }
            //pmpr($activity['comment_content']);
            pmpr($resource_type);
            pmpr($resource_id);
            pmpr($meta);
            //$this->created_activity($activity, $resource_id, $resource_type, $meta, $newProjectId );
              
        }
        die();
        
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

}
