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
        add_filter( 'manage_project-manager_page_cpm_messages_columns', array($this, 'manage_message_columns') );
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
            'supports' => array('title', 'editor'),
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
            'date' => __( 'Date' )
        );

        return $columns;
    }

    function get_all( $project_id ) {

    }

    function get( $message_id ) {
        return get_post( $message_id );
    }

    function insert( $data ) {
        $data['created'] = current_time( 'mysql' );
        $data['author'] = get_current_user_id();

        $result = $this->_db->insert( CPM_MESSAGE_TABLE, $data );

        return $this->_db->insert_id;
    }

    function create( $project_id, $files ) {
        $post = $_POST;

        $data = array(
            'project_id' => $project_id,
            'milestone_id' => (int) $post['milestone'],
            'title' => $post['message_title'],
            'privacy' => (int) $post['message_privacy'],
            'message' => $post['message_detail']
        );

        $message_id = $this->insert( $data );

        if ( $message_id ) {

            //if there is any file, update the object reference
            if ( count( $files ) > 0 ) {
                $comment_obj = CPM_Comment::getInstance();

                foreach ($files as $file_id) {
                    $comment_obj->associate_file( $file_id, $message_id, $project_id, 'MESSAGE' );
                }
            }
        }

        do_action( 'cpm_new_message', $message_id, $data );

        return $message_id;
    }

    function update( $data ) {

    }

    function delete( $message_id ) {

    }

    function get_comments( $message_id, $sort = 'ASC' ) {
        $comemnts = $this->_comment_obj->get_comments( $message_id, 'MESSAGE', $sort );

        return $comemnts;
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
