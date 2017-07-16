<?php

class CPM_Upgrade {

    private static $_instance;

    /**
     * Instantiate
     *
     * @since 1.1
     *
     * @return type
     */
    public static function getInstance() {
        if ( ! self::$_instance ) {
            self::$_instance = new CPM_Upgrade();
        }

        return self::$_instance;
    }

    /**
     * Initial action
     *
     * @since 1.1
     *
     * @return type
     */
    function __construct() {
        add_action( 'admin_init', array( $this, 'init' ) );
        add_action( 'admin_notices', array( $this, 'notice' ) );
    }

    /**
     * Plugin notice
     *
     * @since 1.1
     */
    function notice() {
        if ( ! current_user_can( 'update_plugins' ) ) {
            return;
        }

        $version = get_option( 'cpm_version', '0.4.6' );

        if ( version_compare( CPM_VERSION, $version, '<=' ) ) {
            return;
        }
        ?>
        <div class="notice notice-warning">
            <p><?php _e( '<strong>WP Project Manager Data Update Required</strong> &#8211; Please click the button below to update to the latest version.', 'cpm' ) ?></p>

            <form action="" method="post" style="padding-bottom: 10px;">
                <?php wp_nonce_field( '_nonce', 'cpm_nonce' ); ?>
                <input type="submit" class="button button-primary" name="cpm_update" value="<?php _e( 'Run the Update', 'cpm' ); ?>">
            </form>
        </div>
        <?php
    }

    /**
     * Initial action
     *
     * @since 1.1
     */
    function init() {
        if ( ! isset( $_POST['cpm_update'] ) ) {
            return;
        }

        if ( ! wp_verify_nonce( $_POST['cpm_nonce'], '_nonce' ) ) {
            return;
        }

        $this->plugin_upgrades();
        wp_redirect( $_POST['_wp_http_referer'] );
        exit();
    }

    /**
     * Do upgrade tasks
     *
     * @return void
     */
    function plugin_upgrades() {
        $current_version = get_option( 'cpm_version', '0.4.6' );
        $db_updates      = array(
            '0.5'   => 'upgrade-0.5.php',
            '1.0'   => 'upgrade-1.0.php',
            '1.1'   => 'upgrade-1.1.php',
            '1.4'   => 'upgrade-1.4.php',
            '1.4.1' => 'upgrade-1.4.1.php',
            '1.5'   => 'upgrade-1.5.php',
        );

        $this->create_user_role_table();

        foreach ( $db_updates as $version => $path ) {
            if ( version_compare( $current_version, $version, '<' ) ) {
                $file = CPM_PATH . '/includes/pro/upgrades/' . $path;

                if ( file_exists( $file ) ) {
                    require_once $file;
                } else {
                    require_once CPM_PATH . '/includes/upgrades/' . $path;
                }

                update_option( 'cpm_db_version', $version );
                update_option( 'cpm_version', $version );
            }
        }

        update_option( 'cpm_db_version', CPM_DB_VERSION );
        update_option( 'cpm_version', CPM_VERSION );
    }

    function create_user_role_table() {
        global $wpdb;

        $table_name = $wpdb->prefix . 'cpm_user_role';
        $sql        = "CREATE TABLE IF NOT EXISTS {$table_name} (
          `ID` bigint(20) NOT NULL AUTO_INCREMENT,
          `project_id` bigint(20) NOT NULL,
          `user_id` bigint(20) NOT NULL,
          `role` varchar(20) CHARACTER SET utf8 NOT NULL,
          `component` varchar(20) CHARACTER SET utf8 NOT NULL,
          PRIMARY KEY (`ID`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );
    }

}
