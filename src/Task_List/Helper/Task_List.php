<?php
namespace WeDevs\PM\Task_List\Helper;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Manager as Manager;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Serializer\DataArraySerializer;
use League\Fractal\Resource\Collection as Collection;
use WeDevs\PM\Task_List\Transformers\Generate_List_Transformer;

// data: {
// 	with: 'milestone',
// 	per_page: '10',
// 	select: 'id, title',
// 	categories: [2, 4],
// 	assignees: [1,2],
// 	id: [1,2],
// 	title: 'Rocket', 'test'
// 	status: '0',
// 	page: 1,
//  orderby: [title=>'asc', 'id'=>desc]
// },

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
	private $is_single_query = false;

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
			->orderby()
			->get()
			->with()
			->meta();

		$response = $self->format_tasklists( $self->lists );

		if( $self->is_single_query && count( $response['data'] ) ) {
			return ['data' => $response['data'][0]] ;
		}

		return $response;
		// return (new Generate_List_Transformer)->generate_transform( $self->lists );
	}

	/**
	 * Format TaskList data
	 *
	 * @param array $tasklists
	 *
	 * @return array
	 */
	public function format_tasklists( $tasklists ) {
		$response = [
			'data' => [],
			'meta' => []
		];

		if ( ! is_array( $tasklists ) ) {
			$response['data'] = $this->fromat_tasklist( $tasklists );

			return $response;
		}

		foreach ( $tasklists as $key => $tasklist ) {
			$tasklists[$key] = $this->fromat_tasklist( $tasklist );
		}


		$response['data']  = $tasklists;
		$response ['meta'] = $this->set_tasklist_meta();

		return $response;
	}

	/**
	 * Set meta data
	 */
	private function set_tasklist_meta() {
		return [

		];
	}

	public function fromat_tasklist( $tasklist ) {
		$items = [
			'id'          => (int) $tasklist->id,
			'title'       => (string) $tasklist->title,
			'description' => pm_filter_content_url( $tasklist->description ),
			'order'       => (int) $tasklist->order,
			'status'      => $tasklist->status,
			'created_at'  => format_date( $tasklist->created_at ),
			'extra'       => true,
			'project_id'  => $tasklist->project_id
        ];

		$select_items = empty( $this->query_params['select'] ) ? null : $this->query_params['select'];

		if ( ! is_array( $select_items ) && !is_null( $select_items ) ) {
			$select_items = str_replace( ' ', '', $select_items );
			$select_items = explode( ',', $select_items );
		}


		if ( empty( $select_items ) ) {
			$this->item_with( $items,$tasklist );
			$this->item_meta( $items,$tasklist );
			error_log(print_r($items,true));
			return $items;
		}

		foreach ( $items as $item_key => $item ) {
			if ( ! in_array( $item_key, $select_items ) ) {
				unset( $items[$item_key] );
			}
		}

		$this->item_with( $items, $tasklist );
		$this->item_meta( $items, $tasklist );

		return $items;
	}

	private function item_with( &$items, $tasklist ) {
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

		if ( ! is_array( $with ) ) {
			$with = explode( ',', $with );
		}

		$tasklist_with_items =  array_intersect_key( (array) $tasklist, array_flip( $with ) );
		$items = array_merge($items,$tasklist_with_items);

		return $items;
	}

	private function item_meta( &$items, $tasklist ) {
		$meta = empty( $this->query_params['meta'] ) ? [] : $this->query_params['meta'];

		if ( ! is_array( $meta ) ) {
			$meta = explode( ',', $meta );
		}

		if( isset( $tasklist->meta ) ) {
			$tasklist_with_items =  array_intersect_key( (array) $tasklist->meta['data'], array_flip( $meta ) );
			$items['meta']['data'] = $tasklist_with_items;
		}

		return $items;
	}

	private function with() {
		$this->include_milestone()->include_complete_tasks()->include_incomplete_tasks();
		return $this;
	}

	private function meta() {
		$meta = empty( $this->query_params['meta'] ) ? [] : $this->query_params['meta'];

		if ( ! is_array( $meta ) ) {
			$meta = explode( ',', $meta );
		}

		if ( in_array( 'total_tasks', $meta ) || empty( $this->list_ids ) ) {
			$this->total_tasks_count();
		}

		if ( in_array( 'total_complete_tasks', $meta ) || empty( $this->list_ids ) ) {
			$this->total_complete_tasks_count();
		}

		if ( in_array( 'total_incomplete_tasks', $meta ) || empty( $this->list_ids ) ) {
			$this->total_incomplete_tasks_count();
		}

		if ( in_array( 'total_comments', $meta ) || empty( $this->list_ids ) ) {
			$this->total_comments_count();
		}

		if ( in_array( 'total_assignees', $meta ) || empty( $this->list_ids ) ) {
			$this->total_assignees_count();
		}

		return $this;
	}

	private function total_tasks_count() {
		global $wpdb;
		$metas = [];
		$tb_tasks = pm_tb_prefix() . 'pm_tasks';
		$tb_boardable  = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );

		$query ="SELECT DISTINCT count($tb_tasks.id) as task_count, $tb_boardable.board_id as list_id FROM $tb_tasks
			LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_tasks.id
			WHERE $tb_boardable.boardable_type='task'
			AND $tb_boardable.board_type='task_list'
			AND $tb_boardable.board_id IN ($tasklist_format)
			group by $tb_boardable.board_id
		";

		$results = $wpdb->get_results( $wpdb->prepare( $query, $this->list_ids ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->task_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['data']['total_tasks'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
		}

		return $this;
	}

	private function  total_complete_tasks_count() {
		global $wpdb;
		$metas = [];
		$tb_tasks = pm_tb_prefix() . 'pm_tasks';
		$tb_boardable  = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );

		$query ="SELECT DISTINCT count($tb_tasks.id) as task_count, $tb_boardable.board_id as list_id FROM $tb_tasks
			LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_tasks.id
			WHERE $tb_boardable.boardable_type='task'
			AND $tb_boardable.board_type='task_list'
			AND $tb_tasks.status = 1
			AND $tb_boardable.board_id IN ($tasklist_format)
			group by $tb_boardable.board_id
		";

		$results = $wpdb->get_results( $wpdb->prepare( $query, $this->list_ids ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->task_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['data']['total_complete_tasks'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
		}

		return $this;
	}

	private function total_incomplete_tasks_count() {
		global $wpdb;
		$metas = [];
		$tb_tasks = pm_tb_prefix() . 'pm_tasks';
		$tb_boardable  = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );

		$query ="SELECT DISTINCT count($tb_tasks.id) as task_count, $tb_boardable.board_id as list_id FROM $tb_tasks
			LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_tasks.id
			WHERE $tb_boardable.boardable_type='task'
			AND $tb_boardable.board_type='task_list'
			AND $tb_tasks.status = 0
			AND $tb_boardable.board_id IN ($tasklist_format)
			group by $tb_boardable.board_id
		";

		$results = $wpdb->get_results( $wpdb->prepare( $query, $this->list_ids ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->task_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['data']['total_incomplete_tasks'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
		}

		return $this;
	}

	private function total_comments_count() {
		global $wpdb;
		$metas = [];
		$tb_pm_comments = pm_tb_prefix() . 'pm_comments';
		$tb_boards  = pm_tb_prefix() . 'pm_boards';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );

		$query ="SELECT DISTINCT count($tb_pm_comments.id) as comment_count,
		$tb_boards.id as list_id FROM $tb_pm_comments
			LEFT JOIN $tb_boards  ON $tb_boards.id = $tb_pm_comments.commentable_id
			WHERE $tb_pm_comments.commentable_type = 'task_list'
			AND $tb_boards.id IN ($tasklist_format)
			group by $tb_boards.id
		";

		$results = $wpdb->get_results( $wpdb->prepare( $query, $this->list_ids ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->comment_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['data']['total_comments'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
		}

		return $this;
	}

	private function total_assignees_count() {
		global $wpdb;
		$metas = [];
		$tb_users = pm_tb_prefix() . 'Users';
		$tb_boardable  = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );

		$query ="SELECT DISTINCT count($tb_users.id) as user_count,
		$tb_boardable.board_id as list_id FROM $tb_users
			LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_users.id
			WHERE $tb_boardable.board_type = 'task_list'
			AND $tb_boardable.boardable_type = 'user'
			AND $tb_boardable.board_id IN ($tasklist_format)
			group by $tb_boardable.board_id
		";

		$results = $wpdb->get_results( $wpdb->prepare( $query, $this->list_ids ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->comment_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['data']['total_assignees'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
		}

		return $this;
	}

	private function include_complete_tasks() {
		global $wpdb;
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

		if ( ! is_array( $with ) ) {
			$with = explode( ',', $with );
		}

		$incomplete_tasks = [];

		if ( ! in_array( 'complete_tasks', $with ) ) {
			return $this;
		}

		$tb_tasks = pm_tb_prefix() . 'pm_tasks';
		$tb_boardable  = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );

		$query ="SELECT DISTINCT $tb_tasks.*, $tb_boardable.board_id as list_id FROM $tb_tasks
				LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_tasks.id
				WHERE $tb_boardable.boardable_type='task'
				AND $tb_boardable.board_type='task_list'
				AND $tb_tasks.status = 1
				AND $tb_boardable.board_id IN ($tasklist_format)
			";

		$results = $wpdb->get_results( $wpdb->prepare( $query, $this->list_ids ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$complete_tasks[$list_id] = $result;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->complete_tasks['data'] = empty( $complete_tasks[$list->id] ) ? [] : [$complete_tasks[$list->id]];
		}

		return $this;
	}

	private function include_incomplete_tasks() {
		global $wpdb;
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

		if ( ! is_array( $with ) ) {
			$with = explode( ',', $with );
		}

		$incomplete_tasks = [];

		if ( ! in_array( 'incomplete_tasks', $with ) ) {
			return $this;
		}

		$tb_tasks = pm_tb_prefix() . 'pm_tasks';
		$tb_boardable  = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );

		$query ="SELECT DISTINCT $tb_tasks.*, $tb_boardable.board_id as list_id FROM $tb_tasks
			LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_tasks.id
			WHERE $tb_boardable.boardable_type='task'
			AND $tb_boardable.board_type='task_list'
			AND $tb_tasks.status = 0
			AND $tb_boardable.board_id IN ($tasklist_format)
		";

		$results = $wpdb->get_results( $wpdb->prepare( $query, $this->list_ids ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$incomplete_tasks[$list_id] = $result;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->incomplete_tasks['data'] = empty( $incomplete_tasks[$list->id] ) ? [] : [$incomplete_tasks[$list->id]];
		}

		return $this;
	}

	private function include_milestone() {
		global $wpdb;
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

		if ( ! is_array( $with ) ) {
			$with = explode( ',', $with );
		}

		$milestone = [];

		if ( ! in_array( 'milestone', $with ) ) {
			return $this;
		}

		$tb_boards = pm_tb_prefix() . 'pm_boards';
		$tb_boardable  = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );

		$query ="SELECT DISTINCT * FROM $tb_boards
				LEFT JOIN $tb_boardable  ON $tb_boardable.board_id = $tb_boards.id
				WHERE $tb_boards.type='milestone' AND $tb_boardable.board_id IN ($tasklist_format)" ;

		$results = $wpdb->get_results( $wpdb->prepare( $query, $this->list_ids ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->id;
			$milestone[$list_id] = $result;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->milestone['data'] = empty( $milestone[$list->id] ) ? [] : [$milestone[$list->id]];
		}

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

	private function orderby() {
        global $wpdb;

		$tb_pj    = $wpdb->prefix . 'pm_boards';
		$odr_prms = isset( $this->query_params['orderby'] ) ? $this->query_params['orderby'] : false;

        if ( $odr_prms === false && !is_array( $odr_prms ) ) {
            return $this;
        }

        $orders = [];

        $odr_prms = str_replace( ' ', '', $odr_prms );
        $odr_prms = explode( ',', $odr_prms );

        foreach ( $odr_prms as $key => $orderStr ) {
			$orderStr         = str_replace( ' ', '', $orderStr );
			$orderStr         = explode( ':', $orderStr );
			$orderby          = $orderStr[0];
			$order            = empty( $orderStr[1] ) ? 'asc' : $orderStr[1];
			$orders[$orderby] = $order;
        }

        $order = [];

        foreach ( $orders as $key => $value ) {
            $order[] =  $tb_pj .'.'. $key . ' ' . $value;
        }

        $this->orderby = "ORDER BY " . implode( ', ', $order);

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
			{$this->limit} {$this->orderby}";


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
