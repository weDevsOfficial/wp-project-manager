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
            'public' => false,
            'show_in_admin_bar' => false,
            'exclude_from_search' => true,
            'publicly_queryable' => false,
            'show_in_admin_bar' => false,
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

    /**
     * Create or edit a a project
     *
     * @param null|int $project_id
     * @return int
     */
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

    /**
     * Update a project
     *
     * @param int $project_id
     * @return int
     */
    function update( $project_id ) {
        return $this->create( $project_id );
    }

    /**
     * Delete a project
     *
     * @param int $project_id
     * @param bool $force
     */
    function delete( $project_id, $force = false ) {
        do_action( 'cpm_project_delete', $project_id, $force );

        wp_delete_post( $project_id, $force );
    }

    /**
     * Get all the projects
     *
     * @param int $count
     * @return object
     */
    function get_projects( $count = -1 ) {
        
        $pagenum          = isset( $_GET['pagenum'] ) ? absint( $_GET['pagenum'] ) : 1;
        $limit            = 10;
        $offset           = ( $pagenum - 1 ) * $limit;
  
        $args = array(
            //'numberposts'    => $count,
            'post_type'      => 'project',
            'posts_per_page' => $limit,
            'offset'         => $offset
        );

        $query          = new WP_Query( $args );
        $total_projects = $query->found_posts;
        $projects       = $query->posts;
      
        foreach ($projects as &$project) {
            $project->info = $this->get_info( $project->ID );
            $project->users = $this->get_users( $project );
        }

        $projects['total_projects'] = $total_projects;

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

        $project->users = $this->get_users( $project );
        $project->info = $this->get_info( $project_id );

        return $project;
    }

    /**
     * Get project activity
     *
     * @since 0.3.1
     * 
     * @param int $project_id
     * @param array $args
     * @return array
     */
    function get_activity( $project_id, $args = array() ) {
        $defaults = array(
            'order' => 'DESC',
            'offset' => 0,
            'number' => 20
        );

        $args = wp_parse_args( $args, $defaults );
        $args['post_id'] = $project_id;

        return get_comments( apply_filters( 'cpm_activity_args', $args, $project_id ) );
    }

    /**
     * Get project info
     *
     * Gets all the project info such as number of discussion, todolist, todos,
     * comments, files and milestones. These info's are cached for performance
     * improvements.
     *
     * @global object $wpdb
     * @param int $project_id
     * @return stdClass
     */
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
     * Flush a project info cache
     *
     * Some number of queries runs when creating project information.
     * Clears the project information cache when a new activity happens.
     *
     * @since 0.3.1
     * @param int $project_id
     */
    function flush_cache( $project_id ) {
        wp_cache_delete( 'cpm_project_info_' . $project_id );
    }

    /**
     * Get all the users of this project
     *
     * @param int $project_id
     * @param bool $exclude_client
     * @return array user emails with id as index
     */
    function get_users( $project ) {

        if ( is_object( $project ) ) {
            $project_id = $project->ID;
        } else {
            $project_id = $project;
        }

        $mail = array();
        $user_ids = array(get_post_field( 'post_author', $project_id ));
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

    /**
     * Generates navigational menu for a project
     *
     * @param int $project_id
     * @return array
     */
    function nav_links( $project_id ) {
        $links = array(
            __( 'Activity', 'cpm' ) => cpm_url_project_details( $project_id ),
            __( 'Messages', 'cpm' ) => cpm_url_message_index( $project_id ),
            __( 'To-do List', 'cpm' ) => cpm_url_tasklist_index( $project_id ),
            __( 'Milestones', 'cpm' ) => cpm_url_milestone_index( $project_id ),
            __( 'Files', 'cpm' ) => cpm_url_file_index( $project_id )
        );

        return apply_filters( 'cpm_project_nav_links', $links, $project_id );
    }

    /**
     * Prints navigation menu for a project
     *
     * @param int $project_id
     * @param string $active
     * @return string
     */
    function nav_menu( $project_id, $active = '' ) {
        $links = $this->nav_links( $project_id );

        $menu = array();
        foreach ($links as $label => $url) {
            if ( $active == $label ) {
                $menu[] = sprintf( '<a href="%1$s" class="nav-tab nav-tab-active" title="%2$s">%2$s</a>', $url, $label );
            } else {
                $menu[] = sprintf( '<a href="%1$s" class="nav-tab" title="%2$s">%2$s</a>', $url, $label );
            }
        }

        return implode( "\n", $menu );
    }

    /**
     * Checks against admin rights
     *
     * editor and above level has admin rights by default
     *
     * @return bool
     */
    function has_admin_rights() {
        $admin_right = apply_filters( 'cpm_admin_right', 'delete_pages' );

        if ( current_user_can( $admin_right ) ) {
            return true;
        }

        return false;
    }

    /**
     * Check if a user has permission on a project
     *
     * Admins and editors can access all projects.
     *
     * @param object $project
     * @return bool
     */
    function has_permission( $project ) {
        if ( $this->has_admin_rights() ) {
            return true;
        }

        //user id found in the users array
        if ( array_key_exists( get_current_user_id(), $project->users ) ) {
            return true;
        }

        return false;
    }
    
    function get_progress_by_tasks( $project_id ) {
        global $wpdb;
        
        $sql = "SELECT m.meta_value as completed FROM $wpdb->posts p 
            LEFT JOIN $wpdb->postmeta m ON p.ID = m.post_id
            WHERE post_parent IN(
                    SELECT ID FROM $wpdb->posts WHERE post_parent = $project_id AND post_status = 'publish' AND post_type = 'task_list'
            ) AND p.post_status = 'publish' AND p.post_type = 'task' AND m.meta_key = '_completed'
            ORDER BY m.meta_value";
        
        $result = $wpdb->get_results($sql);
        $response = array(
            'total' => count($result),
            'pending' => count(array_filter( $result, 'cpm_tasks_filter_pending' )),
            'completed' => count(array_filter( $result, 'cpm_tasks_filter_done' ))
        );
        
        return $response;
    }

}
