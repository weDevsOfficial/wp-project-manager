<?php
namespace WeDevs\PM\Task_List\Helper;

use WP_REST_Request;
// data: {
// 	with: '',
// 	per_page: '10',
// 	select: 'id, title',
// 	id: [1,2],
// 	title: 'Rocket', 'test'
// 	page: 1,
//  orderby: [title=>'asc', 'id'=>desc]
//  list_meta: 'total_task_lists,total_tasks,total_complete_tasks,total_incomplete_tasks,total_discussion_boards,total_milestones,total_comments,total_files,total_activities'
// },

class Task_List {
	private static $_instance;
	private $query_params;
	private $select;
	private $join;
	private $where;
	private $limit;
	private $orderby;
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
			'pagination' => [
				'total'   => $this->found_rows,
				'per_page'       => ceil( $this->found_rows/$this->get_per_page() )
			]
		];
	}

	public function fromat_tasklist( $tasklist ) {
		$items = [
			'id'          => (int) $tasklist->id,
			'title'       => isset( $tasklist->title ) ? (string) $tasklist->title : null,
			'description' => isset( $tasklist->description ) ?
			 pm_filter_content_url( $tasklist->description ) : null,
			'order'       => isset( $tasklist->order ) ? (int) $tasklist->order : null,
			'status'      => isset( $tasklist->status ) ? $tasklist->status : null,
			'created_at'  => isset( $tasklist->status ) ?  format_date( $tasklist->created_at ) : null,
			'extra'       => true,
			'project_id'  => isset( $tasklist->project_id ) ?  $tasklist->project_id : null
        ];

		$select_items = empty( $this->query_params['select'] ) ? null : $this->query_params['select'];

		if ( ! is_array( $select_items ) && !is_null( $select_items ) ) {
			$select_items = str_replace( ' ', '', $select_items );
			$select_items = explode( ',', $select_items );
		}

		if ( empty( $select_items ) ) {
			$items = $this->item_with( $items,$tasklist );
			$items = $this->item_meta( $items,$tasklist );
			return $items;
		}

		foreach ( $items as $item_key => $item ) {
			if ( ! in_array( $item_key, $select_items ) ) {
				unset( $items[$item_key] );
			}
		}

		$items = $this->item_with( $items, $tasklist );
		$items = $this->item_meta( $items, $tasklist );

		return $items;
	}

	private function item_with( $items, $tasklist ) {
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

		if ( ! is_array( $with ) ) {
			$with = explode( ',', $with );
		}

		$tasklist_with_items =  array_intersect_key( (array) $tasklist, array_flip( $with ) );

		$items = array_merge($items,$tasklist_with_items);

		return $items;
	}

	private function item_meta( $items, $tasklist ) {
		$meta = empty( $this->query_params['list_meta'] ) ? [] : $this->query_params['list_meta'];

		if( ! $meta ) {
			return $items;
		}

		$items['meta'] = empty( $tasklist->meta ) ? [] : $tasklist->meta;

		return $items;
	}

	private function with() {
		//$this->include_milestone()->include_complete_tasks()->include_incomplete_tasks();
		$this->lists = apply_filters( 'pm_tasklist_with',$this->lists, $this->list_ids, $this->query_params );

		return $this;
	}

	private function meta() {
		$meta = empty( $this->query_params['list_meta'] ) ? [] : $this->query_params['list_meta'];

		if ( ! is_array( $meta ) && $meta != 'all' ) {
			$meta = explode( ',', $meta );
		}

		if ( $meta == 'all' ) {
			$this->total_tasks_count();
			$this->total_complete_tasks_count();
			$this->total_incomplete_tasks_count();
			$this->total_comments_count();
			$this->total_assignees_count();
			$this->get_meta_tb_data();

			return $this;
		}

		if ( in_array( 'total_tasks', $meta ) ) {
			$this->total_tasks_count();
		}

		if ( in_array( 'total_complete_tasks', $meta )  ) {
			$this->total_complete_tasks_count();
		}

		if ( in_array( 'total_incomplete_tasks', $meta ) ) {
			$this->total_incomplete_tasks_count();
		}

		if ( in_array( 'total_comments', $meta ) ) {
			$this->total_comments_count();
		}

		if ( in_array( 'total_assignees', $meta ) ) {
			$this->total_assignees_count();
		}

		$this->get_meta_tb_data();

		return $this;
	}

	private function get_meta_tb_data() {
		if ( empty( $this->list_ids ) ) {
			return $this;
		}
        global $wpdb;
		$metas           = [];
		$tb_projects     = pm_tb_prefix() . 'pm_projects';
		$tb_meta         = pm_tb_prefix() . 'pm_meta';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

        $query = "SELECT DISTINCT $tb_meta.meta_key, $tb_meta.meta_value, $tb_meta.entity_id
            FROM $tb_meta
            WHERE $tb_meta.entity_id IN ($tasklist_format)
            AND $tb_meta.entity_type = %s ";

        array_push( $query_data, 'task_list' );

        $results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

        foreach ( $results as $key => $result ) {
            $list_id = $result->entity_id;
            unset( $result->entity_id );
            $metas[$list_id][] = $result;
        }

        foreach ( $this->lists as $key => $list ) {
            $filter_metas = empty( $metas[$list->id] ) ? [] : $metas[$list->id];

            foreach ( $filter_metas as $key => $filter_meta ) {
                $list->meta[$filter_meta->meta_key] = $filter_meta->meta_value;
            }
        }

        return $this;
    }

	private function total_tasks_count() {
		global $wpdb;
		$metas           = [];
		$tb_tasks        = pm_tb_prefix() . 'pm_tasks';
		$tb_boardable    = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

		$query ="SELECT DISTINCT count($tb_tasks.id) as task_count, $tb_boardable.board_id as list_id FROM $tb_tasks
			LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_tasks.id
			WHERE $tb_boardable.board_id IN ($tasklist_format)
			AND $tb_boardable.boardable_type=%s
			AND $tb_boardable.board_type=%s
			group by $tb_boardable.board_id
		";

		array_push( $query_data, 'task', 'task_list' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->task_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['total_tasks'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
		}

		return $this;
	}

	private function  total_complete_tasks_count() {
		global $wpdb;
		$metas           = [];
		$tb_tasks        = pm_tb_prefix() . 'pm_tasks';
		$tb_boardable    = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

		$query ="SELECT DISTINCT count($tb_tasks.id) as task_count, $tb_boardable.board_id as list_id FROM $tb_tasks
			LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_tasks.id
			WHERE $tb_boardable.board_id IN ($tasklist_format)
			AND $tb_boardable.boardable_type=%s
			AND $tb_boardable.board_type=%s
			AND $tb_tasks.status = %d
			group by $tb_boardable.board_id
		";

		array_push( $query_data, 'task', 'task_list', '1' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->task_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['total_complete_tasks'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
		}

		return $this;
	}

	private function total_incomplete_tasks_count() {
		global $wpdb;
		$metas           = [];
		$tb_tasks        = pm_tb_prefix() . 'pm_tasks';
		$tb_boardable    = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

		$query ="SELECT DISTINCT count($tb_tasks.id) as task_count, $tb_boardable.board_id as list_id FROM $tb_tasks
			LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_tasks.id
			WHERE $tb_boardable.board_id IN ($tasklist_format)
			AND $tb_boardable.boardable_type=%s
			AND $tb_boardable.board_type=%s
			AND $tb_tasks.status = %d
			group by $tb_boardable.board_id
		";

		array_push( $query_data, 'task', 'task_list', '0' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->task_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['total_incomplete_tasks'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
		}

		return $this;
	}

	private function total_comments_count() {
		global $wpdb;
		$metas           = [];
		$tb_pm_comments  = pm_tb_prefix() . 'pm_comments';
		$tb_boards       = pm_tb_prefix() . 'pm_boards';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

		$query ="SELECT DISTINCT count($tb_pm_comments.id) as comment_count,
		$tb_boards.id as list_id FROM $tb_pm_comments
			LEFT JOIN $tb_boards  ON $tb_boards.id = $tb_pm_comments.commentable_id
			WHERE $tb_boards.id IN ($tasklist_format)
			AND $tb_pm_comments.commentable_type = %s
			group by $tb_boards.id
		";

		array_push( $query_data, 'task_list' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->comment_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['total_comments'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
		}

		return $this;
	}

	private function total_assignees_count() {
		global $wpdb;
		$metas           = [];
		$tb_users        = pm_tb_prefix() . 'Users';
		$tb_boardable    = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

		$query ="SELECT DISTINCT count($tb_users.id) as user_count,
		$tb_boardable.board_id as list_id FROM $tb_users
			LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_users.id
			WHERE $tb_boardable.board_id IN ( $tasklist_format )
			AND $tb_boardable.board_type = %s
			AND $tb_boardable.boardable_type = %s
			group by $tb_boardable.board_id
		";

		array_push( $query_data, 'task_list', 'user' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->comment_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['total_assignees'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
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

		$tb_tasks        = pm_tb_prefix() . 'pm_tasks';
		$tb_boardable    = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

		$query ="SELECT DISTINCT $tb_tasks.*, $tb_boardable.board_id as list_id FROM $tb_tasks
				LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_tasks.id
				WHERE $tb_boardable.board_id IN ($tasklist_format)
				AND $tb_boardable.boardable_type=%s
				AND $tb_boardable.board_type=%s
				AND $tb_tasks.status = %d
			";

		array_push( $query_data, 'task', 'task_list', 1 );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

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

		$tb_tasks        = pm_tb_prefix() . 'pm_tasks';
		$tb_boardable    = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

		$query ="SELECT DISTINCT $tb_tasks.*, $tb_boardable.board_id as list_id FROM $tb_tasks
			LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_tasks.id
			WHERE $tb_boardable.board_id IN ($tasklist_format)
			AND $tb_boardable.boardable_type=%s
			AND $tb_boardable.board_type=%s
			AND $tb_tasks.status = %d
		";

		array_push( $query_data, 'task', 'task_list', 0 );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

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

		$tb_boards       = pm_tb_prefix() . 'pm_boards';
		$tb_boardable    = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

		$query ="SELECT DISTINCT $tb_boards.*,$tb_boardable.boardable_id as list_id  FROM $tb_boards
				LEFT JOIN $tb_boardable  ON $tb_boardable.board_id = $tb_boards.id
				WHERE $tb_boardable.boardable_id IN ($tasklist_format) AND $tb_boards.type=%s " ;

		array_push( $query_data, 'milestone' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
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

		$this->where_id()->where_project_id()
			->where_title();

		return $this;
	}

	/**
	 * Filter list by ID
	 *
	 * @return class object
	 */
	private function where_id() {
		global $wpdb;
		$id = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false;

		if ( empty( $id ) ) {
			return $this;
		}

		if ( is_array( $id ) ) {
			//$query_id = implode( ',', $id );
			$query_format = pm_get_prepare_format( $id );
			$this->where .= $wpdb->prepare( " AND {$this->tb_list}.id IN ($query_format)", $id );
			// $this->where .= " AND {$this->tb_list}.id IN ($query_id)";
		}

		if ( !is_array( $id ) ) {
			// $this->where .= " AND {$this->tb_list}.id IN ($id)";
			$this->where .= $wpdb->prepare( " AND {$this->tb_list}.id IN (%d)", $id );

			$explode = explode( ',', $id );

			if ( count( $explode ) == 1 ) {
				$this->is_single_query = true;
			}
		}

		return $this;
	}

	/**
	 * Filter task by title
	 *
	 * @return class object
	 */
	private function where_title() {
		global $wpdb;
		$title = isset( $this->query_params['title'] ) ? $this->query_params['title'] : false;

		if ( empty( $title ) ) {
			return $this;
		}

		// $this->where .= " AND {$this->tb_list}.title LIKE '%$title%'";
		$this->where .= $wpdb->prepare( " AND {$this->tb_list}.title LIKE %s", '%'.$title.'%' );

		return $this;
	}

	private function where_project_id() {
		global $wpdb;
		$id = isset( $this->query_params['project_id'] ) ? $this->query_params['project_id'] : false;

		if ( empty( $id ) ) {
			return $this;
		}

		if ( is_array( $id ) ) {
			//$query_id = implode( ',', $id );
			//$this->where .= " AND {$this->tb_list}.project_id IN ($query_id)";
			$query_format = pm_get_prepare_format( $id );
			$this->where .= $wpdb->prepare( " AND {$this->tb_list}.project_id IN ($query_format)", $id );
		}

		if ( !is_array( $id ) ) {
		//	$this->where .= " AND {$this->tb_list}.project_id = $id";
			$this->where .= $wpdb->prepare( " AND {$this->tb_list}.project_id IN (%d)", $id );
		}

		return $this;
	}



	private function limit() {
		global $wpdb;
		$per_page = isset( $this->query_params['per_page'] ) ? $this->query_params['per_page'] : false;

		if ( $per_page === false || $per_page == '-1' ) {
			return $this;
		}

		// $this->limit = " LIMIT {$this->get_offset()},{$this->get_per_page()}";
		$this->limit = $wpdb->prepare( " LIMIT %d,%d", $this->get_offset(), $this->get_per_page() );

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

		$query = "SELECT SQL_CALC_FOUND_ROWS DISTINCT {$this->select}
			FROM {$this->tb_list}
			{$this->join}
			WHERE %d=%d {$this->where} AND $this->tb_list.type=%s
			{$this->orderby} {$this->limit} ";

		$results = $wpdb->get_results( $wpdb->prepare( $query, 1, 1, 'task_list' ) );

		$this->found_rows = $wpdb->get_var( "SELECT FOUND_ROWS()" );
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
		$this->tb_project          = pm_tb_prefix() . 'pm_projects';
		$this->tb_list             = pm_tb_prefix() . 'pm_boards';
		$this->tb_task             = pm_tb_prefix() . 'pm_tasks';
		$this->tb_project_user     = pm_tb_prefix() . 'pm_role_user';
		$this->tb_task_user        = pm_tb_prefix() . 'pm_assignees';
		$this->tb_categories       = pm_tb_prefix() . 'pm_categories';
		$this->tb_category_project = pm_tb_prefix() . 'pm_category_project';
	}
}
