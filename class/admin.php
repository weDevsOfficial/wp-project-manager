<?php

require_once CPM_PATH . '/includes/lib/class.settings-api.php';

/**
 * Admin options handler class
 *
 * @since 0.4
 * @author Tareq Hasan <tareq@wedevs.com>
 */
class CPM_Admin {

    private $settings_api;

    function __construct() {
        $this->settings_api = new WeDevs_Settings_API();

        add_action( 'admin_init', array( $this, 'admin_init' ) );
        add_action( 'admin_menu', array( $this, 'admin_menu' ), 50 );
        add_action( 'admin_notices', array($this, 'promotional_offer' ) );
    }

    function admin_init() {

        //set the settings
        $this->settings_api->set_sections( $this->get_settings_sections() );
        $this->settings_api->set_fields( $this->get_settings_fields() );

        //initialize settings
        $this->settings_api->admin_init();
    }

    function admin_menu() {
        add_submenu_page( 'cpm_projects', __( 'Settings', 'cpm' ), __( 'Settings', 'cpm' ), 'manage_options', 'cpm_settings', array( $this, 'settings_page' ) );
    }

    function get_settings_sections() {
        $sections = array(
            array(
                'id'    => 'cpm_general',
                'title' => __( 'General Settings', 'cpm' )
            ),
            array(
                'id'    => 'cpm_mails',
                'title' => __( 'E-Mail Settings', 'cpm' )
            ),
        );

        return apply_filters( 'cpm_settings_sections', $sections );
    }

    /**
     * Returns all the settings fields
     *
     * @return array settings fields
     */
    static function get_settings_fields() {
        global $wp_roles;

        $settings_fields = array();

        if ( ! $wp_roles ) {
            $wp_roles = new WP_Roles();
        }
        $role_names = $wp_roles->get_names();

        $url_links['backend'] = __( 'Link to Backend', 'cpm' );
        if ( cpm_is_pro() ) {
            $url_links['frontend'] = __( 'Link to Front-end', 'cpm' );
        };

        $settings_fields['cpm_general'] = apply_filters( 'cpm_settings_field_general', array(
            array(
                'name'    => 'upload_limit',
                'label'   => __( 'File Upload Limit', 'cpm' ),
                'default' => '2',
                'desc'    => __( 'File Size in Megabytes. e.g: 2', 'cpm' )
            ),
            array(
                'name'    => 'pagination',
                'label'   => __( 'Projects Per Page', 'cpm' ),
                'type'    => 'text',
                'default' => '10',
                'desc'    => __( '-1 for unlimited', 'cpm' )
            ),
            array(
                'name'    => 'todolist_show',
                'label'   => __( 'Task List Style', 'cpm' ),
                'type'    => 'radio',
                'default' => 'pagination',
                'options' => array( 'pagination' => __( 'Pagination', 'cpm' ), 'load_more' => __( 'Load More...', 'cpm' ), 'lazy_load' => __( 'Lazy Load', 'cpm' ) )
            ),
            array(
                'name'    => 'show_todo',
                'label'   => __( 'Task Lists Per Page', 'cpm' ),
                'type'    => 'text',
                'default' => '5',
            ),
            array(
                'name'    => 'show_incomplete_tasks',
                'label'   => __( 'Incomplete Tasks Per Page', 'cpm' ),
                'type'    => 'text',
                'default' => '50',
            ),
            array(
                'name'    => 'show_completed_tasks',
                'label'   => __( 'Completed Tasks Per Page', 'cpm' ),
                'type'    => 'text',
                'default' => '50',
            ),
            array(
                'name'    => 'project_manage_role',
                'label'   => __( 'Project Managing Capability', 'cpm' ),
                'default' => array( 'editor' => 'editor', 'author' => 'author', 'administrator' => 'administrator' ),
                'desc'    => __( 'Select the user roles who can see and manage all projects.', 'cpm' ),
                'type'    => 'multicheck',
                'options' => $role_names,
            ),
            array(
                'name'    => 'project_create_role',
                'label'   => __( 'Project Creation Capability', 'cpm' ),
                'default' => array( 'editor' => 'editor', 'author' => 'author', 'administrator' => 'administrator' ),
                'desc'    => __( 'Select the user roles who can create projects.', 'cpm' ),
                'type'    => 'multicheck',
                'options' => $role_names,
            ),
                ) );

        $settings_fields['cpm_mails'] = apply_filters( 'cpm_settings_field_mail', array(
            array(
                'name'    => 'email_from',
                'label'   => __( 'From Email', 'cpm' ),
                'type'    => 'text',
                'desc'    => '',
                'default' => get_option( 'admin_email' )
            ),
            array(
                'name'    => 'email_url_link',
                'label'   => __( 'Links in the Email', 'cpm' ),
                'type'    => 'radio',
                'desc'    => __( 'Select where do you want to take the user. Notification emails contain links.', 'cpm' ),
                'default' => 'backend',
                'options' => $url_links
            ),
            array(
                'name'    => 'email_type',
                'label'   => __( 'E-Mail Type', 'cpm' ),
                'type'    => 'select',
                'default' => 'text/plain',
                'options' => array(
                    'text/html'  => __( 'HTML Mail', 'cpm' ),
                    'text/plain' => __( 'Plain Text', 'cpm' )
                )
            ),
            array(
                'name'    => 'email_bcc_enable',
                'label'   => __( 'Send email via Bcc', 'cpm' ),
                'type'    => 'checkbox',
                'default' => 'off',
                'desc'    => __( 'Enable Bcc', 'cpm' )
            ),
        ) );

        return apply_filters( 'cpm_settings_fields', $settings_fields );
    }

    public static function get_post_type( $post_type ) {
        $pages_array = array( '-1' => __( '- Select -', 'cpm' ) );
        $pages       = get_posts( array( 'post_type' => $post_type, 'numberposts' => -1 ) );

        if ( $pages ) {
            foreach ( $pages as $page ) {
                $pages_array[$page->ID] = $page->post_title;
            }
        }

        return $pages_array;
    }

    function settings_page() {
        echo '<div class="wrap">';
        settings_errors();

        $this->settings_api->show_navigation();
        $this->settings_api->show_forms();

        echo '</div>';
    }

    function is_valid_promotion() {
        $today  = strtotime( date( 'Y-m-d', strtotime( current_time( 'mysql' ) ) ) );
        $future = strtotime( '2018-03-26' );

        if ( $future >= $today ) {
            return true;
        }

        return false;
    }

    /**
     * Added promotion notice
     *
     * @since  1.6.10
     *
     * @return void
     */
    public function promotional_offer() {

        if ( ! $this->is_valid_promotion() ) {
            return;
        }

        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        // check if it has already been dismissed
        $offer_key = 'cpm_package_birthday_offer';
        $hide_notice = get_option( $offer_key . '_tracking_notice', 'no' );

        if ( 'hide' == $hide_notice ) {
            return;
        }
        $offer  = __( '<h2>It’s Our Birthday <span>&#x1F382;</span> But You Get The Present <span>&#x1F381;</span></h2>', "cpm" );
        $offer .= __( '<p>Avail Exclusive <strong>25%</strong> Discount with coupon code: <strong>we25</strong></p>', 'cpm' );

        $offer_msg = sprintf( '%s', $offer );
        
        ?>
            <div class="notice is-dismissible" id="cpm-promotional-offer-notice">

                <img class="cpm-logo" src="<?php echo CPM_URL . '/assets/images/pm-icon.png'; ?>" alt="">
                <div class="cpm-offer-msg-wrap"><?php echo $offer_msg; ?></div>
                <span class="dashicons dashicons-megaphone"></span>
                <a href="https://wedevs.com/in/get-25-off" class="button button-primary promo-btn" target="_blank"><?php _e( 'Get the Offer', 'cpm' ); ?></a>
            </div>

            <style>
                .cpm-offer-msg-wrap {
                    margin-top: 18px;
                    margin-left: 20px;
                }
                #cpm-promotional-offer-notice {
                    background-color: #7257a9;
                    border-left: 0px;
                    padding-left: 83px;
                    height: 89px;
                }

                #cpm-promotional-offer-notice a.promo-btn{
                    background: #fff;
                    border-color: #fafafa #fafafa #fafafa;
                    box-shadow: 0 1px 0 #fafafa;
                    color: #7257a9;
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

                #cpm-promotional-offer-notice h2{
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

                #cpm-promotional-offer-notice .cpm-logo {
                    position: absolute;
                    width: 88px;
                    left: 0px;
                    background: #50348ac7;
                }

                #cpm-promotional-offer-notice h2 .dashicons-megaphone {
                    position: relative;
                    top: -1px;
                }

                #cpm-promotional-offer-notice p{
                    width: 85%;
                    color: rgba(250, 250, 250, 0.77);
                    font-size: 14px;
                    margin-bottom: 10px;
                    -webkit-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    -moz-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    -o-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                }

                #cpm-promotional-offer-notice p strong.highlight-text{
                    color: #fff;
                }

                #cpm-promotional-offer-notice p a {
                    color: #fafafa;
                }

                #cpm-promotional-offer-notice .notice-dismiss:before {
                    color: #fff;
                }

                #cpm-promotional-offer-notice span.dashicons-megaphone {
                    position: absolute;
                    top: 16px;
                    right: 248px;
                    color: rgba(253, 253, 253, 0.29);
                    font-size: 96px;
                    transform: rotate(-21deg);
                }

            </style>

            <script type='text/javascript'>
                jQuery('body').on('click', '#cpm-promotional-offer-notice .notice-dismiss', function(e) {
                    e.preventDefault();

                    wp.ajax.post('cpm-dismiss-promotional-offer-notice', {
                        cpm_promotion_dismissed: true
                    });
                });
            </script>
        <?php
    }

}
