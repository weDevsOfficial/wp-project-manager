<?php
namespace WeDevs\PM\task\Helper;

use WP_REST_Request;

// data: {
// 	with: 'assignees,categories',
// 	per_page: '10',
// 	select: ['id, title']
// 	categories: [2, 4],
// 	users: [1,2],
// 	id: [1,2],
// 	title: 'Rocket',
// 	status: '0',
// 	page: 1
// 	due_date_operator = ['less_than','greater_than'];
// 	orderby:'id:desc,created_at:asc
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
	private $orderby;
	private $limit;
	private $with = ['task_list','project'];
	private $tasks;
	private $task_ids;
	private $is_single_query = false;
	private $user_id = false;
	private $found_rows = 0;

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
			->orderby()
			->get()
			->with();
		
		$response = $self->format_tasks( $self->tasks );

		if( $self->is_single_query && count( $response['data'] ) ) {
			return ['data' => $response['data'][0]] ;
		}

		return $response;
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
			$response['meta'] = $this->set_meta();
			return $response;
		}

		foreach ( $tasks as $key => $task ) {
			$tasks[$key] = $this->fromat_task( $task );
		}
		
		$response['data'] = $tasks;
		$response['meta'] = $this->set_meta();
		
		return $response;
	}

	/**
	 * Set meta data
	 */
	private function set_meta() {
		return [
			'total_tasks'  => $this->found_rows,
			'total_page'   => ceil( $this->found_rows/$this->get_per_page() ),
			// 'total_comments'         => 0,
			// 'total_complete_tasks'   => 0,
			// 'total_incomplete_tasks' => 0,
			// 'totla_files'            => 0
		];
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

		$tb_list       = pm_tb_prefix() . 'pm_boards';
		$tb_boardable  = pm_tb_prefix() . 'pm_boardables';
		$tk_ids_format = $this->get_prepare_format( $this->task_ids );

		$query = "SELECT DISTINCT bo.id as task_list_id, bo.title, tk.id as task_id
			FROM $tb_list as bo
			LEFT JOIN $tb_boardable as bor ON bor.board_id = bo.id 
			LEFT JOIN $this->tb_tasks as tk ON tk.id = bor.boardable_id 
			where tk.id IN ($tk_ids_format)";

		$results = $wpdb->get_results( $wpdb->prepare( $query, $this->task_ids ) );
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
		$tk_ids_format = $this->get_prepare_format( $this->task_ids );

		$query = "SELECT DISTINCT pr.id as project_id, pr.title, tk.id as task_id
			FROM $tb_project as pr
			LEFT JOIN $this->tb_tasks as tk ON tk.project_id = pr.id 
			where tk.id IN ($tk_ids_format)";


		$results = $wpdb->get_results( $wpdb->prepare( $query, $this->task_ids ) );
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

	public function get_prepare_format( $ids, $is_string = false ) {

		
		$ids = $this->get_prepare_data( $ids );

        // how many entries will we select?
        $how_many = count( $ids );

        // prepare the right amount of placeholders
        // if you're looing for strings, use '%s' instead
        if( $is_string ) {
            $placeholders = array_fill( 0, $how_many, '%s' );
        } else {
            $placeholders = array_fill( 0, $how_many, '%d' );
        }

        // glue together all the placeholders...
        // $format = '%d, %d, %d, %d, %d, [...]'
        $format = implode( ', ', $placeholders );

        return $format;
    }

    public function get_prepare_data( $args ) {

    	if ( empty( $args ) ) {
    		return [];
    	}

    	if ( ! is_array( $args ) ) {
			if ( strpos( $args, ',' ) !== false ) {
				$args = str_replace( ' ', '', $args );
				$args = explode( ',', $args );
			}
		}

		return is_array( $args ) ? $args : [$args];
    }

	private function where_assignees() {
		$users = isset( $this->query_params['users'] ) ? $this->query_params['users'] : false;

		if ( empty( $users ) ) {
			return $this;
		}

		$format = $this->get_prepare_format( $users );
		$users = $this->get_prepare_data( $users );
			
		global $wpdb;
		$tb_asin = pm_tb_prefix() . 'pm_assignees';

		$this->join .= " LEFT JOIN {$tb_asin} ON $tb_asin.task_id={$this->tb_tasks}.id";
		
		$this->where .= $wpdb->prepare( " AND $tb_asin.assigned_to IN ($format)", $users );
	}

	private function where_project_id() {
		$project_id = isset( $this->query_params['project_id'] ) ? $this->query_params['project_id'] : false;

		if ( empty( $project_id ) ) {
			return $this;
		}

		global $wpdb;
		$format     = $this->get_prepare_format( $project_id );
		$project_id = $this->get_prepare_data( $project_id );

		$this->where .= $wpdb->prepare( " AND {$this->tb_tasks}.project_id IN ($format)", $project_id );

		return $this;
	}

	private function where_start_at() {
		$start_at = !empty( $this->query_params['start_at'] ) ? $this->query_params['start_at'] : false;

		if ( $start_at === false ) {
			return $this;
		}

		global $wpdb;

		$this->where .= $wpdb->prepare( " AND {$this->tb_tasks}.start_at>%s", $start_at );

		return $this;
	}

	private function where_due_date() {
		$due_date = !empty( $this->query_params['due_date'] ) ? $this->query_params['due_date'] : false;
		$ope_params = !empty( $this->query_params['due_date_operator'] ) ? $this->query_params['due_date_operator'] : false;

		if ( $due_date === false ) {
			return $this;
		}
		
		global $wpdb;
		
		$q = [];
		$null_query = '';

		foreach ( $ope_params as $key => $ope_param ) {
			if ( $ope_param == 'null' ) continue;

			$operator = $this->get_operator( $ope_param );
			$due_date = date( 'Y-m-d', strtotime( $due_date ) );
			$q[]      = $wpdb->prepare( " {$this->tb_tasks}.due_date $operator %s", $due_date );
		}

		$q = empty( $q ) ? '' : implode( ' AND ', $q );

		if ( in_array( 'null', $ope_params ) ) {
			$null_query = " {$this->tb_tasks}.due_date is null";
		}

		if ( ! empty( $null_query ) ) {

			if ( ! empty( $q ) ) {
				$this->where .= " AND ( ( $q ) OR ( $null_query ) )";
			} 

			if ( empty( $q ) ) {
				$this->where .= " OR ( $null_query )";
			} 
		}

		if ( empty( $null_query ) ) {
			$this->where .= " AND ( $q )";
		}

		return $this;
	}

	private function get_operator( $param ) {

		$default = [
			'less_than'          => '<',
			'less_than_equal'    => '<=',
			'greater_than'       => '>',
			'greater_than_equal' => '>=',
		];

		return empty( $default[$param] ) ? '' : $default[$param]; 
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

		global $wpdb;
		$format     = $this->get_prepare_format( $id );
		$format_ids = $this->get_prepare_data( $id );

		$this->where .= $wpdb->prepare( " AND {$this->tb_tasks}.id IN ($format)", $format_ids );

		if ( count( $format_ids ) == 1 ) {
			$this->is_single_query = true;
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

		global $wpdb;

		$this->where .= $wpdb->prepare( " AND {$this->tb_tasks}.status=%s", $status );

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

		global $wpdb;

		$this->where .= $wpdb->prepare( " AND {$this->tb_tasks}.title LIKE %s", '%' . $title . '%'  );

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

		global $wpdb;

		$this->limit = $wpdb->prepare( " LIMIT %d,%d", $this->get_offset(), $this->get_per_page() );

		return $this;
	}

	/**
	 * Get offset
	 * 
	 * @return int
	 */
	private function get_offset() {
		$page = isset( $this->query_params['pages'] ) ? $this->query_params['pages'] : false;

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
		
		$id        = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false;
		$boardable = pm_tb_prefix() . 'pm_boardables';
		$tasks = [];

		$query = $wpdb->prepare( "SELECT SQL_CALC_FOUND_ROWS DISTINCT {$this->select}, 
			list.id as task_list_id, 
			$this->tb_tasks.project_id
			
			FROM {$this->tb_tasks}
			
			{$this->join}
			
			Left join $boardable as boardable ON boardable.boardable_id = {$this->tb_tasks}.id
			Left join {$this->tb_lists} as list ON list.id = boardable.board_id
			
			WHERE %d=%d {$this->where} 
			AND boardable.board_type=%s 
			AND boardable.boardable_type=%s
			
			{$this->orderby}
			
			{$this->limit}", 

			1, 1, 'task_list', 'task'
		);
		
		$results = $wpdb->get_results( $query );

		// If task has not boardable_id mean no list
		foreach ( $results as $key => $result ) {
			if( empty( $result->task_list_id ) ) {
				continue;
			}

			$tasks[] = $result;
		}
		
		
		$this->found_rows = $wpdb->get_var( "SELECT FOUND_ROWS()" );
		
		$this->tasks = $tasks;

		if ( ! empty( $results ) && is_array( $results ) ) {
			$this->task_ids = wp_list_pluck( $results, 'id' );
		} 

		if ( ! empty( $results ) && !is_array( $results ) ) {
			$this->task_ids = [$results->id];
		} 

		return $this;
	}

	private function orderby() {
		global $wpdb;

		$tb_pj   = $wpdb->prefix . 'pm_tasks';
		$odr_prms = isset( $this->query_params['orderby'] ) ? $this->query_params['orderby'] : false;
		
		if ( $odr_prms === false && !is_array( $odr_prms ) ) {
			return $this;
		}

		$orders = [];

		$odr_prms = str_replace( ' ', '', $odr_prms );
		$odr_prms = explode( ',', $odr_prms );

		foreach ( $odr_prms as $key => $orderStr ) {
			$orderStr = str_replace( ' ', '', $orderStr );
			$orderStr = explode( ':', $orderStr );

			$orderby = $orderStr[0];
			$order = empty( $orderStr[1] ) ? 'asc' : $orderStr[1];

			$orders[$orderby] = $order;
		}

		$order = [];

	    foreach ( $orders as $key => $value ) {
	    	$order[] =  $tb_pj .'.'. $key . ' ' . $value;
	    }

	    $this->orderby = "ORDER BY " . implode( ', ', $order);

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
