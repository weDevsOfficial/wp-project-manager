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
        if ( ! self::$_instance ) {
            self::$_instance = new CPM_Comment();
        }

        return self::$_instance;
    }

    /**
     * Insert a new comment
     *
     * @param array $commentdata
     * @param array $files
     * @return int
     */
    function create( $commentdata, $files = array() ) {
        $user = apply_filters( 'cpm_comment_user', wp_get_current_user() );

        $commentdata['comment_author_IP']    = preg_replace( '/[^0-9a-fA-F:., ]/', '', $_SERVER['REMOTE_ADDR'] );
        $commentdata['comment_agent']        = substr( $_SERVER['HTTP_USER_AGENT'], 0, 254 );
        $commentdata['comment_author']       = $user->display_name;
        $commentdata['comment_author_email'] = $user->user_email;

        $comment_id = wp_insert_comment( $commentdata );

        if ( $comment_id ) {
            add_comment_meta( $comment_id, '_files', $files );
            $this->associate_file( $files, $commentdata['comment_post_ID'], $_POST['project_id'] );
        }

        do_action( 'cpm_comment_new', $comment_id, $_POST['project_id'], $commentdata );

        return $comment_id;
    }

    /**
     * Update a comment
     *
     * @param array $data
     * @param int $comment_id
     */
    function update( $data, $comment_id ) {
        wp_update_comment( array(
            'comment_ID'      => $comment_id,
            'comment_content' => $data['text']
        ) );
        $parent_id = isset( $_POST['parent_id'] ) ? intval( $_POST['parent_id'] ) : 0;
        if ( isset( $_POST['cpm_attachment'] ) ) {
            update_comment_meta( $comment_id, '_files', $_POST['cpm_attachment'] );
            $this->associate_file( $_POST['cpm_attachment'], $parent_id, $_POST['project_id'] );
        }
        $data['comment_post_ID'] =  $parent_id ; 
        do_action( 'cpm_comment_update', $comment_id, $_POST['project_id'], $data );
    }

    /**
     * Delete a comment
     *
     * @param int $comment_id
     * @param bool $force_delete
     */
    function delete( $comment_id, $force_delete = false ) {
        do_action( 'cpm_comment_delete', $comment_id, $force_delete );

        //delete any file attached to it
        $files = get_comment_meta( $comment_id, '_files', true );

        if ( ! empty( $files ) && is_array( $files ) ) {
            foreach ( $files as $file_id ) {
                $this->delete_file( $file_id );
            }
        }

        //now delete the comment
        wp_delete_comment( $comment_id, $force_delete );
    }

    /**
     * Get a single comment
     *
     * @param int $comment_id
     * @return object
     */
    function get( $comment_id ) {
        
        $comment  = get_comment( $comment_id );
        
        $this->get_comment_meta( $comment_id, $comment );
        
        return $comment;
    }

    /**
     * Get comment meta
     * 
     * @param  int $comment_id 
     * @param  object &$comment   
     *
     * @since  2.0.0 
     * 
     * @return object             
     */
    function get_comment_meta( $comment_id, &$comment ) {
        $files_meta = get_comment_meta( $comment_id, '_files', true );
        $files = array();
        
        if ( $files_meta != '' ) {
            foreach ( $files_meta as $index => $attachment_id ) {
                $temp = $this->get_file( $attachment_id );

                if ( $temp ) {
                    $files[] = $temp;
                } else {
                    //delete the file from meta. may be it's deleted
                    unset( $files_meta[$index] );
                    update_comment_meta( $comment_id, '_files', $files_meta );
                }
            }
        }

        $comment->files        = $files;
        $comment->avatar       = get_avatar($comment->comment_author_email, 96, 'mm') ;
        $comment->comment_user = cpm_url_user( $comment->comment_author_email ); 
        $comment->edit_mode    = false;
    }

    /**
     * Get all comments for a post type
     *
     * @param int $post_id
     * @param string $order
     * @return object
     */
    function get_comments( $post_id, $order = 'ASC' ) {
        $comments = get_comments( array( 'post_id' => $post_id, 'order' => $order ) );

        //prepare comment attachments
        if ( $comments ) {
            foreach ( $comments as $key => $comment ) {
                $this->get_comment_meta( $comment->comment_ID, $comments[$key] );
            }
        }

        return $comments;
    }

    /**
     * Upload a file and insert as attachment
     *
     * @param int $post_id
     * @return int|bool
     */
    function upload_file( $post_id = 0 ) {
        if ( $_FILES['cpm_attachment']['error'] > 0 ) {
            return false;
        }

        $upload = array(
            'name'     => $_FILES['cpm_attachment']['name'],
            'type'     => $_FILES['cpm_attachment']['type'],
            'tmp_name' => $_FILES['cpm_attachment']['tmp_name'],
            'error'    => $_FILES['cpm_attachment']['error'],
            'size'     => $_FILES['cpm_attachment']['size']
        );

        $uploaded_file = wp_handle_upload( $upload, array( 'test_form' => false ) );

        if ( isset( $uploaded_file['file'] ) ) {
            $file_loc  = $uploaded_file['file'];
            $file_name = basename( $_FILES['cpm_attachment']['name'] );
            $file_type = wp_check_filetype( $file_name );

            $attachment = array(
                'post_mime_type' => $file_type['type'],
                'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $file_name ) ),
                'post_content'   => '',
                'post_status'    => 'inherit'
            );

            $attach_id   = wp_insert_attachment( $attachment, $file_loc );
            $attach_data = wp_generate_attachment_metadata( $attach_id, $file_loc );
            wp_update_attachment_metadata( $attach_id, $attach_data );

            do_action( 'cpm_after_upload_file', $attach_id, $attach_data, $post_id );
            return array( 'success' => true, 'file_id' => $attach_id );
        }

        return array( 'success' => false, 'error' => $uploaded_file['error'] );
    }

    /**
     * Get an attachment file
     *
     * @param int $attachment_id
     * @return array
     */
    function get_file( $attachment_id ) {
        $file = get_post( $attachment_id );

        if ( $file ) {
            $response = array(
                'id'   => $attachment_id,
                'name' => get_the_title( $attachment_id ),
                'url'  => wp_get_attachment_url( $attachment_id ),
            );

            if ( wp_attachment_is_image( $attachment_id ) ) {

                $thumb             = wp_get_attachment_image_src( $attachment_id, 'thumbnail' );
                $response['thumb'] = $thumb[0];
                $response['type']  = 'image';
            } else {
                $response['thumb'] = wp_mime_type_icon( $file->post_mime_type );
                $response['type']  = 'file';
            }

            return $response;
        }

        return false;
    }

    /**
     * Associate an attachment with a project
     *
     * Will be easier to find attachments by project
     *
     * @param array $files attachment file ID's
     * @param int $parent_id parent post id
     * @param int $project_id
     */
    function associate_file( $files, $parent_id, $project_id ) {

        foreach ( $files as $file_id ) {
            wp_update_post( array(
                'ID'          => $file_id,
                'post_parent' => $parent_id
            ) );

            update_post_meta( $file_id, '_project', $project_id );
        }
    }

    function delete_file( $file_id, $force = true ) {
        wp_delete_attachment( $file_id, $force );
        do_action( 'cpm_delete_attachment', $file_id, $force );
    }

}

/**
 * Chnage File icon
 * @param type $icon
 * @param type $mime
 * @param type $post_id
 * @return type
 */
function cc_mime_types( $mimes ) {
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}

add_filter( 'upload_mimes', 'cc_mime_types' );

function change_mime_icon( $icon, $mime = null, $post_id = null ) {
    $folder = plugins_url( '../assets/images/icons/', __FILE__ );
    ;
    $icon   = str_replace( get_bloginfo( 'wpurl' ) . '/wp-includes/images/media/', $folder, $icon );
    return $icon;
}

add_filter( 'wp_mime_type_icon', 'change_mime_icon' );
