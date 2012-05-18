<?php

/**
 * Project Listing table
 *
 * @package Client Project Manager
 */
class CPM_Project_List_Table extends WP_List_Table {

    function __construct() {
        parent::__construct( array(
            'singular' => 'cpm_project_list',
            'plural' => 'cpm_project_lists',
            'ajax' => false
        ) );

        $this->_column_headers = array($this->get_columns(), array(), $this->get_sortable_columns());
    }

    /**
     * Define the columns that are going to be used in the table
     *
     * @return array $columns, the array of columns to use with the table
     */
    function get_columns() {
        return array(
            'cb' => '<input type="checkbox" />',
            'name' => __( 'Name' ),
            'client' => __( 'Client' ),
            'status' => __( 'Status' ),
            'billing' => __( 'Billing' ),
            'starts' => __( 'Starts' ),
            'ends' => __( 'Ends' ),
            'actions' => __( 'Actions' )
        );
    }

    /**
     * Decide which columns to activate the sorting functionality on
     *
     * @return array $sortable, the array of columns that can be sorted by the user
     */
    function get_sortable_columns() {
        return array(
            'name' => array('name', false),
            'client' => array('client', false),
            'status' => array('status', false),
            'starts' => array('started', false),
            'ends' => array('ends', false),
        );
    }

    function column_default( $item, $column_name ) {
        switch ($column_name) {
            case 'name':
                $detail_link = admin_url( 'admin.php?page=cpm_projects&action=details&pid=' . $item->id );
                echo '<strong><a class="row-title" href="' . $detail_link . '" title="Edit">' . stripslashes( $item->name ) . '</a></strong>';
                break;

            case 'client':
                $user = get_user_by( 'id', $item->client );
                $link = '#';
                echo '<a href="' . $link . '" title="Edit">' . $user->display_name . '</a>';
                break;

            case 'status':
                echo 'Not Started';
                break;

            case 'billing':
                echo 'Not yet';
                break;

            case 'starts':
                $date = mysql2date( get_option( 'date_format' ), $item->started );
                $abbr = date_i18n( 'Y/m/d g:i:s A', strtotime( $item->started ) );
                printf( '<abbr title="%s">%s</abbr>', $abbr, $date );
                break;

            case 'ends':
                $date = mysql2date( get_option( 'date_format' ), $item->ends );
                $abbr = date_i18n( 'Y/m/d g:i:s A', strtotime( $item->ends ) );
                printf( '<abbr title="%s">%s</abbr>', $abbr, $date );
                break;

            case 'actions':
                $edit_link = '#';
                $del_link = '#';
                printf( '<a href="%s">' . __( 'Edit', 'cpm' ) . '</a> | <a href="%s">' . __( 'Delete', 'cpm' ) . '</a>', $edit_link, $del_link );
                break;
        }
    }

    function column_cb( $item ) {
        return sprintf( '<input type="checkbox" name="%1$s[]" value="%2$s" />', $this->_args['singular'], $item->id );
    }

    function get_bulk_actions() {
        $actions = array(
            'delete' => 'Delete'
        );
        return $actions;
    }

    function process_bulk_action() {

        //Detect when a bulk action is being triggered...
        if ( 'delete' === $this->current_action() ) {
            wp_die( 'Items deleted (or they would be if we had items to delete)!' );
        }
    }

    /**
     * Prepare the table with different parameters, pagination, columns and table elements
     */
    function prepare_items() {
        global $wpdb, $_wp_column_headers;
        $screen = get_current_screen();

        /* -- Preparing your query -- */
        $query = "SELECT * FROM " . CPM_PROJECT_TABLE;

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