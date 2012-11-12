<?php

/**
 * Description of ajax
 *
 * @author tareq
 */
class CPM_Ajax {

    private $_task_obj;
    private $_milestone_obj;

    public function __construct() {
        $this->_task_obj = CPM_Task::getInstance();
        $this->_milestone_obj = CPM_Milestone::getInstance();

        add_action( 'wp_ajax_cpm_task_complete', array($this, 'mark_task_complete') );
        add_action( 'wp_ajax_cpm_task_open', array($this, 'mark_task_open') );
        add_action( 'wp_ajax_cpm_task_delete', array($this, 'delete_task') );
        add_action( 'wp_ajax_cpm_task_add', array($this, 'add_new_task') );
        add_action( 'wp_ajax_cpm_task_update', array($this, 'update_task') );

        add_action( 'wp_ajax_cpm_add_list', array($this, 'add_tasklist') );
        add_action( 'wp_ajax_cpm_update_list', array($this, 'update_tasklist') );
        add_action( 'wp_ajax_cpm_tasklist_delete', array($this, 'delete_tasklist') );

        add_action( 'wp_ajax_cpm_milestone_complete', array($this, 'milestone_complete') );
        add_action( 'wp_ajax_cpm_milestone_open', array($this, 'milestone_open') );
        add_action( 'wp_ajax_cpm_delete_milestone', array($this, 'milestone_delete') );

        add_action( 'wp_ajax_cpm_ajax_upload', array($this, 'ajax_upload') );
        add_action( 'wp_ajax_cpm_delete_file', array($this, 'delete_file') );

        add_action( 'wp_ajax_cpm_comment_new', array($this, 'new_comment') );
        add_action( 'wp_ajax_cpm_comment_get', array($this, 'get_comment') );
        add_action( 'wp_ajax_cpm_comment_update', array($this, 'update_comment') );
        add_action( 'wp_ajax_cpm_comment_delete', array($this, 'delete_comment') );

        add_action( 'wp_ajax_cpm_new_message', array($this, 'new_message') );
        add_action( 'wp_ajax_cpm_get_message', array($this, 'get_message') );
    }

    function add_new_task() {
        $posted = $_POST;

        $list_id = $posted['list_id'];
        $project_id = $posted['project_id'];

        $task_obj = CPM_Task::getInstance();
        $task_id = $task_obj->add_task( $posted['list_id'] );
        $task = $task_obj->get_task( $task_id );

        if ( $task_id ) {
            $response = array(
                'success' => true,
                'id' => $task_id,
                'content' => cpm_task_html( $task, $project_id, $list_id )
            );
        } else {
            $response = array('success' => false);
        }

        echo json_encode( $response );
        exit;
    }

    function update_task() {
        $posted = $_POST;

        $list_id = $posted['list_id'];
        $project_id = $posted['project_id'];
        $task_id = $posted['task_id'];
        $single = (int) $posted['single'];

        $task_obj = CPM_Task::getInstance();
        $task_id = $task_obj->update_task( $list_id, $task_id );
        $task = $task_obj->get_task( $task_id );

        if ( $task_id ) {
            $response = array(
                'success' => true,
                'content' => cpm_task_html( $task, $project_id, $list_id, $single )
            );
        } else {
            $response = array('success' => false);
        }

        echo json_encode( $response );
        exit;
    }

    function mark_task_complete() {
        check_ajax_referer( 'cpm_nonce' );

        $posted = $_POST;
        $task_id = (int) $posted['task_id'];
        $list_id = $posted['list_id'];
        $project_id = $posted['project_id'];
        $single = (int) $posted['single'];

        $task_obj = CPM_Task::getInstance();
        $task_obj->mark_complete( $task_id );

        $task = $task_obj->get_task( $task_id );
        $response = array(
            'success' => true,
            'content' => cpm_task_html( $task, $project_id, $list_id, $single )
        );

        echo json_encode( $response );
        exit;
    }

    function mark_task_open() {
        check_ajax_referer( 'cpm_nonce' );

        $posted = $_POST;
        $task_id = (int) $posted['task_id'];
        $list_id = $posted['list_id'];
        $project_id = $posted['project_id'];
        $single = (int) $posted['single'];

        $task_obj = CPM_Task::getInstance();
        $task_obj->mark_open( $task_id );

        $task = $task_obj->get_task( $task_id );
        $response = array(
            'success' => true,
            'content' => cpm_task_html( $task, $project_id, $list_id, $single )
        );

        echo json_encode( $response );
        exit;
    }

    function delete_task() {
        check_ajax_referer( 'cpm_nonce' );

        $task_id = (int) $_POST['task_id'];
        $list_id = (int) $_POST['list_id'];
        $project_id = (int) $_POST['project_id'];

        $this->_task_obj->delete_task( $task_id );

        echo json_encode( array(
            'success' => true,
            'list_url' => cpm_url_single_tasklist( $project_id, $list_id )
        ) );

        exit;
    }

    function add_tasklist() {
        check_ajax_referer( 'cpm_add_list' );

        $posted = $_POST;
        $project_id = $posted['project_id'];

        $task_obj = CPM_Task::getInstance();
        $list_id = $task_obj->add_list( $project_id );

        if ( $list_id ) {
            $list = $task_obj->get_task_list( $list_id );

            echo json_encode( array(
                'success' => true,
                'id' => $list_id,
                'content' => cpm_task_list_html( $list, $project_id )
            ) );
        } else {
            echo json_encode( array(
                'success' => false
            ) );
        }

        exit;
    }

    function update_tasklist() {
        check_ajax_referer( 'cpm_update_list' );

        $posted = $_POST;
        $project_id = $posted['project_id'];
        $list_id = $posted['list_id'];

        $task_obj = CPM_Task::getInstance();
        $list_id = $task_obj->update_list( $project_id, $list_id );

        if ( $list_id ) {
            $list = $task_obj->get_task_list( $list_id );

            echo json_encode( array(
                'success' => true,
                'id' => $list_id,
                'content' => cpm_task_list_html( $list, $project_id )
            ) );
        } else {
            echo json_encode( array(
                'success' => false
            ) );
        }

        exit;
    }

    function delete_tasklist() {
        check_ajax_referer( 'cpm_nonce' );

        CPM_Task::getInstance()->delete_list( $_POST['list_id'] );

        echo json_encode( array(
            'success' => true
        ) );

        exit;
    }

    function milestone_delete() {
        check_ajax_referer( 'cpm_nonce' );

        $milestone_id = (int) $_POST['milestone_id'];

        $this->_milestone_obj->delete( $milestone_id );
        echo 'success';

        exit;
    }

    function milestone_complete() {
        check_ajax_referer( 'cpm_nonce' );

        $milestone_id = (int) $_POST['milestone_id'];

        $this->_milestone_obj->mark_complete( $milestone_id );
        print_r( $_POST );
        echo 'success';

        exit;
    }

    function milestone_open() {
        check_ajax_referer( 'cpm_nonce' );

        $milestone_id = (int) $_POST['milestone_id'];

        $this->_milestone_obj->mark_open( $milestone_id );
        echo 'success';

        exit;
    }

    function ajax_upload() {
        check_ajax_referer( 'cpm_ajax_upload', 'nonce' );

        $object_id = isset( $_REQUEST['object_id'] ) ? intval( $_REQUEST['object_id'] ) : 0;
        $comment_obj = CPM_Comment::getInstance();
        $response = $comment_obj->upload_file( $object_id );

        if ( $response['success'] ) {
            $file = $comment_obj->get_file( $response['file_id'] );

            $delete = sprintf( '<a href="#" data-id="%d" class="cpm-delete-file button">%s</a>', $file['id'], __( 'Delete File' ) );
            $hidden = sprintf( '<input type="hidden" name="cpm_attachment[]" value="%d" />', $file['id'] );
            $file_url = sprintf( '<a href="%1$s" target="_blank"><img src="%2$s" alt="%3$s" /></a>', $file['url'], $file['thumb'], esc_attr( $file['name'] ) );

            $html = '<div class="cpm-uploaded-item">' . $file_url . ' ' . $delete . $hidden . '</div>';
            echo json_encode( array(
                'success' => true,
                'content' => $html
            ) );

            exit;
        }

        echo json_encode( array(
            'success' => false,
            'error' => $response['error']
        ) );

        exit;
    }

    function delete_file() {
        check_ajax_referer( 'cpm_nonce' );

        $file_id = (isset( $_POST['file_id'] )) ? intval( $_POST['file_id'] ) : 0;

        $comment_obj = CPM_Comment::getInstance();
        $comment_obj->delete_file( $file_id, true );

        echo 'success';
        exit;
    }

    function new_comment() {
        check_ajax_referer( 'cpm_new_message' );

        $posted = $_POST;
        $files = array();

        $text = trim( $posted['cpm_message'] );
        $parent_id = isset( $posted['parent_id'] ) ? intval( $posted['parent_id'] ) : 0;
        $project_id = isset( $posted['project_id'] ) ? intval( $posted['project_id'] ) : 0;

        if ( isset( $posted['cpm_attachment'] ) ) {
            $files = $posted['cpm_attachment'];
        }

        $data = array(
            'comment_post_ID' => $parent_id,
            'comment_content' => $text,
            'user_id' => get_current_user_id()
        );

        $comment_obj = CPM_Comment::getInstance();
        $comment_id = $comment_obj->create( $data, $files );

        if ( $comment_id ) {

            $comment = $comment_obj->get( $comment_id );
            
            echo json_encode( array(
                'success' => true,
                'content' => cpm_show_comment( $comment, $project_id )
            ) );
        }

        exit;
    }

    function update_comment() {
        $posted = $_POST;
        //print_r( $posted );

        $comment_id = isset( $posted['comment_id'] ) ? intval( $posted['comment_id'] ) : 0;

        $data = array(
            'text' => $posted['cpm_message']
        );

        $comment_obj = CPM_Comment::getInstance();
        $comment_obj->update( $data, $comment_id );

        $comment = $comment_obj->get( $comment_id );
        $content = cpm_comment_text( $comment_id );
        $content .= cpm_show_attachments( $comment );

        echo json_encode( array(
            'success' => true,
            'content' => $content
        ) );

        exit;
    }

    function get_comment() {
        check_ajax_referer( 'cpm_nonce' );
        $posted = $_POST;

        $project_id = isset( $posted['project_id'] ) ? intval( $posted['project_id'] ) : 0;
        $object_id = isset( $posted['object_id'] ) ? intval( $posted['object_id'] ) : 0;
        $comment_id = isset( $posted['comment_id'] ) ? intval( $posted['comment_id'] ) : 0;

        $comment = CPM_Comment::getInstance()->get( $comment_id );

        echo json_encode( array(
            'success' => true,
            'id' => $comment_id,
            'form' => cpm_comment_form( $project_id, $object_id, $comment )
        ) );

        exit;
    }

    function delete_comment() {
        check_ajax_referer( 'cpm_nonce' );

        $comment_id = isset( $_POST['comment_id'] ) ? intval( $_POST['comment_id'] ) : 0;
        CPM_Comment::getInstance()->delete( $comment_id );

        echo json_encode( array(
            'success' => true
        ) );

        exit;
    }

    function new_message() {
        check_ajax_referer( 'cpm_message' );

        $posted = $_POST;
        $files = array();
        $project_id = isset( $posted['project_id'] ) ? intval( $posted['project_id'] ) : 0;

        if ( isset( $posted['cpm_attachment'] ) ) {
            $files = $posted['cpm_attachment'];
        }

        $message_obj = CPM_Message::getInstance();
        $message_id = $message_obj->create( $project_id, $files );

        if ( $message_id ) {
            echo cpm_url_single_message( $project_id, $message_id );
        }

        exit;
    }

    function get_message() {
        check_ajax_referer( 'cpm_nonce' );
        $posted = $_POST;

        $message_id = isset( $posted['id'] ) ? intval( $posted['id'] ) : 0;
        $message_obj = CPM_Message::getInstance();
        $message = $message_obj->get( $message_id );

        echo json_encode( $message );

        exit;
    }

}