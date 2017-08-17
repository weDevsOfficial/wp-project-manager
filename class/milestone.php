<?php

class CPM_Milestone {

    private static $_instance;

    public function __construct() {
        add_filter( 'init', array( $this, 'register_post_type' ) );
        add_action( 'cpm_admin_scripts', array ( $this, 'milestone_scripts' ) );
    }

    public static function getInstance() {
        if ( ! self::$_instance ) {
            self::$_instance = new CPM_Milestone();
        }

        return self::$_instance;
    }

    function register_post_type() {
        register_post_type( 'cpm_milestone', array(
            'label'               => __( 'Milestone', 'cpm' ),
            'description'         => __( 'Milestone', 'cpm' ),
            'public'              => false,
            'show_in_admin_bar'   => false,
            'exclude_from_search' => true,
            'publicly_queryable'  => false,
            'show_in_admin_bar'   => false,
            'show_ui'             => false,
            'show_in_menu'        => false,
            'capability_type'     => 'post',
            'hierarchical'        => false,
            'rewrite'             => array( 'slug' => 'milestone' ),
            'query_var'           => true,
            'supports'            => array( 'title', 'editor' ),
            'show_in_json'        => true,
            'labels'              => array(
                'name'               => __( 'Milestone', 'cpm' ),
                'singular_name'      => __( 'Milestone', 'cpm' ),
                'menu_name'          => __( 'Milestone', 'cpm' ),
                'add_new'            => __( 'Add Milestone', 'cpm' ),
                'add_new_item'       => __( 'Add New Milestone', 'cpm' ),
                'edit'               => __( 'Edit', 'cpm' ),
                'edit_item'          => __( 'Edit Milestone', 'cpm' ),
                'new_item'           => __( 'New Milestone', 'cpm' ),
                'view'               => __( 'View Milestone', 'cpm' ),
                'view_item'          => __( 'View Milestone', 'cpm' ),
                'search_items'       => __( 'Search Milestone', 'cpm' ),
                'not_found'          => __( 'No milestones found.', 'cpm' ),
                'not_found_in_trash' => __( 'No milestones found in Trash.', 'cpm' ),
                'parent'             => __( 'Parent Milestone', 'cpm' ),
            ),
        ) );
    }

    function milestone_scripts() {
        if ( isset( $_GET[ 'tab' ] ) AND $_GET[ 'tab' ] == 'milestone' ) {
            
            $scripts = array(
                'cpm-trix-editor'
            );

            $scripts = apply_filters( 'cpm_milestone_scripts', $scripts );

            do_action( 'cpm_before_milestone_scripts' );

            foreach( $scripts as $script ) {
                do_action( 'before-'. $script );
                wp_enqueue_script( $script );
                wp_enqueue_style( $script );
                do_action( 'after-'. $script );
            }

            do_action( 'cpm_after_milestone_scripts' );
        }
    }

    function create( $project_id, $milestone_id = 0 ) {
        $posted    = $_POST;
        $is_update = $milestone_id ? true : false;

        $milestone_privacy = isset( $posted['milestone_privacy'] ) ? $posted['milestone_privacy'] : 'no';

        $data = array(
            'post_parent'  => $project_id,
            'post_title'   => $posted['milestone_name'],
            'post_content' => $posted['milestone_detail'],
            'post_type'    => 'cpm_milestone',
            'post_status'  => 'publish'
        );

        if ( $milestone_id ) {
            $data['ID']   = $milestone_id;
            $milestone_id = wp_update_post( $data );
        } else {
            $milestone_id = wp_insert_post( $data );
            update_post_meta( $milestone_id, '_completed', 0 ); //open initially
        }

        if ( $milestone_id ) {
            $posted['milestone_due'] = isset( $posted['milestone_due'] ) && ! empty( $posted['milestone_due'] ) ? cpm_date2mysql( $posted['milestone_due'] ) : current_time( 'mysql' );
            update_post_meta( $milestone_id, '_due', $posted['milestone_due'] );
            update_post_meta( $milestone_id, '_milestone_privacy', $milestone_privacy );

            if ( $is_update ) {
                CPM_Project::getInstance()->new_project_item( $project_id, $milestone_id, $milestone_privacy, 'milestone', true );

                do_action( 'cpm_milestone_update', $milestone_id, $project_id, $data );
            } else {
                CPM_Project::getInstance()->new_project_item( $project_id, $milestone_id, $milestone_privacy, 'milestone', false );

                do_action( 'cpm_milestone_new', $milestone_id, $project_id, $data );
            }
        }

        return $milestone_id;
    }

    function update( $project_id, $milestone_id ) {
        return $this->create( $project_id, $milestone_id );
    }

    function delete( $milestone_id, $force = false ) {
        do_action( 'cpm_milestone_delete', $milestone_id, $force );

        CPM_Project::getInstance()->delete_project_item( $milestone_id );

        wp_delete_post( $milestone_id, $force );
    }

    function mark_complete( $milestone_id ) {
        update_post_meta( $milestone_id, '_completed', 1 );
        update_post_meta( $milestone_id, '_completed_on', current_time( 'mysql' ) );
        CPM_Project::getInstance()->new_project_item_complete_date( $milestone_id, current_time( 'mysql' ) );
        do_action( 'cpm_milestone_complete', $milestone_id );
    }

    /**
     * Mark a task as uncomplete/open
     *
     * @param int $task_id task id
     */
    function mark_open( $milestone_id ) {
        update_post_meta( $milestone_id, '_completed', 0 );
        update_post_meta( $milestone_id, '_completed_on', current_time( 'mysql' ) );
        CPM_Project::getInstance()->new_project_item_complete_open( $milestone_id );
        do_action( 'cpm_milestone_open', $milestone_id );
    }

    function get( $milestone_id ) {
        $milestone = get_post( $milestone_id );
        $this->set_meta( $milestone );

        return $milestone;
    }

    function set_meta( &$milestone ) {
        $milestone->due_date     = get_post_meta( $milestone->ID, '_due', true );
        $milestone->completed    = get_post_meta( $milestone->ID, '_completed', true );
        $milestone->completed_on = get_post_meta( $milestone->ID, '_completed_on', true );
        $milestone->private      = get_post_meta( $milestone->ID, '_milestone_privacy', true );
    }

    function get_by_project( $project_id, $privacy = false ) {

        $key     = '_due';
        $orderby = 'ASC';
        $args    = array(
            'post_type'      => 'cpm_milestone',
            'post_parent'    => $project_id,
            'posts_per_page' => -1,
            'order'          => $orderby,
            'orderby'        => 'meta_value',
            'meta_key'       => $key
        );

        if ( $privacy === false ) {
            $args['meta_query'] = array(
                array(
                    'key'     => '_milestone_privacy',
                    'value'   => 'yes',
                    'compare' => '!='
                ),
            );
        }

        $args = apply_filters( 'cpm_get_milestone', $args );

        $milestones = new WP_Query( $args );
        if ( $milestones->posts ) {
            foreach ( $milestones->posts as $key => $milestone ) {
                $this->set_meta( $milestones->posts[$key] );
            }
        }
        return $milestones->posts;
    }

    function get_tasklists( $milestone_id, $privacy = false ) {

        return CPM_Task::getInstance()->get_tasklist_by_milestone( $milestone_id, $privacy );
    }

    function get_messages( $milestone_id, $privacy = false ) {
        return CPM_Message::getInstance()->get_by_milestone( $milestone_id, $privacy );
    }

    function get_dropdown( $project_id, $selected = 0 ) {
        $milestones = $this->get_by_project( $project_id );
        $string     = '';

        if ( $milestones ) {
            foreach ( $milestones as $milestone ) {
                $string .= sprintf( "<option value='%d'%s>%s</option>\n", $milestone->ID, selected( $selected, $milestone->ID, false ), $milestone->post_title );
            }
        }

        return $string;
    }

}
