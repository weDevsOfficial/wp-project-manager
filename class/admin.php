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
                'id'    => 'cpm_general',
                'title' => __( 'General', 'cpm' )
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

        if ( !$wp_roles ) {
            $wp_roles = new WP_Roles();
        }
        $role_names = $wp_roles->get_names();

        $settings_fields['cpm_general'] = apply_filters( 'cpm_settings_field_general', array(
            array(
                'name'    => 'upload_limit',
                'label'   => __('File Upload Limit', 'cpm'),
                'default' => '2',
                'desc'    => __('file size in Megabyte. e.g: 2')
            ),
            array(
                'name'    => 'pagination',
                'label'   => __('Number of project per page', 'cpm'),
                'type'    => 'text',
                'default' => '10',
                'desc'    => __('-1 for unlimited', 'cpm')
            ),
            array(
                'name'    => 'project_manage_role',
                'label'   => __( 'Project Manage Capability', 'cpm' ),
                'default' => array( 'editor' => 'editor', 'author' => 'author', 'administrator' => 'administrator' ),
                'desc'    => __( 'Select the user role who can see and manage all projects', 'cpm' ),
                'type'    => 'multicheck',
                'options' => $role_names,
            ),
            array(
                'name'    => 'project_create_role',
                'label'   => __( 'Project Create Capability', 'cpm' ),
                'default' => array( 'editor' => 'editor', 'author' => 'author', 'administrator' => 'administrator' ),
                'desc'    => __( 'Select the user role who can create projects', 'cpm' ),
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
            // array(
            //     'name'    => 'email_type',
            //     'label'   => __( 'E-Mail Type', 'cpm' ),
            //     'type'    => 'select',
            //     'default' => 'text/plain',
            //     'options' => array(
            //         'text/html' => __( 'HTML Mail', 'cpm'),
            //         'text/plain' => __( 'Plain Text', 'cpm')
            //     )
            // ),

            array(
                'name'    => 'email_new_project_sub',
                'label'   => __( 'New Project Invitation', 'cpm' ),
                'type'    => 'text',
                'desc'    => __( '%SITE% Mailing subject for new project invitation %PROJECT_NAME%', 'cpm' ),
                'default' => '[%SITE%] ' . __( 'New Project Invitation:', 'cpm' ) . ' %PROJECT_NAME%'
            ),

            array(
                'name'    => 'email_update_project_sub',
                'label'   => __( 'Update Project Invitation', 'cpm' ),
                'type'    => 'text',
                'desc'    => __( '%SITE% Mailing subject for update project invitation %PROJECT_NAME%', 'cpm' ),
                'default' => '[%SITE%] ' . __( 'Updated Project Invitation: ', 'cpm' ) . ' %PROJECT_NAME%'
            ),

            array(
                'name'    => 'email_new_task_sub',
                'label'   => __( 'New Task', 'cpm' ),
                'type'    => 'text',
                'desc'    => __( '%SITE% %PROJECT_NAME% Mailing subject for new task %LIST_TITLE%', 'cpm' ),
                'default' => '[%SITE%][%PROJECT_NAME%] ' . __( 'New Task Assigned:', 'cpm' ) . ' %LIST_TITLE%'
            ),

            array(
                'name'    => 'email_updated_task_sub',
                'label'   => __( 'Updated Task', 'cpm' ),
                'type'    => 'text',
                'desc'    => __( '%SITE% %PROJECT_NAME% Mailing subject for updated task %LIST_TITLE%', 'cpm' ),
                'default' => '[%SITE%][%PROJECT_NAME%] ' . __( 'Updated Task Assigned:', 'cpm' ) . ' %LIST_TITLE%'
            ),

            array(
                'name'    => 'email_task_complete_sub',
                'label'   => __( 'Completed Task', 'cpm' ),
                'type'    => 'text',
                'desc'    => __( '%SITE% %PROJECT_NAME% Mailing subject for completed task %TASK_TITLE%', 'cpm' ),
                'default' => '[%SITE%][%PROJECT_NAME%] ' . __( 'Task Completed:', 'cpm' ) . ' %TASK_TITLE%'
            ),

            array(
                'name'    => 'email_comment_sub',
                'label'   => __( 'Comment', 'cpm' ),
                'type'    => 'text',
                'desc'    => __( '%SITE% %PROJECT_NAME% Mailing subject for comment %COMMENT_TITLE%', 'cpm' ),
                'default' => '[%SITE%][%PROJECT_NAME%] ' . __( 'New Comment on: ', 'cpm' ) . ' %COMMENT_TITLE%'
            ),

            array(
                'name'    => 'email_discuss_sub',
                'label'   => __( 'Discussion', 'cpm' ),
                'type'    => 'text',
                'desc'    => __( '%SITE% %PROJECT_NAME% Mailing subject for discussion %MESSAGE_TITLE%', 'cpm' ),
                'default' => '[%SITE%][%PROJECT_NAME%] ' . __( 'New Message: ', 'cpm' ) . ' %MESSAGE_TITLE%'
            ),

            


            array(
                'name'    => 'email_new_project_header',
                'label'   => __( 'New Project Header', 'cpm' ),
                'type'    => 'text',
                'desc'    => __( 'Mailing header title for new project', 'cpm' ),
                'default' => __( 'NEW PROJECT', 'cpm' )
            ),

            array(
                'name'    => 'email_update_project_header',
                'label'   => __( 'Update Project Header', 'cpm' ),
                'type'    => 'text',
                'desc'    => __( 'Mailing header title for update project', 'cpm' ),
                'default' => __( 'UPDATE PROJECT', 'cpm' ) 
            ),

            array(
                'name'    => 'email_new_task_header',
                'label'   => __( 'New Task Header', 'cpm' ),
                'type'    => 'text',
                'desc'    => __( 'Mailing header title for new task', 'cpm' ),
                'default' => __( 'New task has been assigned to you', 'cpm' ) 
            ),

            array(
                'name'    => 'email_updated_task_header',
                'label'   => __( 'Updated Task Header', 'cpm' ),
                'type'    => 'text',
                'desc'    => __( 'Mailing header title for updated task', 'cpm' ),
                'default' => __( 'New task has been updated', 'cpm' ) 
            ),

            array(
                'name'    => 'email_complete_task_header',
                'label'   => __( 'Completed Task Header', 'cpm' ),
                'type'    => 'text',
                'desc'    => __( 'Mailing header title for completed task', 'cpm' ),
                'default' => __( 'New task has been completed', 'cpm' ) 
            ),

            array(
                'name'    => 'email_comment_header',
                'label'   => __( 'Comment Header', 'cpm' ),
                'type'    => 'text',
                'desc'    => __( 'Mailing header title for new commenet', 'cpm' ),
                'default' => __( 'NEW COMMENT', 'cpm' ) 
            ),

            array(
                'name'    => 'email_discuss_header',
                'label'   => __( 'Discussion', 'cpm' ),
                'type'    => 'text',
                'desc'    => __( 'Mailing header title for new meassage', 'cpm' ),
                'default' => __( 'NEW MESSAGE', 'cpm' ) 
            ),
            /**
             * ************************
             */
            /*
            array(
                'name'    => 'new_project_sub',
                'label'   => __( 'New Project Subject', 'cpm' ),
                'default' => 'New Project invitation on %PROJECT_NAME%'
            ),
            array(
                'name'    => 'new_project_body',
                'label'   => __( 'New Project Body', 'cpm' ),
                'type'    => 'textarea',
                'default' => "Hello\n
You are assigned in a new project \"%PROJECT_NAME%\" on %SITE%
You can see the project by going here: %PROJECT_URL%",
                'desc' => 'use: %SITE%, %PROJECT_NAME%, %PROJECT_DETAILS%, %PROJECT_URL%'

            ),

            array(
                'name'    => 'update_project_sub',
                'label'   => __( 'Update Project Subject', 'cpm' ),
                'default' => 'Update Project invitation on %PROJECT_NAME%'
            ),
            array(
                'name' => 'update_project_body',
                'label' => __( 'Update Project Body', 'cpm' ),
                'type' => 'textarea',
                'default' => "Hello\n
You are assigned in a project update \"%PROJECT_NAME%\" on %SITE%
You can see the project by going here: %PROJECT_URL%",
                'desc' => 'use: %SITE%, %PROJECT_NAME%, %PROJECT_DETAILS%, %PROJECT_URL%'

            ),
            array(
                'name'    => 'new_message_sub',
                'label'   => __( 'New Message Subject', 'cpm' ),
                'default' => '[%SITE%] New message on project: %PROJECT_NAME%'
            ),
            array(
                'name'    => 'new_message_body',
                'label'   => __( 'New Message Body', 'cpm' ),
                'type'    => 'textarea',
                'default' => "Author : %AUTHOR%\nPermalink : %MESSAGE_URL%\nMessage : %MESSAGE%",
                'desc'    => 'use: %SITE%, %AUTHOR%, %AUTHOR_EMAIL%, %PROJECT_NAME%, %PROJECT_URL%, %MESSAGE_URL%, %MESSAGE%, %IP%'
            ),
            array(
                'name'    => 'new_comment_sub',
                'label'   => __( 'New Comment Subject', 'cpm' ),
                'default' => '[%SITE%][%PROJECT_NAME%] New comment added'
            ),
            array(
                'name'    => 'new_comment_body',
                'label'   => __( 'Body', 'cpm' ),
                'type'    => 'textarea',
                'default' => "Author : %AUTHOR%\nPermalink : %COMMENT_URL%\nComment : %COMMENT%",
                'desc'    => 'use: %SITE%, %PROJECT_NAME%, %PROJECT_URL%, %AUTHOR%, %AUTHOR_EMAIL%, %COMMENT_URL%, %COMMENT%, %IP%'
            ),
            array(
                'name'    => 'new_task_sub',
                'label'   => __( 'New Assigned Task Subject', 'cpm' ),
                'default' => '[%SITE%][%PROJECT_NAME%] New task assigned to you'
            ),
            array(
                'name'  => 'new_task_body',
                'label' => __( 'Body', 'cpm' ),
                'type'  => 'textarea',
                'default' => 'A new task has been assigned to you on %PROJECT_NAME%
Task List URL: %TASKLIST_URL%
Task URL: %TASK_URL%
Task: %TASK%',
                'desc' => 'use: %SITE%, %PROJECT_NAME%, %PROJECT_URL%, %AUTHOR%, %AUTHOR_EMAIL%, %TASKLIST_URL%, %TASK_URL%, %TASK%, %IP%'
            ),

            array(
                'name'    => 'complete_task_sub',
                'label'   => __( 'Completed Task Subject', 'cpm' ),
                'default' => '[%SITE%][%PROJECT_NAME%] Completed task'
            ),

            array(
                'name' => 'completed_task_body',
                'label' => __( 'Body', 'cpm' ),
                'type' => 'textarea',
                'default' => 'A new task has been completed %PROJECT_NAME%
Task List URL: %TASKLIST_URL%
Task URL: %TASK_URL%
Task: %TASK%',
                'desc' => 'use: %SITE%, %PROJECT_NAME%, %PROJECT_URL%, %TASKLIST_URL%, %TASK_URL%, %TASK%, %IP%'
            ),
            */
            array(
                'name'    => 'email_bcc_enable',
                'label'   => __('Send email via Bcc', 'cpm'),
                'type'    => 'checkbox',
                'default' => 'off',
                'desc'    => __('Enable Bcc')
            ),
        ) );

        return apply_filters( 'cpm_settings_fields', $settings_fields );
    }

    public static function get_post_type( $post_type ) {
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

        echo '</div>';
    }

}