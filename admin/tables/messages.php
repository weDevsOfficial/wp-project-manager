<?php

/**
 * Project Listing table
 *
 * @package Client Project Manager
 */
class CPM_Message_List_Table extends WP_List_Table {

    private $_single_project;

    function __construct( $project_id = 0 ) {
        parent::__construct( array(
            'singular' => 'cpm_project_list',
            'plural' => 'cpm_project_lists',
            'ajax' => false
        ) );

        $this->_single_project = $project_id;

        $this->_column_headers = array($this->get_columns(), array(), $this->get_sortable_columns());
    }

    /**
     * Define the columns that are going to be used in the table
     *
     * @return array $columns, the array of columns to use with the table
     */
    function get_columns() {
        $columns = array(
            'cb' => '<input type="checkbox" />',
            'title' => __( 'Title' )
        );

        if ( !$this->_single_project ) {
            $columns['project'] = __( 'Project' );
        }

        $columns['reply_count'] = __( 'Reply Count' );
        $columns['privacy'] = __( 'Visibility' );
        $columns['created'] = __( 'Created' );
        $columns['actions'] = __( 'Actions' );

        return $columns;
    }

    /**
     * Decide which columns to activate the sorting functionality on
     *
     * @return array $sortable, the array of columns that can be sorted by the user
     */
    function get_sortable_columns() {
        $columns = array(
            'title' => array('title', false),
            'privacy' => array('privacy', false),
            'created' => array('created', false)
        );

        if ( !$this->_single_project ) {
            $columns['project'] = array('project_id', false);
        }

        return $columns;
    }

    function column_default( $item, $column_name ) {
        switch ($column_name) {
            case 'title':
                $detail_link = admin_url( 'admin.php?page=cpm_messages&action=single&mid=' . $item->id );
                echo '<strong><a class="row-title" href="' . $detail_link . '" title="Edit">' . stripslashes( $item->title ) . '</a></strong>';
                break;

            case 'client':
                $user = get_user_by( 'id', $item->client );
                $link = '#';
                echo '<a href="' . $link . '" title="Edit">' . $user->display_name . '</a>';
                break;

            case 'project':
                $link = admin_url( 'admin.php?page=cpm_projects&action=details&pid=' . $item->project_id );
                echo '<a href="' . $link . '" title="Edit">' . $item->name . '</a>';
                break;

            case 'reply_count':
                echo $item->reply_count;
                break;

            case 'created':
                $date = mysql2date( get_option( 'date_format' ), $item->created );
                $abbr = date_i18n( 'Y/m/d g:i:s A', strtotime( $item->created ) );
                printf( '<abbr title="%s">%s</abbr>', $abbr, $date );
                break;

            case 'privacy':
                echo ( $item->privacy == 0 ) ? __( 'Public', 'cpm' ) : __( 'Private', 'cpm' );
                break;

            case 'actions':
                $edit_link = '#';
                $del_link = '#';
                printf( '<a class="cpm-get-message" data-id="%1$d" href="%2$s">' . __( 'Edit', 'cpm' ) . '</a> | <a class="cpm-del-message" data-id="%1$d" href="%3$s">' . __( 'Delete', 'cpm' ) . '</a>', $item->id, $edit_link, $del_link );
                break;
        }
    }

    function column_cb( $item ) {
        return sprintf( '<input type="checkbox" name="%1$s[]" value="%2$s" />', $this->_args['singular'], $item->id );
    }

    /**
     * Prepare the table with different parameters, pagination, columns and table elements
     */
    function prepare_items() {
        global $wpdb, $_wp_column_headers;
        $screen = get_current_screen();

        /* -- Preparing your query -- */
        $query = "SELECT m.*, p.name FROM " . CPM_MESSAGE_TABLE . " m
                INNER JOIN " . CPM_PROJECT_TABLE . " p ON p.id = m.project_id";

        if ( $this->_single_project ) {
            $query .= ' WHERE m.project_id = ' . $this->_single_project;
        }

        /* -- Ordering parameters -- */
        //Parameters that are going to be used to order the result
        $orderby = !empty( $_GET["orderby"] ) ? mysql_real_escape_string( $_GET["orderby"] ) : 'ASC';
        $order = !empty( $_GET["order"] ) ? mysql_real_escape_string( $_GET["order"] ) : '';
        if ( !empty( $orderby ) & !empty( $order ) ) {
            $query.=' ORDER BY ' . $orderby . ' ' . $order;
        }

        /* -- Pagination parameters -- */
        //Number of elements in your table?
        $totalitems = $wpdb->query( $query ); //return the total number of affected rows
        //How many to display per page?
        $perpage = 15;
        //Which page is this?
        $paged = !empty( $_GET["paged"] ) ? mysql_real_escape_string( $_GET["paged"] ) : '';
        //Page Number
        if ( empty( $paged ) || !is_numeric( $paged ) || $paged <= 0 ) {
            $paged = 1;
        }
        //How many pages do we have in total?
        $totalpages = ceil( $totalitems / $perpage );
        //adjust the query to take pagination into account
        if ( !empty( $paged ) && !empty( $perpage ) ) {
            $offset = ($paged - 1) * $perpage;
            $query.=' LIMIT ' . (int) $offset . ',' . (int) $perpage;
        }

        /* -- Register the pagination -- */
        $this->set_pagination_args( array(
            "total_items" => $totalitems,
            "total_pages" => $totalpages,
            "per_page" => $perpage,
        ) );
        //The pagination links are automatically built according to those parameters

        /* -- Register the Columns -- */
        $columns = $this->get_columns();
        $_wp_column_headers[$screen->id] = $columns;

        /* -- Fetch the items -- */
        $this->items = $wpdb->get_results( $query );
    }

}