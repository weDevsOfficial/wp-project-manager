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
        add_filter( 'manage_toplevel_page_cpm_projects_columns', array($this, 'manage_message_columns') );
        add_filter( 'get_edit_post_link', array($this, 'get_edit_post_link'), 10, 3 );
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

    function manage_message_columns( $columns ) {
        $columns = array(
            'cb' => '<input type="checkbox" />',
            'title' => _x( 'Title', 'column name' ),
            'comments' => '<span class="vers"><img alt="' . esc_attr__( 'Comments' ) . '" src="' . esc_url( admin_url( 'images/comment-grey-bubble.png' ) ) . '" /></span>',
            'date' => __( 'Date' )
        );

        return $columns;
    }

    function get_edit_post_link( $url, $post_id, $context ) {
        global $post;

        if ( $post->post_type == 'message' && $context == 'display' && is_admin() ) {
            $project_id = $_GET['pid']; //FIXME: set to message parent
            $url = admin_url( sprintf( 'admin.php?page=cpm_projects&action=message_single&pid=%d&mid=%d', $project_id, $post->ID ) );
        }

        return $url;
    }

    function get_all( $project_id ) {

    }

    function get( $message_id ) {
        return get_post( $message_id );
    }

    function create( $project_id, $files ) {
        $post = $_POST;

        $postarr = array(
            'post_parent' => $project_id,
            'post_title' => $post['message_title'],
            'post_content' => $post['message_detail'],
            'post_type' => 'message',
            'post_status' => 'publish'
        );

        $message_id = wp_insert_post( $postarr );

        if ( $message_id ) {
            $milestone_id = (int) $post['milestone'];
            $privacy = (int) $post['message_privacy'];

            update_post_meta( $message_id, '_milestone_id', $milestone_id );
            update_post_meta( $message_id, '_privacy', $privacy );

            //if there is any file, update the object reference
            if ( count( $files ) > 0 ) {
//                $comment_obj = CPM_Comment::getInstance();
//
//                foreach ($files as $file_id) {
//                    $comment_obj->associate_file( $file_id, $message_id, $project_id, 'MESSAGE' );
//                }
            }
        }

        do_action( 'cpm_new_message', $message_id, $postarr );

        return $message_id;
    }

    function update( $data ) {

    }

    function delete( $message_id ) {

    }

    function get_comments( $message_id, $sort = 'ASC' ) {
        $comments = CPM_Comment::getInstance()->get_comments( $message_id );

        return $comments;
    }

    function get_by_milestone( $milestone_id ) {
        $sql = $this->_db->prepare( "SELECT * FROM " . CPM_MESSAGE_TABLE . " WHERE milestone_id=%d AND status = 1", $milestone_id );

        return $this->_db->get_results( $sql );
    }

    function new_comment( $values, $message_id ) {

        $data = array(
            'object_id' => $message_id,
            'text' => $values['text'],
            'privacy' => $values['privacy'],
            'file' => $values['file']
        );

        $comment_id = $this->_comment_obj->create( $data, $message_id, 'MESSAGE' );

        if ( $comment_id ) {
            $this->increase_comment_count( $message_id );
        }

        return $comment_id;
    }

    function upload_file( $project_id ) {
        return $this->_comment_obj->upload_file( $project_id );
    }

    function increase_comment_count( $message_id ) {
        //$this->_db->update( CPM_MESSAGE_TABLE, array('reply_count' => +1), array('id' => $message_id) );
        $sql = "UPDATE " . CPM_MESSAGE_TABLE . " SET `reply_count` = `reply_count`+1 WHERE `id` = %d";
        $this->_db->query( $this->_db->prepare( $sql, $message_id ) );
    }

}
