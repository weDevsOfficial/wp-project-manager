<?php

/**
 * Description of comments
 *
 * @author weDevs
 */
class CPM_Comment {

    private $_db;

    public function __construct() {
        global $wpdb;

        $this->_db = $wpdb;
    }

    function create( $values, $object_id, $type ) {
        $data = array(
            'object_id' => $object_id,
            'text' => $values['text'],
            'privacy' => $values['privacy'],
            'user_id' => get_current_user_id(),
            'created' => current_time( 'mysql' ),
            'type' => $type,
            'file' => $values['file']
        );

        $this->_db->insert( CPM_COMMENT_TABLE, $data );

        return $this->_db->insert_id;
    }

    function update( $data, $object_id, $type ) {

    }

    function delete( $comment_id ) {

    }

    function get( $object_id, $type ) {

    }

    function get_comments( $object_id, $type, $sort = 'ASC' ) {
        $sql = 'SELECT * FROM ' . CPM_COMMENT_TABLE . ' c
            LEFT JOIN ' . CPM_FILES_TABLE . ' f ON c.file = f.id
            WHERE c.object_id = %d AND c.type = "%s" AND c.status = 1
            ORDER BY c.created ' . $sort;
        return $this->_db->get_results( $this->_db->prepare( $sql, $object_id, $type ) );
    }

    function upload_file() {
        if ( $_FILES['cpm_attachment']['error'] > 0 ) {
            return false;
        }

        $upload = array(
            'name' => $_FILES['cpm_attachment']['name'],
            'type' => $_FILES['cpm_attachment']['type'],
            'tmp_name' => $_FILES['cpm_attachment']['tmp_name'],
            'error' => $_FILES['cpm_attachment']['error'],
            'size' => $_FILES['cpm_attachment']['size']
        );

        $uploaded_file = wp_handle_upload( $upload, array('test_form' => false) );

        if ( isset( $uploaded_file['file'] ) ) {
            $file_name = basename( $_FILES['cpm_attachment']['name'] );
            $file_type = wp_check_filetype( $file_name );

            $data = array(
                'name' => $file_name,
                'path' => $uploaded_file['file'],
                'url' => $uploaded_file['url'],
                'mime' => $file_type['type'],
                'created' => current_time( 'mysql' )
            );

            $this->_db->insert( CPM_FILES_TABLE, $data );

            return $this->_db->insert_id;
        }

        return false;
    }

    function get_count( $object_id, $type ) {
        $sql = 'SELECT COUNT(*) FROM ' . CPM_COMMENT_TABLE . ' WHERE object_id = %d AND type = %s AND status = 1';
        $comment_count = $this->_db->get_var( $this->_db->prepare( $sql, $object_id, $type ) );

        return $comment_count;
    }

}
