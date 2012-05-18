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
        $this->_comment_obj = new CPM_Comment();
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

    function create( $data ) {

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

    function upload_file() {
        return $this->_comment_obj->upload_file();
    }

    function increase_comment_count( $message_id ) {
        //$this->_db->update( CPM_MESSAGE_TABLE, array('reply_count' => +1), array('id' => $message_id) );
        $sql = "UPDATE " . CPM_MESSAGE_TABLE . " SET `reply_count` = `reply_count`+1 WHERE `id` = %d";
        $this->_db->query( $this->_db->prepare( $sql, $message_id ) );
    }

}
