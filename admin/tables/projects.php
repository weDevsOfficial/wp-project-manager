<?php

if ( !class_exists( 'WP_Posts_List_Table' ) ) {
    require_once ABSPATH . '/wp-admin/includes/class-wp-posts-list-table.php';
}

/**
 * Project Listing table
 *
 * @package Client Project Manager
 */
class CPM_Project_List_Table extends WP_Posts_List_Table {

    var $is_trash = false;

    function __construct() {
        parent::__construct();
    }

    function prepare_items() {
        global $post_type_object, $avail_post_stati, $wp_query, $per_page, $mode;

        $args = array(
            'post_type' => 'project'
        );
        $avail_post_stati = wp_edit_posts_query( $args );

        $this->hierarchical_display = ( $post_type_object->hierarchical && 'menu_order title' == $wp_query->query['orderby'] );

        $total_items = $this->hierarchical_display ? $wp_query->post_count : $wp_query->found_posts;

        $post_type = $post_type_object->name;
        $per_page = $this->get_items_per_page( 'edit_' . $post_type . '_per_page' );
        $per_page = apply_filters( 'edit_posts_per_page', $per_page, $post_type );

        if ( $this->hierarchical_display )
            $total_pages = ceil( $total_items / $per_page );
        else
            $total_pages = $wp_query->max_num_pages;

        $mode = empty( $_REQUEST['mode'] ) ? 'list' : $_REQUEST['mode'];

        $this->is_trash = isset( $_REQUEST['post_status'] ) && $_REQUEST['post_status'] == 'trash';

        $this->set_pagination_args( array(
            'total_items' => $total_items,
            'total_pages' => $total_pages,
            'per_page' => $per_page
        ) );
    }

}