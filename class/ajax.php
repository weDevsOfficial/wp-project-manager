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

        add_action( 'wp_ajax_cpm_new_invoice', array($this, 'create_invoice') );
        add_action( 'wp_ajax_cpm_update_invoice', array($this, 'update_invoice') );

        add_action( 'wp_ajax_cpm_ajax_upload', array($this, 'ajax_upload') );
        add_action( 'wp_ajax_cpm_delete_file', array($this, 'delete_file') );

        add_action( 'wp_ajax_cpm_new_comment', array($this, 'new_comment') );
        add_action( 'wp_ajax_cpm_get_comment', array($this, 'get_comment') );
        add_action( 'wp_ajax_cpm_update_comment', array($this, 'update_comment') );

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

        $task_obj = CPM_Task::getInstance();
        $task_id = $task_obj->update_task( $list_id, $task_id );
        $task = $task_obj->get_task( $task_id );

        if ( $task_id ) {
            $response = array(
                'success' => true,
                'content' => cpm_task_html( $task, $project_id, $list_id )
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

        $task_obj = CPM_Task::getInstance();
        $task_obj->mark_complete( $task_id );

        $task = $task_obj->get_task( $task_id );
        $response = array(
            'success' => true,
            'content' => cpm_task_html( $task, $project_id, $list_id )
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

        $task_obj = CPM_Task::getInstance();
        $task_obj->mark_open( $task_id );

        $task = $task_obj->get_task( $task_id );
        $response = array(
            'success' => true,
            'content' => cpm_task_html( $task, $project_id, $list_id )
        );

        echo json_encode( $response );
        exit;
    }

    function delete_task() {
        check_ajax_referer( 'cpm_nonce' );

        $task_id = (int) $_POST['task_id'];

        $this->_task_obj->delete_task( $task_id );

        echo json_encode( array(
            'success' => true
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

    function create_invoice() {
        check_ajax_referer( 'cpm_new_invoice' );

        $post = $_POST;
        $invoice_obj = CPM_Invoice::getInstance();
        $project_id = (int) $post['project_id'];
        $total = 0;

        $data = array(
            'title' => $post['invoice_title'],
            'project_id' => $project_id,
            'client_id' => $post['client_id'],
            'gateway' => $post['gateway'],
            'note' => $post['invoice-notes'],
            'terms' => $post['invoice-terms'],
            'due_date' => cpm_date2mysql( $post['due_date'] ),
            'tax' => $post['invoice-tax'],
            'discount' => $post['invoice-discount'],
            'subtotal' => $post['invoice-subtotal'],
            'total' => $post['invoice-total'] //total = ( subtotal + tax ) - discount
        );

//        echo '<pre>';
//        print_r($post);
//        print_r( $data );
//        echo '</pre>';
//        exit;

        $invoice_id = $invoice_obj->create( $data );

        if ( $invoice_id ) {
            foreach ($post['entry_name'] as $key => $entry) {
                $entry = sanitize_text_field( $entry );

                $item = array(
                    'invoice_id' => $invoice_id,
                    'title' => $entry,
                    'amount' => $post['entry_amount'][$key],
                    'text' => $post['entry_details'][$key],
                    'qty' => $post['entry_qty'][$key],
                    'tax' => $post['entry_tax'][$key],
                    'type' => $post['row_type'][$key],
                );

                if ( !empty( $entry ) ) {
                    $invoice_obj->create_item( $item );
                }
            }
        }

        echo cpm_url_single_invoice( $project_id, $invoice_id );
        exit;
    }

    function update_invoice() {
        check_ajax_referer( 'cpm_update_invoice' );

        $post = $_POST;
        $invoice_obj = CPM_Invoice::getInstance();
        $project_id = (int) $post['project_id'];
        $invoice_id = (int) $post['invoice_id'];
        $total = 0;

        $data = array(
            'title' => $post['invoice_title'],
            'project_id' => $project_id,
            'gateway' => $post['gateway'],
            'due_date' => cpm_date2mysql( $post['due_date'] ),
            'taxable' => $post['taxable'],
            'total' => $post['grand_total']
        );

        $invoice_obj->update( $data, $invoice_id );
        //echo '<pre>';
        //delete all previous items
        $invoice_obj->delete_items( $invoice_id );

        if ( $invoice_id ) {
            foreach ($post['entry_name'] as $key => $entry) {
                $item = array(
                    'invoice_id' => $invoice_id,
                    'title' => $entry,
                    'amount' => $post['entry_amount'][$key],
                    'text' => $post['entry_details'][$key],
                    'qty' => $post['entry_qty'][$key]
                );

                $invoice_obj->create_item( $item );
                //print_r( $item );
            }
        }


        echo cpm_url_single_invoice( $project_id, $invoice_id );
        //print_r( $post );
        //print_r( $data );
        //echo '</pre>';
        exit;
    }

    function ajax_upload() {
        check_ajax_referer( 'cpm_ajax_upload', 'nonce' );

        $object_id = isset( $_REQUEST['object_id'] ) ? intval( $_REQUEST['object_id'] ) : 0;
        $comment_obj = CPM_Comment::getInstance();
        $file_id = $comment_obj->upload_file( $object_id );

        if ( $file_id ) {
            $file = $comment_obj->get_file( $file_id );

            $delete = sprintf( '<a href="#" data-id="%d" class="cpm-delete-file button">%s</a>', $file['id'], __( 'Delete File' ) );
            $hidden = sprintf( '<input type="hidden" name="cpm_attachment[]" value="%d" />', $file['id'] );
            $file_url = sprintf( '<a href="%1$s" target="_blank"><img src="%2$s" alt="%3$s" /></a>', $file['url'], $file['thumb'], esc_attr( $file['name'] ) );

            echo '<div class="cpm-uploaded-item">' . $file_url . ' ' . $delete . $hidden . '</div>';
        }

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
        $privacy = (int) $posted['privacy'];

        if ( isset( $posted['cpm_attachment'] ) ) {
            $files = $posted['cpm_attachment'];
        }

        $data = array(
            'comment_post_ID' => $parent_id,
            'comment_content' => $text,
            'user_id' => get_current_user_id()
        );

        $comment_obj = CPM_Comment::getInstance();
        $comment_id = $comment_obj->create( $data, $privacy, $files );

        if ( $comment_id ) {

            $comment = $comment_obj->get( $comment_id );
            cpm_show_comment( $comment );
        }

        exit;
    }

    function update_comment() {
        $posted = $_POST;
        //print_r( $posted );

        $comment_id = isset( $posted['comment_id'] ) ? intval( $posted['comment_id'] ) : 0;

        $data = array(
            'text' => $posted['cpm_message'],
            'privacy' => (int) $posted['privacy']
        );

        $comment_obj = CPM_Comment::getInstance();
        $comment_obj->update( $data, $comment_id );

        $comment = $comment_obj->get( $comment_id );
        echo json_encode( $comment );

        exit;
    }

    function get_comment() {
        check_ajax_referer( 'cpm_nonce' );
        $posted = $_POST;
        $comment_id = isset( $posted['id'] ) ? intval( $posted['id'] ) : 0;

        $comment = CPM_Comment::getInstance()->get( $comment_id );
        echo json_encode( $comment );

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

$cpm_ajax = new CPM_Ajax();