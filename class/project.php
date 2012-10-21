<?php

/**
 * Description of project
 *
 * @author Tareq Hasan (http://tareq.weDevs.com)
 */
class CPM_Project {

    private static $_instance;
    private $custom_fields = array(
        'started', 'ends', 'client', 'budget', 'coworker', 'manager'
    );

    public function __construct() {
        add_filter( 'init', array($this, 'register_post_type') );
        add_filter( 'manage_toplevel_page_cpm_projects_columns', array($this, 'manage_project_columns') );
        add_filter( 'get_edit_post_link', array($this, 'get_edit_post_link'), 10, 3 );
        add_filter( 'post_row_actions', array($this, 'post_row_actions'), 10, 2 );

        //create new project
        add_action( 'admin_init', array($this, 'submit_project'), 99 );

        //notify users
        add_action( 'cpm_new_project', array($this, 'notify_users') );
    }

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new CPM_Project();
        }

        return self::$_instance;
    }

    function register_post_type() {
        register_post_type( 'project', array(
            'label' => __( 'Project', 'cpm' ),
            'description' => __( 'project manager post type', 'cpm' ),
            'public' => true,
            'show_ui' => false,
            'show_in_menu' => false,
            'capability_type' => 'post',
            'hierarchical' => false,
            'rewrite' => array('slug' => ''),
            'query_var' => true,
            'supports' => array('title', 'editor'),
            'labels' => array(
                'name' => __( 'Project', 'cpm' ),
                'singular_name' => __( 'Project', 'cpm' ),
                'menu_name' => __( 'Project', 'cpm' ),
                'add_new' => __( 'Add Project', 'cpm' ),
                'add_new_item' => __( 'Add New Project', 'cpm' ),
                'edit' => __( 'Edit', 'cpm' ),
                'edit_item' => __( 'Edit Project', 'cpm' ),
                'new_item' => __( 'New Project', 'cpm' ),
                'view' => __( 'View Project', 'cpm' ),
                'view_item' => __( 'View Project', 'cpm' ),
                'search_items' => __( 'Search Project', 'cpm' ),
                'not_found' => __( 'No Project Found', 'cpm' ),
                'not_found_in_trash' => __( 'No Project Found in Trash', 'cpm' ),
                'parent' => __( 'Parent Project', 'cpm' ),
            ),
        ) );
    }

    function get_edit_post_link( $url, $post_id, $context ) {
        global $post;

        if ( $post->post_type == 'project' && $context == 'display' && is_admin() ) {
            $url = admin_url( sprintf( 'admin.php?page=cpm_projects&action=details&pid=%d', $post->ID ) );
        }

        return $url;
    }

    function post_row_actions( $actions, $post ) {
        //var_dump( $actions, $post );

        if ( $post->post_type == 'project' ) {
            $actions['edit'] = '<a href="' . get_edit_post_link( $post->ID, 'project' ) . '" title="' . esc_attr( __( 'Edit this project' ) ) . '">' . __( 'Edit' ) . '</a>';
        }

        return $actions;
    }

    function manage_project_columns( $columns ) {
        $columns = array(
            'cb' => '<input type="checkbox" />',
            'title' => _x( 'Title', 'column name' ),
            'client' => __( 'Client', 'cpm' ),
            'status' => __( 'Status', 'cpm' ),
            'billing' => __( 'Billing', 'cpm' ),
            'starts' => __( 'Starts', 'cpm' ),
            'ends' => __( 'Ends', 'cpm' )
        );

        return $columns;
    }

    function manage_edit_columns( $column_name, $post_id ) {

        $custom_fields = get_post_custom( $post_id );

        $client = isset( $custom_fields['client'] ) ? $custom_fields['client'][0] : '';
        $status = isset( $custom_fields['status'] ) ? $custom_fields['status'][0] : '';

        switch ($column_name) {
            case 'client' :
                echo $client;
                get_edit_post_link();
                break;

            case 'status' :
                echo $status;
                break;

            default:
        }
    }

    /**
     * Handles creating new project request
     */
    function submit_project() {

        if ( isset( $_POST['add_project'] ) ) {

            check_admin_referer( 'new_project' );

            if ( empty( $_POST['project_name'] ) ) {
                $error = new WP_Error( 'empty_name', __( 'Empty project name', 'cpm' ) );
            } else {
                $posted = $_POST;
                $data = array(
                    'name' => $posted['project_name'],
                    'description' => $posted['project_description'],
                    'started' => wedevs_date2mysql( $posted['project_started'] ),
                    'ends' => wedevs_date2mysql( $posted['project_ends'] ),
                    'client' => (int) $posted['project_client'],
                    'budget' => (float) $posted['project_budget'],
                    'manager' => (int) $posted['project_manager'],
                    'coworker' => $posted['project_coworker']
                );

                $project_id = $this->create( $data );

                if ( $project_id ) {
                    $location = apply_filters( 'cpm_new_project_redirect_url', cpm_project_details_url( $project_id ) );
                    wp_redirect( $location );
                }
            }
        }
    }

    function create( $data ) {
        $project = array(
            'post_title' => $data['name'],
            'post_content' => $data['description'],
            'post_type' => 'project',
            'post_status' => 'publish'
        );

        $project_id = wp_insert_post( $project );

        if ( $project_id ) {
            foreach ($this->custom_fields as $field) {
                update_post_meta( $project_id, '_' . $field, $data[$field] );
            }

            do_action( 'cpm_new_project', $project_id );
        }

        return $project_id;
    }

    /**
     * Get details of the project
     *
     * @param int $project_id
     * @return object
     */
    function get( $project_id ) {
        $project = get_post( $project_id );

        //add project custom fields on the stdClass object
        foreach ($this->custom_fields as $field) {
            $project->$field = get_post_meta( $project_id, '_' . $field, true );
        }

        return $project;
    }

    /**
     * Get all the users of this project
     *
     * @param int $project_id
     * @param bool $exclude_client
     * @return array user emails with id as index
     */
    function get_users( $project_id, $exclude_client = false ) {

        $project = $this->get( $project_id );

        $mail = array();
        $user_ids = array($project->post_author);
        $co_worker = get_post_meta( $project_id, '_coworker', true );

        //if has privacy, exclude the client
        if ( !$exclude_client ) {
            $client = get_post_meta( $project_id, '_client', true );

            if ( $client && $client != '' ) {
                array_push( $user_ids, $client );
            }
        }

        if ( count( $co_worker ) > 0 ) {
            $user_ids = array_merge( $user_ids, $co_worker );
        }

        //insert the mail addresses in array, user id as key
        if ( $user_ids ) {
            foreach ($user_ids as $id) {
                $user = get_user_by( 'id', $id );
                if ( !is_wp_error( $user ) && $user ) {
                    $mail[$id] = array(
                        'id' => $user->ID,
                        'email' => $user->user_email,
                        'name' => $user->display_name
                    );
                }
            }
        }

        return $mail;
    }

    function get_status( $project_id ) {
        return 'Not started';
    }

    function get_bill_status( $project_id ) {
        return 'Not started';
    }

    function nav_links( $project_id ) {
        $base = admin_url( 'admin.php' );

        $links = array(
            sprintf( '%s?page=cpm_projects&action=details&pid=%d', $base, $project_id ) => __( 'Details', 'cpm' ),
            sprintf( '%s?page=cpm_projects&action=message&pid=%d', $base, $project_id ) => __( 'Messages', 'cpm' ),
            sprintf( '%s?page=cpm_projects&action=task_list&pid=%d', $base, $project_id ) => __( 'Task List', 'cpm' ),
            sprintf( '%s?page=cpm_projects&action=milestone&pid=%d', $base, $project_id ) => __( 'Milestones', 'cpm' ),
            sprintf( '%s?page=cpm_projects&action=invoice&pid=%d', $base, $project_id ) => __( 'Invoices', 'cpm' ),
            sprintf( '%s?page=cpm_projects&action=files&pid=%d', $base, $project_id ) => __( 'Files', 'cpm' ),
        );

        return $links;
    }

    function nav_menu( $project_id, $active = '' ) {
        $links = $this->nav_links( $project_id );

        $menu = array();
        foreach ($links as $url => $label) {
            if ( $active == $label ) {
                //$menu[] = sprintf( '<li class="active"><a href="%1$s" title="%2$s">%2$s</a></li>', $url, $label );
                $menu[] = sprintf( '<a href="%1$s" class="nav-tab nav-tab-active" title="%2$s">%2$s</a>', $url, $label );
            } else {
                //$menu[] = sprintf( '<li><a href="%1$s" title="%2$s">%2$s</a></li>', $url, $label );
                $menu[] = sprintf( '<a href="%1$s" class="nav-tab" title="%2$s">%2$s</a>', $url, $label );
            }
        }

        //return '<ul class="cpm-nav">' . implode( "\n", $menu ) . '</ul>';
        return implode( "\n", $menu );
    }

    /**
     * Notify users about the new project creation
     *
     * @uses `cpm_new_project` hook
     * @param int $project_id
     */
    function notify_users( $project_id ) {

        if ( isset( $_POST['project_notify'] ) ) {
            $users = $this->get_users( $project_id );

            $site_name = wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );
            $subject = sprintf( __( 'New Project invitation on %s', 'cpm' ), $site_name );
            $body = sprintf( __( 'You are assigned in a new project "%s" on %s', 'cpm' ), trim( $_POST['project_name'] ), $site_name ) . "\r\n";
            $body .= sprintf( __( 'You can see the project by going here: %s', 'cpm' ), cpm_project_details_url( $project_id ) ) . "\r\n";

            $wp_email = 'no-reply@' . preg_replace( '#^www\.#', '', strtolower( $_SERVER['SERVER_NAME'] ) );
            $from = "From: \"$blogname\" <$wp_email>";
            $message_headers = "$from\nContent-Type: text/plain; charset=\"" . get_option( 'blog_charset' ) . "\"\n";

            wp_mail( $users, $subject, $body, $message_headers );
        }
    }

}
