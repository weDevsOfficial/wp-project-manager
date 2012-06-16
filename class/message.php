<?php

/**
 * Description of message
 *
 * @author weDevs
 */
class CPM_Message {

    /**
     * $wpdb comment object
     *
     * @var object
     */
    private $_db;

    /**
     * CPM Comment class
     *
     * @var object
     */
    private $_comment_obj;
    private static $_instance;

    public function __construct() {
        global $wpdb;

        $this->_db = $wpdb;
        $this->_comment_obj = CPM_Comment::getInstance();
    }

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new CPM_Message();
        }

        return self::$_instance;
    }

    function get_all( $project_id ) {

    }

    function get( $message_id ) {
        $sql = $this->_db->prepare( "SELECT * FROM " . CPM_MESSAGE_TABLE . " WHERE id=%d AND status = 1", $message_id );

        return $this->_db->get_row( $sql );
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
                    $comment_obj->associate_file( $file_id, $message_id, 'MESSAGE' );
                }
            }
        }

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
