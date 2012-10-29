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

    function create( $commentdata, $privacy, $files = array() ) {
        $user = wp_get_current_user();

        $commentdata['comment_author_IP'] = preg_replace( '/[^0-9a-fA-F:., ]/', '', $_SERVER['REMOTE_ADDR'] );
        $commentdata['comment_agent'] = substr( $_SERVER['HTTP_USER_AGENT'], 0, 254 );
        $commentdata['comment_author'] = $user->display_name;
        $commentdata['comment_author_email'] = $user->user_email;
        $commentdata['comment_type'] = 'project';

        $comment_id = wp_insert_comment( $commentdata );

        if ( $comment_id ) {
            add_comment_meta( $comment_id, 'privacy', $privacy );

            //if there is any file, update the object reference
            if ( count( $files ) > 0 ) {
                foreach ($files as $file_id) {
                    $this->associate_file( $file_id, $comment_id, $project_id, 'COMMENT' );
                }
            }
        }

        do_action( 'cpm_new_comment', $comment_id, $commentdata );

        return $comment_id;
    }

    function update( $data, $comment_id ) {
        $this->_db->update( CPM_COMMENT_TABLE, $data, array('id' => $comment_id) );
    }

    function delete( $comment_id ) {

    }

    function get( $comment_id ) {
        return get_comment( $comment_id );
    }

    function get_comments( $object_id ) {
        $comments = get_comments( array('post_id' => $object_id) );

        return $comments;
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
            $file_loc = $uploaded_file['file'];
            $file_name = basename( $_FILES['cpm_attachment']['name'] );
            $file_type = wp_check_filetype( $file_name );

            $attachment = array(
                'post_mime_type' => $file_type['type'],
                'post_title' => preg_replace( '/\.[^.]+$/', '', basename( $file_name ) ),
                'post_content' => '',
                'post_status' => 'inherit'
            );

            $attach_id = wp_insert_attachment( $attachment, $file_loc );
            $attach_data = wp_generate_attachment_metadata( $attach_id, $file_loc );
            wp_update_attachment_metadata( $attach_id, $attach_data );

            return $attach_id;
        }

        return false;
    }

    /**
     * Get an attachment file
     *
     * @param int $attachment_id
     * @return array
     */
    function get_file( $attachment_id ) {
        $file = get_attached_file( $attachment_id );
        $f = wp_get_attachment_image( $attachment_id );
        $p = wp_get_attachment_metadata( $attachment_id );

        if ( wp_attachment_is_image( $attachment_id ) ) {

            $thumb = wp_get_attachment_image_src( $attachment_id, 'thumbnail' );

            $response = array(
                'id' => $attachment_id,
                'type' => 'image',
                'url' => wp_get_attachment_url( $attachment_id ),
                'thumb' => $thumb[0]
            );
        } else {
            $response = array(
                'id' => $attachment_id,
                'type' => 'file',
                'url' => wp_get_attachment_url( $attachment_id )
            );
        }

        return $response;
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
