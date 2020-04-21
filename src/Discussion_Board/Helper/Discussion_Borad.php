<?php
namespace WeDevs\PM\Discussion_Board\Helper;

use WeDevs\PM\Milestone\Helper\Milestone;


use WP_REST_Request;
// data: {
// 	with: '',
// 	per_page: '10',
// 	select: 'id, title',
// 	id: [1,2],
// 	title: 'Rocket', 'test'
// 	page: 1,
//  orderby: [title=>'asc', 'id'=>desc]
//  discussion_board_meta: 'total_task_discussion_boards,total_tasks,total_complete_tasks,total_incomplete_tasks,total_discussion_boards,total_discussion_boards,total_comments,total_files,total_activities'
// },

class Discussion_Board {
	private static $_instance;
	private $query_params;
	private $select;
	private $join;
	private $where;
	private $limit;
	private $orderby;
	private $with;
	private $discussion_boards;
	private $discussion_board_ids;
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

    public static function get_task_discussion_boards( WP_REST_Request $request ) {
		$discussion_boards = self::get_results( $request->get_params() );

		wp_send_json( $discussion_boards );
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

		$response = $self->format_discussion_boards( $self->discussion_boards );

		if( $self->is_single_query && count( $response['data'] ) ) {
			return ['data' => $response['data'][0]] ;
		}

		return $response;
	}

	/**
	 * Format TaskDiscussion_Board data
	 *
	 * @param array $discussion_boards
	 *
	 * @return array
	 */
	public function format_discussion_boards( $discussion_boards ) {
		$response = [
			'data' => [],
			'meta' => []
		];

		// if ( ! is_array( $discussion_boards ) ) {
		// 	$response['data'] = $this->fromat_discussion_board( $discussion_boards );

		// 	return $response;
		// }

		foreach ( $discussion_boards as $key => $discussion_board ) {
			$discussion_boards[$key] = $this->fromat_discussion_board( $discussion_board );
		}

		$response['data']  = $discussion_boards;
		$response ['meta'] = $this->set_discussion_boards_meta();

		return $response;
	}

	/**
	 * Set meta data
	 */
	private function set_discussion_boards_meta() {
		return [
			'pagination' => [
				'total'   => $this->found_rows,
				'per_page'  => ceil( $this->found_rows/$this->get_per_page() )
			]
		];
	}

	public function fromat_discussion_board( $discussion_board ) {
		
		$items =  [
            'id'           => (int) $discussion_board->id,
            'title'        => $discussion_board->title,
            'description'  => $discussion_board->description,
            'order'        => (int) $discussion_board->order,
            'achieve_date' => format_date( $discussion_board->achieve_date ),
            'achieved_at'  => format_date( $discussion_board->updated_at ),
            'status'       => $discussion_board->status,
            'created_at'   => format_date( $discussion_board->created_at ),
            'meta'         => $discussion_board->meta
        ];

        //$items = apply_filters( 'pm_discussion_board_transform', $items, $discussion_board );

		// $select_items = empty( $this->query_params['select'] ) ? null : $this->query_params['select'];

		// if ( ! is_array( $select_items ) && !is_null( $select_items ) ) {
		// 	$select_items = str_replace( ' ', '', $select_items );
		// 	$select_items = explode( ',', $select_items );
		// }

		// if ( empty( $select_items ) ) {
		// 	$items = $this->item_with( $items,$discussion_board );
		// 	$items = $this->item_meta( $items,$discussion_board );
		// 	return $items;
		// }

		// foreach ( $items as $item_key => $item ) {
		// 	if ( ! in_array( $item_key, $select_items ) ) {
		// 		unset( $items[$item_key] );
		// 	}
		// }

		$items = $this->item_with( $items, $discussion_board );
		//$items = $this->item_meta( $items, $discussion_board );

		return apply_filters( 'pm_discussion_board_transform', $items, $discussion_board );
	}

	private function item_with( $items, $discussion_board ) {
        $with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

        if ( ! is_array( $with ) ) {
            $with = explode( ',', str_replace(' ', '', $with ) );
        }
        
        $discussion_board_with_items =  array_intersect_key( (array) $discussion_board, array_flip( $with ) );

        $items = array_merge( $items, $discussion_board_with_items );

        return $items;
    }


	private function with() {
		
		$this->creator()
			->updater()
			->users()
			->milestone()
			->files()
			->comments();

		$this->discussion_boards = apply_filters( 'pm_discussion_board_with',$this->discussion_boards, $this->discussion_board_ids, $this->query_params );

		return $this;
	}

	private function creator() {

        
        return $this;
	}

	private function updater() {

        
        return $this;
	}

	private function users() {

        
        return $this;
	}

	private function milestone() {
		global $wpdb;

		if ( empty( $this->discussion_board_ids ) ) {
			return $this;
		}

		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', str_replace(' ', '', $with ) );
		}

		if ( ! in_array( 'discussion_boards', $with ) || empty( $this->discussion_board_ids ) ) {
			return $this;
		}

		$tb_boardable    = pm_tb_prefix() . 'pm_boardables';
		$discuss_format = pm_get_prepare_format( $this->discussion_board_ids );
		$query_data       = $this->discussion_board_ids;

		$query = "SELECT DISTINCT bor.boardable_id as discussion_board_id,
			bor.board_id as milestone_id
			FROM $tb_boardable as bor
			where bor.boardable_id IN ($discuss_format)
			AND bor.board_type=%s
			AND bor.boardable_type=%s";

		array_push( $query_data, 'milestone', 'discussion_board' );
		
		$results  = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$milestone_ids = wp_list_pluck( $results, 'milestone_id' );
		
		$milestones = Milestone::get_results([
			'id' => array_unique( $milestone_ids )
		]);
	

        $key_milestones = [];
        $milestones['data'] = count( $milestone_ids ) == 1 && ! empty( $milestones ) ? [$milestones['data']] : $milestones['data'];

        foreach ( $milestones['data'] as $key => $milestone ) {
            $key_milestones[$milestone['id']] = $milestone;
        }

        foreach ( $results as $key => $result ) {
            $milestones[$result->milestone_id][] = $key_milestones[$result->milestone_id];
        }

        foreach ( $this->discussion_boards as $key => $discussion_board ) {
            $discussion_board->discussion_boards['data'] = empty( $milestones[$discussion_board->id] ) ? [] : $milestones[$discussion_board->id];
        }
        
        return $this;
	}

	private function comments() {
		global $wpdb;

		if ( empty( $this->discussion_board_ids ) ) {
			return $this;
		}

		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', str_replace(' ', '', $with ) );
		}

		if ( ! in_array( 'milestone', $with ) || empty( $this->discussion_board_ids ) ) {
			return $this;
		}

		$tb_discussion_boards    = pm_tb_prefix() . 'pm_boardables';
		$tb_pm_comments = pm_tb_prefix() . 'pm_comments';
		$tb_boards = pm_tb_prefix() . 'pm_boards';
		$discussion_board_format = pm_get_prepare_format( $this->discussion_board_ids );
		$query_data       = $this->discussion_board_ids;

		$query ="SELECT DISTINCT $tb_pm_comments.'*'
			FROM $tb_pm_comments 
			LEFT JOIN $tb_boards  ON $tb_boards.id = $tb_pm_comments.commentable_id
			WHERE $tb_boards.id IN ($discussion_board_format)
			AND $tb_pm_comments.commentable_type = %s
		";

		array_push( $query_data, 'discussion_board' );
		
		$results  = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$list_ids = wp_list_pluck( $results, 'list_id' );
		
		$lists = Task_List::get_results([
			'id' => $list_ids
		]);
	

        $key_lists = [];
        $lists['data'] = count( $list_ids ) == 1 && ! empty( $lists ) ? [$lists['data']] : $lists['data'];

        foreach ( $lists['data'] as $key => $list ) {
            $key_lists[$list['id']] = $list;
        }

        foreach ( $results as $key => $result ) {
            $lists[$result->discussion_board_id][] = $key_lists[$result->list_id];
        }

        foreach ( $this->discussion_boards as $key => $discussion_board ) {
            $discussion_board->task_lists['data'] = empty( $lists[$discussion_board->id] ) ? [] : $lists[$discussion_board->id];
        }
        
        return $this;
	}

	private function files() {
		global $wpdb;


		return $this;
	}

	private function meta() {
		$this->get_pm_meta_table_value();

		return $this;
	}

	private function get_pm_meta_table_value() {
		if ( empty( $this->discussion_board_ids ) ) {
			return $this;
		}
        
        global $wpdb;

		$metas            = [];
		$tb_projects      = pm_tb_prefix() . 'pm_projects';
		$tb_meta          = pm_tb_prefix() . 'pm_meta';
		$discussion_board_format = pm_get_prepare_format( $this->discussion_board_ids );
		$query_data       = $this->discussion_board_ids;

        $query = "SELECT DISTINCT $tb_meta.meta_key, $tb_meta.meta_value, $tb_meta.entity_id
            FROM $tb_meta
            WHERE $tb_meta.entity_id IN ($discussion_board_format)
            AND $tb_meta.entity_type = %s ";

        array_push( $query_data, 'discussion_board' );

        $results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

        foreach ( $results as $key => $result ) {
            $discussion_board_id = $result->entity_id;
            unset( $result->entity_id );
            $metas[$discussion_board_id][] = $result;
        }
        
        foreach ( $this->discussion_boards as $key => $discussion_board ) {
            $filter_metas = empty( $metas[$discussion_board->id] ) ? [] : $metas[$discussion_board->id];

            foreach ( $filter_metas as $key => $filter_meta ) {
                $discussion_board->meta[$filter_meta->meta_key] = $filter_meta->meta_value;
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
	 * Filter discussion_board by ID
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
			$this->where .= $wpdb->prepare( " AND {$this->tb_discussion_board}.id IN ($query_format)", $id );
			// $this->where .= " AND {$this->tb_discussion_board}.id IN ($query_id)";
		}

		if ( !is_array( $id ) ) {
			// $this->where .= " AND {$this->tb_discussion_board}.id IN ($id)";
			$this->where .= $wpdb->prepare( " AND {$this->tb_discussion_board}.id IN (%d)", $id );

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

		// $this->where .= " AND {$this->tb_discussion_board}.title LIKE '%$title%'";
		$this->where .= $wpdb->prepare( " AND {$this->tb_discussion_board}.title LIKE %s", '%'.$title.'%' );

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
			//$this->where .= " AND {$this->tb_discussion_board}.project_id IN ($query_id)";
			$query_format = pm_get_prepare_format( $id );
			$this->where .= $wpdb->prepare( " AND {$this->tb_discussion_board}.project_id IN ($query_format)", $id );
		}

		if ( !is_array( $id ) ) {
		//	$this->where .= " AND {$this->tb_discussion_board}.project_id = $id";
			$this->where .= $wpdb->prepare( " AND {$this->tb_discussion_board}.project_id IN (%d)", $id );
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

		$query = "SELECT SQL_CALC_FOUND_ROWS DISTINCT {$this->tb_discussion_board}.*
			FROM {$this->tb_discussion_board}
			{$this->join}
			WHERE %d=%d {$this->where} AND $this->tb_discussion_board.type=%s
			{$this->orderby} {$this->limit} ";

		$results = $wpdb->get_results( $wpdb->prepare( $query, 1, 1, 'discussion_board' ) );

		$this->found_rows = $wpdb->get_var( "SELECT FOUND_ROWS()" );
		$this->discussion_boards = $results;

		if ( ! empty( $results ) && is_array( $results ) ) {
			$this->discussion_board_ids = wp_list_pluck( $results, 'id' );
		}

		if ( ! empty( $results ) && !is_array( $results ) ) {
			$this->discussion_board_ids = [$results->id];
		}

		return $this;
	}

	private function set_table_name() {
		$this->tb_project          = pm_tb_prefix() . 'pm_projects';
		$this->tb_discussion_board        = pm_tb_prefix() . 'pm_boards';
	}
}
