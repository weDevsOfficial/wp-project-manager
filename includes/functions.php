<?php
/**
 * This file contains all the helper functions for Project Manager.
 *
 * @since 0.1
 * @package CPM
 */

/**
 * Filter all the tasks as pending and completed
 *
 * This function gets all the tasks for a tasklist and returns pending and
 * completed tasks as an array
 *
 * @uses `cpm_tasks_filter_done`
 * @uses `cpm_tasks_filter_pending`
 *
 * @since 0.1
 * @param array $tasks
 * @return array
 */
function cpm_tasks_filter( $tasks ) {
    $response = array(
        'completed' => array(),
        'pending' => array()
    );

    if ( $tasks ) {
        $response['pending'] = array_filter( $tasks, 'cpm_tasks_filter_pending' );
        $response['completed'] = array_filter( $tasks, 'cpm_tasks_filter_done' );
    }

    return $response;
}

/**
 * Filter function for `cpm_tasks_filter` for completed tasks
 *
 * @since 0.1
 * @param object $task
 * @return bool
 */
function cpm_tasks_filter_done( $task ) {
    return $task->completed == '1';
}

/**
 * Filter function for `cpm_tasks_filter` for pending tasks
 *
 * @since 0.1
 * @param object $task
 * @return bool
 */
function cpm_tasks_filter_pending( $task ) {
    return $task->completed != '1';
}

/**
 * A user dropdown helper function.
 *
 * Similar to `wp_dropdown_users` function, but it is made for custom placeholder
 * attribute and for multiple dropdown. It's mainly used in creating and editing
 * projects.
 *
 * @since 0.1
 * @param type $selected
 * @return string
 */
function cpm_dropdown_users( $selected = array() ) {

    $placeholder = __( 'Select co-workers', 'cpm' );
    $sel = ' selected="selected"';

    $users = get_users();
    $options = array();
    if ( $users ) {
        foreach ($users as $user) {
            $options[] = sprintf( '<option value="%s"%s>%s</option>', $user->ID, array_key_exists( $user->ID, $selected ) ? $sel : '', $user->display_name );
        }
    }

    $dropdown = '<select name="project_coworker[]" id="project_coworker" placeholder="' . $placeholder . '" multiple="multiple">';
    $dropdown .= implode("\n", $options );
    $dropdown .= '</select>';

    return $dropdown;
}

/**
 * Helper function for converting a normal date string to unix date/time string
 *
 * @since 0.1
 * @param string $date
 * @param int $gmt
 * @return string
 */
function cpm_date2mysql( $date, $gmt = 0 ) {
    $time = strtotime( $date );
    return ( $gmt ) ? gmdate( 'Y-m-d H:i:s', $time ) : gmdate( 'Y-m-d H:i:s', ( $time + ( get_option( 'gmt_offset' ) * 3600 ) ) );
}

/**
 * Displays users as checkboxes from a project
 *
 * @since 0.1
 * @param int $project_id
 */
function cpm_user_checkboxes( $project_id ) {
    $pro_obj = CPM_Project::getInstance();
    $users = $pro_obj->get_users( $project_id );
    $cur_user = get_current_user_id();

    //remove current logged in user from list
    if ( array_key_exists( $cur_user, $users ) ) {
        unset( $users[$cur_user] );
    }

    if ( $users ) {
        foreach ($users as $user) {
            $check = sprintf( '<input type="checkbox" name="notify_user[]" id="cpm_notify_%1$s" value="%1$s" />', $user['id'] );
            printf( '<label for="cpm_notify_%d">%s %s</label> ', $user['id'], $check, $user['name'] );
        }
    } else {
        echo __( 'No users found', 'cpm' );
    }

    return $users;
}

/**
 * User dropdown for task
 *
 * @since 0.1
 * @param int $project_id
 * @param int $selected
 */
function cpm_task_assign_dropdown( $project_id, $selected = '-1' ) {
    $users = CPM_Project::getInstance()->get_users( $project_id );

    if ( $users ) {
        echo '<select name="task_assign" id="task_assign">';
        echo '<option value="-1">' . __( '-- assign to --', 'cpm' ) . '</option>';

        foreach ($users as $user) {
            printf( '<option value="%s"%s>%s</opton>', $user['id'], selected( $selected, $user['id'], false ), $user['name'] );
        }
        echo '</select>';
    }
}

/**
 * Comment form upload field helper
 *
 * Generates markup for ajax file upload list and prints attached files.
 *
 * @since 0.1
 * @param int $id comment ID. used for unique edit comment form pickfile ID
 * @param array $files attached files
 */
function cpm_upload_field( $id, $files = array() ) {
    $id = $id ? '-' . $id : '';
    ?>
    <div id="cpm-upload-container<?php echo $id; ?>">
        <div class="cpm-upload-filelist">
            <?php if ( $files ) { ?>
                <?php foreach ($files as $file) {
                    $delete = sprintf( '<a href="#" data-id="%d" class="cpm-delete-file button">%s</a>', $file['id'], __( 'Delete File' ) );
                    $hidden = sprintf( '<input type="hidden" name="cpm_attachment[]" value="%d" />', $file['id'] );
                    $file_url = sprintf( '<a href="%1$s" target="_blank"><img src="%2$s" alt="%3$s" /></a>', $file['url'], $file['thumb'], esc_attr( $file['name'] ) );

                    $html = '<div class="cpm-uploaded-item">' . $file_url . ' ' . $delete . $hidden . '</div>';
                    echo $html;
                } ?>
            <?php } ?>
        </div>
        <?php printf( __('To attach, <a id="cpm-upload-pickfiles%s" href="#">select files</a> from your computer.', 'cpm' ), $id ); ?>
    </div>
    <?php
}

/**
 * Helper function for formatting date field
 *
 * @since 0.1
 * @param string $date
 * @param bool $show_time
 * @return string
 */
function cpm_get_date( $date, $show_time = false ) {
    $date = strtotime( $date );

    if ( $show_time ) {
        $format = get_option( 'date_format' ) . ' ' . get_option( 'time_format' );
    } else {
        $format = get_option( 'date_format' );
    }

    $date_html = sprintf( '<time datetime="%1$s" title="%1$s">%2$s</time>', date( 'c', $date ), date_i18n( $format, $date ) );

    return apply_filters( 'cpm_get_date', $date_html, $date );
}

/**
 * Show info messages
 *
 * @since 0.1
 * @param string $msg message to show
 * @param string $type message type
 */
function cpm_show_message( $msg, $type = 'cpm-updated' ) {
    ?>
    <div class="<?php echo esc_attr( $type ); ?>">
        <p><strong><?php echo $msg; ?></strong></p>
    </div>
    <?php
}

/**
 * Helper function to generate task list completeness progressbar
 *
 * @since 0.1
 * @param int $total
 * @param int $completed
 * @return string
 */
function cpm_task_completeness( $total, $completed ) {
    //skipping vision by zero problem
    if ( $total < 1 ) {
        return;
    }

    $percentage = (100 * $completed) / $total;

    ob_start();
    ?>
    <div class="cpm-progress cpm-progress-info">
        <div style="width:<?php echo $percentage; ?>%" class="bar completed"></div>
        <div class="text"><?php printf( '%s: %d%% (%d of %d)', __( 'Completed', 'cpm' ), $percentage, $completed, $total ); ?></div>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Helper function to calcalute left milestone
 *
 * @since 0.1
 * @param int $from
 * @param int $to
 * @return bool
 */
function cpm_is_left( $from, $to ) {
    $diff = $to - $from;

    if ( $diff > 0 ) {
        return true;
    }

    return false;
}

/**
 * The main logging function
 *
 * @since 0.1
 * @uses error_log
 * @param string $type type of the error. e.g: debug, error, info
 * @param string $msg
 */
function cpm_log( $type = '', $msg = '' ) {
    if ( WP_DEBUG == true ) {
        $msg = sprintf( "[%s][%s] %s\n", date( 'd.m.Y h:i:s' ), $type, $msg );
        error_log( $msg, 3, dirname( __FILE__ ) . '/debug.log' );
    }
}

/**
 * Helper function for displaying localized numbers
 *
 * @since 0.1
 * @param int $number
 * @return string
 */
function cpm_get_number( $number ) {
    return number_format_i18n( $number );
}

/**
 * Helper function for generating anchor tags
 *
 * @since 0.1
 * @param string $link
 * @param string $text
 * @return string
 */
function cpm_print_url( $link, $text ) {
    return sprintf( '<a href="%s">%s</a>', $link, $text );
}

/**
 * Displays tasks, messages, milestones contents. Removed `the_content` filter
 * and applied other filters due to conflicts created by other plugins.
 *
 * @since 0.1
 * @param string $content
 * @return string
 */
function cpm_get_content( $content ) {
    $content = apply_filters( 'cpm_get_content', $content );

    return $content;
}

/**
 * Helper function to include `header.php` ono project tabs
 *
 * @since 0.1
 * @param string $active_menu
 * @param int $project_id
 */
function cpm_get_header( $active_menu, $project_id = 0 ) {
    $cpm_active_menu = $active_menu;

    require_once CPM_PLUGIN_PATH . '/views/project/header.php';
}

/**
 * Displays comment texts. Mainly used for applying `comment_text` filter
 * on messages, tasks and to-do's comments.
 *
 * @since 0.1
 * @param type $comment_ID
 * @return string
 */
function cpm_comment_text( $comment_ID = 0 ) {
    $comment = get_comment( $comment_ID );
    return apply_filters( 'comment_text', get_comment_text( $comment_ID ), $comment );
}

/**
 * Helper function for displaying excerpts
 *
 * @since 0.1
 * @param string $text
 * @param int $length
 * @param string $append
 * @return string
 */
function cpm_excerpt( $text, $length, $append = '...' ) {
    $text = wp_strip_all_tags( $text, true );
    $count = mb_strlen( $text );
    $text = mb_substr( $text, 0, $length );

    if( $count > $length ) {
        $text = $text . $append;
    }

    return $text;
}

/**
 * Helper function for displaying data attributes on HTML tags
 *
 * @since 0.1
 * @param array $values
 */
function cpm_data_attr( $values ) {

    $data = array();
    foreach ($values as $key => $val) {
        $data[] = sprintf( 'data-%s="%s"', $key, esc_attr( $val ) );
    }

    echo implode( ' ', $data );
}

/**
 * Helper function for displaying project summary
 *
 * @since 0.1
 * @param object $info
 * @return string
 */
function cpm_project_summary( $info ) {
    $info_array = array();

    if( $info->discussion ) {
        $info_array[] = sprintf( _n( '%d message', '%d messages', $info->discussion, 'cpm' ), $info->discussion );
    }

    if( $info->todolist ) {
        $info_array[] = sprintf( _n( '%d to-do list', '%d to-do lists', $info->todolist, 'cpm' ), $info->todolist );
    }

    if( $info->todos ) {
        $info_array[] = sprintf( _n( '%d to-do', '%d to-dos', $info->todos, 'cpm' ), $info->todos );
    }

    if( $info->comments ) {
        $info_array[] = sprintf( _n( '%d comment', '%d comments', $info->comments, 'cpm' ), $info->comments );
    }

    if( $info->files ) {
        $info_array[] = sprintf( _n( '%d file', '%d files', $info->files, 'cpm' ), $info->files );
    }

    if( $info->milestone ) {
        $info_array[] = sprintf( _n( '%d milestone', '%d milestones', $info->milestone, 'cpm' ), $info->milestone );
    }

    return implode(', ', $info_array );
}

/**
 * Serve project files with proxy
 *
 * This function handles project files for privacy. It gets the file ID
 * and project ID as input. Checks if the current user has access on that
 * project and serves the attached file with right header type. If the
 * request is not from a user from this project, s/he will not be able to
 * see the file.
 *
 * @uses `wp_ajax_cpm_file_get` action
 * @since 0.3
 */
function cpm_serve_file() {
    $file_id = isset( $_GET['file_id'] ) ? intval( $_GET['file_id'] ) : 0;
    $project_id = isset( $_GET['project_id'] ) ? intval( $_GET['project_id'] ) : 0;
    $type = isset( $_GET['type'] ) ? $_GET['type'] : 'full';

    //check permission
    $pro_obj = CPM_Project::getInstance();
    $project = $pro_obj->get( $project_id );
    if ( !$pro_obj->has_permission( $project ) ) {
        die( 'file access denied' );
    }

    //get file path
    $file_path = get_attached_file( $file_id );
    if ( !file_exists( $file_path ) ) {
        header( "Status: 404 Not Found" );
        die('file not found');
    }

    if ( $type == 'thumb' ) {
        $metadata = wp_get_attachment_metadata( $file_id );
        $filename = basename( $file_path );

        //if thumbnail is found, replace file name with thumb file name
        if ( array_key_exists( 'thumbnail', $metadata['sizes'] ) ) {
            $file_path = str_replace( $filename, $metadata['sizes']['thumbnail']['file'], $file_path );
        }
    }

    $extension = strtolower( substr( strrchr( $file_path, '.' ), 1 ) );

    // get the file mime type using the file extension
    switch ($extension) {
        case 'jpeg':
        case 'jpg':
            $mime = 'image/jpeg';
            break;

        case 'png':
            $mime = 'image/png';
            break;

        case 'gif':
            $mime = 'image/gif';
            break;

        case 'bmp':
            $mime = 'image/bmp';
            break;

        default:
            $mime = 'application/force-download';
    }

    // serve the file with right header
    if ( is_readable( $file_path ) ) {
        header( 'Content-Type: ' . $mime );
        header( 'Content-Transfer-Encoding: binary' );
        header( 'Content-Disposition: inline; filename=' . basename( $file_path ) );
        readfile( $file_path );
    }

    exit;
}

add_action( 'wp_ajax_cpm_file_get', 'cpm_serve_file' );

/**
 * Show denied file access for un-authenticated users
 *
 * @since 0.3.1
 */
function cpm_serve_file_denied() {
    die( 'file access denied' );
}

add_action( 'wp_ajax_nopriv_cpm_file_get', 'cpm_serve_file_denied' );

/**
 * Remove comments from listing publicly
 *
 * Hides all comments made on project, task_list, task, milestone, message
 * from listing on frontend, admin dashboard, and admin comments page.
 *
 * @since 0.2
 *
 * @param array $clauses
 * @return array
 */
function cpm_hide_comments( $clauses ) {
    global $wpdb, $pagenow;

    if ( !is_admin() || $pagenow == 'edit-comments.php' || (is_admin() && $pagenow == 'index.php') ) {
        $post_types = implode( "', '", array('project', 'task_list', 'task', 'milestone', 'message') );
        $clauses['join'] .= " JOIN $wpdb->posts as cpm_p ON cpm_p.ID = $wpdb->comments.comment_post_ID";
        $clauses['where'] .= " AND cpm_p.post_type NOT IN('$post_types')";
    }

    return $clauses;
}

add_filter( 'comments_clauses', 'cpm_hide_comments', 99 );

/**
 * Hide project comments from comment RSS
 * 
 * @global object $wpdb
 * @param string $where
 * @return string
 */
function cpm_hide_comment_rss( $where ) {
    global $wpdb;

    $post_types = implode( "', '", array('project', 'task_list', 'task', 'milestone', 'message') );
    $where .= " AND {$wpdb->posts}.post_type NOT IN('$post_types')";
    
    return $where;
}

add_filter( 'comment_feed_where', 'cpm_hide_comment_rss' );


/**
 * Get the value of a settings field
 *
 * @since 0.4
 * @param string $option option field name
 * @return mixed
 */
function cpm_get_option( $option ) {

    $fields = CPM_Admin::get_settings_fields();
    $prepared_fields = array();

    //prepare the array with the field as key
    //and set the section name on each field
    foreach ($fields as $section => $field) {
        foreach ($field as $fld) {
            $prepared_fields[$fld['name']] = $fld;
            $prepared_fields[$fld['name']]['section'] = $section;
        }
    }

    // bail if option not found
    if ( !isset( $prepared_fields[$option] ) ) {
        return;
    }
    
    //get the value of the section where the option exists
    $opt = get_option( $prepared_fields[$option]['section'] );
    $opt = is_array($opt) ? $opt : array();

    //return the value if found, otherwise default
    if ( array_key_exists( $option, $opt ) ) {
        return $opt[$option];
    } else {
        $val = isset( $prepared_fields[$option]['default'] ) ? $prepared_fields[$option]['default'] : '';
        return $val;
    }
}

if ( !function_exists( 'get_ipaddress' ) ) {

    /**
     * Returns users current IP Address
     *
     * @since 0.4
     * @return string IP Address
     */
    function get_ipaddress() {
        if ( empty( $_SERVER["HTTP_X_FORWARDED_FOR"] ) ) {
            $ip_address = $_SERVER["REMOTE_ADDR"];
        } else {
            $ip_address = $_SERVER["HTTP_X_FORWARDED_FOR"];
        }
        if ( strpos( $ip_address, ',' ) !== false ) {
            $ip_address = explode( ',', $ip_address );
            $ip_address = $ip_address[0];
        }
        return $ip_address;
    }

}

/**
 * Check if a user can access a project
 * 
 * @since 0.4.4
 * 
 * @param int $project_id
 * @return boolean
 */
function cpm_user_can_access( $project_id ) {
    $user_id = get_current_user_id();
    $project_author = get_post_field( 'post_author', $project_id );
    
    if ( $user_id == $project_author ) {
        return true;
    }
    
    $co_worker = get_post_meta( $project_id, '_coworker', true );
    $co_worker = is_array( $co_worker ) ? $co_worker : array();
    
    if ( in_array( $user_id, $co_worker ) ) {
        return true;
    }
    
    return false;
}


/**
 * Check if current user can manage projects
 * 
 * @since 0.4.4
 * @return boolean
 */
function cpm_manage_capability() {
    $admin_right = apply_filters( 'cpm_admin_right', 'delete_pages' );

    if ( current_user_can( $admin_right ) ) {
        return true;
    }

    return false;
}


/**
 * Substitute function to support pro version and frontend
 * 
 * @since 0.4.4
 * @param int $project_id
 * @return boolean
 */
function cpm_is_project_archived( $project_id ) {
    return false;
}

/**
 * Check if the current user has certain project manage capability
 * 
 * Substitute function of pro version
 * 
 * @since 0.4.4
 * @param type $project_id
 * @return boolean
 */
function cpm_user_can_delete_edit( $project_id ) {
    $user_id = get_current_user_id();
    $project_author = get_post_field( 'post_author', $project_id );
    
    if ( $user_id == $project_author ) {
        return true;
    }
    
    return false;
}

function cpm_pagination( $total, $limit, $pagenum ) {
    $num_of_pages = ceil( $total / $limit );
    $page_links = paginate_links( array(
        'base'      => add_query_arg( 'pagenum', '%#%' ),
        'format'    => '',
        'prev_text' => __( '&laquo;', 'aag' ),
        'next_text' => __( '&raquo;', 'aag' ),
        'add_args'  => false,
        'total'     => $num_of_pages,
        'current'   => $pagenum
    ) );

    if ( $page_links ) {
        echo '<div class="tablenav"><div class="tablenav-pages" style="margin: 1em 0">' . $page_links . '</div></div>';
    }
}

function cpm_project_actions() {}
function cpm_user_create_form() {}