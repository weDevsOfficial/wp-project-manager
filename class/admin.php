<?php

require_once dirname( __FILE__ ) . '/class.settings-api.php';

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

        add_action( 'admin_init', array($this, 'admin_init') );
        add_action( 'admin_menu', array($this, 'admin_menu'), 50 );
    }

    function admin_init() {

        //set the settings
        $this->settings_api->set_sections( $this->get_settings_sections() );
        $this->settings_api->set_fields( $this->get_settings_fields() );

        //initialize settings
        $this->settings_api->admin_init();
    }

    function admin_menu() {
        add_submenu_page( 'cpm_projects', __( 'Settings', 'cpm' ), __( 'Settings', 'cpm' ), 'manage_options', 'cpm_settings', array($this, 'settings_page') );
    }

    function get_settings_sections() {
        $sections = array(
            array(
                'id' => 'cpm_general',
                'title' => __( 'General', 'cpm' )
            ),
            array(
                'id' => 'cpm_mails',
                'title' => __( 'E-Mail Settings', 'cpm' )
            )
        );

        return apply_filters( 'cpm_settings_sections', $sections );
    }

    /**
     * Returns all the settings fields
     *
     * @return array settings fields
     */
    static function get_settings_fields() {
        $settings_fields = array();
        
        $settings_fields['cpm_general'] = apply_filters( 'cpm_settings_field_general', array(
            array(
                'name' => 'upload_limit',
                'label' => __('File Upload Limit', 'cpm'),
                'default' => '2',
                'desc' => __('file size in Megabyte. e.g: 2')
            )
        ));

        $settings_fields['cpm_mails'] = apply_filters( 'cpm_settings_field_mail', array(
            array(
                'name' => 'email_type',
                'label' => __( 'E-Mail Type', 'cpm' ),
                'type' => 'select',
                'default' => 'text/plain',
                'options' => array(
                    'text/html' => __( 'HTML Mail', 'cpm'),
                    'text/plain' => __( 'Plain Text', 'cpm')
                )
            ),
            array(
                'name' => 'new_project_sub',
                'label' => __( 'New Project Subject', 'cpm' ),
                'default' => 'New Project invitation on %PROJECT_NAME%'
            ),
            array(
                'name' => 'new_project_body',
                'label' => __( 'New Project Body', 'cpm' ),
                'type' => 'textarea',
                'default' => "Hello\n
You are assigned in a new project \"%PROJECT_NAME%\" on %SITE%
You can see the project by going here: %PROJECT_URL%",
                'desc' => 'use: %SITE%, %PROJECT_NAME%, %PROJECT_DETAILS%, %PROJECT_URL%'
                
            ),
            array(
                'name' => 'new_message_sub',
                'label' => __( 'New Message Subject', 'cpm' ),
                'default' => '[%SITE%] New message on project: %PROJECT_NAME%'
            ),
            array(
                'name' => 'new_message_body',
                'label' => __( 'New Message Body', 'cpm' ),
                'type' => 'textarea',
                'default' => "Author : %AUTHOR%\nPermalink : %MESSAGE_URL%\nMessage : %MESSAGE%",
                'desc' => 'use: %SITE%, %AUTHOR%, %AUTHOR_EMAIL%, %PROJECT_NAME%, %PROJECT_URL%, %MESSAGE_URL%, %MESSAGE%, %IP%'
            ),
            array(
                'name' => 'new_comment_sub',
                'label' => __( 'New Comment Subject', 'cpm' ),
                'default' => '[%SITE%][%PROJECT_NAME%] New comment added'
            ),
            array(
                'name' => 'new_comment_body',
                'label' => __( 'Body', 'cpm' ),
                'type' => 'textarea',
                'default' => "Author : %AUTHOR%\nPermalink : %COMMENT_URL%\nComment : %COMMENT%",
                'desc' => 'use: %SITE%, %PROJECT_NAME%, %PROJECT_URL%, %AUTHOR%, %AUTHOR_EMAIL%, %COMMENT_URL%, %COMMENT%, %IP%'
            ),
            array(
                'name' => 'new_task_sub',
                'label' => __( 'New Assigned Task Subject', 'cpm' ),
                'default' => '[%SITE%][%PROJECT_NAME%] New task assigned to you'
            ),
            array(
                'name' => 'new_task_body',
                'label' => __( 'Body', 'cpm' ),
                'type' => 'textarea',
                'default' => 'A new task has been assigned to you on %PROJECT_NAME%
Task List URL: %TASKLIST_URL%
Task URL: %TASK_URL%
Task: %TASK%',
                'desc' => 'use: %SITE%, %PROJECT_NAME%, %PROJECT_URL%, %AUTHOR%, %AUTHOR_EMAIL%, %TASKLIST_URL%, %TASK_URL%, %TASK%, %IP%'
            ),
        ) );

        return apply_filters( 'cpm_settings_fields', $settings_fields );
    }
    
    static function get_post_type( $post_type ) {
        $pages_array = array( '-1' => __( '- select -', 'dokan' ) );
        $pages = get_posts( array('post_type' => $post_type, 'numberposts' => -1) );

        if ( $pages ) {
            foreach ($pages as $page) {
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
        
        echo '<a href="http://wedevs.com/plugin/wp-project-manager/" target="_blank">';
        echo '<img src="'. plugins_url( '', dirname( __FILE__ ) ) . '/images/banner.png" alt="Get PRO version" title="Get the PRO version">';
        echo '</a>';

        echo '</div>';
    }

}