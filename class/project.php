<?php

/**
 * Description of project
 *
 * @author weDevs
 */
class CPM_Project {

    private $_db;

    public function __construct() {
        global $wpdb;

        $this->_db = $wpdb;
    }

    function delete( $project_id ) {

    }

    function get_all() {

    }

    function get( $project_id ) {
        $sql = $this->_db->prepare( 'SELECT * FROM ' . CPM_PROJECT_TABLE . ' WHERE id=%d AND status = 1', $project_id );

        return $this->_db->get_row( $sql );
    }

    function create( $data ) {
        $data['created'] = current_time( 'mysql' );
        $data['author'] = get_current_user_id();
        $data['status'] = 1;

        $result = $this->_db->insert( CPM_PROJECT_TABLE, $data );

        return $this->_db->insert_id;
    }

    function update( $data ) {

    }

    function get_status( $project_id ) {
        return 'Not started';
    }

    function get_bill_status( $project_id ) {
        return 'Not started';
    }

    function nav_links( $project_id ) {
        $base = admin_url( 'admin.php' );
        $links = array(
            sprintf( '%s?page=cpm_projects&action=details&pid=%d', $base, $project_id ) => __( 'Details', 'cpm' ),
            sprintf( '%s?page=cpm_messages&action=project&pid=%d', $base, $project_id ) => __( 'Messages', 'cpm' ),
            sprintf( '%s?page=cpm_projects&action=task_list&pid=%d', $base, $project_id ) => __( 'Task List', 'cpm' ),
            sprintf( '%s?page=cpm_projects&action=milestone&pid=%d', $base, $project_id ) => __( 'Milestones', 'cpm' ),
            sprintf( '%s?page=cpm_projects&action=invoice&pid=%d', $base, $project_id ) => __( 'Invoices', 'cpm' ),
            sprintf( '%s?page=cpm_projects&action=files&pid=%d', $base, $project_id ) => __( 'Files', 'cpm' ),
        );

        return $links;
    }

    function nav_menu( $project_id, $active = '' ) {
        $links = $this->nav_links( $project_id );

        $menu = array();
        foreach ($links as $url => $label) {
            if( $active == $label ) {
                $menu[] = sprintf( '<li class="active"><a href="%1$s" title="%2$s">%2$s</a></li>', $url, $label );
            } else {
                $menu[] = sprintf( '<li><a href="%1$s" title="%2$s">%2$s</a></li>', $url, $label );
            }
        }

        return '<ul class="cpm-nav">' . implode( "\n", $menu ) . '</ul>';
    }

    function notify_coworker_new_project( $project_id ) {
        $users = $_POST['project_coworker'];

        $site_name = wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );
        $subject = sprintf( __( 'New Project invitation on %s', 'cpm' ), $site_name );
        $body = sprintf( __( 'You are assigned in a new project "%s" on %s', 'cpm' ), trim( $_POST['project_name'] ), $site_name ) . "\r\n";
        $body .= sprintf( __( 'You can see the project by going here: %s', 'cpm' ), cpm_project_details_url( $project_id ) ) . "\r\n";

        $wp_email = 'no-reply@' . preg_replace( '#^www\.#', '', strtolower( $_SERVER['SERVER_NAME'] ) );
        $from = "From: \"$blogname\" <$wp_email>";
        $message_headers = "$from\nContent-Type: text/plain; charset=\"" . get_option( 'blog_charset' ) . "\"\n";

        wp_mail( $users, $subject, $body, $message_headers );
    }

}
