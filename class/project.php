<?php

/**
 * Description of project
 *
 * @author Tareq Hasan (http://tareq.weDevs.com)
 */
class CPM_Project {

    private static $_instance;

    public function __construct() {
        add_filter( 'init', array( $this, 'register_post_type' ) );
        add_filter( 'manage_edit-project_category_columns', array( $this, 'manage_edit_project_category_columns' ) );

        add_filter( 'parent_file', array( $this, 'fix_category_menu' ) );
    }

    public static function getInstance() {
        if ( ! self::$_instance ) {
            self::$_instance = new CPM_Project();
        }

        return self::$_instance;
    }

    function register_post_type() {

        $args_post_type = array (
            'label'               => __( 'Project', 'cpm' ),
            'description'         => __( 'project manager post type', 'cpm' ),
            'public'              => false,
            'show_in_admin_bar'   => false,
            'exclude_from_search' => true,
            'publicly_queryable'  => false,
            'show_in_admin_bar'   => false,
            'show_ui'             => false,
            'show_in_menu'        => false,
            'capability_type'     => 'post',
            'hierarchical'        => false,
            'rewrite'             => array( 'slug' => '' ),
            'query_var'           => true,
            'supports'            => array( 'title', 'editor', 'comments' ),
            'show_in_json'        => true,
            'labels'              => array(
                'name'               => __( 'Project', 'cpm' ),
                'singular_name'      => __( 'Project', 'cpm' ),
                'menu_name'          => __( 'Project', 'cpm' ),
                'add_new'            => __( 'Add Project', 'cpm' ),
                'add_new_item'       => __( 'Add New Project', 'cpm' ),
                'edit'               => __( 'Edit', 'cpm' ),
                'edit_item'          => __( 'Edit Project', 'cpm' ),
                'new_item'           => __( 'New Project', 'cpm' ),
                'view'               => __( 'View Project', 'cpm' ),
                'view_item'          => __( 'View Project', 'cpm' ),
                'search_items'       => __( 'Search Project', 'cpm' ),
                'not_found'          => __( 'No projects found.', 'cpm' ),
                'not_found_in_trash' => __( 'No projects found in Trash.', 'cpm' ),
                'parent'             => __( 'Parent Project', 'cpm' ),
            ),
        );

        $args_post_type = apply_filters( 'cpm_register_project_post_type', $args_post_type );

        register_post_type( 'cpm_project', $args_post_type );

        $args = array (
            'hierarchical' => true,
            'labels'       => array(
                'name'              => _x( 'Project Categories', 'taxonomy general name' ),
                'singular_name'     => _x( 'Location', 'taxonomy singular name' ),
                'search_items'      => __( 'Search Project Categories', 'cpm' ),
                'all_items'         => __( 'All Project Categories', 'cpm' ),
                'parent_item'       => __( 'Parent Project Category', 'cpm' ),
                'parent_item_colon' => __( 'Parent Project Category:', 'cpm' ),
                'edit_item'         => __( 'Edit Project Category', 'cpm' ),
                'update_item'       => __( 'Update Project Category', 'cpm' ),
                'add_new_item'      => __( 'Add New Project Category', 'cpm' ),
                'new_item_name'     => __( 'New Project Category Name', 'cpm' ),
                'menu_name'         => __( 'Categories', 'cpm' ),
            ),
            'rewrite'      => array(
                'slug'         => 'cpm-project-category',
                'with_front'   => false,
                'hierarchical' => true
            ),
        );

        $args = apply_filters( 'cpm_register_taxonomy', $args );

        register_taxonomy( 'cpm_project_category', 'cpm_project', $args );

    }

    /**
     * highlight the proper top level menu
     *
     * @link http://wordpress.org/support/topic/moving-taxonomy-ui-to-another-main-menu?replies=5#post-2432769
     * @global obj $current_screen
     * @param string $parent_file
     * @return string
     */
    function fix_category_menu( $parent_file ) {
        global $current_screen;

        if ( $current_screen->taxonomy == 'cpm_project_category' )
            $parent_file = 'cpm_projects';

        return $parent_file;
    }

    /**
     * Create or edit a a project
     *
     * @param null|int $project_id
     * @return int
     */
    function create( $project_id = 0, $posted = array() ) {

        $is_update = ( $project_id ) ? true : false;

        $data = array(
            'post_title'   => $posted['project_name'],
            'post_content' => isset( $posted['project_description'] ) ? $posted['project_description'] : '',
            'post_type'    => 'cpm_project',
            'post_status'  => 'publish'
        );

        if ( $is_update ) {
            $data['ID'] = $project_id;
            $project_id = wp_update_post( $data );
        } else {
            $project_id = wp_insert_post( $data );
        }

        if ( $project_id ) {
            $this->insert_project_user_role( $posted, $project_id );
            $project_cat = isset( $posted['project_cat'] ) ? $posted['project_cat'] : '';
            wp_set_post_terms( $project_id, $project_cat, 'cpm_project_category', false );

            if ( $is_update ) {
                do_action( 'cpm_project_update', $project_id, $data, $posted );
            } else {
                update_post_meta( $project_id, '_project_archive', 'no' );
                update_post_meta( $project_id, '_project_active', 'yes' );
                $settings = $this->settings_user_permission();
                update_post_meta( $project_id, '_settings', $settings );
                do_action( 'cpm_project_new', $project_id, $data, $posted );
            }
        }

        return $project_id;
    }

    function insert_project_user_role( $posted, $project_id ) {

        global $wpdb;
        $table          = $wpdb->prefix . 'cpm_user_role';
        $wpdb->delete( $table, array( 'project_id' => $project_id ), array( '%d' ) );
        $project_author = get_post_field( 'post_author', $project_id );
        $this->insert_user( $project_id, $project_author, 'manager' );

        $users_role = isset( $posted['role'] ) && array( $posted['role'] ) ? $posted['role'] : array();
        $users_role = apply_filters( 'cpm_assign_user_role', $users_role, $posted, $project_id );

        foreach ( $users_role as $user_id => $role ) {
            if ( $user_id == $project_author ) {
                continue;
            }
            $this->insert_user( $project_id, $user_id, $role );
        }
    }

    function update_user_role( $project_id, $user_id, $role ) {
        global $wpdb;
        $table = $wpdb->prefix . 'cpm_user_role';
        $data  = array( 'role' => $role );
        $where = array( 'project_id' => $project_id, 'user_id' => $user_id );

        $wpdb->update( $table, $data, $where );
    }

    function insert_user( $project_id, $user_id, $role ) {
        global $wpdb;
        $table  = $wpdb->prefix . 'cpm_user_role';
        $data   = array(
            'project_id' => $project_id,
            'user_id'    => $user_id,
            'role'       => $role,
        );
        $format = array( '%d', '%d', '%s' );
        $wpdb->insert( $table, $data, $format );
    }

    function settings_user_permission() {
        $labels = cpm_settings_label();
        foreach ( $labels as $section => $name ) {
            foreach ( $name as $key => $field ) {
                $settings['co_worker'][$key] = 'yes';
                $settings['client'][$key]    = 'yes';
            }
        }

        $client_permission = array(
            'msg_view_private'       => 'no',
            'tdolist_view_private'   => 'no',
            'todo_view_private'      => 'no',
            'create_milestone'       => 'no',
            'milestone_view_private' => 'no',
        );

        foreach ( $client_permission as $name => $premisson ) {
            $settings['client'][$name] = $premisson;
        }

        return $settings;
    }

    /**
     * Update a project
     *
     * @param int $project_id
     * @return int
     */
    function update( $project_id, $posted ) {

        if ( ! cpm_user_can_access( $project_id ) ) {
            return false;
        }

        return $this->create( $project_id, $posted );
    }

    /**
     * Delete a project
     *
     * @param int $project_id
     * @param bool $force
     */
    function delete( $project_id, $force = false ) {
        do_action( 'cpm_project_delete', $project_id, $force );

        global $wpdb;
        $table = $wpdb->prefix . 'cpm_user_role';
        $wpdb->delete( $table, array( 'project_id' => $project_id ), array( '%d' ) );

        $delete = wp_delete_post( $project_id, $force );

        if ( $delete ) {
            return true;
        }
    }

    function get_all_project( $count = -1 , $order_by = array() )
    {
        $pagenum          = isset( $_GET['pagenum'] ) ? absint( $_GET['pagenum'] ) : 1;
        $limit            = -1;
        $offset           = ( $pagenum - 1 ) * $limit;
        $filters          = $_GET;
        $project_category = isset( $filters['project_cat'] ) ? $filters['project_cat'] : 0;

        $args = array(
            'post_type'      => 'cpm_project',
            'posts_per_page' => $limit,
            'offset'         => $offset
        );
        if(!  empty( $order_by ) ){
            $args['orderby'] = $order_by[0] ;
            $args['order'] = $order_by[1] ;
        }

        //Add Filtering
        if ( $project_category != 0 && $project_category != '-1' ) {
            $args['tax_query'][] = array(
                'taxonomy' => 'cpm_project_category',
                'field'    => 'term_id',
                'terms'    => array( $project_category ),
                'operator' => 'IN',
            );
        }

        if ( isset( $_GET['page'] ) && $_GET['page'] == 'cpm_projects' && isset( $_GET['status'] ) ) {
            if ( $_GET['status'] == 'archive' ) {

                $args['meta_query'] = array(
                    array(
                        'key'     => '_project_active',
                        'value'   => 'no',
                        'compare' => '='
                    ),
                );
            } else if ( $_GET['status'] == 'active' ) {
                $args['meta_query'] = array(
                    array(
                        'key'     => '_project_active',
                        'value'   => 'yes',
                        'compare' => '='
                    ),
                );
            } else if ( $_GET['status'] == 'all' ) {
                $args['meta_query'] = '';
            }
        } else {
            $args['meta_query'] = array(
                array(
                    'key'     => '_project_active',
                    'value'   => 'yes',
                    'compare' => '='
                ),
            );
        }

        if ( cpm_can_manage_projects() === false ) {
            add_filter( 'posts_join', array( $this, 'jonin_user_role_table' ) );
            add_filter( 'posts_where', array( $this, 'get_project_where_user_role' ), 10, 2 );
        }

        $args = apply_filters( 'cpm_get_projects_argument', $args );

        $projects       = new WP_Query( $args );
        $total_projects = $projects->found_posts;
        $projects       = $projects->posts;

        if ( cpm_can_manage_projects() === false ) {
            remove_filter( 'posts_join', array( $this, 'jonin_user_role_table' ) );
            remove_filter( 'posts_where', array( $this, 'get_project_where_user_role' ), 10, 2 );
        }

        foreach ( $projects as &$project ) {
            $project->info  = $this->get_info( $project->ID );
            $project->users = $this->get_users( $project );
        }
        $projects['total_projects'] = $total_projects;
        return $projects;
    }

   /**
    * Get all the projects
    * @param int $count
    * @param array $order_by // $array('orderby', 'order')
    * @return object
    */
    function get_projects( $count = -1 , $order_by = array() ) {
        $pagenum          = isset( $_GET['pagenum'] ) ? absint( $_GET['pagenum'] ) : 1;
        $limit            = ( $count == '-1' ) ? intval( cpm_get_option( 'pagination', 'cpm_general' ) ) : $count;
        $offset           = ( $pagenum - 1 ) * $limit;
        $filters          = $_GET;
        $project_category = isset( $filters['project_cat'] ) ? $filters['project_cat'] : 0;

        $args = array(
            'post_type'      => 'cpm_project',
            'posts_per_page' => $limit,
            'offset'         => $offset
        );
        if(!  empty( $order_by ) ){
            $args['orderby'] = $order_by[0] ;
            $args['order'] = $order_by[1] ;
        }

        //Add Filtering
        if ( $project_category != 0 && $project_category != '-1' ) {
            $args['tax_query'][] = array(
                'taxonomy' => 'cpm_project_category',
                'field'    => 'term_id',
                'terms'    => array( $project_category ),
                'operator' => 'IN',
            );
        }

        if ( isset( $_GET['page'] ) && $_GET['page'] == 'cpm_projects' && isset( $_GET['status'] ) ) {
            if ( $_GET['status'] == 'archive' ) {

                $args['meta_query'] = array(
                    array(
                        'key'     => '_project_active',
                        'value'   => 'no',
                        'compare' => '='
                    ),
                );
            } else if ( $_GET['status'] == 'active' ) {
                $args['meta_query'] = array(
                    array(
                        'key'     => '_project_active',
                        'value'   => 'yes',
                        'compare' => '='
                    ),
                );
            } else if ( $_GET['status'] == 'all' ) {
                $args['meta_query'] = '';
            }
        } else {
            $args['meta_query'] = array(
                array(
                    'key'     => '_project_active',
                    'value'   => 'yes',
                    'compare' => '='
                ),
            );
        }

        if ( cpm_can_manage_projects() === false ) {
            add_filter( 'posts_join', array( $this, 'jonin_user_role_table' ) );
            add_filter( 'posts_where', array( $this, 'get_project_where_user_role' ), 10, 2 );
        }

        $args = apply_filters( 'cpm_get_projects_argument', $args );

        $projects       = new WP_Query( $args );
        $total_projects = $projects->found_posts;
        $projects       = $projects->posts;

        if ( cpm_can_manage_projects() === false ) {
            remove_filter( 'posts_join', array( $this, 'jonin_user_role_table' ) );
            remove_filter( 'posts_where', array( $this, 'get_project_where_user_role' ), 10, 2 );
        }

        foreach ( $projects as &$project ) {
            $project->info  = $this->get_info( $project->ID );
            $project->users = $this->get_users( $project );
        }
        $projects['total_projects'] = $total_projects;
        return $projects;
    }

    function get_user_projects( $user_id ) {

        $args = array(
            'post_type' => 'cpm_project'
        );

        $projects       = new WP_Query( $args );
        $total_projects = $projects->found_posts;
        $projects       = $projects->posts;
        $rp             = array();

        foreach ( $projects as &$project ) {

            if ( cpm_user_can_access( $project->ID, '', $user_id ) ) {
                // $project->info = $this->get_info( $project->ID );
                // $project->users = $this->get_users( $project );
                $rp[$project->ID] = $project;
            }
        }


        return $rp;
    }

    function jonin_user_role_table( $join ) {
        global $wp_query, $wpdb;

        $table = $wpdb->prefix . 'cpm_user_role';
        $join .= "LEFT JOIN $table ON $wpdb->posts.ID = $table.project_id";

        return $join;
    }

    function get_project_where_user_role( $where, $wp_query, $user_id = 0 ) {
        global $wpdb;

        $table = $wpdb->prefix . 'cpm_user_role';

        if ( absint( $user_id ) )
            $user_id = $user_id;
        else
            $user_id = get_current_user_id();

        $project_where = " AND $table.user_id = $user_id";
        $where .= apply_filters( 'cpm_get_projects_where', $project_where, $table, $where, $wp_query, $user_id );
        return $where;
    }

    /**
     * Get details of the project
     *
     * @param int $project_id
     * @return object
     */
    function get( $project_id, $invoice_id = '' ) {
        $project = get_post( $project_id );

        if ( ! $project ) {
            return false;
        }

        $meta = get_post_meta( $invoice_id );
        if ( $meta ) {
            foreach ( $meta as $k => $v ) {
                $project->$k = maybe_unserialize( $v[0] );
            }
        }
        $project->users = $this->get_users( $project );
        $project->info  = $this->get_info( $project_id );

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
            'order'  => 'DESC',
            'offset' => 0,
            'number' => 20
        );

        $args            = wp_parse_args( $args, $defaults );
        $args['post_id'] = $project_id;

        $response = get_comments( apply_filters( 'cpm_activity_args', $args, $project_id ) );

        return $response;
    }

    /**
     * Get projects activity
     *
     * @since 1.2
     *
     * @param int $project_id
     * @param array $args
     * @return array
     */
    function get_projects_activity( $projects_id, $args = array() ) {
        if ( ! $projects_id ) {
            return false;
        }

        $defaults = array(
            'order'  => 'DESC',
            'offset' => 0,
            'number' => 20
        );

        $args             = wp_parse_args( $args, $defaults );
        $args['post__in'] = $projects_id;
        $comments         = get_comments( apply_filters( 'cpm_projects_activity_args', $args, $projects_id ) );
        return $comments;
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
            $sql       = "SELECT ID, comment_count FROM $wpdb->posts WHERE `post_type` = '%s' AND `post_status` = 'publish' AND `post_parent` IN (%s);";
            $sql_files = "SELECT COUNT(ID) FROM $wpdb->posts p INNER JOIN $wpdb->postmeta m ON (p.ID = m.post_id) WHERE p.post_type = 'attachment' AND (p.post_status = 'publish' OR p.post_status = 'inherit') AND ( (m.meta_key = '_project' AND CAST(m.meta_value AS CHAR) = '$project_id') )";

            $discussions = $wpdb->get_results( sprintf( $sql, 'cpm_message', $project_id ) );
            $todolists   = $wpdb->get_results( sprintf( $sql, 'cpm_task_list', $project_id ) );
            $milestones  = $wpdb->get_results( sprintf( $sql, 'cpm_milestone', $project_id ) );
            $todos       = $todolists ? $wpdb->get_results( sprintf( $sql, 'cpm_task', implode( ', ', wp_list_pluck( $todolists, 'ID' ) ) ) ) : array();
            $files       = $wpdb->get_var( $sql_files );

            // for promodule files

            $discussion_comment = wp_list_pluck( $discussions, 'comment_count' );
            $todolist_comment   = wp_list_pluck( $todolists, 'comment_count' );
            $todo_comment       = $todolists ? wp_list_pluck( $todos, 'comment_count' ) : array();
            $milestone          = wp_list_pluck( $milestones, 'ID' );

            $total_comment = array_sum( $discussion_comment ) + array_sum( $todolist_comment ) + array_sum( $todo_comment );

            $ret             = new stdClass();
            $ret->discussion = count( $discussions );
            $ret->todolist   = count( $todolists );
            $sticky          = get_option( 'sticky_posts' );
            if ( ! empty( $sticky ) ) {
                $sticky                    = implode( ',', $sticky );
                $sql_pin_list              = "SELECT ID FROM $wpdb->posts WHERE `post_type` = 'cpm_task_list' AND `post_status` = 'publish' AND `post_parent` = $project_id  AND ID IN( $sticky );";
                $pin_todolists             = $wpdb->get_results( $sql_pin_list );
                $ret->pin_list             = count( $pin_todolists );
                $ret->todolist_without_pin = ( $ret->todolist - $ret->pin_list );
            } else {
                $ret->pin_list = 0;
            }
            $ret->todolist_without_pin = ( $ret->todolist - $ret->pin_list );
            $ret->todos                = count( $todos );
            $ret->comments             = $total_comment;
            $ret->files                = ( int ) $files;
            $ret->milestone            = count( $milestone );
            $ret->total_attach_doc     = $ret->files;
            $ret->files                = apply_filters( 'cpm_project_total_files', $ret->files, $project_id );

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
        global $wpdb;

        if ( is_object( $project ) ) {
            $project_id = $project->ID;
        } else {
            $project_id = $project;
        }

        $user_list = array();
        $table     = $wpdb->prefix . 'cpm_user_role';
        $query     = "SELECT user_id, role FROM {$table} WHERE project_id = %d AND component = ''";

        $query = apply_filters( 'cpm_get_users_query', $query, $project, $table );

        $project_users = $wpdb->get_results( $wpdb->prepare( $query, $project_id ) );

        $project_users = apply_filters( 'cpm_get_users', $project_users, $project, $table );

        if ( $project_users ) {
            foreach ( $project_users as $row ) {
                $user = get_user_by( 'id', $row->user_id );
               // print_r($user) ;
                if ( ! is_wp_error( $user ) && $user ) {

                    $u = array(
                        'id'         => $user->ID,
                        'email'      => $user->user_email,
                        'name'       => $user->display_name,
                        'login_name' => $user->user_login,
                        'role'       => $row->role,
                        'avatar'     => get_avatar( $user->ID, 96, 'mm' ),
                        'avatar_url' => get_avatar_url( $user->ID, ['default' => 'mm'] ),
                        'user_url'   => cpm_url_user( $user->ID, true, 48, $user ),
                    );

                    array_push( $user_list, $u) ;
                }
            }
        }

        return $user_list;
    }

    /**
     * Generates navigational menu for a project
     *
     * @param int $project_id
     * @return array
     */
    function nav_links( $project_id ) {
        $project_info   = $this->get_info( $project_id );
        $count_comments = get_comment_count( $project_id );
        $total_activity = $count_comments['total_comments'];
        $links          = array(
            __( 'Overview', 'cpm' )    => array(
                'url'   => cpm_url_project_overview( $project_id ),
                'count' => '',
                'class' => 'overview cpm-sm-col-12'
            ),
            __( 'Activities', 'cpm' )  => array(
                'url'   => cpm_url_project_details( $project_id ),
                'count' => $total_activity,
                'class' => 'activity cpm-sm-col-12'
            ),
            __( 'Discussions', 'cpm' ) => array(
                'url'   => cpm_url_message_index( $project_id ),
                'count' => $project_info->discussion,
                'class' => 'message cpm-sm-col-12'
            ),
            __( 'Task Lists', 'cpm' ) => array(
                'url'   => cpm_url_tasklist_index( $project_id ),
                'count' => $project_info->todolist,
                'class' => 'to-do-list cpm-sm-col-12'
            ),
            __( 'Milestones', 'cpm' )  => array(
                'url'   => cpm_url_milestone_index( $project_id ),
                'count' => $project_info->milestone,
                'class' => 'milestone cpm-sm-col-12'
            ),
            __( 'Files', 'cpm' )       => array(
                'url'   => cpm_url_file_index( $project_id ),
                'count' => $project_info->files,
                'class' => 'files cpm-sm-col-12'
            )
        );

        if ( cpm_user_can_access( $project_id ) ) {
            $links[__( 'Settings', 'cpm' )] = array( 'url' => cpm_url_settings_index( $project_id ), 'count' => '', 'class' => 'settings cpm-sm-col-12' );
        }

        $links = apply_filters( 'cpm_project_nav_links', $links, $project_id );

        return $links;
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
        $menu  = array();

        foreach ( $links as $label => $url ) {
            if ( is_array( $url ) ) {
                $link  = $url['url'];
                $count = $url['count'];
                $class = $url['class'];
            } else {
                $link  = $url;
                $count = '';
                $class = 'others';
            }
            if ( $active == $label ) {

                $menu[] = sprintf( '<li> <a href="%1$s" class="%4$s active" title="%2$s">%2$s <div>%3$s</div></a></li>', $link, $label, $count, $class );
            } else {

                $menu[] = sprintf( '<li> <a href="%1$s" class="%4$s" title="%2$s">%2$s<div>%3$s</div></a></li>', $link, $label, $count, $class );
            }
        }

        return implode( "", $menu );
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
    function has_permission( $project, $user_id = 0 ) {
        global $current_user;

        if ( absint( $user_id ) ) {
            $user = get_user_by( 'ID', $user_id );
        } else {
            $user = $current_user;
        }

        if ( ! $user ) {
            return false;
        }

        //chck manage capability
        if ( cpm_can_manage_projects( $user->ID ) ) {
            return true;
        }

        $uesr_role_in_project = cpm_get_role_in_project( $project->ID, $user_id );

        //If current user has no role in this project
        if ( ! $uesr_role_in_project ) {
            return false;
        }

        return true;
    }

    function get_progress_by_tasks( $project_id ) {
        global $wpdb;

        $sql = "SELECT m.meta_value as completed FROM $wpdb->posts p
            LEFT JOIN $wpdb->postmeta m ON p.ID = m.post_id
            WHERE post_parent IN (SELECT ID FROM $wpdb->posts WHERE post_parent = $project_id AND post_status = 'publish' AND post_type = 'cpm_task_list')
            AND p.post_status = 'publish' AND p.post_type = 'cpm_task' AND m.meta_key = '_completed'
            ORDER BY m.meta_value";

        $result   = $wpdb->get_results( $sql );
        $response = array(
            'total'     => count( $result ),
            'pending'   => count( array_filter( $result, 'cpm_tasks_filter_pending' ) ),
            'completed' => count( array_filter( $result, 'cpm_tasks_filter_done' ) )
        );

        return $response;
    }

    /**
     * Modifies columns in project category table.
     */
    function manage_edit_project_category_columns( $columns ) {
        unset( $columns['posts'] );
        return $columns;
    }

    /**
     * Insert project item
     *
     * @param int $project_id
     * @param int $object_id
     * @param string $private
     * @param boolen $update
     * @param dateTime $complete_date
     * @param int $complete_status
     * @param boolen $parent
     *
     * @since 1.1
     *
     * @return type
     */
    function new_project_item( $project_id, $object_id, $private, $type, $update, $complete_date = '0000-00-00 00:00:00', $complete_status = 0, $parent = false ) {
        global $wpdb;
        $table   = $wpdb->prefix . 'cpm_project_items';
        $private = ( $private == 'yes' ) ? 1 : 0;

        $data = array(
            'project_id'      => $project_id,
            'item_type'       => $type,
            'object_id'       => $object_id,
            'private'         => $private,
            'parent'          => $parent ? $parent : $project_id,
            'complete_date'   => $complete_date,
            'complete_status' => $complete_status
        );

        $format = array( '%d', '%s', '%d', '%d', '%d', '%s', '%d' );

        $data = apply_filters( 'cpm_new_project_item_data', $data );

        do_action( 'cpm_before_update_new_project_item', $project_id, $object_id, $private, $type, $update );

        if ( $update ) {
            $where = array(
                'project_id' => $project_id,
                'object_id'  => $object_id
            );

            $wpdb->update( $table, $data, $where, $format );
        } else {
            $wpdb->insert( $table, $data, $format );
        }

        do_action( 'cpm_after_update_new_project_item', $project_id, $object_id, $private, $type, $update );
    }

    /**
     * Insert project item complete date
     *
     * @param init $object_id
     *
     * @since 1.1
     *
     * @return type
     */
    function new_project_item_complete_date( $object_id, $complete ) {
        global $wpdb;

        $table = $wpdb->prefix . 'cpm_project_items';

        $where = array(
            'object_id' => $object_id,
        );

        $data = array(
            'complete_date'   => $complete,
            'complete_status' => 1
        );

        $wpdb->update( $table, $data, $where, array( '%s', '%d' ) );
    }

    /**
     * Insert project item open
     *
     * @param init $object_id
     *
     * @since 1.1
     *
     * @return type
     */
    function new_project_item_complete_open( $object_id ) {
        global $wpdb;

        $table = $wpdb->prefix . 'cpm_project_items';

        $where = array(
            'object_id' => $object_id
        );

        $data = array(
            'complete_date'   => '0000-00-00 00:00:00',
            'complete_status' => 0
        );

        $wpdb->update( $table, $data, $where, array( '%s', '%d' ) );
    }

    /**
     * Delete project item
     *
     * @param init $object_id
     *
     * @since 1.1
     *
     * @return void
     */
    function delete_project_item( $object_id ) {
        global $wpdb;

        $table = $wpdb->prefix . 'cpm_project_items';

        $object_id = apply_filters( 'cpm_delete_project_item_data', $object_id );

        do_action( 'cpm_before_delete_new_project_item', $object_id );

        $delete = $wpdb->delete( $table, array( 'object_id' => $object_id ), array( '%d' ) );

        do_action( 'cpm_before_delete_new_project_item', $object_id );



        return $delete;
    }

    /**
     * Generate date for chart
     * @global object $wpdb
     * @param int $project_id
     * @param date $end_date
     * @param date $start_date
     * @return array
     */
    function get_chart_data( $project_id, $end_date, $start_date ) {
        global $wpdb;

        $chart_transient = 'cpm_chart_data_' . $project_id;
        $chart_date      = get_transient( $chart_transient );

        if ( $chart_date === false ) {
            $where          = $wpdb->prepare( "WHERE comment_post_ID = '%d' AND DATE(comment_date) >= '%s' AND DATE(comment_date) <= '%s'", $project_id, $start_date, $end_date );
            $sql            = "SELECT * FROM {$wpdb->comments} $where  ";
            $total_activity = $wpdb->get_results( $sql );

            $csql  = "SELECT  * FROM {$wpdb->posts}
                    WHERE DATE(post_date) >= '{$start_date}'
                    AND DATE(post_date) <= '{$end_date}'
                    AND post_parent IN (SELECT ID FROM {$wpdb->posts} WHERE post_parent = '{$project_id}' ) ";
            $todos = $wpdb->get_results( $csql );

            $response['date_list'] = array();
            $response['todos']     = array();

            foreach ( $total_activity as $activity ) {
                $date = date( 'M d', strtotime( $activity->comment_date ) );

                if ( ! isset( $response['date_list'][$date] ) ) {
                    $response['date_list'][$date] = 1;
                } else {

                    $response['date_list'][$date] += 1;
                }
            }

            foreach ( $todos as $to_do ) {
                $tdate = date( 'M d', strtotime( $to_do->post_date ) );

                if ( ! isset( $response['todos'][$tdate] ) ) {
                    $response['todos'][$tdate] = 1;
                } else {
                    $response['todos'][$tdate] += 1;
                }
            }

            $data_transient = $response;
            set_transient( $chart_transient, $data_transient, DAY_IN_SECONDS );
        } else {
            $response = $chart_date;
        }

        return $response;
    }

}
