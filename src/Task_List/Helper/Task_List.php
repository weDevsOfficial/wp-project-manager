<?php
namespace WeDevs\PM\Task_List\Helper;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Manager as Manager;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Serializer\DataArraySerializer;
use League\Fractal\Resource\Collection as Collection;
use WeDevs\PM\Task_List\Transformers\Generate_List_Transformer;

class Task_List {
	private static $_instance;
	private $query_params;
	private $select;
	private $join;
	private $where;
	private $limit;
	private $with;
	private $lists;
	private $list_ids;

	public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    function __construct() {
    	$this->set_table_name();
    }

    public static function get_task_lists( WP_REST_Request $request ) {
		$lists = self::get_results( $request->get_params() );
		wp_send_json( $lists );
	}

	public static function get_results( $params ) {
		//global $wpdb;

		$self = self::getInstance();
		$self->query_params = $params;

		$self->select()
			->join()
			->where()
			->limit()
			->get()
			->with();
		
		return (new Generate_List_Transformer)->generate_transform( $self->lists );
	}

	private function with() {
		// $this->include_assignees()
		// 	->include_categories()
		// 	->include_task_lists();
			// ->include_tasks();

		return $this;
	}


	private function get_selectable_items( $tb, $key ) {
		$select = '';
		$select_items = $this->query_params[$key];
		
		if ( empty( $select_items ) ) {
			$select = $tb . '.*';
		}

		$select_items = str_replace( ' ', '', $select_items );
		$select_items = explode( ',', $select_items );

		foreach ( $select_items as $key => $item ) {
			$select .= $tb . '.' . $item . ',';
		}

		return substr( $select, 0, -1 );
	}

	private function select() {
		$select = '';
		
		if ( empty( $this->query_params['select'] ) ) {
			$this->select = $this->tb_list . '.*';

			return $this;
		}

		$select_items = $this->query_params['select'];

		if ( ! is_array( $select_items ) ) {
			$select_items = str_replace( ' ', '', $select_items );
			$select_items = explode( ',', $select_items );
		}

		foreach ( $select_items as $key => $item ) {
			$item = str_replace( ' ', '', $item );
			$select .= $this->tb_list . '.' . $item . ',';
		}
		
		$this->select = substr( $select, 0, -1 );
		
		return $this;
	}

	private function join() {
		return $this;
	}

	private function where() {
		
		$this->where_project_id()
			->where_title();
	
		return $this;
	}

	/**
	 * Filter task by title
	 * 
	 * @return class object
	 */
	private function where_title() {
		$title = isset( $this->query_params['title'] ) ? $this->query_params['title'] : false;

		if ( empty( $title ) ) {
			return $this;
		}

		$this->where .= " AND {$this->tb_list}.title LIKE '%$title%'";

		return $this;
	}

	private function where_project_id() {
		$id = isset( $this->query_params['project_id'] ) ? $this->query_params['project_id'] : false; 

		if ( empty( $id ) ) {
			return $this;
		}

		if ( is_array( $id ) ) {
			$query_id = implode( ',', $id );
			$this->where .= " AND {$this->tb_list}.project_id IN ($query_id)";
		}

		if ( !is_array( $id ) ) {
			$this->where .= " AND {$this->tb_list}.project_id = $id";
		}

		return $this;
	}



	private function limit() {

		$per_page = isset( $this->query_params['per_page'] ) ? $this->query_params['per_page'] : false;
		
		if ( $per_page === false || $per_page == '-1' ) {
			return $this;
		}

		$this->limit = " LIMIT {$this->get_offset()},{$this->get_per_page()}";

		return $this;
	}

	private function get_offset() {
		$page = isset( $this->query_params['page'] ) ? $this->query_params['page'] : false;

		$page   = empty( $page ) ? 1 : absint( $page );
		$limit  = $this->get_per_page();
		$offset = ( $page - 1 ) * $limit;

		return $offset;
	}

	private function get_per_page() {

		$per_page = isset( $this->query_params['per_page'] ) ? $this->query_params['per_page'] : false;
		
		if ( ! empty( $per_page ) && intval( $per_page ) ) {
			return intval( $per_page );
		}

		return 10;
	}

	private function get() {
		global $wpdb;
		$id = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false;

		$query = "SELECT DISTINCT {$this->select} 
			FROM {$this->tb_list}
			{$this->join}
			WHERE 1=1 {$this->where} AND $this->tb_list.type='task_list'
			{$this->limit}";
		
		if ( $id && ( ! is_array( $id ) ) ) {
			$results = $wpdb->get_row( $query );
		} else {
			$results = $wpdb->get_results( $query );
		} 

		$this->lists = $results;

		if ( ! empty( $results ) && is_array( $results ) ) {
			$this->list_ids = wp_list_pluck( $results, 'id' );
		} 

		if ( ! empty( $results ) && !is_array( $results ) ) {
			$this->list_ids = [$results->id];
		} 

		return $this;
	}

	private function set_table_name() {
		$this->tb_project      = pm_tb_prefix() . 'pm_projects';
		$this->tb_list         = pm_tb_prefix() . 'pm_boards';
		$this->tb_task         = pm_tb_prefix() . 'pm_tasks';
		$this->tb_project_user = pm_tb_prefix() . 'pm_role_user';
		$this->tb_task_user    = pm_tb_prefix() . 'pm_assignees';
		$this->tb_categories   = pm_tb_prefix() . 'pm_categories';
		$this->tb_category_project   = pm_tb_prefix() . 'pm_category_project';
	}
}
