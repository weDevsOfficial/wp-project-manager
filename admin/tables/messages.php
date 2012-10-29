<?php

if ( !class_exists( 'WP_Posts_List_Table' ) ) {
    require_once ABSPATH . '/wp-admin/includes/class-wp-posts-list-table.php';
}

/**
 * Message Listing table
 *
 * @package Client Project Manager
 */
class CPM_Child_List_Table extends WP_Posts_List_Table {

    public $is_trash = false;
    private $post_type;
    private $post_parent;

    function __construct( $post_type, $post_parent = null ) {
        global $post_type_object;

        $this->post_type = $post_type;
        $this->post_parent = $post_parent;

        parent::__construct();

        $post_type_object = get_post_type_object( $this->post_type );
    }

    function get_views() {
        global $post_type_object, $locked_post_status, $avail_post_stati;

        $post_type = $post_type_object->name;

        if ( !empty( $locked_post_status ) )
            return array();

        $status_links = array();
        $num_posts = $this->count_posts( $post_type, 'readable' );
        $class = '';
        $allposts = '';

        $current_user_id = get_current_user_id();

        if ( $this->user_posts_count ) {
            if ( isset( $_GET['author'] ) && ( $_GET['author'] == $current_user_id ) )
                $class = ' class="current"';
            $status_links['mine'] = "<a href='edit.php?post_type=$post_type&author=$current_user_id'$class>" . sprintf( _nx( 'Mine <span class="count">(%s)</span>', 'Mine <span class="count">(%s)</span>', $this->user_posts_count, 'posts' ), number_format_i18n( $this->user_posts_count ) ) . '</a>';
            $allposts = '&all_posts=1';
        }

        $total_posts = array_sum( (array) $num_posts );

        // Subtract post types that are not included in the admin all list.
        foreach (get_post_stati( array('show_in_admin_all_list' => false) ) as $state)
            $total_posts -= $num_posts->$state;

        $class = empty( $class ) && empty( $_REQUEST['post_status'] ) && empty( $_REQUEST['show_sticky'] ) ? ' class="current"' : '';
        $status_links['all'] = "<a href='admin.php?page=cpm_projects&action=message&pid={$this->post_parent}'$class>" . sprintf( _nx( 'All <span class="count">(%s)</span>', 'All <span class="count">(%s)</span>', $total_posts, 'posts' ), number_format_i18n( $total_posts ) ) . '</a>';

        foreach (get_post_stati( array('show_in_admin_status_list' => true), 'objects' ) as $status) {
            $class = '';

            $status_name = $status->name;

            if ( !in_array( $status_name, $avail_post_stati ) )
                continue;

            if ( empty( $num_posts->$status_name ) )
                continue;

            if ( isset( $_REQUEST['post_status'] ) && $status_name == $_REQUEST['post_status'] )
                $class = ' class="current"';

            $status_links[$status_name] = "<a href='admin.php?page=cpm_projects&amp;action=message&amp;pid={$this->post_parent}&post_status=$status_name'$class>" . sprintf( translate_nooped_plural( $status->label_count, $num_posts->$status_name ), number_format_i18n( $num_posts->$status_name ) ) . '</a>';
        }

        if ( !empty( $this->sticky_posts_count ) ) {
            $class = !empty( $_REQUEST['show_sticky'] ) ? ' class="current"' : '';

            $sticky_link = array('sticky' => "<a href='edit.php?post_type=$post_type&amp;show_sticky=1'$class>" . sprintf( _nx( 'Sticky <span class="count">(%s)</span>', 'Sticky <span class="count">(%s)</span>', $this->sticky_posts_count, 'posts' ), number_format_i18n( $this->sticky_posts_count ) ) . '</a>');

            // Sticky comes after Publish, or if not listed, after All.
            $split = 1 + array_search( ( isset( $status_links['publish'] ) ? 'publish' : 'all' ), array_keys( $status_links ) );
            $status_links = array_merge( array_slice( $status_links, 0, $split ), $sticky_link, array_slice( $status_links, $split ) );
        }

        return $status_links;
    }

    function prepare_items() {
        global $post_type_object, $avail_post_stati, $wp_query, $per_page, $mode;

        $query_args = array(
            'post_type' => $this->post_type,
        );

        $query_args['post_parent'] = $this->post_parent ? $this->post_parent : 0;
        $query_args['m'] = isset( $_GET['m'] ) ? (int) $_GET['m'] : 0;
        $query_args['cat'] = isset( $_GET['cat'] ) ? (int) $_GET['cat'] : 0;
        $wp_query = new WP_Query( apply_filters( 'cpm_table_query', $query_args ) );

        //$avail_post_stati = wp_edit_posts_query( $query_args );
        $avail_post_stati = get_available_post_statuses( $this->post_type );

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

    function count_posts( $type = 'post', $perm = '' ) {
        global $wpdb;

        $user = wp_get_current_user();

        $cache_key = $this->post_type . '_' . $this->post_parent;

        $query = "SELECT post_status, COUNT( * ) AS num_posts FROM {$wpdb->posts} WHERE post_type = %s AND post_parent = %d";
        if ( 'readable' == $perm && is_user_logged_in() ) {
            $post_type_object = get_post_type_object( $type );
            if ( !current_user_can( $post_type_object->cap->read_private_posts ) ) {
                $cache_key .= '_' . $perm . '_' . $user->ID;
                $query .= " AND (post_status != 'private' OR ( post_author = '$user->ID' AND post_status = 'private' ))";
            }
        }
        $query .= ' GROUP BY post_status';

        $count = wp_cache_get( $cache_key, 'counts' );
        if ( false !== $count )
            return $count;

        $count = $wpdb->get_results( $wpdb->prepare( $query, $this->post_type, $this->post_parent ), ARRAY_A );

        $stats = array();
        foreach (get_post_stati() as $state)
            $stats[$state] = 0;

        foreach ((array) $count as $row)
            $stats[$row['post_status']] = $row['num_posts'];

        $stats = (object) $stats;
        wp_cache_set( $cache_key, $stats, 'counts' );

        return $stats;
    }

}