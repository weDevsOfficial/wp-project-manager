<?php
namespace WeDevs\PM\task\Helper;

use WP_REST_Request;

// data: {
// 	with: 'assignees,categories',
// 	task_lists_per_page: '10',
// 	tasks_per_page: '10',
// 	per_page: '10',
// 	select: 'id, title',
// 	task_lists_select_items: 'id, title',
// 	task_select_items: 'id, title',
// 	categories: [2, 4],
// 	assignees: [1,2],
// 	id: [1,2],
// 	title: 'Rocket',
// 	status: '0',
// 	page: 1
// },

class Task {

	private static $_instance;
	private $tb_projects;
	private $tb_lists;
	private $tb_tasks;
	private $query_params;
	private $select;
	private $join;
	private $where;
	private $limit;
	private $with;
	private $tasks;
	private $task_ids;
	private $is_single_query = false;

	/**
	 * Class instance
	 * 
	 * @return Object
	 */
	public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    /**
     * Class constructor
     */
    public function __construct() {
    	$this->set_table_name();
    }

    /**
     * AJAX Get tasks
     * 
     * @param  array $request
     * 
     * @return Object
     */
	public static function get_tasks( WP_REST_Request $request ) {
		$self = self::getInstance();
		$tasks = self::get_results( $request->get_params() );
		
		wp_send_json( $tasks );
	}

	/**
	 * Get tasks
	 * 
	 * @param  array $params
	 * 
	 * @return array
	 */
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

		return $self->format_tasks( $self->tasks );
	}

	/**
	 * Format tasks data
	 * 
	 * @param array $tasks
	 * 
	 * @return array
	 */
	public function format_tasks( $tasks ) {

		$response = [
			'data' => [],
			'meta' => []
		];

		if ( ! is_array( $tasks ) ) {
			$response['data'] = $this->fromat_task( $tasks );

			return $response;
		}

		foreach ( $tasks as $key => $task ) {
			$tasks[$key] = $this->fromat_task( $task );
		}
		
		$response['data'] = $tasks;

		return $response;
	}

	/**
	 * Format task data
	 * 
	 * @param  Object $task 
	 * 
	 * @return array          
	 */
	public function fromat_task( $task ) {
		$items = [
            'id'      => (int) $task->id,
            'title'   => (string) $task->title,
        ];

        $select_items = $this->query_params['select'];

		if ( ! is_array( $select_items ) ) {
			$select_items = str_replace( ' ', '', $select_items );
			$select_items = explode( ',', $select_items );
		}

		if ( empty( $select_items ) ) {
			return $items;
		}

		foreach ( $items as $item_key => $item ) {
			if ( ! in_array( $item_key, $select_items ) ) {
				unset( $items[$item_key] );
			}
		}
		
		return $items;

	}

	/**
	 * Join others table information
	 * 
	 * @return Object
	 */
	private function with() {
		

		return $this;
	}

	/**
	 * Choose table select item
	 * 
	 * @param  string $tb
	 * @param  string $key
	 * 
	 * @return string
	 */
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
			$this->select = $this->tb_task . '.*';

			return $this;
		}

		$select_items = $this->query_params['select'];

		if ( ! is_array( $select_items ) ) {
			$select_items = str_replace( ' ', '', $select_items );
			$select_items = explode( ',', $select_items );
		}

		foreach ( $select_items as $key => $item ) {
			$item = str_replace( ' ', '', $item );
			$select .= $this->tb_task . '.' . $item . ',';
		}
		
		$this->select = substr( $select, 0, -1 );
		
		return $this;
	}

	private function join() {
		return $this;
	}

	/**
	 * Set task where condition
	 * 
	 * @return class object
	 */
	private function where() {
		
		$this->where_id()
			->where_title()
			->where_status();

		return $this;
	}

	/**
	 * Filter task by ID
	 * 
	 * @return class object
	 */
	private function where_id() {

		$id = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false; 

		if ( empty( $id ) ) {
			return $this;
		}

		if ( is_array( $id ) ) {
			$query_id = implode( ',', $id );
			$this->where .= " AND {$this->tb_task}.id IN ($query_id)";
		}

		if ( !is_array( $id ) ) {
			$this->where .= " AND {$this->tb_task}.id IN ($id)";

			$explode = explode( ',', $id );

			if ( count( $explode ) == 1 ) {
				$this->is_single_query = true;
			}
		}

		return $this;
	}

	/**
	 * Filter porject by status
	 * 
	 * @return class object
	 */
	private function where_status() {

		$status = isset( $this->query_params['status'] ) ? $this->query_params['status'] : false;

		if ( $status === false ) {
			return $this;
		}

		$this->where .= " AND {$this->tb_task}.status='$status'";

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

		$this->where .= " AND {$this->tb_task}.title LIKE '%$title%'";

		return $this;
	}

	/**
	 * Generate task query limit
	 * 
	 * @return class object
	 */
	private function limit() {

		$per_page = isset( $this->query_params['per_page'] ) ? $this->query_params['per_page'] : false;
		
		if ( $per_page === false || $per_page == '-1' ) {
			return $this;
		}

		$this->limit = " LIMIT {$this->get_offset()},{$this->get_per_page()}";

		return $this;
	}

	/**
	 * Get offset
	 * 
	 * @return int
	 */
	private function get_offset() {
		$page = isset( $this->query_params['page'] ) ? $this->query_params['page'] : false;

		$page   = empty( $page ) ? 1 : absint( $page );
		$limit  = $this->get_per_page();
		$offset = ( $page - 1 ) * $limit;

		return $offset;
	}

	/**
	 * Get the number for tasks per page
	 * 
	 * @return class instance
	 */
	private function get_per_page() {

		$per_page = isset( $this->query_params['per_page'] ) ? $this->query_params['per_page'] : false;
		
		if ( ! empty( $per_page ) && intval( $per_page ) ) {
			return intval( $per_page );
		}

		return 10;
	}

	/**
	 * Execute the tasks query
	 * 
	 * @return class instance
	 */
	private function get() {
		global $wpdb;
		$id = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false;

		$query = "SELECT DISTINCT {$this->select} 
			FROM {$this->tb_task}
			{$this->join}
			WHERE 1=1 {$this->where}
			{$this->limit}";
		
		if ( $this->is_single_query ) {
			$results = $wpdb->get_row( $query );
		} else { 
			$results = $wpdb->get_results( $query );
		} 

		$this->tasks = $results;

		if ( ! empty( $results ) && is_array( $results ) ) {
			$this->task_ids = wp_list_pluck( $results, 'id' );
		} 

		if ( ! empty( $results ) && !is_array( $results ) ) {
			$this->task_ids = [$results->id];
		} 

		return $this;
	}

	/**
	 * Set table name as class object
	 */
	private function set_table_name() {
		$this->tb_tasks    = pm_tb_prefix() . 'pm_tasks';
		$this->tb_lists    = pm_tb_prefix() . 'pm_boards';
		$this->tb_projects = pm_tb_prefix() . 'pm_projects';
	}
}
