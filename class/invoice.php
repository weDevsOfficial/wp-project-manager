<?php

/**
 * Description of invoice
 *
 * @author tareq
 */
class CPM_Invoice {

    private $_db;
    private static $_instance;

    public function __construct() {
        global $wpdb;

        $this->_db = $wpdb;
    }

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new CPM_Invoice();
        }

        return self::$_instance;
    }

    function get( $invoice_id ) {
        $sql = $this->_db->prepare( 'SELECT * FROM ' . CPM_INVOICE_TABLE . ' WHERE id=%d AND status = 1', $invoice_id );

        return $this->_db->get_row( $sql );
    }

    function get_items( $invoice_id ) {
        $sql = $this->_db->prepare( 'SELECT * FROM ' . CPM_INVOICE_ITEM_TABLE . ' WHERE invoice_id=%d', $invoice_id );

        return $this->_db->get_results( $sql );
    }

    function get_formatted_items( $invoice_id ) {
        $holder = array('hour' => array(), 'item' => array());
        $items = $this->get_items( $invoice_id );

        if ( $items ) {
            foreach ($items as $item) {
                if ( $item->type == 'hour' ) {
                    $holder['hour'][] = $item;
                } else {
                    $holder['item'][] = $item;
                }
            }
        }

        return $holder;
    }

    function create( $data ) {
        $data['created'] = current_time( 'mysql' );
        $result = $this->_db->insert( CPM_INVOICE_TABLE, $data );

        return $this->_db->insert_id;
    }

    function update( $data, $invoice_id ) {
        $this->_db->update( CPM_INVOICE_TABLE, $data, array('id' => $invoice_id) );
    }

    function delete( $invoice_id, $force = false ) {
        if ( $force == false ) {
            $data = array(
                'status' => 0,
            );

            $this->_db->update( CPM_INVOICE_TABLE, $data, array('id' => $invoice_id) );
        } else {
            $sql = 'DELETE FROM ' . CPM_INVOICE_TABLE . ' WHERE id = %d';

            return $this->_db->query( $this->_db->prepare( $sql, $invoice_id ) );
        }
    }

    function create_item( $data ) {
        $data['created'] = current_time( 'mysql' );

        $result = $this->_db->insert( CPM_INVOICE_ITEM_TABLE, $data );

        return $this->_db->insert_id;
    }

    function delete_item( $item_id ) {
        $sql = 'DELETE FROM ' . CPM_INVOICE_ITEM_TABLE . ' WHERE id = %d';

        return $this->_db->query( $this->_db->prepare( $sql, $item_id ) );
    }

    function delete_items( $invoice_id ) {
        $sql = 'DELETE FROM ' . CPM_INVOICE_ITEM_TABLE . ' WHERE invoice_id = %d';

        return $this->_db->query( $this->_db->prepare( $sql, $invoice_id ) );
    }

}