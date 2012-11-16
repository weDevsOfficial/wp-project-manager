<?php

/**
 * Description of message
 *
 * @author weDevs
 */
class CPM_Message {

    private static $_instance;

    public function __construct() {
        add_filter( 'init', array($this, 'register_post_type') );
    }

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new CPM_Message();
        }

        return self::$_instance;
    }

    function register_post_type() {
        register_post_type( 'message', array(
            'label' => __( 'Messages', 'cpm' ),
            'description' => __( 'message post type', 'cpm' ),
            'public' => false,
            'show_ui' => false,
            'show_in_menu' => true,
            'capability_type' => 'post',
            'hierarchical' => false,
            'rewrite' => array('slug' => ''),
            'query_var' => true,
            'supports' => array('title', 'editor', 'comments'),
            'labels' => array(
                'name' => __( 'Messages', 'cpm' ),
                'singular_name' => __( 'Message', 'cpm' ),
                'menu_name' => __( 'Message', 'cpm' ),
                'add_new' => __( 'Add Message', 'cpm' ),
                'add_new_item' => __( 'Add New Message', 'cpm' ),
                'edit' => __( 'Edit', 'cpm' ),
                'edit_item' => __( 'Edit Message', 'cpm' ),
                'new_item' => __( 'New Message', 'cpm' ),
                'view' => __( 'View Message', 'cpm' ),
                'view_item' => __( 'View Message', 'cpm' ),
                'search_items' => __( 'Search Messages', 'cpm' ),
                'not_found' => __( 'No Messages Found', 'cpm' ),
                'not_found_in_trash' => __( 'No Messages Found in Trash', 'cpm' ),
                'parent' => __( 'Parent Message', 'cpm' ),
            ),
        ) );
    }

    function get_all( $project_id, $count = -1 ) {
        $messages = get_posts( array(
            'numberposts' => $count,
            'post_type' => 'message',
            'post_parent' => $project_id
        ));

        return $messages;
    }

    function get( $message_id ) {
        $message = get_post( $message_id );
        $message->milestone = get_post_meta( $message_id, '_milestone', true );
        $message->files = CPM_Comment::getInstance()->get_attachments( $message_id );

        return $message;
    }

    function create( $project_id, $files = array(), $message_id = 0 ) {
        $post = $_POST;
        $is_update = $message_id ? true : false;

        $postarr = array(
            'post_parent' => $project_id,
            'post_title' => $post['message_title'],
            'post_content' => $post['message_detail'],
            'post_type' => 'message',
            'post_status' => 'publish'
        );

        if( $is_update ) {
            $postarr['ID'] = $message_id;
            $message_id = wp_update_post( $postarr );
        } else {
            $message_id = wp_insert_post( $postarr );
        }

        if ( $message_id ) {
            $milestone_id = (int) $post['milestone'];

            update_post_meta( $message_id, '_milestone', $milestone_id );

            //if there is any file, update the object reference
            if ( count( $files ) > 0 ) {
                update_post_meta( $message_id, '_files', $files );
                
                $comment_obj = CPM_Comment::getInstance();
                $comment_obj->associate_file( $files, $message_id, $project_id, 'message' );
            }

            if ( $is_update ) {
                do_action( 'cpm_message_update', $message_id, $postarr );
            } else {
                do_action( 'cpm_message_new', $message_id, $postarr );
            }
        }

        return $message_id;
    }

    function update( $project_id, $files = array(), $message_id ) {
        return $this->create( $project_id, $files, $message_id );
    }

    function delete( $message_id, $force = false ) {
        wp_delete_post( $message_id, $force );
    }

    function get_comments( $message_id, $sort = 'ASC' ) {
        $comments = CPM_Comment::getInstance()->get_comments( $message_id, $sort );

        return $comments;
    }

    function get_by_milestone( $milestone_id ) {
        $args = array(
            'post_type' => 'message',
            'meta_key' => '_milestone',
            'meta_value' => $milestone_id
        );

        $messages = get_posts( $args );

        return $messages;
    }

}
