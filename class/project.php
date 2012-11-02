<?php

/**
 * Description of project
 *
 * @author Tareq Hasan (http://tareq.weDevs.com)
 */
class CPM_Project {

    private static $_instance;
    private $custom_fields = array(
        'started', 'ends', 'client', 'budget', 'coworker', 'manager', 'status'
    );

    public function __construct() {
        add_filter( 'init', array($this, 'register_post_type') );
        add_filter( 'cpm_project_columns', array($this, 'manage_project_columns') );
        add_filter( 'cpm_project_table_views', array($this, 'table_views'), 10, 3 );
        add_filter( 'manage_project_posts_custom_column', array($this, 'manage_edit_columns'), 11, 2 );
        add_filter( 'get_edit_post_link', array($this, 'get_edit_post_link'), 10, 3 );
        add_filter( 'post_row_actions', array($this, 'post_row_actions'), 10, 2 );

        //create new project
        add_action( 'admin_init', array($this, 'submit_project'), 99 );
        add_action( 'load-toplevel_page_cpm_projects', array($this, 'set_screen_options') );

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
            $url = cpm_url_project_details( $post->ID );
        }

        return $url;
    }

    function post_row_actions( $actions, $post ) {

        if ( $post->post_type == 'project' ) {
            unset( $actions['inline hide-if-no-js'] );

            $actions['edit'] = '<a href="' . cpm_url_project_edit( $post->ID ) . '" title="' . esc_attr( __( 'Edit this project', 'cpm' ) ) . '">' . __( 'Edit', 'cpm' ) . '</a>';
            $actions['view'] = '<a href="' . cpm_url_project_details( $post->ID ) . '" title="' . esc_attr( __( 'Edit this project', 'cpm' ) ) . '">' . __( 'View Project', 'cpm' ) . '</a>';
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

    function table_views( $links, $num_posts, $statuses ) {
        $class = (!isset( $_REQUEST['post_status'] )) ? ' class="current"' : '';
        $base_url = cpm_url_projects();

        foreach ($links as $key => $link) {
            if ( $key == 'all' ) {
                $links['all'] = "<a href='$base_url'$class>" . sprintf( _nx( 'All <span class="count">(%s)</span>', 'All <span class="count">(%s)</span>', $num_posts->total, 'posts' ), number_format_i18n( $num_posts->total ) ) . '</a>';
            } else {
                if ( isset( $_REQUEST['post_status'] ) && $key == $_REQUEST['post_status'] ) {
                    $class = ' class="current"';
                } else {
                    $class = '';
                }

                $links[$key] = "<a href='$base_url&amp;post_status=$key'$class>" . sprintf( translate_nooped_plural( $statuses[$key]->label_count, $num_posts->$key ), number_format_i18n( $num_posts->$key ) ) . '</a>';
            }
        }

        return $links;
    }

    function manage_edit_columns( $column_name, $post_id ) {

        $custom_fields = get_post_custom( $post_id );

        $client = isset( $custom_fields['_client'] ) ? $custom_fields['_client'][0] : __( 'None', 'cpm' );
        $status = isset( $custom_fields['_status'] ) ? $custom_fields['_status'][0] : __( 'None', 'cpm' );
        $starts = isset( $custom_fields['_started'] ) ? $custom_fields['_started'][0] : __( 'None', 'cpm' );
        $ends = isset( $custom_fields['_ends'] ) ? $custom_fields['_ends'][0] : __( 'None', 'cpm' );
        $billing = isset( $custom_fields['_budget'] ) ? $custom_fields['_budget'][0] : __( 'None', 'cpm' );

        switch ($column_name) {
            case 'client' :
                $user = get_user_by( 'id', $client );
                $link = esc_url( add_query_arg( 'wp_http_referer', urlencode( stripslashes( $_SERVER['REQUEST_URI'] ) ), "user-edit.php?user_id=$user->ID" ) );
                printf( '<a href="%s">%s</a>', $link, $user->display_name );
                break;

            case 'status' :
                echo $status;
                break;

            case 'starts':
                echo cpm_show_date( $starts );
                break;

            case 'ends':
                echo cpm_show_date( $ends );
                break;

            case 'billing':
                echo cpm_get_currency( $billing );
                break;
        }
    }

    function set_screen_options() {
        $screen = get_current_screen();

        $screen->post_type = 'project';
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
                    'coworker' => $posted['project_coworker'],
                    'status' => $posted['project_status']
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

        //if any co-workers found, add them
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
                $body .= sprintf( __( 'You can see the project by going here: %s', 'cpm' ), cpm_project_details_url( $project_id ) ) . "\r\n";

                $wp_email = 'no-reply@' . preg_replace( '#^www\.#', '', strtolower( $_SERVER['SERVER_NAME'] ) );
                $from = "From: \"$blogname\" <$wp_email>";
                $message_headers = "$from\nContent-Type: text/plain; charset=\"" . get_option( 'blog_charset' ) . "\"\n";

                wp_mail( $users, $subject, $body, $message_headers );
            }
        }
    }

}
