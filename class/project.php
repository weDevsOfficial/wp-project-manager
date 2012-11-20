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

    function create( $project_id = 0 ) {
        $posted = $_POST;
        $is_update = ( $project_id ) ? true : false;
        $co_worker = isset( $posted['project_coworker'] ) ? $posted['project_coworker'] : '';

        $data = array(
            'post_title' => $posted['project_name'],
            'post_content' => $posted['project_description'],
            'post_type' => 'project',
            'post_status' => 'publish'
        );

        if ( $is_update ) {
            $data['ID'] = $project_id;
            $project_id = wp_update_post( $data );
        } else {
            $project_id = wp_insert_post( $data );
        }

        if ( $project_id ) {
            update_post_meta( $project_id, '_coworker', $co_worker );

            if ( $is_update ) {
                do_action( 'cpm_project_update', $project_id, $data );
            } else {
                do_action( 'cpm_project_new', $project_id, $data );
            }
        }

        return $project_id;
    }

    function update( $project_id ) {
        return $this->create( $project_id );
    }

    function get_projects( $count = -1 ) {
        $projects = get_posts( array(
            'numberposts' => $count,
            'post_type' => 'project'
        ));

        foreach ($projects as &$project) {
            $project->info = $this->get_info( $project->ID );
        }

        return $projects;
    }

    /**
     * Get details of the project
     *
     * @param int $project_id
     * @return object
     */
    function get( $project_id ) {
        $project = get_post( $project_id );
        $project->info = $this->get_info( $project_id );
        $project->users = get_post_meta( $project_id, '_coworker', true );

        return $project;
    }

    function get_info( $project_id ) {
        global $wpdb;

        $ret = wp_cache_get( 'cpm_project_info_' . $project_id );

        if ( false === $ret ) {
            //get discussions
            $sql = "SELECT ID, comment_count FROM $wpdb->posts WHERE `post_type` = '%s' AND `post_status` = 'publish' AND `post_parent` IN (%s);";

            $discussions = $wpdb->get_results( sprintf( $sql, 'message', $project_id ) );
            $todolists = $wpdb->get_results( sprintf( $sql, 'task_list', $project_id ) );
            $todos = $todolists ? $wpdb->get_results( sprintf( $sql, 'task', implode(', ', wp_list_pluck( $todolists, 'ID') ) ) ) : array();

            $discussion_comment = wp_list_pluck( $discussions, 'comment_count' );
            $todolist_comment = wp_list_pluck( $todolists, 'comment_count' );
            $todo_comment = $todolists ? wp_list_pluck( $todos, 'comment_count' ) : array();

            $total_comment = array_sum( $discussion_comment ) + array_sum( $todolist_comment ) + array_sum( $todo_comment );

            $ret = new stdClass();
            $ret->discussion = count( $discussions );
            $ret->todolist = count( $todolists );
            $ret->todos = count( $todos );
            $ret->comments = $total_comment;

            wp_cache_set( 'cpm_project_info_' . $project_id, $ret );
        }

        return $ret;
    }

    /**
     * Get all the users of this project
     *
     * @param int $project_id
     * @param bool $exclude_client
     * @return array user emails with id as index
     */
    function get_users( $project_id ) {

        $project = $this->get( $project_id );

        $mail = array();
        $user_ids = array( $project->post_author );
        $co_worker = get_post_meta( $project_id, '_coworker', true );

        //if any co-workers found, add them
        if ( $co_worker != '' ) {
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
            sprintf( '%s?page=cpm_projects&tab=project&action=single&pid=%d', $base, $project_id ) => __( 'Details', 'cpm' ),
            sprintf( '%s?page=cpm_projects&tab=message&action=index&pid=%d', $base, $project_id ) => __( 'Messages', 'cpm' ),
            sprintf( '%s?page=cpm_projects&tab=task&action=index&pid=%d', $base, $project_id ) => __( 'Task List', 'cpm' ),
            sprintf( '%s?page=cpm_projects&tab=milestone&action=index&pid=%d', $base, $project_id ) => __( 'Milestones', 'cpm' ),
            sprintf( '%s?page=cpm_projects&tab=files&action=index&pid=%d', $base, $project_id ) => __( 'Files', 'cpm' ),
        );

        return apply_filters( 'cpm_project_nav_links', $links );
    }

    function nav_menu( $project_id, $active = '' ) {
        $links = $this->nav_links( $project_id );

        $menu = array();
        foreach ($links as $url => $label) {
            if ( $active == $label ) {
                $menu[] = sprintf( '<a href="%1$s" class="nav-tab nav-tab-active" title="%2$s">%2$s</a>', $url, $label );
            } else {
                $menu[] = sprintf( '<a href="%1$s" class="nav-tab" title="%2$s">%2$s</a>', $url, $label );
            }
        }

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
            $user_id = get_current_user_id();

            //exclude the current user from array
            if ( array_key_exists( $user_id, $users ) ) {
                unset( $users[$user_id] );
            }

            //if any users left, get their mail addresses and send mail
            if ( $users ) {
                $users = wp_list_pluck( $users, 'email' ); //get only the email fields

                $site_name = wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );
                $subject = sprintf( __( 'New Project invitation on %s', 'cpm' ), $site_name );
                $body = sprintf( __( 'You are assigned in a new project "%s" on %s', 'cpm' ), trim( $_POST['project_name'] ), $site_name ) . "\r\n";
                $body .= sprintf( __( 'You can see the project by going here: %s', 'cpm' ), cpm_url_project_details( $project_id ) ) . "\r\n";

                $wp_email = 'no-reply@' . preg_replace( '#^www\.#', '', strtolower( $_SERVER['SERVER_NAME'] ) );
                $from = "From: \"$blogname\" <$wp_email>";
                $message_headers = "$from\nContent-Type: text/plain; charset=\"" . get_option( 'blog_charset' ) . "\"\n";

                wp_mail( $users, $subject, $body, $message_headers );
            }
        }
    }

}
