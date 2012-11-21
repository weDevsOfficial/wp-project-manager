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

    function delete( $project_id, $force = false ) {
        do_action( 'cpm_project_delete', $project_id, $force );
        
        wp_delete_post( $project_id, $force );
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

        if ( !$project ) {
            return false;
        }

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
            $sql_files = "SELECT COUNT(ID) FROM $wpdb->posts p INNER JOIN $wpdb->postmeta m ON (p.ID = m.post_id) WHERE p.post_type = 'attachment' AND (p.post_status = 'publish' OR p.post_status = 'inherit') AND ( (m.meta_key = '_project' AND CAST(m.meta_value AS CHAR) = '$project_id') )";

            $discussions = $wpdb->get_results( sprintf( $sql, 'message', $project_id ) );
            $todolists = $wpdb->get_results( sprintf( $sql, 'task_list', $project_id ) );
            $milestones = $wpdb->get_results( sprintf( $sql, 'milestone', $project_id ) );
            $todos = $todolists ? $wpdb->get_results( sprintf( $sql, 'task', implode(', ', wp_list_pluck( $todolists, 'ID') ) ) ) : array();
            $files = $wpdb->get_var( $sql_files );

            $discussion_comment = wp_list_pluck( $discussions, 'comment_count' );
            $todolist_comment = wp_list_pluck( $todolists, 'comment_count' );
            $todo_comment = $todolists ? wp_list_pluck( $todos, 'comment_count' ) : array();
            $milestone = wp_list_pluck( $milestones, 'ID' );

            $total_comment = array_sum( $discussion_comment ) + array_sum( $todolist_comment ) + array_sum( $todo_comment );

            $ret = new stdClass();
            $ret->discussion = count( $discussions );
            $ret->todolist = count( $todolists );
            $ret->todos = count( $todos );
            $ret->comments = $total_comment;
            $ret->files = (int) $files;
            $ret->milestone = count( $milestone );

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
        $links = array(
            cpm_url_project_details( $project_id ) => __( 'Activity', 'cpm' ),
            cpm_url_message_index( $project_id ) => __( 'Messages', 'cpm' ),
            cpm_url_tasklist_index( $project_id ) => __( 'To-do List', 'cpm' ),
            cpm_url_milestone_index( $project_id ) => __( 'Milestones', 'cpm' ),
            cpm_url_file_index( $project_id ) => __( 'Files', 'cpm' ),
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

}
