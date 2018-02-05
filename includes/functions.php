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
        'pending'   => array()
    );

    if ( $tasks ) {
        $response['pending']   = array_filter( $tasks, 'cpm_tasks_filter_pending' );
        $response['completed'] = array_filter( $tasks, 'cpm_tasks_filter_done' );
    }

    return $response;
}

function cpm_project_filters() {
    if ( cpm_can_manage_projects() ) {
        ?>
        <input type="text" id="cpm-search-client" name="searchitem" placeholder="<?php _e( 'Search by Client...', 'cpm' ); ?>" value="" />
    <?php } ?>
    <input type="text" id="cpm-all-search" name="searchitem" placeholder="<?php _e( 'Search All...', 'cpm' ); ?>" value="" />
    <?php
}

/**
 * A category dropdown helper function.
 *
 * @since 0.4.4
 *
 * @param int $current_category_id
 * @param bool $show_count
 * @param boll $show_all
 * @return string
 */
function cpm_dropdown_category( $current_category_id = -1, $show_count = false, $show_all = false, $class = '' ) {
    $args = array(
        'class'            => $class,
        'child_of'         => 0,
        'depth'            => 0,
        'echo'             => 0,
        'hide_empty'       => 0,
        'hide_if_empty'    => 0,
        'hierarchical'     => true,
        'name'             => 'project_cat',
        'order'            => 'ASC',
        'orderby'          => 'name',
        'selected'         => $current_category_id,
        'show_count'       => $show_count,
        'show_option_all'  => $show_all ? __( '- All Categories -', 'cpm' ) : '',
        'show_option_none' => ! $show_all ? __( '- Project Category -', 'cpm' ) : '',
        'tab_index'        => 0,
        'taxonomy'         => 'cpm_project_category',
    );

    $args = apply_filters( 'cpm_category_dropdown', $args, $current_category_id );

    return wp_dropdown_categories( $args );
}

function cpm_filter_category( $current_category_id ) {
    return cpm_dropdown_category( $current_category_id, false, false );
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

    $placeholder = __( 'Select Co-Workers', 'cpm' );
    $sel         = ' selected="selected"';

    $users   = get_users();
    $options = array();
    if ( $users ) {
        foreach ( $users as $user ) {
            $options[] = sprintf( '<option value="%s"%s>%s</option>', $user->ID, array_key_exists( $user->ID, $selected ) ? $sel : '', $user->display_name );
        }
    }

    $dropdown = '<select name="project_coworker[]" id="project_coworker" placeholder="' . $placeholder . '" multiple="multiple">';
    $dropdown .= implode( "\n", $options );
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
    //return ( $gmt ) ? gmdate( 'Y-m-d H:i:s', $time ) : get_gmt_from_date( date( 'Y-m-d H:i:s', strtotime( $date ) ) ); //gmdate( 'Y-m-d H:i:s', ( $time + ( get_option( 'timezone_string' ) * 3600 ) ) );
    return ( $gmt ) ? gmdate( 'Y-m-d H:i:s', $time ) : gmdate( 'Y-m-d H:i:s', strtotime( $date ) );
}

function cpm_to_mysql_date( $date, $gmt = 0 ) {
    return ( $gmt ) ? gmdate( 'Y-m-d', $time ) : gmdate( 'Y-m-d', strtotime( $date ) );
}
/**
 * Displays users as checkboxes from a project
 *
 * @since 0.1
 * @param int $project_id
 */
function cpm_user_checkboxes( $project_id ) {
    $pro_obj  = CPM_Project::getInstance();
    $users    = $pro_obj->get_users( $project_id );
    $cur_user = get_current_user_id();

    foreach ( $users as $key => $user ) {
        // remove current logged in user from list
        if ( $user['id'] == $cur_user ) {
            unset( $users[$key] );
            continue;
        }
        // prepare to sort users by name
        $sort[$key] = strtolower( $user['name'] );
    }

    if ( $users ) {
        ?>

        <h2 class="cpm-box-title"> <?php _e( 'Notify users', 'cpm' ); ?>
            <label class="cpm-small-title" for="select-all"> <input type="checkbox" name="select-all" id="select-all" class="cpm-toggle-checkbox" /> <?php _e( 'Select all', 'cpm' ); ?></label>
        </h2>

        <ul class='cpm-user-list' >
            <?php
            array_multisort( $sort, SORT_ASC, $users );

            foreach ( $users as $user ) {
                $check = sprintf( '<input type="checkbox" name="notify_user[]" id="cpm_notify_%1$s" value="%1$s" />', $user['id'] );
                printf( '<li><label for="cpm_notify_%d">%s %s</label></li>', $user['id'], $check, ucwords( strtolower( $user['name'] ) ) );
            }
            ?>

            <div class='clearfix'></div>
        </ul>
        <?php
    } else {
        echo __( 'No users found.', 'cpm' );
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
        echo '<select name="task_assign[]" class="chosen-select"  id="task_assign" multiple="multiple" data-placeholder="' . __( 'Select User', 'cpm' ) . '">';

        foreach ( $users as $user ) {

            if ( is_array( $selected ) ) {
                $selectd_status = in_array( $user['id'], $selected ) ? 'selected="selected"' : '';
            } else {
                $selectd_status = selected( $selected, $user['id'], false );
            }
            printf( '<option value="%s"%s>%s</opton>', $user['id'], $selectd_status, $user['name'] );
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
                <?php
                foreach ( $files as $file ) {
                    $delete   = sprintf( '<a href="#" data-id="%d" class="cpm-delete-file button">%s</a>', $file['id'], __( 'Delete File', 'cpm' ) );
                    $hidden   = sprintf( '<input type="hidden" name="cpm_attachment[]" value="%d" />', $file['id'] );
                    $file_url = sprintf( '<a href="%1$s" target="_blank"><img src="%2$s" alt="%3$s" /></a>', $file['url'], $file['thumb'], esc_attr( $file['name'] ) );

                    $html = '<div class="cpm-uploaded-item">' . $file_url . ' ' . $delete . $hidden . '</div>';
                    echo $html;
                }
                ?>
            <?php } ?>
        </div>
        <?php printf( __( 'To attach, %sselect files%s from your computer.', 'cpm' ), sprintf( '<a id="cpm-upload-pickfiles%s" href="#">', $id ), '</a>' ); ?>
    </div>
    <?php
}

/**
 * Helper function for formatting date field
 *
 * @since 0.1
 *
 * @param string $date
 * @param bool $show_time
 *
 * @return string
 */
function cpm_get_date( $date, $show_time = false, $format = null ) {

    $formatted = cpm_get_date_without_html( $date, $show_time, $format );
    $date_html = sprintf( '<time datetime="%1$s" title="%1$s">%2$s</time>', date( 'c', strtotime( $date ) ), $formatted );

    return apply_filters( 'cpm_get_date', $date_html, $date );
}

/**
 * Helper function for formatting date field without html
 *
 * @since 1.2
 *
 * @param string $date
 * @param bool $show_time
 *
 * @return string
 */
function cpm_get_date_without_html( $date, $show_time = false, $format = null ) {

    $date = strtotime( $date );

    if ( null === $format ) {
        if ( $show_time ) {
            $format = get_option( 'date_format' ) . ' ' . get_option( 'time_format' );
        } else {
            $format = get_option( 'date_format' );
        }
    }

    $date_html = sprintf( '%s', date_i18n( $format, $date ) );

    return apply_filters( 'cpm_get_date_without_html', $date_html, $date );
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
 *
 * @param int $total
 * @param int $completed
 *
 * @return string
 */
function cpm_task_completeness( $total, $completed ) {
    $percentage = ( $total > 0 ) ? (100 * $completed) / $total : 0;

    ob_start();
    ?>
    <div class="cpm-progress cpm-progress-info">
        <div style="width:<?php echo $percentage; ?>%" class="bar completed"></div>
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
    require_once CPM_PATH . '/views/project/header.php';
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

    if ( function_exists( 'mb_strlen' ) ) {
        $count = mb_strlen( $text );
        $text  = mb_substr( $text, 0, $length );
    } else {
        $count = strlen( $text );
        $text  = substr( $text, 0, $length );
    }

    if ( $count > $length ) {
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
    foreach ( $values as $key => $val ) {
        $data[] = sprintf( 'data-%s="%s"', $key, esc_attr( $val ) );
    }

    echo implode( ' ', $data );
}

function cpm_project_summary_info( $info, $project_id ) {
    $summary            = array();
    $summary['message'] = array(
        'label' => _n( 'Discussion', 'Discussions', $info->discussion, 'cpm' ),
        'count' => $info->discussion,
        'url'   => cpm_url_message_index( $project_id )
    );

    $summary['todo'] = array(
        'label' => _n( 'Task List', 'Task Lists', $info->todolist, 'cpm' ),
        'count' => $info->todolist,
        'url'   => cpm_url_tasklist_index( $project_id )
    );

    $summary['todos'] = array(
        'label' => _n( 'Task', 'Tasks', $info->todos, 'cpm' ),
        'count' => $info->todos,
        'url'   => cpm_url_tasklist_index( $project_id )
    );

    $summary['comments'] = array(
        'label' => _n( 'Comment', 'Comments', $info->comments, 'cpm' ),
        'count' => $info->comments,
        'url'   => ''
    );

    $summary['files'] = array(
        'label' => _n( 'File', 'Files', $info->files, 'cpm' ),
        'count' => $info->files,
        'url'   => cpm_url_file_index( $project_id )
    );

    $summary['milestone'] = array(
        'label' => _n( 'Milestone', 'Milestones', $info->milestone, 'cpm' ),
        'count' => $info->milestone,
        'url'   => cpm_url_milestone_index( $project_id )
    );

    return $summary;
}

/**
 * Helper function for displaying project summary
 *
 * @since 0.1
 * @param object $info
 * @return string
 */
function cpm_project_summary( $info, $project_id ) {
    $info_array = array();
    $summary    = cpm_project_summary_info( $info, $project_id );
    foreach ( $summary as $key => $val ) {
        if ( $val['url'] != '' ) {
            $info_array[] = sprintf( "<li class='%s'><a href='%s'><strong>%d</strong> %s</a></li>", $key, $val['url'], $val['count'], $val['label'] );
        } else {
            $info_array[] = sprintf( "<li class='%s'><strong>%d</strong> %s</li>", $key, $val['count'], $val['label'] );
        }
    }
    return implode( '', $info_array );
}

/**
 * Helper function for displaying project summary in project overview page
 *
 * @since 3.8
 *
 * @param object $info
 *
 * @return string
 */
function cpm_project_overview_summary( $info, $project_id ) {
    $info_array = array();
    $summary    = cpm_project_summary_info( $info, $project_id );

    foreach ( $summary as $key => $val ) {
        if($val['url'] == ""  OR $val['url'] == '#' ){
           $info_array[] = sprintf( '<li class="%s"><a><div class="icon"></div> <div class="count"><span>%d</span> %s</div> </a></li>', $key,  $val['count'], $val['label'] );
        }else {
        $info_array[] = sprintf( '<li class="%s"><a href="%s"> <div class="icon"></div> <div class="count"><span>%d</span> %s</div> </a></li>', $key, $val['url'], $val['count'], $val['label'] );
        }
    }

    return implode( '', $info_array );
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
    $file_id    = isset( $_GET['file_id'] ) ? intval( $_GET['file_id'] ) : 0;
    $project_id = isset( $_GET['project_id'] ) ? intval( $_GET['project_id'] ) : 0;
    $type       = isset( $_GET['type'] ) ? $_GET['type'] : 'full';

    //check permission
    $pro_obj = CPM_Project::getInstance();
    $project = $pro_obj->get( $project_id );
    if ( ! $pro_obj->has_permission( $project ) ) {
        die( __( 'file access denied', 'cpm' ) );
    }

    //get file path
    $file_path = get_attached_file( $file_id );
    if ( ! file_exists( $file_path ) ) {
        header( "Status: 404 Not Found" );
        die( __( 'file not found', 'cpm' ) );
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
    switch ( $extension ) {
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

    if ( ! is_admin() || $pagenow == 'edit-comments.php' || (is_admin() && $pagenow == 'index.php') ) {
        $post_types = implode( "', '", array( 'cpm_project', 'cpm_task_list', 'cpm_task', 'cpm_milestone', 'cpm_message', 'sub_task' ) );
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

    $post_types = implode( "', '", array( 'cpm_project', 'cpm_task_list', 'cpm_task', 'cpm_milestone', 'cpm_message' ) );
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
//function cpm_get_option( $option ) {

function cpm_get_option( $option, $section = 'cpm_general', $default = '' ) {

    $options = get_option( $section );

    if ( isset( $options[$option] ) ) {
        return $options[$option];
    }

    return $default;
}

if ( ! function_exists( 'get_ipaddress' ) ) {

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

function cpm_settings_label() {
    $labels = array(
        'Message'   => array(
            'create_message'   => __( 'Create', 'cpm' ),
            'msg_view_private' => __( 'View Private', 'cpm' ),
        ),
        'Todo List' => array(
            'create_todolist'      => __( 'Create', 'cpm' ),
            'tdolist_view_private' => __( 'View Private', 'cpm' ),
        ),
        'Todo'      => array(
            'create_todo'       => __( 'Create', 'cpm' ),
            'todo_view_private' => __( 'View Private', 'cpm' ),
        ),
        'Milestone' => array(
            'create_milestone'       => __( 'Create', 'cpm' ),
            'milestone_view_private' => __( 'View Private', 'cpm' ),
        ),
        'Files'     => array(
            'upload_file_doc'   => __( 'Upload or create doc', 'cpm' ),
            'file_view_private' => __( 'View Private files or docs', 'cpm' ),
        ),
    );

    return apply_filters( 'cpm_project_permission', $labels );
}

function cpm_project_user_role_pre_chache( $project_id, $user_id = false ) {
    global $wpdb;

    $table = $wpdb->prefix . 'cpm_user_role';

    if ( ! $user_id ) {
        $user_id = get_current_user_id();
    }

    $role = $wpdb->get_var( $wpdb->prepare( "SELECT role FROM {$table} WHERE project_id = '%d' AND user_id='%d'", $project_id, $user_id ) );

    $project_user_role = ! empty( $role ) ? $role : false;

    return $project_user_role;
}

/**
 * Get a project user role by project id
 *
 * @param int $project_id
 * @parm int $user_id //
 * @return string
 */
function cpm_get_role_in_project( $project_id, $user_id = 0 ) {

    if ( absint( $user_id ) ) {
        $user = get_user_by( 'ID', $user_id );
    } else {
        $user = wp_get_current_user();
    }

    $cache_key         = 'cpm_project_user_role_' . $project_id . $user->ID;
    $project_user_role = wp_cache_get( $cache_key );

    if ( $project_user_role === false ) {
        $project_user_role = cpm_project_user_role_pre_chache( $project_id, $user->ID );
        wp_cache_set( $cache_key, $project_user_role );
    }

    return apply_filters( 'cpm_project_user_role', $project_user_role, $project_id, $user->ID );
}

/**
 * Check if a user a project manager of an individual project
 *
 * @param  int  $project_id
 *
 * @return boolean
 */
function cpm_is_single_project_manager( $project_id ) {

    $project_user_role = cpm_get_role_in_project( $project_id );

    return ( $project_user_role == 'manager' ) ? true : false;
}

/**
 * Check if a user has the manage capability
 *
 * @param  integer  $user_id
 *
 * @return boolean
 */
function cpm_can_manage_projects( $user_id = 0 ) {
    global $current_user;

    if ( absint( $user_id ) ) {
        $user = get_user_by( 'ID', $user_id );
    } else {
        $user = $current_user;
    }

    if ( ! $user ) {
        return false;
    }


    $loggedin_user_role = array_flip( $user->roles );
    $opt                = cpm_get_option( 'project_manage_role', 'cpm_general', array( 'administrator' => 'administrator', 'editor' => 'editor', 'author' => 'author' ) );
    $manage_cap_option  = $opt;
    $manage_capability  = array_intersect_key( $manage_cap_option, $loggedin_user_role );

    //checking project manage capability
    if ( $manage_capability ) {
        return true;
    }

    return false;
}

/**
 * Check if a user has the project create capability
 *
 * @param  integer  $user_id
 *
 * @return boolean
 */
function cpm_can_create_projects( $user_id = 0 ) {
    global $current_user;

    if ( absint( $user_id ) ) {
        $user = get_user_by( 'ID', $user_id );
    } else {
        $user = $current_user;
    }

    if ( ! $user ) {
        return false;
    }

    //checking project manage capability
    if ( cpm_can_manage_projects( $user->ID ) ) {
        return true;
    }

    $loggedin_user_role       = array_flip( $user->roles );
    $manage_cap_option        = cpm_get_option( 'project_create_role', 'cpm_general', array( 'administrator' => 'administrator', 'editor' => 'editor', 'author' => 'author' ) );
    $project_ceate_capability = array_intersect_key( $loggedin_user_role, $manage_cap_option );

    //checking project create capability
    if ( $project_ceate_capability ) {
        return true;
    }

    return false;
}

/**
 * Check if a user has the owner for the task list
 *
 * @param  integer  $user_id
 * @param  objec $list
 * @param  $id_only
 *
 * @return boolean
 */
function cpm_user_can_delete_edit( $project_id, $post, $id_only = false ) {
    if ( $id_only ) {
        $post = get_post( intval( $post ) );
    }

    $user = wp_get_current_user();

    // grant project manager all access
    // also if the user role has the ability to manage all projects from settings, allow him
    if ( cpm_can_manage_projects() || cpm_is_single_project_manager( $project_id ) || $user->ID == $post->post_author ) {
        return true;
    }

    return false;
}

/**
 * Check if a user has any access on a project
 *
 * @param  int      $project_id
 * @param  string   $section
 * @param  integer  $user_id
 *
 * @return boolean
 */
function cpm_user_can_access( $project_id, $section = '', $user_id = 0 ) {
    global $current_user;

    if ( absint( $user_id ) ) {
        $user = get_user_by( 'ID', $user_id );
    } else {
        $user = $current_user;
    }

    if ( ! $user ) {
        return false;
    }

    if ( ! cpm_is_pro() ) {
        return true;
    }

    //chck manage capability
    if ( cpm_can_manage_projects( $user->ID ) ) {
        return true;
    }

    $uesr_role_in_project = cpm_get_role_in_project( $project_id, $user->ID );

    //If current user has no role in this project
    if ( ! $uesr_role_in_project ) {
        return false;
    }

    // grant project manager all access
    // also if the user role has the ability to manage all projects from settings, allow him
    if ( $uesr_role_in_project == 'manager' ) {
        return true;
    }
    
    $can_access = cpm_get_project_permsision_settings( $project_id, $uesr_role_in_project, $section );

    return $can_access;
}

/**
 * Check if a user has any access from a project settings
 *
 * @param  int     $project_id
 * @param  string  $uesr_role_in_project
 * @param  string  $section
 *
 * @return boolean
 */
function cpm_get_project_permsision_settings( $project_id, $uesr_role_in_project, $section ) {
    $settings_role = get_post_meta( $project_id, '_settings', true );
    $can_access    = isset( $settings_role[$uesr_role_in_project][$section] ) ? $settings_role[$uesr_role_in_project][$section] : '';

    return ( $can_access == 'yes' ) ? true : false;
}

function cpm_user_can_access_file( $project_id, $section, $is_private ) {

    if ( $is_private == 'no' ) {
        return true;
    }

    return cpm_user_can_access( $project_id, $section );
}

/**
 * Get all the orders from a specific seller
 *
 * @global object $wpdb
 *
 * @param int $seller_id
 *
 * @return array
 */
function cpm_project_count() {
    global $wpdb;
    $table = $wpdb->prefix . 'cpm_user_role';

    $user_id   = get_current_user_id();
    $cache_key = 'cpm_project_count';
    $count     = wp_cache_get( $cache_key, 'cpm' );

    if ( isset( $_GET['project_cat'] ) && ! empty( $_GET['project_cat'] ) && ( $_GET['project_cat'] != '-1' ) ) {
        $project_category      = $_GET['project_cat'];
        $project_category_join = " LEFT JOIN {$wpdb->term_relationships} as term ON term.object_id = post.ID";
        $project_category      = " AND term.term_taxonomy_id IN ($project_category)";
    } else {
        $project_category      = '';
        $project_category_join = '';
    }

    $project_category_join = apply_filters( 'cpm_project_activity_count_join', $project_category_join );
    $project_category      = apply_filters( 'cpm_project_activity_count_where', $project_category );

    if ( cpm_can_manage_projects() == false ) {
        $role_join  = "LEFT JOIN {$table} AS role ON role.project_id = post.ID";
        $role_where = "AND role.user_id = $user_id";
    } else {
        $role_join  = '';
        $role_where = '';
    }

    if ( $count === false ) {
        $sql = "SELECT COUNT(post.ID) AS count, meta.meta_value AS type FROM {$wpdb->posts} AS post
            LEFT JOIN {$wpdb->postmeta} AS meta on meta.post_id = post.ID
            $project_category_join
            $role_join
            WHERE
                post.post_type ='cpm_project'
                AND post.post_status = 'publish'
                $project_category
                $role_where
                AND meta.meta_key = '_project_active'
                GROUP BY meta.meta_value";

        $count = $wpdb->get_results( $sql );

        wp_cache_set( $cache_key, $count, 'cpm' );
    }

    if ( is_array( $count ) && count( $count ) ) {
        foreach ( $count as $key => $obj ) {
            if ( $obj->type == 'yes' ) {
                $active = $obj->count;
            }
            if ( $obj->type == 'no' ) {
                $archive = $obj->count;
            }
        }
    }

    $count['active']  = isset( $active ) ? $active : 0;
    $count['archive'] = isset( $archive ) ? $archive : 0;

    return $count;
}

function cpm_project_actions( $project_id ) {
    if (is_admin()){
        $url = admin_url( "admin.php?page=cpm_projects" );
    } else {
        $url = add_query_arg( array( 'page' => 'cpm_projects' ), get_permalink() );
    }
    ?>
    <div class="cpm-project-action">
        <span class="dashicons dashicons-admin-generic cpm-settings-bind"></span>

        <ul class="cpm-settings" >
            <li>
                <span class="cpm-spinner"></span>
                <a href="<?php echo cpm_url_projects() ?>" class="cpm-project-delete-link" title="<?php esc_attr_e( 'Delete project', 'cpm' ); ?>" <?php cpm_data_attr( array( 'confirm' => __( 'Are you sure to delete this project?', 'cpm' ), 'project_id' => $project_id ) ) ?>>
                    <span class="dashicons dashicons-trash"></span>
                    <span><?php _e( 'Delete', 'cpm' ); ?></span>
                </a>
            </li>
            <li>
                <span class="cpm-spinner"></span>
                <?php if ( get_post_meta( $project_id, '_project_active', true ) == 'yes' ) { ?>
                    <a class="cpm-archive" data-type="archive" data-project_id="<?php echo $project_id; ?>" href="#">
                        <span class="dashicons dashicons-yes"></span>
                        <span><?php _e( 'Complete', 'cpm' ); ?></span>
                    </a>
                <?php } else { ?>
                    <a class="cpm-archive" data-type="restore" data-project_id="<?php echo $project_id; ?>" href="#">
                        <span class="dashicons dashicons-undo"></span>
                        <span><?php _e( 'Restore', 'cpm' ); ?></span>
                    </a>
                <?php } ?>
            </li>

            <?php if ( cpm_is_pro() ) { ?>
                <li>
                    <span class="cpm-spinner"></span>
                    <a class="cpm-duplicate-project" href="<?php echo $url; ?>" data-project_id="<?php echo $project_id; ?>">
                        <span class="dashicons dashicons-admin-page"></span>
                        <span><?php _e( 'Duplicate', 'cpm' ); ?></span>
                    </a>
                </li>
            <?php } ?>
        </ul>
    </div>
    <?php
}

/**
 * Check if a project is archived/completed
 *
 * @param int $project_id
 * @return boolean
 */
function cpm_is_project_archived( $project_id ) {
    $active = get_post_meta( $project_id, '_project_active', true );

    if ( $active == 'no' ) {
        return true;
    }

    return false;
}

function cpm_assigned_user( $users, $render = true, $avatar = true, $separator = '' ) {

    $html = "";
    if ( is_array( $users ) ) {
        $sl = 0;
        foreach ( $users as $user_id ) {
            $html .= ($sl > 0) ? $separator : " ";
            $html .="<span class='cpm-assigned-user'>" . cpm_url_user( $user_id, $avatar ) . "</span>";

            $sl ++;
        }
    } else {
        $html .="<span class='cpm-assigned-user'>" . cpm_url_user( $user_id, $avatar ) . "</span>";
    }

    if ( false === $render ) {
        return $html;
    } else {
        echo $html;
    }
}

function cpm_pagination( $total, $limit, $pagenum ) {
    $num_of_pages = ceil( $total / $limit );
    $page_links   = paginate_links( array(
        'base'      => add_query_arg( 'pagenum', '%#%' ),
        'format'    => '',
        'prev_text' => __( '&laquo;', 'cpm' ),
        'next_text' => __( '&raquo;', 'cpm' ),
        'add_args'  => false,
        'total'     => $num_of_pages,
        'current'   => $pagenum,
    ));

    if ( $page_links ) {
        echo '<div class="tablenav"><div class="tablenav-pages">' . $page_links . '</div></div>';
    }
}

add_action( 'cpm_delete_project_prev', 'cpm_delete_project_child' );

/**
 * Delete project child elements
 *
 * Delete all child task lists, messages and milestones when
 * a project is deleted.
 *
 * @param  int  $project_id
 *
 * @since 0.5.4
 *
 * @return void
 */
function cpm_delete_project_child( $project_id ) {

    $childrens = get_posts( array( 'post_type' => array( 'cpm_task_list', 'cpm_message', 'cpm_milestone' ), 'post_pre_page' => '-1', 'post_parent' => $project_id ) );

    foreach ( $childrens as $key => $children ) {
        switch ( $children->post_type ) {
            case 'cpm_task_list':
                CPM_Task::getInstance()->delete_list( $children->ID, true );
                break;
            case 'cpm_message':
                CPM_Message::getInstance()->delete( $children->ID, true );
                break;
            case 'cpm_milestone':
                CPM_Milestone::getInstance()->delete( $children->ID, true );
                break;
        }
    }
}

/**
 * Get all manager from a project
 *
 * @param  int  $project_id
 *
 * @since 0.1
 *
 * @return array
 */
function cpm_get_all_manager_from_project( $project_id ) {
    global $wpdb;
    $table  = $wpdb->prefix . 'cpm_user_role';
    $result = $wpdb->get_results( "SELECT `user_id` FROM $table WHERE project_id='$project_id' AND role='manager'" );
    return wp_list_pluck( $result, 'user_id' );
}

/**
 * Get email header
 *
 * @param  string $action
 *
 * @since 1.1
 *
 * @return void
 */
function cpm_get_email_header() {
    $file_name = '/emails/header.php';
    cpm_load_template( $file_name );
}

/**
 * Get email footer
 *
 * @param  string $action
 *
 * @since 1.1
 *
 * @return void
 */
function cpm_get_email_footer() {
    $file_name = '/emails/footer.php';
    cpm_load_template( $file_name );
}

/**
 * Get co-workers
 *
 * @since 1.1
 * @return object
 */
function cpm_get_co_worker() {
    global $wpdb;
    $table = $wpdb->prefix . 'cpm_user_role';
    return $wpdb->get_results( "SELECT DISTINCT user_id FROM $table WHERE role IN( 'manager', 'co_worker' )" );
}

function cpm_get_co_worker_dropdown() {
    global $wpdb;
    $table      = $wpdb->prefix . 'cpm_user_role';
    $user_table = $wpdb->prefix . 'users';
    return $wpdb->get_results( "SELECT u.ID as ID, u.display_name as display_name, cu.user_id as user_id, cu.role as role FROM $user_table as u, $table as cu  WHERE  u.ID = cu.user_id AND ( cu.role = 'manager' OR cu.role = 'co_worker' ) GROUP BY u.ID ORDER BY u.display_name ASC  " );
}

/**
 * Get co-workers
 *
 * @param str $start
 * @param str $end
 * @param str $check
 *
 * @since 1.2
 * @return boolen
 */
function cpm_date_range( $start, $end, $check ) {

    $start = date( 'Y-m-d H:i:s', strtotime( $start ) );
    $end   = date( 'Y-m-d H:i:s', strtotime( $end ) );
    $check = date( 'Y-m-d H:i:s', strtotime( $check ) );

    if ( $start <= $check && $end >= $check ) {
        return true;
    } else {
        return false;
    }
}

/**
 * Get ordinal number
 *
 * @param int $number
 *
 * @since 1.2
 * @return str
 */
function cpm_ordinal( $number ) {
    $ends = array( 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th' );
    if ( (($number % 100) >= 11) && (($number % 100) <= 13) )
        return $number . 'th';
    else
        return $number . $ends[$number % 10];
}

/**
 * Localize script message
 *
 * @since 1.2
 * @return array
 */
function cpm_message() {
    $message = array(
        'report_frm_field_limit'       => __( 'You cannot use this field more than once!', 'cpm' ),
        'report_total_frm_field_limit' => __( 'You cannot create more than 4 actions!', 'cpm' ),
        'new_todo'                     => __( 'New Task List', 'cpm' ),
        'update_todo'                  => __( 'Update Task List', 'cpm' ),
        'comment_placeholder'          => __( 'Write a comment...', 'cpm' ),
        'confirm'                      => __( 'Are you sure?', 'cpm' ),
    );

    return apply_filters( 'cpm_message', $message );
}

/**
 * Check if this is a pro version
 *
 * @return boolean
 */
function cpm_is_pro() {

    if ( class_exists( 'WeDevs_CPM_Pro' ) ) {
        return true;
    }

    return false;
}

/**
 * Wrapper function for string length
 *
 * @since 1.3
 *
 * @param  string  $string
 *
 * @return int
 */
function cpm_strlen( $string ) {
    if ( function_exists( 'mb_strlen' ) ) {
        return mb_strlen( $string );
    } else {
        return strlen( $string );
    }
}

/**
 * Load template for view page and emails
 *
 * @since 1.4.3
 *
 * @param  string  $file
 *
 * @return html
 */
function cpm_load_template( $file, $args = array() ) {
    if ( $args && is_array( $args ) ) {
        extract( $args );
    }

    $child_theme_dir  = get_stylesheet_directory() . '/cpm/';
    $parent_theme_dir = get_template_directory() . '/cpm/';
    $cpm_dir          = CPM_PATH . '/views/';

    if ( file_exists( $child_theme_dir . $file ) ) {
        include $child_theme_dir . $file;
    } else if ( file_exists( $parent_theme_dir . $file ) ) {
        include $parent_theme_dir . $file;
    } else {
        include $cpm_dir . $file;
    }
}

/**
 * Embed a JS template page with its ID
 *
 * @param  string  the file path of the file
 * @param  string  the script id
 *
 * @return void
 */
function cpm_get_js_template( $file_path, $id ) {
    if ( file_exists( $file_path ) ) {
        echo '<script type="text/html" id="tmpl-' . $id . '">' . "\n";
        include_once $file_path;
        echo "\n" . '</script>' . "\n";
    }
}

/**
 * WP Timezone Settings
 *
 * @since 2.0.0
 *
 * @return string
 */
function cpm_get_wp_timezone() {
    $momentjs_tz_map = array(
        'UTC-12'    => 'Etc/GMT+12',
        'UTC-11.5'  => 'Pacific/Niue',
        'UTC-11'    => 'Pacific/Pago_Pago',
        'UTC-10.5'  => 'Pacific/Honolulu',
        'UTC-10'    => 'Pacific/Honolulu',
        'UTC-9.5'   => 'Pacific/Marquesas',
        'UTC-9'     => 'America/Anchorage',
        'UTC-8.5'   => 'Pacific/Pitcairn',
        'UTC-8'     => 'America/Los_Angeles',
        'UTC-7.5'   => 'America/Edmonton',
        'UTC-7'     => 'America/Denver',
        'UTC-6.5'   => 'Pacific/Easter',
        'UTC-6'     => 'America/Chicago',
        'UTC-5.5'   => 'America/Havana',
        'UTC-5'     => 'America/New_York',
        'UTC-4.5'   => 'America/Halifax',
        'UTC-4'     => 'America/Manaus',
        'UTC-3.5'   => 'America/St_Johns',
        'UTC-3'     => 'America/Sao_Paulo',
        'UTC-2.5'   => 'Atlantic/South_Georgia',
        'UTC-2'     => 'Atlantic/South_Georgia',
        'UTC-1.5'   => 'Atlantic/Cape_Verde',
        'UTC-1'     => 'Atlantic/Azores',
        'UTC-0.5'   => 'Atlantic/Reykjavik',
        'UTC+0'     => 'Etc/UTC',
        'UTC'       => 'Etc/UTC',
        'UTC+0.5'   => 'Etc/UTC',
        'UTC+1'     => 'Europe/Madrid',
        'UTC+1.5'   => 'Europe/Belgrade',
        'UTC+2'     => 'Africa/Tripoli',
        'UTC+2.5'   => 'Asia/Amman',
        'UTC+3'     => 'Europe/Moscow',
        'UTC+3.5'   => 'Asia/Tehran',
        'UTC+4'     => 'Europe/Samara',
        'UTC+4.5'   => 'Asia/Kabul',
        'UTC+5'     => 'Asia/Karachi',
        'UTC+5.5'   => 'Asia/Kolkata',
        'UTC+5.75'  => 'Asia/Kathmandu',
        'UTC+6'     => 'Asia/Dhaka',
        'UTC+6.5'   => 'Asia/Rangoon',
        'UTC+7'     => 'Asia/Bangkok',
        'UTC+7.5'   => 'Asia/Bangkok',
        'UTC+8'     => 'Asia/Shanghai',
        'UTC+8.5'   => 'Asia/Pyongyang',
        'UTC+8.75'  => 'Australia/Eucla',
        'UTC+9'     => 'Asia/Tokyo',
        'UTC+9.5'   => 'Australia/Darwin',
        'UTC+10'    => 'Australia/Brisbane',
        'UTC+10.5'  => 'Australia/Adelaide',
        'UTC+11'    => 'Australia/Melbourne',
        'UTC+11.5'  => 'Pacific/Norfolk',
        'UTC+12'    => 'Asia/Anadyr',
        'UTC+12.75' => 'Asia/Anadyr',
        'UTC+13'    => 'Pacific/Fiji',
        'UTC+13.75' => 'Pacific/Chatham',
        'UTC+14'    => 'Pacific/Tongatapu',
    );

    $current_offset = get_option('gmt_offset');
    $tzstring       = get_option('timezone_string');

    // Remove old Etc mappings. Fallback to gmt_offset.
    if ( false !== strpos( $tzstring, 'Etc/GMT' ) ) {
        $tzstring = '';
    }

    if ( empty( $tzstring ) ) { // Create a UTC+- zone if no timezone string exists
        if ( 0 == $current_offset ) {
            $tzstring = 'UTC+0';
        } elseif ($current_offset < 0) {
            $tzstring = 'UTC' . $current_offset;
        } else {
            $tzstring = 'UTC+' . $current_offset;
        }

    }

    if ( array_key_exists( $tzstring , $momentjs_tz_map ) ) {
        $tzstring = $momentjs_tz_map[ $tzstring ];
    }

    return $tzstring;
}

function cpm_has_milestone( $project_id ) {
    $args = array(
        'posts_per_page'   => 1,
        'post_type'        => 'cpm_milestone',
        'post_status'      => 'publish',
        'post_parent'      => $project_id
    );

    $posts = get_posts( $args );

    return $posts;
}

/**
 * Get project id
 *
 * @since  1.6.3
 * 
 * @return int
 */
function cpm_get_project_id() {
    if ( isset( $_GET['pid'] ) ) {
        return absint( $_GET['pid'] ) ? $_GET['pid'] : false;

    } else if ( isset( $_GET['project_id'] ) ) {
        return absint( $_GET['project_id'] ) ? $_GET['project_id'] : false;
    }
    
    return false;
}

/**
 * Get locale code
 *
 * @since 1.6.6
 *
 * @return str
 */
function cpm_pro_get_locale() {
    $locale = get_locale();

    // no need to add locale for en_US
    if ( 'en_US' === $locale ) {
        return;
    }

    $explod_locale = explode( '_', $locale );

    // make sure we have two segments - 1.lang, 2.country
    if ( count( $explod_locale ) < 2 ) {
        return $locale;
    }

    $lang = $explod_locale[0];
    $country = strtolower( $explod_locale[1] );

    if ( $lang === $country ) {
        $locale = $lang;
    } else {
        $locale = $lang . '-' . $country;
    }

    return $locale;
}

function cpm_pr( $data ) {
    echo '<pre>'; print_r( $data ); echo '</pre>';
}


