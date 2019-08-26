<?php
namespace WeDevs\PM\task\Helper;

use WP_REST_Request;

// data: {
// 	with: 'assignees,categories',
// 	task_lists_per_page: '10',
// 	tasks_per_page: '10',
// 	per_page: '10',
// 	select: 'id, title',
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
	private $with = ['task_list','project'];
	private $tasks;
	private $task_ids;
	private $is_single_query = false;
	private $user_id = false;

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
    	$this->set_login_user();
    }

    private function set_login_user() {

    	$this->user_id = empty( $this->query_params['login_user'] ) ? 
    		get_current_user_id() : (int) $user_id;
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
			'id'         => (int) $task->id,
			'title'      => (string) $task->title,
			'created_at' => $task->created_at,
			'start_at'   => $task->start_at,
			'due_date'   => $task->due_date,
			'completed_at' => $task->completed_at
        ];

        $select_items = empty( $this->query_params['select'] ) ? false : $this->query_params['select'];

		if ( $select_items && ! is_array( $select_items ) ) {
			$select_items = str_replace( ' ', '', $select_items );
			$select_items = explode( ',', $select_items );
		}
		
		if ( empty( $select_items ) ) {
			$items = $this->set_with_items( $items, $task );
			$items = $this->set_fixed_items( $items, $task );
			return $items;
		}

		foreach ( $items as $item_key => $item ) {
			
			if ( ! in_array( $item_key, $select_items ) ) {
				unset( $items[$item_key] );
			}
		}
		
		$items = $this->set_with_items( $items, $task );
		$items = $this->set_fixed_items( $items, $task );
		
		return $items;

	}

	private function set_with_items( $items, $task ) {
		$request_with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $request_with ) ) {
			$request_with = explode( ',', $request_with );
		}

		foreach ( $this->with as $default_with ) {
			if ( in_array( $default_with, $request_with ) && isset( $task->$default_with ) ) {
				$items[$default_with] = $task->$default_with;
			}
		}

		return $items;
	}

	private function set_fixed_items( $items, $task ) {
		$items['task_list_id'] = (int) $task->task_list_id;
		$items['project_id'] = (int) $task->project_id;

		return $items;
	}

	/**
	 * Join others table information
	 * 
	 * @return Object
	 */
	private function with() {
		$this->include_project()
			->include_list();

		return $this;
	}

	/**
	 * Set project ssignees
	 * 
	 * @return class object
	 */
	private function include_list() {
		global $wpdb;
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', $with );
		}

		if ( ! in_array( 'task_list', $with ) || empty( $this->task_ids ) ) {
			return $this;
		}

		$tb_list = pm_tb_prefix() . 'pm_boards';
		$tb_boardable = pm_tb_prefix() . 'pm_boardables';
		$task_ids = implode( ',', $this->task_ids );

		$query = "SELECT DISTINCT bo.id as task_list_id, bo.title, tk.id as task_id
			FROM $tb_list as bo
			LEFT JOIN $tb_boardable as bor ON bor.board_id = bo.id 
			LEFT JOIN $this->tb_tasks as tk ON tk.id = bor.boardable_id 
			where tk.id IN ($task_ids)";

		$results = $wpdb->get_results( $query );
		$lists = [];

		foreach ( $results as $key => $result ) {
			$task_id = $result->task_id;
			unset( $result->task_id );
			$lists[$task_id] = $result;
		}
		
		foreach ( $this->tasks as $key => $task ) {
			$task->task_list = empty( $lists[$task->id] ) ? '' : $lists[$task->id]; 
		}
		
		return $this;
	}

	/**
	 * Set project ssignees
	 * 
	 * @return class object
	 */
	private function include_project() {
		global $wpdb;
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', $with );
		}

		if ( ! in_array( 'project', $with ) || empty( $this->task_ids ) ) {
			return $this;
		}

		$tb_project = pm_tb_prefix() . 'pm_projects';
		$task_ids = implode( ',', $this->task_ids );

		$query = "SELECT DISTINCT pr.id as project_id, pr.title, tk.id as task_id
			FROM $tb_project as pr
			LEFT JOIN $this->tb_tasks as tk ON tk.project_id = pr.id 
			where tk.id IN ($task_ids)";


		$results = $wpdb->get_results( $query );
		$projects = [];

		foreach ( $results as $key => $result ) {
			$task_id = $result->task_id;
			unset( $result->task_id );
			$projects[$task_id] = $result;
		}
		
		foreach ( $this->tasks as $key => $task ) {
			$task->project = empty( $projects[$task->id] ) ? '' : $projects[$task->id]; 
		}
		
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
			$this->select = $this->tb_tasks . '.*';

			return $this;
		}

		$select_items = $this->query_params['select'];

		if ( ! is_array( $select_items ) ) {
			$select_items = str_replace( ' ', '', $select_items );
			$select_items = explode( ',', $select_items );
		}

		foreach ( $select_items as $key => $item ) {
			$item = str_replace( ' ', '', $item );
			$select .= $this->tb_tasks . '.' . $item . ',';
		}
		
		$this->select = substr( $select, 0, -1 );
		
		return $this;
	}

	private function join() {

		$this->join = apply_filters( 'pm_task_join', $this->join );
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
			->where_status()
			->where_due_date()
			->where_start_at()
			->where_project_id()
			->where_assignees();

		$this->where = apply_filters( 'pm_task_where', $this->where, $this->user_id );

		return $this;
	}

	private function where_assignees() {
		$assignees = isset( $this->query_params['assignees'] ) ? $this->query_params['assignees'] : false;

		if ( $assignees === false ) {
			return $this;
		}

		if ( $assignees && is_array( $assignees ) ) {
			$assignees = implode( ',', $assignees );
		}

		global $wpdb;
		$tb_asin = pm_tb_prefix() . 'pm_assignees';

		$this->join .= " LEFT JOIN {$tb_asin} ON $tb_asin.task_id={$this->tb_tasks}.id";
		
		$this->where .= " AND $tb_asin.assigned_to IN ($assignees)";
	}

	private function where_project_id() {
		$project_id = isset( $this->query_params['project_id'] ) ? $this->query_params['project_id'] : false;

		if ( $project_id === false ) {
			return $this;
		}

		if ( is_array( $project_id ) ) {
			$project_id = implode( ',', $project_id );
		}

		$this->where .= " AND {$this->tb_tasks}.project_id IN ($project_id)";

		return $this;
	}

	private function where_start_at() {
		$start_at = !empty( $this->query_params['start_at'] ) ? $this->query_params['start_at'] : false;

		if ( $start_at === false ) {
			return $this;
		}

		$this->where .= " AND {$this->tb_tasks}.start_at>'$start_at'";

		return $this;
	}

	private function where_due_date() {
		$due_date = !empty( $this->query_params['due_date'] ) ? $this->query_params['due_date'] : false;

		if ( $due_date === false ) {
			return $this;
		}

		$current_date = $due_date ? date( 'Y-m-d', strtotime( $due_date ) ) : date( 'Y-m-d', strtotime( current_time( 'mysql' ) ) );

		$this->where .= " AND {$this->tb_tasks}.due_date<'$current_date'";

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
			$this->where .= " AND {$this->tb_tasks}.id IN ($query_id)";
		}

		if ( !is_array( $id ) ) {
			$this->where .= " AND {$this->tb_tasks}.id IN ($id)";

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

		$this->where .= " AND {$this->tb_tasks}.status='$status'";

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

		$this->where .= " AND {$this->tb_tasks}.title LIKE '%$title%'";

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
		$boardable = pm_tb_prefix() . 'pm_boardables';

		$query = "SELECT DISTINCT {$this->select}, list.id as task_list_id, $this->tb_tasks.project_id
			FROM {$this->tb_tasks}
			{$this->join}
			Left join $boardable as boardable ON boardable.boardable_id = {$this->tb_tasks}.id
			Left join {$this->tb_lists} as list ON list.id = boardable.board_id
			WHERE 1=1 {$this->where}
			{$this->limit}";
		
		if ( $this->is_single_query ) {
			$results = $wpdb->get_row( $query );
		} else { 
			$results = $wpdb->get_results( $query );
		} 

		// If task has not boardable_id mean no list
		foreach ( $results as $key => $result ) {
			if( empty( $result->task_list_id ) ) {
				unset( $results[$key] );
			}
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
