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

        add_action( 'wp_ajax_cpm_project_new', array($this, 'project_new') );
        add_action( 'wp_ajax_cpm_project_update', array($this, 'project_edit') );
        add_action( 'wp_ajax_cpm_project_delete', array($this, 'project_delete') );

        add_action( 'wp_ajax_cpm_task_complete', array($this, 'mark_task_complete') );
        add_action( 'wp_ajax_cpm_task_open', array($this, 'mark_task_open') );
        add_action( 'wp_ajax_cpm_task_delete', array($this, 'delete_task') );
        add_action( 'wp_ajax_cpm_task_add', array($this, 'add_new_task') );
        add_action( 'wp_ajax_cpm_task_update', array($this, 'update_task') );
        add_action( 'wp_ajax_cpm_task_order', array($this, 'task_save_order') );

        add_action( 'wp_ajax_cpm_add_list', array($this, 'add_tasklist') );
        add_action( 'wp_ajax_cpm_update_list', array($this, 'update_tasklist') );
        add_action( 'wp_ajax_cpm_tasklist_delete', array($this, 'delete_tasklist') );

        add_action( 'wp_ajax_cpm_milestone_new', array($this, 'milestone_new') );
        add_action( 'wp_ajax_cpm_milestone_complete', array($this, 'milestone_complete') );
        add_action( 'wp_ajax_cpm_milestone_open', array($this, 'milestone_open') );
        add_action( 'wp_ajax_cpm_milestone_get', array($this, 'milestone_get') );
        add_action( 'wp_ajax_cpm_delete_milestone', array($this, 'milestone_delete') );
        add_action( 'wp_ajax_cpm_milestone_update', array($this, 'milestone_update') );

        add_action( 'wp_ajax_cpm_ajax_upload', array($this, 'ajax_upload') );
        add_action( 'wp_ajax_cpm_delete_file', array($this, 'delete_file') );

        add_action( 'wp_ajax_cpm_comment_new', array($this, 'new_comment') );
        add_action( 'wp_ajax_cpm_comment_get', array($this, 'get_comment') );
        add_action( 'wp_ajax_cpm_comment_update', array($this, 'update_comment') );
        add_action( 'wp_ajax_cpm_comment_delete', array($this, 'delete_comment') );

        add_action( 'wp_ajax_cpm_message_new', array($this, 'new_message') );
        add_action( 'wp_ajax_cpm_message_update', array($this, 'update_message') );
        add_action( 'wp_ajax_cpm_message_delete', array($this, 'delete_message') );
        add_action( 'wp_ajax_cpm_message_get', array($this, 'get_message') );

        add_action( 'wp_ajax_cpm_get_activity', array($this, 'get_activity') );
    }

    function project_new() {
        $posted = $_POST;
        $pro_obj = CPM_Project::getInstance();

        //fail if current user is not editor or above
        if ( !$pro_obj->has_admin_rights() ) {
            echo json_encode( array('success' => false) );
            exit;
        }


        $project_id = $pro_obj->create();
        $project = $pro_obj->get( $project_id );

        echo json_encode( array(
            'success' => true,
            'url' => cpm_url_project_details( $project_id )
        ) );

        exit;
    }

    function project_edit() {
        $posted = $_POST;

        $project_id = isset( $posted['project_id'] ) ? intval( $posted['project_id'] ) : 0;

        $pro_obj = CPM_Project::getInstance();
        $project_id = $pro_obj->update( $project_id );
        $project = $pro_obj->get( $project_id );

        echo json_encode( array(
            'success' => true,
            'title' => $project->post_title,
            'content' => cpm_get_content( $project->post_content ),
            'users' => cpm_dropdown_users( $project->users )
        ) );

        exit;
    }

    function project_delete() {
        $posted = $_POST;

        $project_id = isset( $posted['project_id'] ) ? intval( $posted['project_id'] ) : 0;
        
        do_action( 'cpm_delete_project_prev',  $project_id );
        
        CPM_Project::getInstance()->delete( $project_id, true );
        
        do_action( 'cpm_delete_project_after',  $project_id );

        echo json_encode( array(
            'success' => true,
            'url' => cpm_url_projects()
        ) );

        exit;
    }

    function add_new_task() {
        $posted = $_POST;

        $list_id = $posted['list_id'];
        $project_id = $posted['project_id'];

        $task_obj = CPM_Task::getInstance();
        $task_id = $task_obj->add_task( $posted['list_id'] );
        $task = $task_obj->get_task( $task_id );
        $complete = $task_obj->get_completeness( $list_id );

        if ( $task_id ) {
            $response = array(
                'success' => true,
                'id' => $task_id,
                'content' => cpm_task_html( $task, $project_id, $list_id ),
                'progress' => cpm_task_completeness( $complete['total'], $complete['completed'] )
            );
        } else {
            $response = array('success' => false);
        }
        
        do_action( 'cpm_after_new_task', $task_id, $list_id, $project_id );

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
        
        do_action( 'cpm_after_update_task', $task_id, $list_id, $project_id );

        echo json_encode( $response );
        exit;
    }
    
    function task_save_order() {

        if ( $_POST['items'] ) {
            foreach ($_POST['items'] as $index => $task_id) {
                wp_update_post( array('ID' => $task_id, 'menu_order' => $index) );
            }
        }
        
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
        $complete = $task_obj->get_completeness( $list_id );

        $task = $task_obj->get_task( $task_id );
        $response = array(
            'success' => true,
            'content' => cpm_task_html( $task, $project_id, $list_id, $single ),
            'progress' => cpm_task_completeness( $complete['total'], $complete['completed'] )
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
        $complete = $task_obj->get_completeness( $list_id );

        $task = $task_obj->get_task( $task_id );
        $response = array(
            'success' => true,
            'content' => cpm_task_html( $task, $project_id, $list_id, $single ),
            'progress' => cpm_task_completeness( $complete['total'], $complete['completed'] )
        );

        echo json_encode( $response );
        exit;
    }

    function delete_task() {
        check_ajax_referer( 'cpm_nonce' );

        $task_id = (int) $_POST['task_id'];
        $list_id = (int) $_POST['list_id'];
        $project_id = (int) $_POST['project_id'];
        
        do_action( 'cpm_delete_task_prev', $task_id, $list_id, $project_id, $task_obj );

        $task_obj = CPM_Task::getInstance();
        $task_obj->delete_task( $task_id, true );
        $complete = $task_obj->get_completeness( $list_id );
        
        do_action( 'cpm_delete_task_after', $task_id, $list_id, $project_id, $task_obj );

        echo json_encode( array(
            'success' => true,
            'list_url' => cpm_url_single_tasklist( $project_id, $list_id ),
            'progress' => cpm_task_completeness( $complete['total'], $complete['completed'] )
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
        
        do_action( 'cpm_delete_tasklist_prev', $_POST['list_id'] );

        CPM_Task::getInstance()->delete_list( $_POST['list_id'], true );
        
        do_action( 'cpm_delete_tasklist_after', $_POST['list_id'] );

        echo json_encode( array(
            'success' => true
        ) );

        exit;
    }

    function milestone_new() {
        check_ajax_referer( 'cpm_milestone' );

        CPM_Milestone::getInstance()->create( $_POST['project_id'] );

        echo json_encode( array(
            'success' => true
        ) );

        exit;
    }

    function milestone_update() {
        check_ajax_referer( 'cpm_milestone' );
        $posted = $_POST;

        $project_id = isset( $posted['project_id'] ) ? intval( $posted['project_id'] ) : 0;
        $milestone_id = isset( $posted['milestone_id'] ) ? intval( $posted['milestone_id'] ) : 0;

        CPM_Milestone::getInstance()->update( $project_id, $milestone_id );

        echo json_encode( array(
            'success' => true
        ) );

        exit;
    }

    function milestone_get() {
        check_ajax_referer( 'cpm_nonce' );

        $posted = $_POST;

        $project_id = isset( $posted['project_id'] ) ? intval( $posted['project_id'] ) : 0;
        $milestone_id = isset( $posted['id'] ) ? intval( $posted['id'] ) : 0;
        $milestone = CPM_Milestone::getInstance()->get( $milestone_id );

        echo json_encode( array(
            'success' => true,
            'content' => cpm_milestone_form( $project_id, $milestone )
        ) );

        exit;
    }

    function milestone_delete() {
        check_ajax_referer( 'cpm_nonce' );

        $milestone_id = (int) $_POST['milestone_id'];

        $this->_milestone_obj->delete( $milestone_id, true );
        echo json_encode( array(
            'success' => true
        ) );

        exit;
    }

    function milestone_complete() {
        check_ajax_referer( 'cpm_nonce' );

        $milestone_id = (int) $_POST['milestone_id'];

        $this->_milestone_obj->mark_complete( $milestone_id );
        print_r( $_POST );
        echo json_encode( array(
            'success' => true
        ) );

        exit;
    }

    function milestone_open() {
        check_ajax_referer( 'cpm_nonce' );

        $milestone_id = (int) $_POST['milestone_id'];

        $this->_milestone_obj->mark_open( $milestone_id );
        echo json_encode( array(
            'success' => true
        ) );

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
        $project_id = isset( $posted['project_id'] ) ? intval( $posted['project_id'] ) : 0;

        $data = array(
            'text' => $posted['cpm_message']
        );

        $comment_obj = CPM_Comment::getInstance();
        $comment_obj->update( $data, $comment_id );

        $comment = $comment_obj->get( $comment_id );
        $content = cpm_comment_text( $comment_id );
        $content .= cpm_show_attachments( $comment, $project_id );

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
        CPM_Comment::getInstance()->delete( $comment_id, true );

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
            echo json_encode( array(
                'success' => true,
                'id' => $message_id,
                'url' => cpm_url_single_message( $project_id, $message_id )
            ) );

            exit;
        }

        echo json_encode( array(
            'success' => false
        ) );

        exit;
    }

    function update_message() {
        check_ajax_referer( 'cpm_message' );
        $posted = $_POST;

        $files = array();
        $project_id = isset( $posted['project_id'] ) ? intval( $posted['project_id'] ) : 0;
        $message_id = isset( $posted['message_id'] ) ? intval( $posted['message_id'] ) : 0;

        if ( isset( $posted['cpm_attachment'] ) ) {
            $files = $posted['cpm_attachment'];
        }

        $message_obj = CPM_Message::getInstance();
        $message_id = $message_obj->update( $project_id, $files, $message_id );
        $message = $message_obj->get( $message_id );

        if ( $message_id && ! empty( $message ) ) {
            echo json_encode( array(
                'success' => true,
                'id' => $message_id,
                'content' => cpm_get_content( $message->post_content ). cpm_show_attachments( $message, $project_id )
            ) );

            exit;
        }

        echo json_encode( array(
            'success' => false
        ) );

        exit;
    }

    function delete_message() {
        check_ajax_referer( 'cpm_nonce' );

        $posted = $_POST;

        $project_id = isset( $posted['project_id'] ) ? intval( $posted['project_id'] ) : 0;
        $message_id = isset( $posted['message_id'] ) ? intval( $posted['message_id'] ) : 0;

        CPM_Message::getInstance()->delete( $message_id, true );

        echo json_encode( array(
            'success' => true,
            'url' => cpm_url_message_index( $project_id )
        ) );

        exit;
    }

    function get_message() {
        check_ajax_referer( 'cpm_nonce' );
        $posted = $_POST;

        $message_id = isset( $posted['message_id'] ) ? intval( $posted['message_id'] ) : 0;
        $project_id = isset( $posted['project_id'] ) ? intval( $posted['project_id'] ) : 0;

        $message_obj = CPM_Message::getInstance();
        $message = $message_obj->get( $message_id );

        if( $message ) {
            echo json_encode( array(
                'success' => true,
                'id' => $message_id,
                'content' => cpm_message_form( $project_id, $message )
            ) );

            exit;
        }

        echo json_encode( array(
            'success' => false
        ) );

        exit;
    }

    /**
     * Get project activity
     *
     * @since 0.3.1
     */
    function get_activity() {
        $project_id = isset( $_GET['project_id'] ) ? intval( $_GET['project_id'] ) : 0;
        $offset = isset( $_GET['offset'] ) ? intval( $_GET['offset'] ) : 0;

        $activities = CPM_project::getInstance()->get_activity( $project_id, array('offset' => $offset) );
        if ( $activities ) {
            echo json_encode( array(
                'success' => true,
                'content' => cpm_activity_html( $activities ),
                'count' => count( $activities )
            ) );
        } else {
            echo json_encode( array(
                'success' => false
            ) );
        }
        exit;
    }

}
