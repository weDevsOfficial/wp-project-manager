<?php

/**
 * Description of ajax
 *
 * @author tareq
 */
class CPM_Ajax {

    private $_task_obj;
    private $_milestone_obj;
    private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new CPM_Ajax();
        }

        return self::$_instance;
    }

    public function __construct() {
        $this->_task_obj      = CPM_Task::getInstance();
        $this->_milestone_obj = CPM_Milestone::getInstance();

        add_action( 'wp_ajax_cpm_user_create', array ( $this, 'create_user' ) );

        add_action( 'wp_ajax_cpm_project_new', array ( $this, 'project_new' ) );
        add_action( 'wp_ajax_cpm_project_update', array ( $this, 'project_edit' ) );
        add_action( 'wp_ajax_cpm_project_delete', array ( $this, 'project_delete' ) );

        add_action( 'wp_ajax_cpm_task_complete', array ( $this, 'mark_task_complete' ) );

        add_action( 'wp_ajax_cpm_task_open', array ( $this, 'mark_task_open' ) );

        add_action( 'wp_ajax_cpm_task_delete', array ( $this, 'delete_task' ) );
        add_action( 'wp_ajax_cpm_task_add', array ( $this, 'add_new_task' ) );
        add_action( 'wp_ajax_cpm_task_update', array ( $this, 'update_task' ) );
        add_action( 'wp_ajax_cpm_task_order', array ( $this, 'task_save_order' ) );
        add_action( 'wp_ajax_cpm_check_task_access', array ( $this, 'check_task_access' ) );

        add_action( 'wp_ajax_cpm_add_list', array ( $this, 'add_tasklist' ) );
        add_action( 'wp_ajax_cpm_update_list', array ( $this, 'update_tasklist' ) );
        add_action( 'wp_ajax_cpm_tasklist_delete', array ( $this, 'delete_tasklist' ) );
        add_action( 'wp_ajax_cpm_tasklist_pinstatus_update', array ( $this, 'update_tasklist_pinstatus' ) );

        add_action( 'wp_ajax_cpm_get_task_list', array ( $this, 'get_task_list' ) );
        add_action( 'wp_ajax_cpm_get_todo_list_single', array ( $this, 'get_todo_list_single' ) );
        add_action( 'wp_ajax_cpm_get_todo_list', array ( $this, 'get_todo_list' ) );
        add_action( 'wp_ajax_cpm_get_task', array ( $this, 'get_todo_single' ) );

        add_action( 'wp_ajax_cpm_get_task_init_data', array ( $this, 'task_page_init_data' ) );
        add_action( 'wp_ajax_cpm_milestone_new', array ( $this, 'milestone_new' ) );
        add_action( 'wp_ajax_cpm_milestone_complete', array ( $this, 'milestone_complete' ) );
        add_action( 'wp_ajax_cpm_milestone_open', array ( $this, 'milestone_open' ) );
        add_action( 'wp_ajax_cpm_milestone_get', array ( $this, 'milestone_get' ) );
        add_action( 'wp_ajax_cpm_get_milestones', array ( $this, 'get_milestones' ) );
        add_action( 'wp_ajax_cpm_delete_milestone', array ( $this, 'milestone_delete' ) );
        add_action( 'wp_ajax_cpm_milestone_update', array ( $this, 'milestone_update' ) );

        add_action( 'wp_ajax_cpm_ajax_upload', array ( $this, 'ajax_upload' ) );
        add_action( 'wp_ajax_cpm_ajax_upload_old', array ( $this, 'ajax_upload_old' ) );
        add_action( 'wp_ajax_cpm_delete_file', array ( $this, 'delete_file' ) );

        add_action( 'wp_ajax_cpm_comment_new', array ( $this, 'new_comment' ) );
        add_action( 'wp_ajax_cpm_comment_get', array ( $this, 'get_comment' ) );
        add_action( 'wp_ajax_cpm_comment_update', array ( $this, 'update_comment' ) );
        add_action( 'wp_ajax_cpm_comment_delete', array ( $this, 'delete_comment' ) );

        add_action( 'wp_ajax_cpm_comment_new_old', array ( $this, 'new_comment_old' ) );
        add_action( 'wp_ajax_cpm_comment_update_old', array ( $this, 'update_comment_old' ) );
        add_action( 'wp_ajax_cpm_comment_delete_old', array ( $this, 'delete_comment_old' ) );


        add_action( 'wp_ajax_cpm_show_discussion', array ( $this, 'get_discussion' ) );
        add_action( 'wp_ajax_cpm_message_new', array ( $this, 'new_message' ) );
        add_action( 'wp_ajax_cpm_message_update', array ( $this, 'update_message' ) );
        add_action( 'wp_ajax_cpm_message_delete', array ( $this, 'delete_message' ) );
        add_action( 'wp_ajax_cpm_message_get', array ( $this, 'get_message' ) );

        add_action( 'wp_ajax_cpm_get_activity', array ( $this, 'get_activity' ) );

        add_action( 'wp_ajax_cpm_user_autocomplete', array ( $this, 'autocomplete_user_role' ) );

        add_action( 'wp_ajax_cpm_project_archive', array ( $this, 'archive' ) );

        add_action( 'wp_ajax_cpm_calender_update_duetime', array ( $this, 'update_task_time' ) );

        add_action( 'wp_ajax_cpm_project_reports', array ( $this, 'report' ) );
        add_action( 'wp_ajax_cpm_get_projects_activity', array ( $this, 'get_projects_activity' ) );
        // Mension
        add_action( 'wp_ajax_cpmm_user_mension', array ( $this, 'mension_user' ) );

        // Set Project View
        // For Task Page on Vue JS
        add_action( 'wp_ajax_cpm_get_list_extra_field', array ( $this, 'listfrom_extrafield_list' ) );
        add_action( 'wp_ajax_cpm_get_task_extra_field', array ( $this, 'taskfrom_extrafield_list' ) );
        add_action( 'wp_ajax_cpm_task_create_comment', array( $this, 'cpm_task_create_comment' ) );
        add_action( 'wp_ajax_cpm_get_post_comments', array( $this, 'get_post_comments' ) );
        add_action( 'wp_ajax_cpm_get_compiled_content', array( $this, 'get_compiled_content' ) );
        
        add_action( 'wp_ajax_cpm_initial_todo_list', array( $this, 'initial_todo_list' ) );
        add_action( 'wp_ajax_cpm_get_tasks', array( $this, 'get_tasks' ) );
        add_action( 'wp_ajax_cpm_get_incompleted_tasks', array( $this, 'get_incompleted_tasks' ) );
        add_action( 'wp_ajax_cpm_get_completed_tasks', array( $this, 'get_completed_tasks' ) );
        add_action( 'wp_ajax_cpm_update_active_mode', array( $this, 'update_active_mode' ) );

        add_action( 'wp_ajax_cpm_update_task_order', array( $this, 'update_task_order' ) );
        add_action( 'wp_ajax_cpm-dismiss-promotional-offer-notice', array( $this, 'dismiss_promotional_offer' ) );
    }

    /**
     * Dismiss promotion notice
     *
     * @since  1.9.10
     *
     * @return void
     */
    public function dismiss_promotional_offer() {
        if ( ! empty( $_POST['cpm_promotion_dismissed'] ) ) {
            $offer_key = 'cpm_package_birthday_offer';
            update_option( $offer_key . '_tracking_notice', 'hide' );
        }
    }

    function update_active_mode() {
        check_ajax_referer( 'cpm_nonce' );
        
        $project_id = absint( $_POST['project_id'] );
        $mode       = $_POST['mode'];

        update_post_meta( $project_id, 'cpm_list_active_mode', $mode );

        wp_send_json_success();
    }

    function get_incompleted_tasks() {
        check_ajax_referer( 'cpm_nonce' );
        $list_id     = absint( $_POST['list_id'] );
        $project_id  = absint( $_POST['project_id'] );
        $page_number = absint( $_POST['page_number'] );

        $permission  = $this->permissions( $project_id );
        $tasks       = CPM_Task::getInstance()->get_incompleted_tasks( $list_id, $permission['todo_view_private'], $page_number );

        foreach ( $tasks as $key => $task ) {
            $tasks[$key]->can_del_edit = cpm_user_can_delete_edit( $project_id, $task );
        }

        $found_tasks = CPM_Task::getInstance()->count_incompleted_tasks($list_id);
        
        wp_send_json_success( 
            array( 
                'tasks' => $tasks, 
                'incompleted_tasks' => $tasks, 
                'found_incompleted_tasks' => $found_tasks 
            ) 
        );
    }

    function get_completed_tasks() {
        check_ajax_referer( 'cpm_nonce' );
        $list_id     = absint( $_POST['list_id'] );
        $project_id  = absint( $_POST['project_id'] );
        $page_number = absint( $_POST['page_number'] );

        $permission  = $this->permissions( $project_id );
        $tasks       = CPM_Task::getInstance()->get_completed_tasks( $list_id, $permission['todo_view_private'], $page_number );

        foreach ( $tasks as $key => $task ) {
            $tasks[$key]->can_del_edit = cpm_user_can_delete_edit( $project_id, $task );
        }

        $found_tasks = CPM_Task::getInstance()->count_completed_tasks($list_id);
        
        wp_send_json_success( 
            array( 
                'tasks' => $tasks, 
                'completed_tasks' => $tasks, 
                'found_completed_tasks' => $found_tasks 
            ) 
        );
    }

    function get_tasks() {
        check_ajax_referer( 'cpm_nonce' );
        $list_id     = absint( $_POST['list_id'] );
        $project_id  = absint( $_POST['project_id'] );
        $page_number = absint( $_POST['page_number'] );

        $permission        = $this->permissions( $project_id );
        $incompleted_tasks = CPM_Task::getInstance()->get_incompleted_tasks( $list_id, $permission['todo_view_private'], $page_number );
        $completed_tasks   = CPM_Task::getInstance()->get_completed_tasks( $list_id, $permission['todo_view_private'], $page_number );

        $tasks = array_merge( $incompleted_tasks, $completed_tasks );

        foreach ( $tasks as $key => $task ) {
            $tasks[$key]->can_del_edit = cpm_user_can_delete_edit( $project_id, $task );
        }

        $found_incompleted_tasks = CPM_Task::getInstance()->count_incompleted_tasks($list_id);
        $found_completed_tasks   = CPM_Task::getInstance()->count_completed_tasks($list_id);
        
        wp_send_json_success( 
            array( 
                'tasks'                   => $tasks,
                'incompleted_tasks'       => $incompleted_tasks,
                'completed_tasks'         => $completed_tasks,
                'found_incompleted_tasks' => $found_incompleted_tasks, 
                'found_completed_tasks'   => $found_completed_tasks 
            ) 
        );
    }

    /**
     * Get initial value when loaded todo list tab
     *
     * @since  2.0.0
     * 
     * @return json
     */
    function initial_todo_list() {
        check_ajax_referer( 'cpm_nonce' );
        $project_id = absint( $_POST['project_id'] );

        if ( ! $project_id ) {
            wp_send_json_error( array( 'error' => __( 'Invalid project ID.', 'cpm' ) ) );
        }

        $permission   = $permission = $this->permissions( $project_id );
        
        $current_page = empty( $_POST['current_page'] ) ? 1 : absint( $_POST['current_page'] );
        $tasks        = array();
        $new_lists    = array();
        $filter_private_list = $permission['todolist_view_private'] ? false : true;
        
        $lists        = CPM_Task::getInstance()->get_task_lists( $project_id, $filter_private_list, false, $current_page );
        
        foreach ( $lists['lists'] as $list ) {
           // $task        = CPM_Task::getInstance()->get_tasks( $list->ID, $permission['todo_view_private'] );
            $list->tasks = array();
            $new_lists[] = $list;
        }
        
        $milestones = CPM_Milestone::getInstance()->get_by_project( $project_id );

        $show_todo = cpm_get_option( 'show_todo', 'cpm_general' );
        
        $send = array( 
            'active_mode'   => get_post_meta( $project_id, 'cpm_list_active_mode', true ), 
            'milestones'    => $milestones, 
            'permissions'   => $permission, 
            'lists'         => $new_lists,
            'list_total'    => empty( $lists['count'] ) ? 0 : $lists['count'],
            'project_users' => CPM_Project::getInstance()->get_users( $project_id ),
            'todo_list_per_page' => empty( $show_todo ) ? 5 : $show_todo
        );

        $send = apply_filters( 'cpm_initial_todo_list', $send );

        wp_send_json_success( $send );
    }

    /**
     * Search report
     *
     * @return void
     */
    function report() {
        //check_ajax_referer( 'cpm_nonce' );
        parse_str( $_POST[ 'data' ], $data );
        $table = cpm()->report->report_generate( $data );
        wp_send_json_success( array ( 'table' => $table ) );
    }

    function pre_user_query( $self ) {
        global $wpdb;

        $cpm_user           = $wpdb->prefix . 'cpm_user_role';
        $wp_user            = $wpdb->users;
        $self->query_fields .= ", cpu.project_id";
        $self->query_from   .= " LEFT JOIN $cpm_user AS cpu ON $wp_user.ID = cpu.user_id";
        $query_where        = " AND cpu.role='client'";

        $self->query_where .= apply_filters( 'cpm_pre_user_query_where', $query_where, $self );
    }

    function where_project_search( $where ) {
        $item  = $_POST[ 'item' ];
        $where .= " OR tk.post_title LIKE '%$item%'";
        return $where;
    }

     function cpm_task_create_comment() {
        check_ajax_referer( 'cpm_nonce' );
        $posted              = $_POST;
        $files               = array();
        $response['success'] = FALSE;
        $text                = trim( $posted['description'] );
        $parent_id           = isset( $posted['parent_id'] ) ? intval( $posted['parent_id'] ) : 0;
        $project_id          = isset( $posted['project_id'] ) ? intval( $posted['project_id'] ) : 0;
        $comment_obj         = new CPM_Comment();
        if ( isset( $posted['cpm_attachment'] ) ) {
            $files = $posted['cpm_attachment'];
        }

        $user_id = get_current_user_id();
        $user    = get_user_by( 'id', $user_id );

        $data = array(
            'comment_post_ID'      => $parent_id,
            'comment_content'      => $text,
            'user_id'              => get_current_user_id(),
            'comment_author_IP'    => preg_replace( '/[^0-9a-fA-F:., ]/', '', $_SERVER['REMOTE_ADDR'] ),
            'comment_agent'        => substr( $_SERVER['HTTP_USER_AGENT'], 0, $this->_files_name_show4 ),
            'comment_author'       => $user->display_name,
            'comment_author_email' => $user->user_email
        );

        $comment_id = wp_insert_comment( $data );

        if ( $comment_id ) {
            add_comment_meta( $comment_id, '_files', $files );

            do_action( 'cpm_comment_new', $comment_id, $_POST['project_id'], $data );

            $response['success'] = TRUE;
            $comment             = $comment_obj->get( $comment_id );
            //  $comment['avata'] = get_avatar($comment->comment_author_email) ;
            $response['comment'] = $comment;
        }
        echo json_encode( $response );

        exit();
    }


    function join_project_search( $join ) {
        global $wpdb;
        $table = $wpdb->posts;
        $join  = "LEFT JOIN $table AS tl ON tl.ID=$table.ID
        LEFT JOIN $table AS tk ON tk.post_parent=tl.ID ";

        return $join;
    }

    function post_where( $where, &$wp_query ) {
        $where .= 'AND p.ID IN(4)';
        return $where;
    }

    function update_task_time() {

        check_ajax_referer( 'cpm_nonce' );
        $respne[ 'success' ] = false;

        // cpm_user_can_delete_edit( $project_id, $list )
        $start_date = sanitize_text_field( $_POST[ 'start_date' ] );
        $end_date   = sanitize_text_field( $_POST[ 'end_date' ] );
        $project_id = sanitize_text_field( $_POST[ 'project_id' ] );
        $task_id    = sanitize_text_field( $_POST[ 'task_id' ] );

        if ( empty( $end_date ) || empty( $task_id ) ) {
            return ;
        }
        $end_date   = date( 'Y-m-d H:i:s', strtotime( $end_date ) );
        
        if( !empty( $start_date ) ){
            $start_date = date( 'Y-m-d H:i:s', strtotime( $start_date ) );
        }
        
        if ( cpm_user_can_delete_edit( $project_id, $task_id, true ) ) {
            $task_start_field = cpm_get_option( 'task_start_field', 'cpm_general', 'off' );
            if ( $task_start_field == 'on' && !empty( $start_date ) ) {
                update_post_meta( $_POST[ 'task_id' ], '_start', $start_date );
            }

            update_post_meta( $_POST[ 'task_id' ], '_due', $end_date );
            $respne[ 'success' ] = true;
        }

        echo json_encode( $respne );
        exit();
    }

    function create_user() {
        check_ajax_referer( 'cpm_nonce' );

        parse_str( $_POST[ 'data' ], $postdata );
        $validate = $this->form_validate( $postdata );

        if ( is_wp_error( $validate ) ) {
            wp_send_json_error( $validate->errors[ 'error' ][ 0 ] );
        }
        
        if ( cpm_can_create_projects() ) {
            $random_password                = wp_generate_password( $length                         = 12, $include_standard_special_chars = false );
            $first_name                     = $postdata[ 'first_name' ] != '' ? sanitize_text_field( $postdata[ 'first_name' ] ) : '';
            $last_name                      = $postdata[ 'last_name' ] != '' ? sanitize_text_field( $postdata[ 'last_name' ] ) : '';

            $userdata = array (
                'user_login'   => $postdata[ 'user_name' ] != '' ? sanitize_text_field( $postdata[ 'user_name' ] ) : '',
                'user_pass'    => $random_password,
                'user_email'   => $postdata[ 'user_email' ] != '' ? sanitize_email( $postdata[ 'user_email' ] ) : '',
                'display_name' => $first_name . ' ' . $last_name,
            );

            $user_id = wp_insert_user( $userdata );

            if ( $user_id ) {
                update_user_meta( $user_id, 'first_name', $first_name );
                update_user_meta( $user_id, 'last_name', $last_name );

                wp_new_user_notification( $user_id );
                $user_meta = $this->create_user_meta( sanitize_text_field( $postdata[ 'user_name' ] ), $user_id );
                wp_send_json_success( $user_meta );
            }
        }else {
            wp_send_json_error( __( 'Access Denied', 'cpm' ) );
        }
    }

    function form_validate( $postdata ) {

        if ( empty( $postdata[ 'user_name' ] ) ) {
            return new WP_Error( 'error', __( 'Username is required.', 'cpm' ) );
        }

        if ( empty( $postdata[ 'user_email' ] ) ) {
            return new WP_Error( 'error', __( 'Email is required.', 'cpm' ) );
        }

        if ( !is_email( $postdata[ 'user_email' ] ) ) {
            return new WP_Error( 'error', __( 'Invalid email', 'cpm' ) );
        }

        if ( username_exists( $postdata[ 'user_name' ] ) ) {
            return new WP_Error( 'error', __( 'Username already exist', 'cpm' ) );
        }

        if ( email_exists( $postdata[ 'user_email' ] ) ) {
            return new WP_Error( 'error', __( 'Email already exist', 'cpm' ) );
        }

        return true;
    }

    function archive() {

        if ( !wp_verify_nonce( $_POST[ '_nonce' ], 'cpm_nonce' ) ) {
            wp_send_json_error( __( 'Are you cheating?', 'cpm' ) );
        }
        if ( cpm_can_manage_projects() ) {
            if ( isset( $_POST[ 'project_id' ] ) ) {
                $project_id = sanitize_text_field( $_POST[ 'project_id' ] );
            }else {
                wp_send_json_error( __( 'Project ID required', 'cpm' ) );
            }
            if ( $_POST[ 'type' ] == 'archive' ) {
                update_post_meta( $project_id, '_project_active', 'no' );
            }else {
                update_post_meta( $project_id, '_project_active', 'yes' );
            }
            wp_cache_delete( 'cpm_count' );
            wp_send_json_success( array (
                'url'   => cpm_url_projects(),
                'count' => cpm_project_count(),
            ) );
        }else {
            wp_send_json_error( __( 'Access Denied', 'cpm' ) );
        }
    }

    /**
     * Set Project View setting
     *
     * @since 1.3.8
     */
    function set_project_view() {

        if ( !wp_verify_nonce( $_POST[ '_nonce' ], 'cpm_nonce' ) ) {
            wp_send_json_error( __( 'Are you cheating?', 'cpm' ) );
        }

        $view = in_array( $_POST[ 'change_view' ], array ( 'grid', 'list' ) ) ? $_POST[ 'change_view' ] : 'grid';
        update_user_meta( get_current_user_id(), '_cpm_project_view', $view );

        wp_send_json_success();
    }

    function project_new() {
        $posted  = $_POST;
        $pro_obj = CPM_Project::getInstance();

        //fail if current user is not editor or above
        if ( !cpm_can_create_projects() ) {
            echo json_encode( array ( 'success' => false ) );
            exit;
        }

        $posted     = $_POST;
        $project_id = $pro_obj->create( $project_id = 0, $posted );
        $project    = $pro_obj->get( $project_id );
        $url        = cpm_url_project_details( $project_id );
        if ( !isset( $posted[ 'cpmf_url' ] ) ) {
            $url = sprintf( '%s?page=cpm_projects&tab=project&action=overview&pid=%d', admin_url( 'admin.php' ), $project_id );
        }
        echo json_encode( array (
            'success' => true,
            'url'     => $url
        ) );

        exit;
    }

    function project_edit() {

        $posted = $_POST;

        // form data validation start 
        $validator = new CPM_Validator();

        $rules = [
            'project_name' => 'required',
        ];

        $error_messages = [
            'project_name.required' => __( 'Project name is required.', 'cpm' ),
        ];
        // form data validation end 

        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;
        if ( ( cpm_can_manage_projects() || cpm_can_create_projects() ) && $validator->validate( $posted, $rules, $error_messages ) ) {
            $pro_obj    = CPM_Project::getInstance();
            $project_id = $pro_obj->update( $project_id, $posted );
            $project    = $pro_obj->get( $project_id );

            echo json_encode( array (
                'success' => true,
                'title'   => $project->post_title,
                'content' => cpm_get_content( $project->post_content ),
                'users'   => $this->user_role_table_generator( $project )
            ) );
        } else {
            echo json_encode( array (
                'success' => false,
                'errors' => $validator->get_errors()
            ) );
        }
        exit;
    }

    function user_role_table_generator( $project ) {
        ob_start();
        if ( !is_null( $project ) ) {
            $users_role = apply_filters( 'cpm_users_exclude_from_project', $project->users, $project );

            foreach ( $users_role as $array ) {
                $user_data = get_userdata( $array[ 'id' ] );

                if ( $user_data === false ) {
                    continue;
                }

                if ( $project->post_author == $user_data->ID ) {
                    continue;
                }

                $name = str_replace( ' ', '_', $user_data->display_name );
                ?>
                <tr>
                    <td><?php printf( '%s', ucfirst( $user_data->display_name ) ); ?></td>
                    <td>
                        <input type="radio" <?php checked( 'manager', $array[ 'role' ] );
                ?> id="cpm-manager-<?php echo $name; ?>"  name="role[<?php echo $array[ 'id' ]; ?>]" value="manager">
                        <label for="cpm-manager-<?php echo $name; ?>"><?php _e( 'Manager', 'cpm' );
                ?></label>
                    </td>
                    <td>
                        <input type="radio" <?php checked( 'co_worker', $array[ 'role' ] );
                ?> id="cpm-co-worker-<?php echo $name; ?>" name="role[<?php echo $array[ 'id' ]; ?>]" value="co_worker">
                        <label for="cpm-co-worker-<?php echo $name; ?>"><?php _e( 'Co-Worker', 'cpm' );
                ?></label>
                    </td>
                    <?php do_action( 'cpm_update_project_client_field', $array, $name ); ?>

                    <td><a hraf="#" class="cpm-del-proj-role cpm-assign-del-user"><span class="dashicons dashicons-trash"></span> <span class="title"><?php _e( 'Delete', 'cpm' ); ?></span></a></td>
                </tr>

                <?php
            }
        }
        return ob_get_clean();
    }

    function project_delete() {
        $posted = $_POST;

        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;
        $post = get_post( $project_id );
        
        if ( cpm_user_can_delete_edit( $project_id, $post ) ) {
            do_action( 'cpm_delete_project_prev', $project_id );

            CPM_Project::getInstance()->delete( $project_id, true );

            do_action( 'cpm_delete_project_after', $project_id );
            echo json_encode( array (
                'success' => true,
                'url'     => $_POST[ 'url' ],
            ) );
        }else {
            echo json_encode( array (
                'success' => false
            ) );
        }
        exit;
    }

    function add_new_task() {
        $posted = $_POST;
        
        // removing empty fields
        $posted = array_filter( $posted );

        // validating task data 
        $this->validate_data( $posted );

        $list_id    = isset( $posted[ 'list_id' ] ) ? intval( $posted[ 'list_id' ] ) : 0;
        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;
        $type       = isset( $posted[ 'type' ] ) ? $posted[ 'type' ] : 'html';
        $response   = array ( 'success' => false );
        
        if ( cpm_user_can_access( $project_id, 'create_todo' ) ) {
            $task_obj = CPM_Task::getInstance();
            $task_id  = $task_obj->add_task( $list_id, $posted );
            $task     = $task_obj->get_task( $task_id );
            $task->can_del_edit = cpm_user_can_delete_edit( $project_id, $task );
            $complete = $task_obj->get_completeness( $list_id, $project_id );
            $single   = isset( $_POST[ 'single' ] ) ? $_POST[ 'single' ] : false;

            if ( is_wp_error( $task_id ) ) {
                wp_send_json_error( array( 'error' => $task_id->get_error_messages() ) );
            }

            do_action( 'cpm_after_new_task', $task_id, $list_id, $project_id );
        } else {
            $error = new WP_Error( 'permission', 'You do not have permission to add new todo list', 'cpm' );
            wp_send_json_error( array( 'error' => $error->get_error_messages() ) ); 
        }
        
        wp_send_json_success( array( 'success' => __( 'A new task has been created successfully.', 'cpm' ),  'task' => $task ) );
    }

    protected function validate_data($data)
    {
        $validator = new CPM_Validator();

        $rules = [
            'task_title' => 'required',
            'task_start' => 'date',
            'task_due' => 'date',
        ];

        $error_messages = [
            'task_title.required' => __( 'Task title is required.', 'cpm' ),
            'task_start.date' => __( 'Start date is a date field and should be formatted as Y-m-d', 'cpm' ),
            'task_due.date' => __( 'Due date is a date field and should be formatted as Y-m-d', 'cpm' ),
        ];

        if ( !$validator->validate( $data, $rules, $error_messages ) ) {
            $validator->send_json_errors();
        }
    }

    function update_task() {
        $posted = $_POST;

        // removing empty fields
        $posted = array_filter($posted);

        // validating task data 
        $this->validate_data($posted);

        $list_id    = isset( $posted[ 'list_id' ] ) ? intval( $posted[ 'list_id' ] ) : 0;
        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;
        $task_id    = isset( $posted[ 'task_id' ] ) ? intval( $posted[ 'task_id' ] ) : 0;
        $type       = isset( $posted[ 'type' ] ) ? $posted[ 'type' ] : 'html';
        $single     = empty( $posted[ 'single' ] ) ? false : $posted[ 'single' ];
        $response   = array ( 'success' => false );
        
        if ( cpm_user_can_delete_edit( $project_id, $task_id, true ) ) {
            $task_obj = CPM_Task::getInstance();
            $task_id  = $task_obj->update_task( $list_id, $posted, $task_id );
            $task     = $task_obj->get_task( $task_id );
            
            if ( is_wp_error( $task_id ) ) {
                wp_send_json_error( array( 'error' => $task_id->get_error_messages() ) );
            }

            do_action( 'cpm_after_update_task', $task_id, $list_id, $project_id );
        } else {
            $error = new WP_Error( 'permission', 'You do not have permission to add new todo list', 'cpm' );
            wp_send_json_error( array( 'error' => $error->get_error_messages() ) ); 
        }
        
        wp_send_json_success( array( 'success' => __( 'The task has been updated successfully.', 'cpm' ),  'task' => $task ) );
    }

    function check_task_access() {

        $project_id = isset( $_POST[ 'project_id' ] ) ? intval( $_POST[ 'project_id' ] ) : 0;
        $task_id    = isset( $_POST[ 'task_id' ] ) ? intval( $_POST[ 'task_id' ] ) : 0;

        if ( cpm_user_can_delete_edit( $project_id, $task_id, true ) ) {
            $response = true;
        }else {
            $response = false;
        }

        echo json_encode( $response );
        exit;
    }

    function task_save_order() {

        if ( $_POST[ 'items' ] ) {
            foreach ( $_POST[ 'items' ] as $index => $task_id ) {
                wp_update_post( array ( 'ID' => $task_id, 'menu_order' => $index ) );
            }
        }

        exit;
    }

    function mark_task_complete() {
        check_ajax_referer( 'cpm_nonce' );

        $posted     = $_POST;
        $task_id    = isset( $posted[ 'task_id' ] ) ? intval( $posted[ 'task_id' ] ) : 0;
        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;
        $task_obj   = CPM_Task::getInstance();
        $is_assign  = $task_obj->check_task_assign( $task_id );

        
        if ( cpm_user_can_delete_edit( $project_id, $task_id, true ) || $is_assign ) {

            $task_obj->mark_complete( $task_id );

            do_action( 'mark_task_complete', $project_id, $task_id );

            wp_send_json_success( array( 'success' => __( 'The task has been marked as completed.', 'cpm' ) ) );
        
        } else {
            $error = new WP_Error( 'permission', 'You do not have sufficient permission', 'cpm' );
            wp_send_json_error( array( 'error' => $error->get_error_messages() ) ); 
        }
    }

    function mark_task_open() {
        check_ajax_referer( 'cpm_nonce' );

        $posted     = $_POST;
        $task_id    = isset( $posted[ 'task_id' ] ) ? intval( $posted[ 'task_id' ] ) : 0;
        //$list_id    = isset( $posted[ 'list_id' ] ) ? intval( $posted[ 'list_id' ] ) : 0;
        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;
        //$single     = isset( $posted[ 'single' ] ) ? $posted[ 'single' ] : false;
        $task_obj   = CPM_Task::getInstance();
        // $response   = array ( 'success' => false );
        $is_assign  = $task_obj->check_task_assign( $task_id );
        
        if ( cpm_user_can_delete_edit( $project_id, $task_id, true ) || $is_assign ) {
            $task_obj->mark_open( $task_id );

            do_action( 'cpm_mark_task_open', $project_id, $task_id );

            wp_send_json_success( array( 'success' => __( 'The task has been reopened.', 'cpm' ) ) );

        } else {
            $error = new WP_Error( 'permission', 'You do not have sufficient permission', 'cpm' );
            wp_send_json_error( array( 'error' => $error->get_error_messages() ) );
        } 
    }

    function delete_task() {
        check_ajax_referer( 'cpm_nonce' );
        $posted     = $_POST;
        $task_id    = isset( $posted[ 'task_id' ] ) ? intval( $posted[ 'task_id' ] ) : 0;
        $list_id    = isset( $posted[ 'list_id' ] ) ? intval( $posted[ 'list_id' ] ) : 0;
        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;
        $response   = array ( 'success' => false );
        
        if ( cpm_user_can_delete_edit( $project_id, $task_id, true ) ) {
            $task_obj = CPM_Task::getInstance();

            do_action( 'cpm_delete_task_prev', $task_id, $list_id, $project_id, $task_obj );

            $task_obj->delete_task( $task_id, true );
            //$complete = $task_obj->get_completeness( $list_id, $project_id );

            do_action( 'cpm_delete_task_after', $task_id, $list_id, $project_id, $task_obj );

            // $response = array (
            //     'success'  => true,
            //     'list_url' => cpm_url_single_tasklist( $project_id, $list_id ),
            //     'progress' => cpm_task_completeness( $complete[ 'total' ], $complete[ 'completed' ] )
            // );
            wp_send_json_success( array( 'success' => __( 'The task has been deleted successfully.', 'cpm' ) ) );
        } else {
            $error = new WP_Error( 'permission', 'You do not have permission to delete this task', 'cpm' );
            wp_send_json_error( array( 'error' => $error->get_error_messages() ) );
        }
        
    }

    function add_tasklist() {
        check_ajax_referer( 'cpm_nonce' );

        $posted     = $_POST;
        $project_id = $posted[ 'project_id' ];
        $response   = array ( 'success' => false );

        // form data validation start 
        $validator = new CPM_Validator();

        $rules = [
            'tasklist_name' => 'required',
        ];

        $error_messages = [
            'tasklist_name.required' => __( 'Task list name is required.', 'cpm' ),
        ];

        if ( !$validator->validate( $posted, $rules, $error_messages ) ) {
            $validator->send_json_errors();
        }
        // form data validation end 
        
        if ( cpm_user_can_access( $project_id, 'create_todolist' ) ) {
            $task_obj = CPM_Task::getInstance();
            $list_id  = $task_obj->add_list( $project_id, $posted );

            if ( ! is_wp_error( $list_id ) ) {
                $list = $task_obj->get_task_list( $list_id );
                $list->tasks = array();
                //$list = $this->add_new_list_kyes( $list, $project_id );

                $response = (array (
                    'success' => true,
                    'id'      => $list_id,
                    'newlist' => TRUE,
                    'list'    => $list
                ));
            } else {
                wp_send_json_error( array( 'error' => $list_id->get_error_messages() ) );
            }
        } else {
            $error = new WP_Error( 'permission', 'You do not have permission to add new todo list', 'cpm' );
            wp_send_json_error( array( 'error' => $error->get_error_messages() ) );
        }

        wp_send_json_success( array( 'success' => __( 'A new task list has been created successfully.', 'cpm' ),  'list' => $response ) );
    }

    function update_tasklist() {
        check_ajax_referer( 'cpm_nonce' );

        $posted     = $_POST;
        $project_id = $posted[ 'project_id' ];
        $list_id    = $posted[ 'list_id' ];

        // form data validation start 
        $validator = new CPM_Validator();

        $rules = [
            'tasklist_name' => 'required',
        ];

        $error_messages = [
            'tasklist_name.required' => __( 'Task list name is required.', 'cpm' ),
        ];

        if ( !$validator->validate( $posted, $rules, $error_messages ) ) {
            $validator->send_json_errors();
        }
        // form data validation end 
        
        if ( cpm_user_can_delete_edit( $project_id, $list_id, true ) ) {
            $task_obj = CPM_Task::getInstance();
            $list_id  = $task_obj->update_list( $project_id, $posted, $list_id );

            if ( $list_id ) {
                //$task_obj->get_tasks( $list_id )
                $list = $task_obj->get_task_list( $list_id );
                $list->tasks = $task_obj->get_tasks( $list_id );
                //$list = $this->add_new_list_kyes( $list, $project_id );

            }
        } else {
            $error = new WP_Error( 'permission', 'You do not have permission to update new todo list', 'cpm' );
            wp_send_json_error( array( 'error' => $error->get_error_messages() ) );
        }
        
        if ( is_wp_error( $list_id ) ) {
            wp_send_json_error( array( 'error' => $list_id->get_error_messages() ) );
        }

        wp_send_json_success( array( 'list' => $list, 'success' => __( 'Task list has been updated successfully.', 'cpm' ) ) );
    }

    function add_new_list_kyes( $list, $project_id ) {
        $task_obj               = CPM_Task::getInstance();
        $comstatus              = $task_obj->get_completeness( $list->ID, $project_id );
        $list->ed_permission    = cpm_user_can_delete_edit( $project_id, $list );
        $list->complete         = intval( $comstatus[ 'completed' ] );
        $list->total            = $comstatus[ 'total' ];
        $list->incomplete       = intval( $list->total - $list->complete );
        $percentage             = ( $list->total > 0 ) ? (100 * $list->complete ) / $list->total : 0;
        $list->complete_percent = intval($percentage);
        $list->tasklist_privacy = filter_var( $list->private, FILTER_VALIDATE_BOOLEAN );

        $list->extra_data = '';
        $list->edit_mode  = false;
        $list->full_view_mode  = false;
        $list->hideme  = false;
        $list->comments  = array();

        $list->show_new_task_form  = false;
        $list->tasklist            = array();
        $list->assigned_users_temp = array();
        
        return $list;
    }

    function delete_tasklist() {
        check_ajax_referer( 'cpm_nonce' );
        $list_id    = $_POST['list_id'];
        $project_id = $_POST['project_id'];
        $response   = array ( 'success' => false );
        
        if ( cpm_user_can_delete_edit( $project_id, $list_id, true ) ) {
            do_action( 'cpm_delete_tasklist_prev', $_POST[ 'list_id' ] );

            CPM_Task::getInstance()->delete_list( $_POST[ 'list_id' ], true );

            do_action( 'cpm_delete_tasklist_after', $_POST[ 'list_id' ] );
            wp_send_json_success( array( 'success' => __( 'Task list has been deleted successfully.', 'cpm' ) ) );
        } else {
            $error = new WP_Error( 'permission', 'You do not have permission to add new todo list', 'cpm' );
            wp_send_json_error( array( 'error' => $error->get_error_messages() ) );
        }
    }

    /**
     * Pin a todo list at top
     *
     * @since 1.4.1
     *
     * @return void
     */
    public function update_tasklist_pinstatus() {
        check_ajax_referer( 'cpm_nonce' );
        $posted = $_POST;

        $post_id  = sanitize_text_field( $posted[ 'list_id' ] );
        /* $status = sanitize_text_field( $posted['pin_status'] );
          $update  = update_post_meta( $list_id, '_pin_list', $status );
         */
        $stickies = get_option( 'sticky_posts' );

        if ( !is_array( $stickies ) ) {
            $stickies = array ( $post_id );
        }

        if ( !in_array( $post_id, $stickies ) ) {
            $stickies[] = $post_id;
        }else {
            $offset = array_search( $post_id, $stickies );

            if ( false === $offset ) {
                return;
            }

            array_splice( $stickies, $offset, 1 );
        }

        $update = update_option( 'sticky_posts', $stickies );
        if ( $update ) {
            echo json_encode( array (
                'success' => true,
            ) );
        }else {
            echo json_encode( array (
                'success' => false
            ) );
        }

        exit;
    }

    function milestone_new() {
        check_ajax_referer( 'cpm_milestone' );
        $project_id = isset( $_POST[ 'project_id' ] ) ? intval( $_POST[ 'project_id' ] ) : 0;

        if ( cpm_user_can_access( $project_id, 'create_milestone' ) ) {
            CPM_Milestone::getInstance()->create( $project_id );

            echo json_encode( array (
                'success' => true
            ) );
        }else {
            echo json_encode( array (
                'success' => true
            ) );
        }

        exit;
    }

    function milestone_update() {
        check_ajax_referer( 'cpm_milestone' );
        $posted       = $_POST;
        $milestone_id = sanitize_text_field( $posted[ 'milestone_id' ] );
        $response     = array ( 'success' => false );
        if ( cpm_user_can_delete_edit( $project_id, $milestone_id, true ) ) {
            $project_id   = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;
            $milestone_id = isset( $posted[ 'milestone_id' ] ) ? intval( $posted[ 'milestone_id' ] ) : 0;

            CPM_Milestone::getInstance()->update( $project_id, $milestone_id );

            echo json_encode( array (
                'success' => true
            ) );
        }else {
            echo json_encode( array (
                'success' => false
            ) );
        }
        exit;
    }

    function get_milestones() {
        check_ajax_referer( 'cpm_nonce' );
        
        $project_id = abs( $_POST['project_id'] );
        $milestone  = CPM_Milestone::getInstance()->get_by_project( $project_id );

        wp_send_json_success( array( 'milestones' => $milestone ) );
    }

    function milestone_get() {
        check_ajax_referer( 'cpm_nonce' );

        $posted = $_POST;

        $project_id   = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;
        $milestone_id = isset( $posted[ 'id' ] ) ? intval( $posted[ 'id' ] ) : 0;
        $milestone    = CPM_Milestone::getInstance()->get( $milestone_id );

        echo json_encode( array (
            'success' => true,
            'id'      => $milestone_id,
            'content' => cpm_milestone_form( $project_id, $milestone )
        ) );

        exit;
    }

    function milestone_delete() {
        check_ajax_referer( 'cpm_nonce' );

        $milestone_id = ( int ) $_POST[ 'milestone_id' ];

        if ( cpm_user_can_delete_edit( $project_id, $milestone_id, true ) ) {
            $this->_milestone_obj->delete( $milestone_id, true );
            echo json_encode( array (
                'success' => true
            ) );
        }else {
            echo json_encode( array (
                'success' => false
            ) );
        }
        exit;
    }

    function milestone_complete() {
        check_ajax_referer( 'cpm_nonce' );

        $milestone_id = ( int ) $_POST[ 'milestone_id' ];

        if ( cpm_user_can_delete_edit( $project_id, $milestone_id, true ) ) {
            $this->_milestone_obj->mark_complete( $milestone_id );
            // print_r( $_POST );
            echo json_encode( array (
                'success' => true
            ) );
        }else {
            echo json_encode( array (
                'success' => false
            ) );
        }
        exit;
    }

    function milestone_open() {
        check_ajax_referer( 'cpm_nonce' );

        $milestone_id = ( int ) $_POST[ 'milestone_id' ];

        if ( cpm_user_can_delete_edit( $project_id, $milestone_id, true ) ) {
            $this->_milestone_obj->mark_open( $milestone_id );
            echo json_encode( array (
                'success' => true
            ) );
        }else {
            echo json_encode( array (
                'success' => false
            ) );
        }
        exit;
    }

    function ajax_upload() {
        check_ajax_referer( 'cpm_ajax_upload', 'nonce' );

        $object_id   = isset( $_REQUEST['object_id'] ) ? intval( $_REQUEST['object_id'] ) : 0;
        $comment_obj = CPM_Comment::getInstance();
        $response    = $comment_obj->upload_file( $object_id );

        if ( $response['success'] ) {
            $file = $comment_obj->get_file( $response['file_id'] );

            // $delete   = sprintf( '<a href="#" data-id="%d" class="cpm-delete-file button">%s</a>', $file['id'], __( 'Delete File', 'cpm' ) );
            // $hidden   = sprintf( '<input type="hidden" name="cpm_attachment[]" value="%d" />', $file['id'] );
            // $file_url = sprintf( '<a href="%1$s" target="_blank"><img src="%2$s" alt="%3$s" /></a>', $file['url'], $file['thumb'], esc_attr( $file['name'] ) );

            // $html = '<div class="cpm-uploaded-item">' . $file_url . ' ' . $delete . $hidden . '</div>';
            // echo json_encode( array(
            //     'success' => true,
            //     'content' => $html,
            // ) );

            // exit;
            
            wp_send_json_success( 
                array( 
                    'file' => array( 
                        'name'  => esc_attr( $file['name'] ),
                        'id'    => $file['id'],
                        'url'   => $file['url'],
                        'thumb' => $file['thumb'],
                        'type'  => $file['type']
                    )
                )
            );
        } else {
            wp_send_json_error( array( 'error' => $response['error'] ) );
        }
    }

    function delete_file() {
        check_ajax_referer( 'cpm_nonce' );

        $file_id = absint( $_POST[ 'file_id' ] ) ? $_POST[ 'file_id' ] : 0;

        $comment_obj = CPM_Comment::getInstance();
        $comment_obj->delete_file( $file_id, true );

        wp_send_json_success();
        exit;
    }

    function new_comment() {
        check_ajax_referer( 'cpm_nonce' );

        $posted = $_POST;
        $files  = array();

        if ( empty( $posted['cpm_message'] ) ) {
            $error = new WP_Error( 'cpm_message', 'Required comment content', 'cpm' );
            wp_send_json_error( array( 'error' => $error->get_error_messages() ) );
        }

        $text       = trim( $posted[ 'cpm_message' ] );
        $parent_id  = isset( $posted[ 'parent_id' ] ) ? intval( $posted[ 'parent_id' ] ) : 0;
        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;

        if ( isset( $posted[ 'cpm_attachment' ] ) ) {
            $files = $posted[ 'cpm_attachment' ];
        }

        $data = array (
            'comment_post_ID' => $parent_id,
            'comment_content' => $text,
            'user_id'         => get_current_user_id()
        );

        $comment_obj = CPM_Comment::getInstance();
        $comment_id  = $comment_obj->create( $data, $files );

        if ( $comment_id ) {
            $comment = $comment_obj->get( $comment_id );
            wp_send_json_success( array( 'success' => __( 'Successfully updated', 'cpm' ),  'comment' => $comment ) );
        
        } else {
            wp_send_json_error( array( 'error' => __( 'Error', 'cpm' ) ) );
        }
    }

    function new_comment_old() {
        check_ajax_referer( 'cpm_nonce' );
        $posted = $_POST;
        $files  = array ();
        $text       = trim( $posted[ 'cpm_message' ] );
        $parent_id  = isset( $posted[ 'parent_id' ] ) ? intval( $posted[ 'parent_id' ] ) : 0;
        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;
        if ( isset( $posted[ 'cpm_attachment' ] ) ) {
            $files = $posted[ 'cpm_attachment' ];
        }
        $data = array (
            'comment_post_ID' => $parent_id,
            'comment_content' => $text,
            'user_id'         => get_current_user_id()
        );
        $comment_obj = CPM_Comment::getInstance();
        $comment_id  = $comment_obj->create( $data, $files );
        if ( $comment_id ) {
            $comment = $comment_obj->get( $comment_id );
            echo json_encode( array (
                'success'     => true,
                'placeholder' => __( 'Add a comment...', 'cpm' ),
                'content'     => cpm_show_comment( $comment, $project_id )
            ) );
        }

        exit;
    }

    function update_comment() {
        $posted = $_POST;

        if ( empty( $posted['cpm_message'] ) ) {
            $error = new WP_Error( 'cpm_message', 'Required comment content', 'cpm' );
            wp_send_json_error( array( 'error' => $error->get_error_messages() ) );
        }
 
        $comment_id = isset( $posted[ 'comment_id' ] ) ? intval( $posted[ 'comment_id' ] ) : 0;
        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;

        $data = array (
            'text' => $posted['cpm_message'],
        );

        $comment_obj = CPM_Comment::getInstance();
        $comment_obj->update( $data, $comment_id );

        wp_send_json_success( array( 'success' => __( 'Successfully updated', 'cpm' ) ) );

        // $comment = $comment_obj->get( $comment_id );
        // $content = cpm_comment_text( $comment_id );
        // $content .= cpm_show_attachments( $comment, $project_id );

        
    }

    function update_comment_old() {
        $posted = $_POST;
        //print_r( $posted );
        $comment_id = isset( $posted[ 'comment_id' ] ) ? intval( $posted[ 'comment_id' ] ) : 0;
        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;
        $data = array (
            'text' => $posted[ 'cpm_message' ],
        );
        $comment_obj = CPM_Comment::getInstance();
        $comment_obj->update( $data, $comment_id );
        $comment = $comment_obj->get( $comment_id );
        $content = cpm_comment_text( $comment_id );
        $content .= cpm_show_attachments( $comment, $project_id );
        echo json_encode( array (
            'success' => true,
            'content' => $content,
        ) );
        exit;
    }

    function get_comment() {
        check_ajax_referer( 'cpm_nonce' );
        
        $posted = $_POST;

        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;
        $object_id  = isset( $posted[ 'object_id' ] ) ? intval( $posted[ 'object_id' ] ) : 0;
        $comment_id = isset( $posted[ 'comment_id' ] ) ? intval( $posted[ 'comment_id' ] ) : 0;

        $comment = CPM_Comment::getInstance()->get( $comment_id );

        echo json_encode( array (
            'success' => true,
            'id'      => $comment_id,
            'form'    => cpm_comment_form( $project_id, $object_id, $comment )
        ) );

        exit;
    }

    function delete_comment() {
        check_ajax_referer( 'cpm_nonce' );

        $comment_id = isset( $_POST[ 'comment_id' ] ) ? intval( $_POST[ 'comment_id' ] ) : 0;
        CPM_Comment::getInstance()->delete( $comment_id, true );

        wp_send_json_success( array( 'success' => __( 'Successfully deleted comment', 'cpm' ) ) );
    }

    function delete_comment_old() {
        check_ajax_referer( 'cpm_nonce' );

        $comment_id = isset( $_POST[ 'comment_id' ] ) ? intval( $_POST[ 'comment_id' ] ) : 0;
        CPM_Comment::getInstance()->delete( $comment_id, true );

        echo json_encode( array (
            'success' => true
        ) );

        exit;
    }

    function new_message() {
        check_ajax_referer( 'cpm_message' );
        $posted = $_POST;

        $files      = array();
        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;

        if ( isset( $posted[ 'cpm_attachment' ] ) ) {
            $files = $posted[ 'cpm_attachment' ];
        }
        if ( cpm_user_can_access( $project_id, 'create_message' ) ) {
            $message_obj = CPM_Message::getInstance();
            $message_id  = $message_obj->create( $project_id, $posted, $files );
            if ( !isset( $posted[ 'cpmf_url' ] ) ) {
                $url = sprintf( '%s?page=cpm_projects&tab=message&action=single&pid=%d&mid=%d', admin_url( 'admin.php' ), $project_id, $message_id );
            }else {
                $url = cpm_url_single_message( $project_id, $message_id );
            }

            if ( $message_id ) {
                echo json_encode( array (
                    'success' => true,
                    'id'      => $message_id,
                    'url'     => $url,
                ) );

                exit;
            }

            echo json_encode( array (
                'success' => false
            ) );
        }else {
            echo json_encode( array (
                'success' => false
            ) );
        }
        exit;
    }

    function update_message() {
        check_ajax_referer( 'cpm_message' );
        $posted = $_POST;

        $files      = array();
        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;
        $message_id = isset( $posted[ 'message_id' ] ) ? intval( $posted[ 'message_id' ] ) : 0;

        if ( isset( $posted[ 'cpm_attachment' ] ) ) {
            $files = $posted[ 'cpm_attachment' ];
        }

        $message_obj = CPM_Message::getInstance();
        $message_id  = $message_obj->update( $project_id, $posted, $files, $message_id );
        $message     = $message_obj->get( $message_id );

        if ( $message_id && !empty( $message ) ) {
            echo json_encode( array (
                'success' => true,
                'id'      => $message_id,
                'content' => cpm_get_content( $message->post_content ) . cpm_show_attachments( $message, $project_id )
            ) );

            exit;
        }

        echo json_encode( array (
            'success' => false
        ) );

        exit;
    }

    function delete_message() {
        check_ajax_referer( 'cpm_nonce' );

        $posted     = $_POST;
        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;
        $message_id = isset( $posted[ 'message_id' ] ) ? intval( $posted[ 'message_id' ] ) : 0;

        CPM_Message::getInstance()->delete( $message_id, true );

        echo json_encode( array (
            'success' => true,
            'url'     => cpm_url_message_index( $project_id )
        ) );

        exit;
    }

    function get_message() {
        check_ajax_referer( 'cpm_nonce' );
        $posted = $_POST;

        $message_id = isset( $posted[ 'message_id' ] ) ? intval( $posted[ 'message_id' ] ) : 0;
        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;

        $message_obj = CPM_Message::getInstance();
        $message     = $message_obj->get( $message_id );

        if ( $message ) {
            echo json_encode( array (
                'success'    => true,
                'id'         => $message_id,
                'project_id' => $project_id,
                'content'    => cpm_message_form( $project_id, $message )
            ) );

            exit;
        }

        echo json_encode( array (
            'success' => false
        ) );

        exit;
    }

    function get_discussion() {
        check_ajax_referer( 'cpm_nonce' );
        $posted = $_POST;

        $message_id = isset( $posted[ 'message_id' ] ) ? intval( $posted[ 'message_id' ] ) : 0;
        $project_id = isset( $posted[ 'project_id' ] ) ? intval( $posted[ 'project_id' ] ) : 0;

        // $message_obj = CPM_Message::getInstance();
        // $message = $message_obj->get( $message_id );
        $content = cpm_discussion_single( $message_id, $project_id );
        // var_dump($content) ;
        if ( $message_id ) {
            echo json_encode( array (
                'success'    => true,
                'id'         => $message_id,
                'project_id' => $project_id,
                'content'    => $content,
            ) );

            exit;
        }

        echo json_encode( array (
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
        $project_id = isset( $_GET[ 'project_id' ] ) ? intval( $_GET[ 'project_id' ] ) : 0;
        $offset     = isset( $_GET[ 'offset' ] ) ? intval( $_GET[ 'offset' ] ) : 0;

        $activities = CPM_project::getInstance()->get_activity( $project_id, array ( 'offset' => $offset ) );
        if ( $activities ) {
            echo json_encode( array (
                'success' => true,
                'content' => cpm_activity_html( $activities ),
                'count'   => count( $activities )
            ) );
        }else {
            echo json_encode( array (
                'success' => false
            ) );
        }
        exit;
    }

    /**
     * Get projects activity
     *
     * @since 1.2
     */
    function get_projects_activity() {
        $projects_id = isset( $_GET[ 'projects_id' ] ) ? $_GET[ 'projects_id' ] : 0;
        $offset      = isset( $_GET[ 'offset' ] ) ? intval( $_GET[ 'offset' ] ) : 0;

        $activities = CPM_project::getInstance()->get_projects_activity( $projects_id, array ( 'offset' => $offset ) );

        if ( $activities ) {
            echo json_encode( array (
                'success' => true,
                'content' => cpm_projects_activity_html( $activities ),
                'count'   => count( $activities )
            ) );
        }else {
            echo json_encode( array (
                'success' => false
            ) );
        }
        exit;
    }

    function autocomplete_user_role() {
        $users = get_users( array (
            'search'         => '*' . $_POST[ 'term' ] . '*',
            'search_columns' => array ( 'user_login', 'user_email', 'nicename' ),
                ) );

        foreach ( $users as $user ) {
            $data[] = array (
                'label'      => $user->display_name,
                '_user_meta' => $this->create_user_meta( $user->display_name, $user->ID ),
            );
        }

        if ( isset( $data ) && count( $data ) ) {
            $user_info = json_encode( $data );
        }else {
            $data[]    = array (
                'label'      => '<div class="no-user-wrap"><p>' . __( 'No users found.', 'cpm' ) . '</p> <span class="button-primary">' . __( 'Create a new user?', 'cpm' ) . '</span></div>',
                'value'      => 'cpm_create_user',
                '_user_meta' => '',
            );
            $user_info = json_encode( $data );
        }

        wp_send_json_success( $user_info );
    }

    function mension_user() {

        $users = get_users( array (
            'search'         => '*' . $_POST[ 'term' ] . '*',
            'search_columns' => array ( 'user_login', 'user_email', 'nicename' ),
                ) );

        foreach ( $users as $user ) {
            $data[] = array (
                'label' => $user->display_name
            );
        }

        if ( isset( $data ) && count( $data ) ) {
            $user_info = json_encode( $data );
        }else {
            $data[]    = array (
                'label' => '<p>' . __( 'No users found.', 'cpm' ) . '</p>',
            );
            $user_info = json_encode( $data );
        }

        wp_send_json_success( $user_info );
    }

    function create_user_meta( $display_name, $user_id ) {
        $name = str_replace( ' ', '_', $display_name );
        ob_start();
        ?>
        <tr>
            <td><?php printf( '%s', ucfirst( $display_name ) ); ?></td>
            <td>

                <input type="radio" id="cpm-manager-<?php echo $name; ?>"  name="role[<?php echo $user_id; ?>]" value="manager">
                <label for="cpm-manager-<?php echo $name; ?>"><?php _e( 'Manager', 'cpm' );
        ?></label>

            </td>
            <td>

                <input type="radio" checked="checked" id="cpm-co-worker-<?php echo $name; ?>" name="role[<?php echo $user_id; ?>]" value="co_worker">
                <label for="cpm-co-worker-<?php echo $name; ?>"><?php _e( 'Co-Worker', 'cpm' );
        ?></label>
            </td>
            <?php do_action( 'cpm_new_project_client_field', $user_id, $name ); ?>

            <td><a hraf="#" class="cpm-del-proj-role cpm-assign-del-user"><span class="dashicons dashicons-trash"></span> <span class="title"><?php _e( 'Delete', 'cpm' ); ?></span></a></td>
        </tr>

        <?php
        return ob_get_clean();
    }

    // Start New method for Vue JS - Task Page

    function task_page_init_data() {
        check_ajax_referer( 'cpm_nonce' );

        $project_id = isset( $_POST[ 'project_id' ] ) ? intval( $_POST[ 'project_id' ] ) : 0;


        $response[ 'milestone' ] = CPM_Milestone::getInstance()->get_by_project( $project_id );

        $response[ 'tlf_extra_field' ] = $this->listfrom_extrafield( $project_id );
        $response[ 'init_data' ]       = array (
            
            'task_start_field'      => filter_var( cpm_get_option( 'task_start_field', 'cpm_general' ), FILTER_VALIDATE_BOOLEAN ),
            'task_form_extra_field' => $this->taskfrom_extrafield( $project_id ),
            'users'                 => CPM_Project::getInstance()->get_users( $project_id ),


        );

        echo json_encode( $response );
        exit();
    }

    function get_task_list() {
        $is_admin   = (isset( $_POST[ 'is_admin' ] )) ? sanitize_text_field( $_POST[ 'is_admin' ] ) : 'yes';
        $show_pin   = (isset( $_POST[ 'show_pin' ] ) && sanitize_text_field( $_POST[ 'show_pin' ] ) == 'yes' ) ? TRUE : FALSE;
        $project_id = (isset( $_POST[ 'project_id' ] )) ? sanitize_text_field( $_POST[ 'project_id' ] ) : 0;
        $offset     = (isset( $_POST[ 'offset' ] )) ? sanitize_text_field( $_POST[ 'offset' ] ) : 0;
        $privacy    = (isset( $_POST[ 'privacy' ] ) ) ? sanitize_text_field( $_POST[ 'privacy' ] ) : false;
        $type       = (isset( $_POST[ 'type' ] ) && $_POST[ 'type' ] == 'json' ) ? 'json' : 'html';
        $task_obj   = CPM_Task::getInstance();
        $lists      = $task_obj->get_task_lists( $project_id, $privacy, $offset, $show_pin );
        $data       = '';

        if ( 'no' == $is_admin ) {
            new CPM_Frontend_URLs();
        }

        //var_dump($list) ;
        if ( empty( $lists['posts'] ) ) {
            echo json_encode( array (
                'success'  => false,
                'response' => '',
                'offset'   => intval( $offset )
            ) );
        }else {
            $json_list = array();
            foreach ( $lists['posts'] as $list ) {
                $data .= cpm_task_list_html( $list, $project_id );
                $list = $this->add_new_list_kyes( $list, $project_id );

                array_push( $json_list, $list );
            }
            if ( $type == 'json' ) {
                $data = $json_list;
            }
            $per_page = cpm_get_option( 'show_todo', 'cpm_general' );

            $response = array (
                'lists'       => $data,
                'next_offset' => ($offset + $per_page),
                'success'     => true,
            );
            echo json_encode( $response );
        }
        exit();
    }

    function permissions( $project_id ) {
        return array(
            'todolist_view_private'=> apply_filters( 'tdolist_view_private', true, $project_id ), //cpm_user_can_access( $project_id, 'tdolist_view_private' ),
            'create_todolist'      => apply_filters( 'create_todolist', true, $project_id ), //cpm_user_can_access( $project_id, 'create_todolist' ),
            'todo_view_private'    => apply_filters( 'todo_view_private', true, $project_id ), //cpm_user_can_access( $project_id, 'todo_view_private' ),
            'create_todo'          => apply_filters( 'create_todo', true, $project_id ), //cpm_user_can_access( $project_id, 'create_todo' ),
            'task_start_field'     => apply_filters( 'task_start_field', false, $project_id ), //cpm_get_option( 'task_start_field', 'cpm_general' )
        );
    }

    function get_todo_list_single() {
        $is_admin      = (isset( $_POST[ 'is_admin' ] )) ? sanitize_text_field( $_POST[ 'is_admin' ] ) : 'yes';
        
        $list_id       = (isset( $_POST[ 'list_id' ] )) ? sanitize_text_field( $_POST[ 'list_id' ] ) : 0;
        $project_id    = (isset( $_POST[ 'project_id' ] )) ? sanitize_text_field( $_POST[ 'project_id' ] ) : 0;
        $offset        = (isset( $_POST[ 'offset' ] )) ? sanitize_text_field( $_POST[ 'offset' ] ) : 0;
        $privacy       = (isset( $_POST[ 'privacy' ] ) ) ? sanitize_text_field( $_POST[ 'privacy' ] ) : false;
        $type          = (isset( $_POST[ 'type' ] ) && $_POST[ 'type' ] == 'json' ) ? 'json' : 'html';
        $permission    = $this->permissions( $project_id );
        $task_obj      = CPM_Task::getInstance();
        $list          = $task_obj->get_task_list($list_id, $permission['todolist_view_private']);
        $milestones    = CPM_Milestone::getInstance()->get_by_project( $project_id );
        $project_users = CPM_Project::getInstance()->get_users( $project_id );
        
        if ( $list ) {
            $list->tasks     = array();//$task_obj->get_tasks( $list_id, $permission['todo_view_private'] );
            $list->comments  = $task_obj->get_comments( $list_id );   

            foreach ( $list->comments as $key => $comment ) {
                 $comment->comment_content = do_shortcode( $comment->comment_content );
            }
        }
        
        if ( 'no' == $is_admin ) {
            new CPM_Frontend_URLs();
        }

        wp_send_json_success( array( 'permissions' => $permission, 'list' => $list, 'project_users' => $project_users, 'milestones' => $milestones ) );

        if ( empty( $list ) ) {
            echo json_encode( array (
                'success'  => false,
                'response' => '',
            ) );
        } else {

             $list = $this->add_new_list_kyes( $list, $project_id );

            $response = array (
                'list'       => $list,
                'success'     => true,
            );
            echo json_encode( $response );
        }
        exit();
    }


    function get_todo_list() {
        $task_obj   = CPM_Task::getInstance();
        $is_admin   = isset( $_POST[ 'is_admin' ] ) ? sanitize_text_field( $_POST[ 'is_admin' ] ) : 'yes';
        $list_id    = sanitize_text_field( $_POST[ 'list_id' ] );
        $project_id = sanitize_text_field( $_POST[ 'project_id' ] );
        $single     = sanitize_text_field( $_POST[ 'single' ] );
        $type       = (isset( $_POST[ 'type' ] ) && $_POST[ 'type' ] == 'json' ) ? 'json' : 'html';
        $tasks      = $task_obj->get_tasks_by_access_role( $list_id, $project_id );

        if ( 'no' == $is_admin ) {
            new CPM_Frontend_URLs();
        }

        $tasks     = cpm_tasks_filter( $tasks );
        $task_list = array();



        if ( count( $tasks[ 'pending' ] ) ) {
            foreach ( $tasks[ 'pending' ] as $task ) {
                $task_obj->set_todo_extra_data( $project_id, $list_id, $task, $single);
                array_push( $task_list, $task );
                if ( $type !== 'json' ) {
                    ?>
                    <li class="cpm-todo cpm-todo-openlist">
                        <?php echo cpm_task_html( $task, $project_id, $list_id ); ?>
                    </li>
                    <?php
                }
            }
        }

        if ( $single && count( $tasks[ 'completed' ] ) ) {
            foreach ( $tasks[ 'completed' ] as $task ) {
                array_push( $task_list, $task );
                $task_obj->set_todo_extra_data( $project_id, $list_id, $task, $single );
                if ( $type !== 'json' ) {
                    ?>
                    <li class="cpm-todo cpm-todo-closelist">
                        <?php echo cpm_task_html( $task, $project_id, $list_id ); ?>
                    </li>
                    <?php
                }
            }
        }

        if ( $type === 'json' ) {
            $response[ 'success' ]  = TRUE;
            $response[ 'tasklist' ] = $task_list;

            echo json_encode( $response );
        }

        exit();
    }

    /**
     * Get single task,  Required project ID and task ID
     *
     * @since 0.4
     * 
     * @return obj
     */
    function get_todo_single() {
        check_ajax_referer( 'cpm_nonce' );
        
        $task_obj   = CPM_Task::getInstance();
        $is_admin   = isset( $_POST[ 'is_admin' ] ) ? sanitize_text_field( $_POST[ 'is_admin' ] ) : 'yes';
        $task_id    = sanitize_text_field( $_POST[ 'task_id' ] );
        $project_id = sanitize_text_field( $_POST[ 'project_id' ] );
        $task       = $task_obj->get_task( $task_id);

        $task->can_del_edit = cpm_user_can_delete_edit( $project_id, $task );

        wp_send_json_success( array( 'task' => $task ) );
    }


    function get_post_comments() {
        check_ajax_referer( 'cpm_nonce' );
        $posted               = $_POST;
        $post_id              = isset( $posted['post_id'] ) ? intval( $posted['post_id'] ) : 0;
        $comment_obj          = new CPM_Comment();
        $comments             = $comment_obj->get_comments( $post_id );
        $response['success']  = TRUE;
        $response['comments'] = $comments;
        echo json_encode( $response );

        exit();
    }

    function get_compiled_content(){
        $rendered = cpm_get_content( $_GET['content'] );
        echo json_encode( $rendered );
        exit();
    }

    function task_users( $task_users, $avatar = false ) {
        $user = array();
        if ( is_array( $task_users ) ) {
            foreach ( $task_users as $u ) {
                $user_details = get_user_by( 'ID', $u );
                if ( $user_details ) {
                    $nu = array (
                        'avatar' => cpm_url_user( $u, $avatar ),
                        'name'   => $user_details->display_name,
                        'id'     => $user_details->ID,
                        'email'  => $user_details->user_email
                    );
                    array_push( $user, $nu );
                }
            }
        }else {
            if ( $task_users != "" or $task_users != null ) {
                $user_details = get_user_by( 'ID', $task_users );
                if ( $user_details ) {
                    $nu = array (
                        'avatar' => cpm_url_user( $task_users, $avatar ),
                        'name'   => $user_details->display_name,
                        'id'     => $user_details->ID,
                        'email'  => $user_details->user_email
                    );
                    array_push( $user, $nu );
                }
            }
        }
        return $user;
    }

    function listfrom_extrafield( $project_id ) {
        ob_start();
        $r = do_action( 'cpm_tasklist_form', $project_id, array () );

        return ob_get_clean();
        exit();
    }

    function listfrom_extrafield_list() {

        $project_id = (isset( $_POST[ 'project_id' ] )) ? sanitize_text_field( $_POST[ 'project_id' ] ) : 0;
        $listid     = (isset( $_POST[ 'listid' ] )) ? sanitize_text_field( $_POST[ 'listid' ] ) : array ();

        $r = do_action( 'cpm_tasklist_form', $project_id, $listid );
        //echo json_encode( $r );
        exit();
    }

    function taskfrom_extrafield( $project_id ) {
        ob_start();

        $r = do_action( 'cpm_task_new_form', 0, $project_id, 0 );

        return ob_get_clean();
        exit();
    }

    function taskfrom_extrafield_list() {

        $project_id = (isset( $_POST[ 'project_id' ] )) ? sanitize_text_field( $_POST[ 'project_id' ] ) : 0;
        // $listid     = (isset( $_POST[ 'listid' ] )) ? sanitize_text_field( $_POST[ 'listid' ] ) : 0;
        $taskid     = (isset( $_POST[ 'taskid' ] )) ? sanitize_text_field( $_POST[ 'taskid' ] ) : 0;

        $r = do_action( 'cpm_task_new_form', $project_id, $taskid );
        //echo json_encode( $r );
        exit();
    }

    function hook_cpm_task_column( $project_id, $list_id, $task, $single = false ) {
        ob_start();

        $r = do_action( 'cpm_task_column', $task, $project_id, $list_id, $single, $task->completed );

        return ob_get_clean();
        exit();
    }

    function ajax_upload_old() {
        check_ajax_referer( 'cpm_ajax_upload', 'nonce' );

        $object_id   = isset( $_REQUEST['object_id'] ) ? intval( $_REQUEST['object_id'] ) : 0;
        $comment_obj = CPM_Comment::getInstance();
        $response    = $comment_obj->upload_file( $object_id );

        if ( $response['success'] ) {
            $file = $comment_obj->get_file( $response['file_id'] );

            $delete   = sprintf( '<a href="#" data-id="%d" class="cpm-delete-file button">%s</a>', $file['id'], __( 'Delete File', 'cpm' ) );
            $hidden   = sprintf( '<input type="hidden" name="cpm_attachment[]" value="%d" />', $file['id'] );
            $file_url = sprintf( '<a href="%1$s" target="_blank"><img src="%2$s" alt="%3$s" /></a>', $file['url'], $file['thumb'], esc_attr( $file['name'] ) );

            $html = '<div class="cpm-uploaded-item">' . $file_url . ' ' . $delete . $hidden . '</div>';
            echo json_encode( array(
                'success' => true,
                'content' => $html,
            ) );

            exit;
        }

        echo json_encode( array(
            'success' => false,
            'error'   => $response['error'],
        ) );

        exit;
    }

    function update_task_order() {
        check_ajax_referer( 'cpm_nonce' );

        $orders = $_POST['orders'];

        foreach ($orders as $task_id => $task_order) {
            $post_data = array(
                'ID' => $task_id,
                'menu_order' => $task_order
            );

            wp_update_post($post_data, true);
        }
                
        wp_send_json_success( __( 'Successfully reordered', 'cpm' ));
    }

}