<?php

/**
 * Description of project
 *
 * @author Tareq Hasan (http://tareq.weDevs.com)
 */
class CPM_Project {

    private static $_instance;

    public function __construct() {
        add_filter( 'init', array($this, 'register_post_type') );
        add_filter( 'manage_toplevel_page_cpm_projects_columns', array($this, 'manage_project_columns') );
        add_filter( 'get_edit_post_link', array($this, 'get_edit_post_link'), 10, 3 );
        add_filter( 'post_row_actions', array($this, 'post_row_actions'), 10, 2 );
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
     * Get all the users of this project
     *
     * @param int $project_id
     * @param bool $exclude_client
     * @return array user emails with id as index
     */
    function get_users( $project_id, $exclude_client = false ) {

        $project = $this->get( $project_id );

        $mail = array();
        $user_ids = array($project->author);

        //if has privacy, exclude the client
        if ( !$exclude_client ) {
            array_push( $user_ids, $project->client );
        }

        //coworker email needs to be explode as they are saved in single field
        if ( $project->coworker != '' ) {
            $coworker = explode( '|', $project->coworker );
            $user_ids = array_merge( $user_ids, $coworker );
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

    function get( $project_id ) {
        return get_post( $project_id );
    }

    function create( $data ) {
        $data['created'] = current_time( 'mysql' );
        $data['author'] = get_current_user_id();
        $data['status'] = 1;

        $result = $this->_db->insert( CPM_PROJECT_TABLE, $data );

        return $this->_db->insert_id;
    }

    function update( $data ) {

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
            sprintf( '%s?page=cpm_messages&action=project&pid=%d', $base, $project_id ) => __( 'Messages', 'cpm' ),
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

    function notify_coworker_new_project( $project_id ) {
        $users = $_POST['project_coworker'];

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
