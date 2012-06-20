<?php

/**
 * Description of comments
 *
 * @author weDevs
 */
class CPM_Comment {

    private $_db;
    private static $_instance;

    public function __construct() {
        global $wpdb;

        $this->_db = $wpdb;
    }

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new CPM_Comment();
        }

        return self::$_instance;
    }

    function create( $values, $object_id = 0, $project_id = 0, $type = '', $files = array() ) {
        $data = array(
            'object_id' => $object_id,
            'text' => $values['text'],
            'privacy' => $values['privacy'],
            'user_id' => get_current_user_id(),
            'created' => current_time( 'mysql' ),
            'type' => $type
        );

        $this->_db->insert( CPM_COMMENT_TABLE, $data );

        $comment_id = $this->_db->insert_id;

        //if there is any file, update the object reference
        if ( count( $files ) > 0 ) {
            foreach ($files as $file_id) {
                $this->associate_file( $file_id, $comment_id, $project_id, 'COMMENT' );
            }
        }

        do_action( 'cpm_new_comment', $comment_id, $data );

        return $comment_id;
    }

    function update( $data, $comment_id ) {
        $this->_db->update( CPM_COMMENT_TABLE, $data, array('id' => $comment_id) );
    }

    function delete( $comment_id ) {

    }

    function get( $comment_id ) {
        $sql = 'SELECT c.*, f.url, f.name, f.id as file_id FROM ' . CPM_COMMENT_TABLE . ' c
                LEFT JOIN ' . CPM_FILES_TABLE . ' f ON f.object_id = c.id WHERE c.id = %d AND c.status = 1';

        $sql = $this->_db->prepare( $sql, $comment_id );

        $comments = $this->_db->get_results( $sql );

        return $this->prepare_comments( $comments );
    }

    function get_comments( $object_id, $type, $sort = 'ASC' ) {
        //$sub = 'SELECT f.url, f.name FROM ' . CPM_FILES_TABLE . ' f WHERE f.id IN (c.file)';
        $sql = 'SELECT c.*, f.url, f.name, f.id as file_id FROM ' . CPM_COMMENT_TABLE . ' c
            LEFT JOIN ' . CPM_FILES_TABLE . ' f ON f.object_id = c.id
            WHERE c.object_id = %d AND c.type = "%s" AND c.status = 1
            ORDER BY c.created ' . $sort;

        $comments = $this->_db->get_results( $this->_db->prepare( $sql, $object_id, $type ) );

        return $this->prepare_comments( $comments );
    }

    /**
     * Prepare comments for to display attachments correctly
     *
     * The main query return duplicate results if the comment has multiple
     * files linked to them. This function loops through the comments and
     * make those duplicate comments to single and place those fields under
     * the comment.
     *
     * @param type $comments
     * @return type
     */
    function prepare_comments( $comments ) {
        if ( $comments ) {
            //var_dump( $comments );
            $tmp = array();
            foreach ($comments as $comment) {
                //cpm_show_comment( $comment );
                if ( isset( $tmp[$comment->id] ) ) {
                    $tmp[$comment->id]->files[] = array(
                        'url' => $comment->url,
                        'name' => $comment->name,
                        'id' => $comment->file_id
                    );
                } else {
                    $tmp[$comment->id] = $comment;
                    if ( $comment->url != null ) {
                        $tmp[$comment->id]->files[] = array(
                            'url' => $comment->url,
                            'name' => $comment->name,
                            'id' => $comment->file_id
                        );
                    } else {
                        $tmp[$comment->id]->files = array();
                    }
                }
            }

            return $tmp;
        }

        return $comments;
    }

    function upload_file( $object_id = 0, $type = 'COMMENT' ) {
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
                'object_id' => $object_id,
                'name' => $file_name,
                'path' => $uploaded_file['file'],
                'url' => $uploaded_file['url'],
                'mime' => $file_type['type'],
                'type' => $type,
                'created' => current_time( 'mysql' )
            );

            $this->_db->insert( CPM_FILES_TABLE, $data );

            return $this->_db->insert_id;
        }

        return false;
    }

    function get_file( $file_id ) {
        $sql = $this->_db->prepare( "SELECT * FROM " . CPM_FILES_TABLE . " WHERE id=%d AND status = 1", $file_id );

        return $this->_db->get_row( $sql );
    }

    function associate_file( $file_id, $object_id = 0, $project_id = 0, $type ) {
        $data = array(
            'project_id' => $project_id,
            'object_id' => $object_id,
            'type' => $type
        );

        $this->_db->update( CPM_FILES_TABLE, $data, array('id' => $file_id) );
    }

    function delete_file( $file_id, $force = false ) {

        if ( $force == false ) {
            $data = array(
                'status' => 0,
            );

            $this->_db->update( CPM_FILES_TABLE, $data, array('id' => $file_id) );
        } else {

            $file = $this->get_file( $file_id );

            if ( $file ) {
                if ( file_exists( $file->path ) ) {
                    unlink( $file->path );
                }

                $sql = 'DELETE FROM ' . CPM_FILES_TABLE . ' WHERE id = %d';
                return $this->_db->query( $this->_db->prepare( $sql, $file_id ) );
            }
        }
    }

    function get_count( $object_id, $type ) {
        $sql = 'SELECT COUNT(*) FROM ' . CPM_COMMENT_TABLE . ' WHERE object_id = %d AND type = %s AND status = 1';
        $comment_count = $this->_db->get_var( $this->_db->prepare( $sql, $object_id, $type ) );

        return $comment_count;
    }

}
