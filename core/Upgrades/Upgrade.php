<?php
namespace WeDevs\PM\Core\Upgrades;
class Upgrade {

    /** @var array DB updates that need to be run */
    private static $updates = [
        '2.0'    => 'Upgrade_2_0',
    ];

    public static $instance = null;

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
    }

    public function init_upgrades() {
        if( ! current_user_can( 'update_plugins' ) || ! $this->is_needs_update() ){
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
    public function is_needs_update() {
        $installed_version = !empty( get_site_option( 'cpm_db_version' ) ) ? get_site_option( 'cpm_db_version' ) : get_site_option( 'pm_db_version' );
        $updatable_versions = config('app.db_version');
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

        if ( ! current_user_can( 'update_plugins' ) || ! $this->is_needs_update() ) {
            return;
        }
        $installed_version  = get_option( 'cpm_db_version' );
        $updatable_versions = config('app.db_version');
        if ( ! is_null( $installed_version ) && version_compare( $installed_version, $updatable_versions, '<' ) ) {
            ?>
                <div class="notice notice-warning">
                   

                    <p><?php _e( '<strong>WP Project Manager Data Update Required</strong> &#8211; Please click the button below to update to the latest version.', 'pm' ) ?></p>

                    <form action="" method="post" style="padding-bottom: 10px;" class="PmUpgradeFrom">
                        <?php wp_nonce_field( '_nonce', 'pm_nonce' ); ?>
                        <input type="submit" class="button button-primary" name="pm_update" value="<?php _e( 'Run the Update', 'pm' ); ?>">
                    </form>
                </div>

                <script type="text/javascript">
                    jQuery('form.PmUpgradeFrom').submit(function(event){
                        return confirm( '<?php _e( 'It is strongly recommended that you backup your database before proceeding. Are you sure you wish to run the updater now?', 'pm' ); ?>' );
                    });
                </script>
            <?php
        } else {
            update_option( 'pm_db_version', $updatable_versions );
        }
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

        if ( ! $this->is_needs_update() ) {
            return;
        }
         $installed_version = get_option( 'pm_db_version' );

         foreach (self::$updates as $version => $object ) {
            if ( version_compare( $installed_version, $version, '<' ) ) {

                if ( method_exists( $object, 'upgrade_init' ) ){
                    $object->upgrade_init();
                }
                
                update_option( 'pm_db_version', $version );
            }
        }
        update_option( 'pm_db_version', config('db_version') );
    }
}
