<?php

class CPM_Milestone {

    private static $_instance;

    public function __construct() {
        add_filter( 'init', array($this, 'register_post_type') );
    }

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new CPM_Milestone();
        }

        return self::$_instance;
    }

    function register_post_type() {
        register_post_type( 'milestone', array(
            'label' => __( 'Milestone', 'cpm' ),
            'description' => __( 'Milestone', 'cpm' ),
            'public' => false,
            'show_in_admin_bar' => false,
            'exclude_from_search' => true,
            'publicly_queryable' => false,
            'show_in_admin_bar' => false,
            'show_ui' => false,
            'show_in_menu' => false,
            'capability_type' => 'post',
            'hierarchical' => false,
            'rewrite' => array('slug' => 'milestone'),
            'query_var' => true,
            'supports' => array('title', 'editor'),
            'labels' => array(
                'name' => __( 'Milestone', 'cpm' ),
                'singular_name' => __( 'Milestone', 'cpm' ),
                'menu_name' => __( 'Milestone', 'cpm' ),
                'add_new' => __( 'Add Milestone', 'cpm' ),
                'add_new_item' => __( 'Add New Milestone', 'cpm' ),
                'edit' => __( 'Edit', 'cpm' ),
                'edit_item' => __( 'Edit Milestone', 'cpm' ),
                'new_item' => __( 'New Milestone', 'cpm' ),
                'view' => __( 'View Milestone', 'cpm' ),
                'view_item' => __( 'View Milestone', 'cpm' ),
                'search_items' => __( 'Search Milestone', 'cpm' ),
                'not_found' => __( 'No Milestone Found', 'cpm' ),
                'not_found_in_trash' => __( 'No Milestone Found in Trash', 'cpm' ),
                'parent' => __( 'Parent Milestone', 'cpm' ),
            ),
        ) );
    }

    function create( $project_id, $milestone_id = 0 ) {
        $posted = $_POST;
        $is_update = $milestone_id ? true : false;

        $data = array(
            'post_parent' => $project_id,
            'post_title' => $posted['milestone_name'],
            'post_content' => $posted['milestone_detail'],
            'post_type' => 'milestone',
            'post_status' => 'publish'
        );

        if ( $milestone_id ) {
            $data['ID'] = $milestone_id;
            $milestone_id = wp_update_post( $data );
        } else {
            $milestone_id = wp_insert_post( $data );
            update_post_meta( $milestone_id, '_completed', 0 ); //open initially
        }

        if ( $milestone_id ) {
            update_post_meta( $milestone_id, '_due', cpm_date2mysql( $posted['milestone_due'] ) );

            if ( $is_update ) {
                do_action( 'cpm_milestone_update', $milestone_id, $project_id, $data );
            } else {
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

        wp_delete_post( $milestone_id, $force );
    }

    function mark_complete( $milestone_id ) {
        update_post_meta( $milestone_id, '_completed', 1 );
        update_post_meta( $milestone_id, '_completed_on', current_time( 'mysql' ) );

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

        do_action( 'cpm_milestone_open', $milestone_id );
    }

    function get( $milestone_id ) {
        $milestone = get_post( $milestone_id );
        $this->set_meta( $milestone );

        return $milestone;
    }

    function set_meta( &$milestone ) {
        $milestone->due_date = get_post_meta( $milestone->ID, '_due', true );
        $milestone->completed = get_post_meta( $milestone->ID, '_completed', true );
        $milestone->completed_on = get_post_meta( $milestone->ID, '_completed_on', true );
    }

    function get_by_project( $project_id ) {
        $args = array(
            'post_type' => 'milestone',
            'post_parent' => $project_id,
            'numberposts' => -1
        );

        $milestones = get_posts( $args );
        if ( $milestones ) {
            foreach ($milestones as $key => $milestone) {
                $this->set_meta( $milestones[$key] );
            }
        }

        return $milestones;
    }

    function get_tasklists( $milestone_id ) {
        return CPM_Task::getInstance()->get_tasklist_by_milestone( $milestone_id );
    }

    function get_messages( $milestone_id ) {
        return CPM_Message::getInstance()->get_by_milestone( $milestone_id );
    }

    function get_dropdown( $project_id, $selected = 0 ) {
        $milestones = $this->get_by_project( $project_id );
        $string = '';

        if ( $milestones ) {
            foreach ($milestones as $milestone) {
                $string .= sprintf( "<option value='%d'%s>%s</option>\n", $milestone->ID, selected( $selected, $milestone->ID, false ), $milestone->post_title );
            }
        }

        return $string;
    }

}