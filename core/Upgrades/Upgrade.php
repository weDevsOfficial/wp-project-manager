<?php
namespace WeDevs\PM\Core\Upgrades;
use PM_Create_Table;


class Upgrade {

    /** @var array DB updates that need to be run */
    private static $updates = [
        '2.0'   => 'Upgrade_2_0',
        '2.1'   => 'Upgrade_2_1',
        '2.2'   => 'Upgrade_2_2',
        '2.2.1' => 'Upgrade_2_2_1',
        '2.2.2' => 'Upgrade_2_2_2',
        '2.3'   => 'Upgrade_2_3',
    ];

    public static $instance = null;

    private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    /**
     * Binding all events
     *
     * @since 0.1
     *
     * @return void
     */
    function __construct() {
        add_action( 'admin_notices', array($this, 'show_update_notice') );
        add_action( 'admin_init', array( $this, 'init_upgrades' ) );
        add_action( 'admin_init', array( $this, 'do_updates' ) );
        add_action( 'wp_ajax_do_updates', array( $this, 'do_updates' ) );
        add_filter( 'heartbeat_received', array( $this, 'receive_heartbeat' ), 10, 2 );
    }

    public static function create_tables() {
        
        $is_need_update = self::is_needs_update();
        
        if (  $is_need_update ) {
            new PM_Create_Table;
            (new \RoleTableSeeder())->run();
        }
    }

    public function receive_heartbeat($response, $data) {
        $pm_migration = empty( $data['pm_migration'] ) ? false : $data['pm_migration'];

        if ( $pm_migration ) {
            $db_observe = get_option( 'pm_observe_migration' );
            $db_observe['count'] = empty( $db_observe['count'] ) ? [] : $db_observe['count'];
            $db_observe['migrate'] = empty( $db_observe['migrate'] ) ? [] : $db_observe['migrate'];

            $check_status = [];
            foreach ( $db_observe['count'] as $key => $value) {
                if ( $db_observe['migrate'][$key] >= $value ) {
                    $check_status[$key] = 'complete';
                } else {
                    $check_status[$key] = 'incomplete';
                }
            }

            if ( in_array( 'incomplete', $check_status  ) ) {
                $is_all_migrated = false;
            } else {
                $is_all_migrated = true;
            }

            $response['pm_migration'] = $db_observe;
            $response['pm_is_all_migrated'] = $is_all_migrated;
        }

        return $response;

    }

    public function init_upgrades() {
        if( ! current_user_can( 'update_plugins' ) ){
            return ;
        }

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
    public static function is_needs_update() {
        $bd_version = get_option( 'cpm_db_version' );
        $installed_version = !empty( $bd_version ) ? get_option( 'cpm_db_version' ) : get_option( 'pm_db_version' );

        $updatable_versions = pm_config('app.db_version');

        // may be it's the first install
        if ( ! $installed_version ) {
            if ( version_compare( $updatable_versions, '2.1' , '<=' ) ) {

                update_option( 'pm_db_version', 2.0 );
            } else {
                update_option( 'pm_db_version', $updatable_versions );
            }
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

        if ( ! current_user_can( 'update_plugins' ) || ! $this->is_needs_update() ) {
            return;
        }

            ?>
                <div class="wrap">
                    <div class="notice notice-warning">

                        <p>
                            <strong><?php esc_attr_e( 'WP Project Manager Data Update Required', 'wedevs-project-manager' ); ?></strong>
                            <?php esc_attr_e('&#8211; Please click the button below to update to the latest version.', 'wedevs-project-manager' ) ?>
                        </p>
                        <form action="" method="post" style="padding-bottom: 10px;" class="PmUpgradeFrom">
                            <?php wp_nonce_field( '_nonce', 'pm_nonce' ); ?>
                            <input type="submit" class="button button-primary" name="pm_update" value="<?php esc_html_e( 'Run the Update', 'wedevs-project-manager' ); ?>">
                            <a href="https://wedevs.com/docs/wp-project-manager/how-to-migrate-to-wp-project-manager-v2-0/?utm_source=wp-admin&utm_medium=pm-action-link&utm_campaign=pm-docs" class="button promo-btn" target="_blank"><?php esc_html_e( 'Read More', 'wedevs-project-manager' ); ?></a>
                        </form>
                    </div>
                </div>
                <script type="text/javascript">
                    jQuery('form.PmUpgradeFrom').submit(function(event){
                        //event.preventDefault();

                        return confirm( '<?php esc_html_e( 'It is strongly recommended that you backup your database before proceeding. Are you sure you wish to run the updater now?', 'wedevs-project-manager' ); ?>' );
                    });
                </script>
            <?php
       
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

        if ( isset( $_POST['pm_nonce'] ) && ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['pm_nonce'] ) ), '_nonce' ) ) {
            return;
        }

        if ( ! isset( $_POST['pm_update'] ) ) {
            return;
        }

        if ( ! current_user_can( 'manage_options' ) ) {
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

        if ( ! $this->is_needs_update() ) {
            return;
        }

        $installed_version = get_option( 'pm_db_version' );

        foreach (self::$updates as $version => $object ) {


            if ( version_compare( $installed_version, $version, '<' ) ) {
                
                if ( method_exists( $object, 'upgrade_init' ) ){
                    $object->upgrade_init();
                    update_option( 'pm_db_version', $version );
                }
            }
        }

        delete_option( 'cpm_db_version' );
       // update_option( 'pm_db_version', '2.0-beta' );
    }
}


