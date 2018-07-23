<?php

namespace WeDevs\PM\Core\WP;

use WeDevs\PM\Core\WP\Menu;
use WeDevs\PM\Core\Upgrades\Upgrade;
use WeDevs\PM\Core\Notifications\Notification;
use WeDevs\PM\Core\WP\Register_Scripts;
use WeDevs\PM\Core\WP\Enqueue_Scripts as Enqueue_Scripts;
use WeDevs\PM\Core\File_System\File_System as File_System;
use WeDevs\PM\Core\Cli\Commands;
use PM_Create_Table;


class Frontend {

	/**
     * Constructor for the PM class
     *
     * Sets up all the appropriate hooks and actions
     * within our plugin.
     */
	public function __construct() {
		$this->includes();

		// instantiate classes
        $this->instantiate();

		// Initialize the action hooks
        $this->init_actions();

        // Initialize the action hooks
        $this->init_filters();

        //Execute only plugin install time
        register_activation_hook( PM_FILE, array( $this, 'install' ) );
    }

    public function install() {
        new PM_Create_Table;
        (new \RoleTableSeeder())->run();
    }

	/**
	 * All actions
	 *
	 * @return void
	 */
	public function init_actions() {
        add_action( 'plugins_loaded', array( $this, 'seed' ), 10 );
		add_action( 'admin_menu', array( new Menu, 'admin_menu' ) );
        add_action( 'wp_ajax_pm_ajax_upload', array ( new File_System, 'ajax_upload_file' ) );
		add_action( 'init', array ( 'WeDevs\PM\Core\Notifications\Notification' , 'init_transactional_emails' ) );
		add_action( 'admin_enqueue_scripts', array ( $this, 'register_scripts' ) );
		add_action( 'wp_enqueue_scripts', array ( $this, 'register_scripts' ) );
		add_action( 'plugins_loaded', array( $this, 'load_plugin_textdomain' ) );
		add_action( 'plugins_loaded', array( $this, 'pm_content_filter' ) );
		add_action( 'plugins_loaded', array( $this, 'pm_content_filter_url' ) );
        add_filter( 'plugin_action_links_' . PM_BASENAME , array( $this, 'plugin_action_links' ) );
		add_filter( 'in_plugin_update_message-' . PM_BASENAME , array( $this, 'upgrade_notice' ), 10, 2 );

        if ( class_exists('WeDevs_CPM_Pro') ) {
			add_action( 'admin_notices', [$this, 'pm_pro_notice'] );
		}
	}

    function seed() {
        Upgrade::create_tables();
    }

	function pm_content_filter() {
		add_filter( 'pm_get_content', 'wptexturize' );
        add_filter( 'pm_get_content', 'convert_smilies' );
        add_filter( 'pm_get_content', 'convert_chars' );
        add_filter( 'pm_get_content', 'wpautop' );
        add_filter( 'pm_get_content', 'shortcode_unautop' );
        add_filter( 'pm_get_content', 'prepend_attachment' );
        add_filter( 'pm_get_content', 'make_clickable' );
	}

	function pm_content_filter_url() {
		add_filter( 'pm_get_content_url', 'make_clickable' );
	}

	function load_plugin_textdomain() {
		load_plugin_textdomain( 'wedevs-project-manager', false, config('frontend.basename') . '/languages/' );
	}

	public function includes() {
		//if ( ! wp_next_scheduled( 'pm_test_schedule' ) ) {
			//wp_schedule_event(time(), 'pm_schedule', 'pm_test_schedule');
		//}

		// cli command
        if ( defined('WP_CLI') && WP_CLI ) {
        	$file = config( 'frontend.patch' ) . '/core/cli/Commands.php';

        	//if ( file_exists( $file ) ) {
        		new Commands();
        	//}
        }
	}

	/**
	 * All filters
	 *
	 * @return void
	 */
	public function init_filters() {
		add_filter( 'upload_mimes', [$this, 'cc_mime_types'] );
		add_filter( 'wp_mime_type_icon', [$this, 'change_mime_icon'], 10, 3 );
		add_filter( 'todo_list_text_editor', [$this, 'project_text_editor'] );
	}

	function cc_mime_types( $mimes ) {
	    $mimes['svg'] = 'image/svg+xml';
	    return $mimes;
	}

	function change_mime_icon( $icon, $mime = null, $post_id = null ) {
		$assets_url = config('frontend.assets_url');
	    $folder 	= $assets_url . 'images/icons/';
	    $exist_mime = [
	    	'application/pdf' => 'pdf.png'
	    ];

        if ( array_key_exists( $mime, $exist_mime ) ) {
            return  $icon = $folder . $exist_mime[$mime];
        }

	    $icon = str_replace( get_bloginfo( 'wpurl' ) . '/wp-includes/images/media/', $folder, $icon );

	    return $icon;
	}

	function cron_interval( $schedules ) {
		// Adds every 5 minutes to the existing schedules.
		$schedules[ 'pm_schedule' ] = array(
			'interval' => MINUTE_IN_SECONDS * 1,
			'display'  => sprintf( __( 'Every %d Minutes PM schedule', 'wedevs-project-manager' ), 1 ),
		);

		return $schedules;
	}

function project_text_editor($config) {
	$config['external_plugins']['placeholder'] = config('frontend.assets_url') . 'vendor/tinymce/plugins/placeholder/plugin.min.js';
	$config['plugins'] = 'placeholder textcolor colorpicker wplink wordpress';
	return $config;
}

	/**
	 * instantiate classes
	 *
	 * @return void
	 */
	public function instantiate() {
        Notification::init_transactional_emails();
        new Upgrade();
	}

	public function register_scripts() {
		Register_Scripts::scripts();
		Register_Scripts::styles();
	}
	public function pm_pro_notice() {
		$offer  = __( '<h2>WP Project Manager Pro required version 2.0 or above.</span></h2>', "wedevs-project-manager" );
        $offer .= __( '<p>To migrate version 2.0, Please read mmigration docs </p>', 'wedevs-project-manager' );

        $offer_msg = sprintf( '%s', $offer );
		 ?>
		 <div class="notice" id="pm-promotional-offer-notice">

                <img class="pm-logo" src="<?php echo config('frontend.url') . 'views/assets/images/pm-icon.png'; ?>" alt="">
                <div class="pm-offer-msg-wrap"><?php echo $offer_msg; ?></div>
                <span class="dashicons dashicons-megaphone"></span>
                <a href="https://wedevs.com/docs/wp-project-manager/how-to-migrate-to-wp-project-manager-v2-0/?utm_source=wp-admin&utm_medium=pm-action-link&utm_campaign=pm-docs" class="button button-primary promo-btn" target="_blank"><?php _e( 'Read Docs', 'wedevs-project-manager' ); ?></a>
            </div>

            <style>
                .pm-offer-msg-wrap {
                    margin-top: 18px;
                    margin-left: 20px;
                }
                #pm-promotional-offer-notice {
                    background-color: #e53935;
                    border-left: 0px;
                    padding-left: 83px;
                    height: 89px;
                    position: relative;
                }

                #pm-promotional-offer-notice a.promo-btn{
                    background: #fff;
                    border-color: #fafafa #fafafa #fafafa;
                    box-shadow: 0 1px 0 #fafafa;
                    color: #616161;
                    text-decoration: none;
                    text-shadow: none;
                    position: absolute;
                    top: 30px;
                    right: 26px;
                    height: 40px;
                    line-height: 40px;
                    width: 130px;
                    text-align: center;
                }

                #pm-promotional-offer-notice h2{
                    font-size: 18px;
                    width: 85%;
                    color: rgba(250, 250, 250, 1);
                    margin-bottom: 8px;
                    font-weight: normal;
                    margin-top: 15px;
                    -webkit-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    -moz-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    -o-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                }

                #pm-promotional-offer-notice .pm-logo {
                    position: absolute;
                    width: auto;
                    height: 100%;
                    left: 0px;
                    background: #D32F2F;
                    top: 0;
                }

                #pm-promotional-offer-notice h2 .dashicons-megaphone {
                    position: relative;
                    top: -1px;
                }

                #pm-promotional-offer-notice p{
                    width: 85%;
                    color: rgba(250, 250, 250, 0.77);
                    font-size: 14px;
                    margin-bottom: 10px;
                    -webkit-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    -moz-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    -o-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                }

                #pm-promotional-offer-notice p strong.highlight-text{
                    color: #fff;
                }

                #pm-promotional-offer-notice p a {
                    color: #fafafa;
                }

                #pm-promotional-offer-notice .notice-dismiss:before {
                    color: #fff;
                }

                #pm-promotional-offer-notice span.dashicons-megaphone {
                    position: absolute;
                    top: 16px;
                    right: 248px;
                    color: rgba(253, 253, 253, 0.29);
                    font-size: 96px;
                    transform: rotate(-21deg);
                }

            </style>

		 <?php
	}

	/**
     * Plugin action links
     *
     * @param  array  $links
     *
     * @return array
     */
    function plugin_action_links( $links ) {
    	global $wedevs_pm_pro;

        if ( !$wedevs_pm_pro  ) {
            $links[] = '<a href="https://wedevs.com/wp-project-manager-pro/pricing/?utm_source=freeplugin&utm_medium=pm-action-link&utm_campaign=pm-pro-prompt" style="color: #389e38;font-weight: bold;" target="_blank">' . __( 'Get Pro', 'wedevs-project-manager' ) . '</a>';
        }

        $links[] = '<a href="' . admin_url( 'admin.php?page=pm_projects#/settings' ) . '">' . __( 'Settings', 'wedevs-project-manager' ) . '</a>';
        $links[] = '<a href="https://wedevs.com/docs/wp-project-manager/?utm_source=wp-admin&utm_medium=pm-action-link&utm_campaign=pm-docs" target="_blank">' . __( 'Documentation', 'wedevs-project-manager' ) . '</a>';

        return $links;
    }

    /**
     * Upgrade notice
     *
     * @param  stdClass $current
     * @param  stdClass $new
     *
     * @return void
     */
    public function upgrade_notice( $current, $new_version ) {

        if ( isset( $new_version->upgrade_notice ) && strlen( trim( $new_version->upgrade_notice ) ) > 0 ) {
            echo '<div style="background-color: #d54e21; padding: 10px; color: #f9f9f9; margin-top: 10px">';
            echo $new_version->upgrade_notice . '</div>';
        }
    }
}
