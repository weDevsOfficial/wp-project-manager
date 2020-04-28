<?php
namespace WeDevs\PM\Milestone\Helper;

use WeDevs\PM\Task_List\Helper\Task_List;
use WeDevs\PM\Discussion_Board\Helper\Discussion_Board;

use WP_REST_Request;
// data: {
// 	with: '',
// 	per_page: '10',
// 	select: 'id, title',
// 	id: [1,2],
// 	title: 'Rocket', 'test'
// 	page: 1,
//  orderby: [title=>'asc', 'id'=>desc]
//  milestone_meta: 'total_task_milestones,total_tasks,total_complete_tasks,total_incomplete_tasks,total_discussion_boards,total_milestones,total_comments,total_files,total_activities'
// },

class Milestone {
	private static $_instance;
	private $query_params;
	private $select;
	private $join;
	private $where;
	private $limit;
	private $orderby;
	private $with;
	private $milestones;
	private $milestone_ids;
	private $is_single_query = false;

	public static function getInstance() {
        return new self();
    }

    function __construct() {
    	$this->set_table_name();
    }

    public static function get_task_milestones( WP_REST_Request $request ) {
		$milestones = self::get_results( $request->get_params() );

		wp_send_json( $milestones );
	}

	public static function get_results( $params = [] ) {
		$self = self::getInstance();
		$self->query_params = $params;

		$self->join()
			->where()
			->limit()
			->orderby()
			->get()
			->with()
			->meta();

		$response = $self->format_milestones( $self->milestones );
		
		if ( pm_is_single_query( $params ) ) {
			return ['data' => $response['data'][0]] ;
		}

		return $response;
	}

	/**
	 * Format TaskMilestone data
	 *
	 * @param array $milestones
	 *
	 * @return array
	 */
	public function format_milestones( $milestones ) {
		$response = [
			'data' => [],
			'meta' => []
		];

		// if ( ! is_array( $milestones ) ) {
		// 	$response['data'] = $this->fromat_milestone( $milestones );

		// 	return $response;
		// }

		foreach ( $milestones as $key => $milestone ) {
			$milestones[$key] = $this->fromat_milestone( $milestone );
		}

		$response['data']  = $milestones;
		$response ['meta'] = $this->set_milestones_meta();

		return $response;
	}

	/**
	 * Set meta data
	 */
	private function set_milestones_meta() {
		return [
			'pagination' => [
				'total'   => $this->found_rows,
				'per_page'  => ceil( $this->found_rows/$this->get_per_page() )
			]
		];
	}

	public function fromat_milestone( $milestone ) {
		
		$items =  [
            'id'           => (int) $milestone->id,
            'title'        => $milestone->title,
            'description'  => $milestone->description,
            'order'        => (int) $milestone->order,
            'achieve_date' => format_date( $milestone->achieve_date ),
            'achieved_at'  => format_date( $milestone->updated_at ),
            'status'       => $milestone->status,
            'created_at'   => format_date( $milestone->created_at ),
            'meta'         => $milestone->meta
        ];

        //$items = apply_filters( 'pm_milestone_transform', $items, $milestone );

		// $select_items = empty( $this->query_params['select'] ) ? null : $this->query_params['select'];

		// if ( ! is_array( $select_items ) && !is_null( $select_items ) ) {
		// 	$select_items = str_replace( ' ', '', $select_items );
		// 	$select_items = explode( ',', $select_items );
		// }

		// if ( empty( $select_items ) ) {
		// 	$items = $this->item_with( $items,$milestone );
		// 	$items = $this->item_meta( $items,$milestone );
		// 	return $items;
		// }

		// foreach ( $items as $item_key => $item ) {
		// 	if ( ! in_array( $item_key, $select_items ) ) {
		// 		unset( $items[$item_key] );
		// 	}
		// }

		$items = $this->item_with( $items, $milestone );
		//$items = $this->item_meta( $items, $milestone );

		return apply_filters( 'pm_milestone_transform', $items, $milestone );
	}

	private function item_with( $items, $milestone ) {
        $with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

        if ( ! is_array( $with ) ) {
            $with = explode( ',', str_replace(' ', '', $with ) );
        }
        
        $milestone_with_items =  array_intersect_key( (array) $milestone, array_flip( $with ) );

        $items = array_merge( $items, $milestone_with_items );

        return $items;
    }


	private function with() {
		$this->achieve_date()
			->discussion_boards()
			->task_lists();

		$this->milestones = apply_filters( 'pm_milestone_with',$this->milestones, $this->milestone_ids, $this->query_params );

		return $this;
	}

	private function discussion_boards() {
		global $wpdb;

		if ( empty( $this->milestone_ids ) ) {
			return $this;
		}

		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', str_replace(' ', '', $with ) );
		}

		if ( ! in_array( 'discussion_boards', $with ) || empty( $this->milestone_ids ) ) {
			return $this;
		}

		$tb_milestones    = pm_tb_prefix() . 'pm_boardables';
		$milestone_format = pm_get_prepare_format( $this->milestone_ids );
		$query_data       = $this->milestone_ids;

		$query = "SELECT DISTINCT bor.boardable_id as discussion_board_id,
			bor.board_id as milestone_id
			FROM $tb_milestones as bor
			where bor.board_id IN ($milestone_format)
			AND bor.board_type=%s
			AND bor.boardable_type=%s";

		array_push( $query_data, 'milestone', 'discussion_board' );
		
		$results  = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$discussion_board_ids = wp_list_pluck( $results, 'discussion_board_id' );
		
		$discussion_boards = Discussion_Board::get_results([
			'id' => $discussion_board_ids
		]);
	

        $key_discussion_boards = [];
        $discussion_boards['data'] = $discussion_boards['data'];

        foreach ( $discussion_boards['data'] as $key => $discussion_board ) {
            $key_discussion_boards[$discussion_board['id']] = $discussion_board;
        }

        foreach ( $results as $key => $result ) {
            $discussion_boards[$result->milestone_id][] = $key_discussion_boards[$result->discussion_board_id];
        }

        foreach ( $this->milestones as $key => $milestone ) {
            $milestone->discussion_boards['data'] = empty( $discussion_boards[$milestone->id] ) ? [] : $discussion_boards[$milestone->id];
        }
        
        return $this;
	}

	private function task_lists() {
		global $wpdb;

		if ( empty( $this->milestone_ids ) ) {
			return $this;
		}

		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', str_replace(' ', '', $with ) );
		}

		if ( ! in_array( 'task_lists', $with ) || empty( $this->milestone_ids ) ) {
			return $this;
		}

		$tb_milestones    = pm_tb_prefix() . 'pm_boardables';
		$milestone_format = pm_get_prepare_format( $this->milestone_ids );
		$query_data       = $this->milestone_ids;

		$query = "SELECT DISTINCT bor.boardable_id as list_id,
			bor.board_id as milestone_id
			FROM $tb_milestones as bor
			where bor.board_id IN ($milestone_format)
			AND bor.board_type=%s
			AND bor.boardable_type=%s";

		array_push( $query_data, 'milestone', 'task_list' );
		
		$results  = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$list_ids = wp_list_pluck( $results, 'list_id' );
		
		$lists = Task_List::get_results([
			'id' => $list_ids
		]);
	

        $key_lists = [];

        foreach ( $lists['data'] as $key => $list ) {
            $key_lists[$list['id']] = $list;
        }

        foreach ( $results as $key => $result ) {
            $lists[$result->milestone_id][] = $key_lists[$result->list_id];
        }

        foreach ( $this->milestones as $key => $milestone ) {
            $milestone->task_lists['data'] = empty( $lists[$milestone->id] ) ? [] : $lists[$milestone->id];
        }
        
        return $this;
	}

	private function achieve_date() {
		global $wpdb;

		$tb_meta          = pm_tb_prefix() . 'pm_meta';
		$milestone_format = pm_get_prepare_format( $this->milestone_ids );
		$query_data       = $this->milestone_ids;

		$query = "SELECT DISTINCT mt.meta_value as achieve_date, mt.entity_id as milestone_id
			FROM $tb_meta as mt
			where mt.entity_id IN ($milestone_format)
			AND mt.meta_key=%s";

		array_push( $query_data, 'achieve_date' );
		
		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$metas   = [];

		foreach ( $results as $key => $result ) {
			$milestone_id = $result->milestone_id;
			unset( $result->milestone_id );
			$metas[$milestone_id] = $result;
		}
		
		foreach ( $this->milestones as $key => $milestone ) {
			$milestone->achieve_date = empty( $metas[$milestone->id] ) ? '' : $metas[$milestone->id]->achieve_date; 
		}

		return $this;
	}

	private function meta() {
		$this->get_pm_meta_table_value()
			->total_task_list()
			->total_discussion_board();
		

		return $this;
	}

	private function total_task_list() {
		global $wpdb;
		
		if ( empty( $this->milestone_ids ) ) {
			return $this;
		}

		$metas            = [];
		$tb_milestones    = pm_tb_prefix() . 'pm_boardables';
		$milestone_format = pm_get_prepare_format( $this->milestone_ids );
		$query_data       = $this->milestone_ids;

		$query = "SELECT DISTINCT count(bor.boardable_id) as total_task_list,
			bor.board_id as milestone_id
			FROM $tb_milestones as bor
			where bor.board_id IN ($milestone_format)
			AND bor.board_type=%s
			AND bor.boardable_type=%s
			group by bor.boardable_id";

		array_push( $query_data, 'milestone', 'task_list' );
		
		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		
		foreach ( $results as $key => $result ) {
			$milestone_id = $result->milestone_id;
			unset($result->milestone_id);
			$metas[$milestone_id] = $result->total_task_list;
		}

		foreach ( $this->milestones as $key => $milestone ) {
			$milestone->meta['total_task_list'] = empty( $metas[$milestone->id] ) ? 0 : (int) $metas[$milestone->id];
		}
		
		return $this;
	}

	private function total_discussion_board() {

		global $wpdb;
		
		if ( empty( $this->milestone_ids ) ) {
			return $this;
		}

		$metas            = [];
		$tb_milestones    = pm_tb_prefix() . 'pm_boardables';
		$milestone_format = pm_get_prepare_format( $this->milestone_ids );
		$query_data       = $this->milestone_ids;

		$query = "SELECT DISTINCT count(bor.boardable_id) as total_discussion_board,
			bor.board_id as milestone_id
			FROM $tb_milestones as bor
			where bor.board_id IN ($milestone_format)
			AND bor.board_type=%s
			AND bor.boardable_type=%s
			group by bor.boardable_id";

		array_push( $query_data, 'milestone', 'discussion_board' );
		
		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		
		foreach ( $results as $key => $result ) {
			$milestone_id = $result->milestone_id;
			unset($result->milestone_id);
			$metas[$milestone_id] = $result->total_discussion_board;
		}

		foreach ( $this->milestones as $key => $milestone ) {
			$milestone->meta['total_discussion_board'] = empty( $metas[$milestone->id] ) ? 0 : (int) $metas[$milestone->id];
		}
		
		return $this;
	}

	private function get_pm_meta_table_value() {
		if ( empty( $this->milestone_ids ) ) {
			return $this;
		}
        
        global $wpdb;

		$metas            = [];
		$tb_projects      = pm_tb_prefix() . 'pm_projects';
		$tb_meta          = pm_tb_prefix() . 'pm_meta';
		$milestone_format = pm_get_prepare_format( $this->milestone_ids );
		$query_data       = $this->milestone_ids;

        $query = "SELECT DISTINCT $tb_meta.meta_key, $tb_meta.meta_value, $tb_meta.entity_id
            FROM $tb_meta
            WHERE $tb_meta.entity_id IN ($milestone_format)
            AND $tb_meta.entity_type = %s ";

        array_push( $query_data, 'milestone' );

        $results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

        foreach ( $results as $key => $result ) {
            $milestone_id = $result->entity_id;
            unset( $result->entity_id );
            $metas[$milestone_id][] = $result;
        }
        
        foreach ( $this->milestones as $key => $milestone ) {
            $filter_metas = empty( $metas[$milestone->id] ) ? [] : $metas[$milestone->id];

            foreach ( $filter_metas as $key => $filter_meta ) {
                $milestone->meta[$filter_meta->meta_key] = $filter_meta->meta_value;
            }
        }
        
        return $this;
    }

	private function join() {
		return $this;
	}

	private function where() {

		$this->where_id()
			->where_project_id()
			->where_title();

		return $this;
	}

	/**
	 * Filter milestone by ID
	 *
	 * @return class object
	 */
	private function where_id() {
		$id = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false; 

		if ( empty( $id ) ) {
			return $this;
		}

		global $wpdb;
		$format     = pm_get_prepare_format( $id );
		$format_ids = pm_get_prepare_data( $id );

		$this->where .= $wpdb->prepare( " AND {$this->tb_milestone}.id IN ($format)", $format_ids );

		if ( count( $format_ids ) == 1 ) {
			$this->is_single_query = true;
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

		// $this->where .= " AND {$this->tb_milestone}.title LIKE '%$title%'";
		$this->where .= $wpdb->prepare( " AND {$this->tb_milestone}.title LIKE %s", '%'.$title.'%' );

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
			//$this->where .= " AND {$this->tb_milestone}.project_id IN ($query_id)";
			$query_format = pm_get_prepare_format( $id );
			$this->where .= $wpdb->prepare( " AND {$this->tb_milestone}.project_id IN ($query_format)", $id );
		}

		if ( !is_array( $id ) ) {
		//	$this->where .= " AND {$this->tb_milestone}.project_id = $id";
			$this->where .= $wpdb->prepare( " AND {$this->tb_milestone}.project_id IN (%d)", $id );
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

		$query = "SELECT SQL_CALC_FOUND_ROWS DISTINCT {$this->tb_milestone}.*
			FROM {$this->tb_milestone}
			{$this->join}
			WHERE %d=%d {$this->where} AND $this->tb_milestone.type=%s
			{$this->orderby} {$this->limit} ";

		$results = $wpdb->get_results( $wpdb->prepare( $query, 1, 1, 'milestone' ) );

		$this->found_rows = $wpdb->get_var( "SELECT FOUND_ROWS()" );
		$this->milestones = $results;

		if ( ! empty( $results ) && is_array( $results ) ) {
			$this->milestone_ids = wp_list_pluck( $results, 'id' );
		}

		if ( ! empty( $results ) && !is_array( $results ) ) {
			$this->milestone_ids = [$results->id];
		}

		return $this;
	}

	private function set_table_name() {
		$this->tb_project          = pm_tb_prefix() . 'pm_projects';
		$this->tb_milestone        = pm_tb_prefix() . 'pm_boards';
	}
}
