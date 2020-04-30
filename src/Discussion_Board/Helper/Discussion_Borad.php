<?php
namespace WeDevs\PM\Discussion_Board\Helper;

use WeDevs\PM\Milestone\Helper\Milestone;
use WeDevs\PM\Comment\Helper\Comment;
use WeDevs\PM\File\Helper\File;


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
        return new self();
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

		if ( pm_is_single_query( $params ) ) {
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

		foreach ( $discussion_boards as $key => $discussion_board ) {
			$discussion_boards[$key] = $this->fromat_discussion_board( $discussion_board );
		}

		$response['data'] = $discussion_boards;
		$response['meta'] = $this->set_discussion_boards_meta();

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
		
		$items = [
            'id'          => (int) $discussion_board->id,
            'title'       => $discussion_board->title,
            'description' => pm_get_content( $discussion_board->description ),
            'order'       => $discussion_board->order,
            'created_at'  => format_date( $discussion_board->created_at ),
            'meta'        => $discussion_board->meta,
        ];

		$items = $this->item_with( $items, $discussion_board );
		
		return apply_filters( 'pm_discuss_transform', $items, $discussion_board );
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
			->milestone()
			->files()
			->comments();

		$this->discussion_boards = apply_filters( 'pm_discussion_board_with',$this->discussion_boards, $this->discussion_board_ids, $this->query_params );

		return $this;
	}

	private function creator() {
		if ( empty( $this->discussion_boards ) ) {
			return $this;
		}

		$creator_ids = wp_list_pluck( $this->discussion_boards, 'created_by' );
		$creator_ids = array_unique( $creator_ids );

		$creators = pm_get_users( [ 'id' => $creator_ids ] );
		$creators = $creators['data'];
		
		$items = []; 
		
		foreach ( $creators as $key => $creator ) {
			$items[$creator['id']] = $creator;
		}

		foreach ( $this->discussion_boards as $key => $discussion_board ) {
			$c_creator = empty( $items[$discussion_board->created_by] ) ? [] : $items[$discussion_board->created_by];

			$discussion_board->creator = [ 'data' => $c_creator ];
		}

		return $this;
	}

	private function updater() {

        if ( empty( $this->discussion_boards ) ) {
			return $this;
		}

		$updater_ids = wp_list_pluck( $this->discussion_boards, 'updated_by' );
		$updater_ids = array_unique( $updater_ids );

		$updaters = pm_get_users( [ 'id' => $updater_ids ] );
		$updaters = $updaters['data'];
		
		$items = []; 
		
		foreach ( $updaters as $key => $updater ) {
			$items[$updater['id']] = $updater;
		}

		foreach ( $this->discussion_boards as $key => $discussion_board ) {
			$c_updater = empty( $items[$discussion_board->updated_by] ) ? [] : $items[$discussion_board->updated_by];

			$discussion_board->updater = [ 'data' => $c_updater ];
		}

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

		if ( ! in_array( 'milestone', $with ) || empty( $this->discussion_board_ids ) ) {
			return $this;
		}

		$tb_boardable   = pm_tb_prefix() . 'pm_boardables';
		$discuss_format = pm_get_prepare_format( $this->discussion_board_ids );
		$query_data     = $this->discussion_board_ids;

		$query = "SELECT DISTINCT bor.boardable_id as discussion_board_id,
			bor.board_id as milestone_id
			FROM $tb_boardable as bor
			where bor.boardable_id IN ($discuss_format)
			AND bor.board_type=%s
			AND bor.boardable_type=%s";

		array_push( $query_data, 'milestone', 'discussion_board' );
		
		$results       = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$milestone_ids = wp_list_pluck( $results, 'milestone_id' );
		
		$milestones = Milestone::get_results([
			'id' => array_unique( $milestone_ids )
		]);

		$milestones     = $milestones['data'];
		$key_milestones = [];
		$items          = [];

        foreach ( $milestones as $key => $milestone ) {
        	if ( empty( $milestone['id'] ) ) {
        		continue;
        	}
        	
            $key_milestones[$milestone['id']] = $milestone;
        }

        foreach ( $results as $key => $result ) {
            $items[$result->discussion_board_id] = $key_milestones[$result->milestone_id];
        }
        
        foreach ( $this->discussion_boards as $key => $discussion_board ) {
            $discussion_board->milestone['data'] = empty( $items[$discussion_board->id] ) ? [] : $items[$discussion_board->id];
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

		if ( ! in_array( 'comments', $with ) || empty( $this->discussion_board_ids ) ) {
			return $this;
		}

		$tb_comments             = pm_tb_prefix() . 'pm_comments';
		$discussion_board_format = pm_get_prepare_format( $this->discussion_board_ids );
		$query_data              = $this->discussion_board_ids;

		$query ="SELECT DISTINCT com.id as comment_id, com.commentable_id as discussion_board_id
			FROM $tb_comments as com
			WHERE com.commentable_id IN ($discussion_board_format)
			AND com.commentable_type = %s
		";

		array_push( $query_data, 'discussion_board' );
		
		$results  = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$comment_ids = wp_list_pluck( $results, 'comment_id' );
		
		$comments = Comment::get_results([
			'id' => array_unique( $comment_ids )
		]);

		$comments     = $comments['data'];
		$key_comments = [];
		$items        = [];

        foreach ( $comments as $key => $comment ) {
        	if ( empty( $comment['id'] ) ) {
        		continue;
        	}

            $key_comments[$comment['id']] = $comment;
        }

        foreach ( $results as $key => $result ) {
            $items[$result->discussion_board_id][] = $key_comments[$result->comment_id];
        }
       
        foreach ( $this->discussion_boards as $key => $discussion_board ) {
            $discussion_board->comments['data'] = empty( $items[$discussion_board->id] ) ? [] : $items[$discussion_board->id];
        }

        return $this;
	}

	private function files() {
		global $wpdb;

		if ( empty( $this->discussion_board_ids ) ) {
			return $this;
		}

		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', str_replace(' ', '', $with ) );
		}

		if ( ! in_array( 'files', $with ) || empty( $this->discussion_board_ids ) ) {
			return $this;
		}

		$tb_files                = pm_tb_prefix() . 'pm_files';
		$discussion_board_format = pm_get_prepare_format( $this->discussion_board_ids );
		$query_data              = $this->discussion_board_ids;

		$query = "SELECT DISTINCT fil.id as file_id,
			fil.fileable_id as discussion_board_id
			FROM $tb_files as fil
			where fil.fileable_id IN ($discussion_board_format)
			AND fil.fileable_type=%s";

		array_push( $query_data, 'discussion_board' );
		
		$results  = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$file_ids = wp_list_pluck( $results, 'file_id' );
		
		$files = File::get_results([
			'id' => $file_ids
		]);
	
		$files     = $files['data'];
		$key_files = [];
		$items     = [];

        foreach ( $files as $key => $file ) {
        	if ( empty( $file['id'] ) ) {
        		continue;
        	}

            $key_files[$file['id']] = $file;
        }

        foreach ( $results as $key => $result ) {
            $items[$result->discussion_board_id][] = $key_files[$result->file_id];
        }
       	
        foreach ( $this->discussion_boards as $key => $discussion_board ) {
            $discussion_board->files['data'] = empty( $items[$discussion_board->id] ) ? [] : $items[$discussion_board->id];
        }

        return $this;
	}

	private function meta() {
		$this->get_pm_meta_table_value()
			->total_comments()
			->total_files();

		return $this;
	}

	private function total_comments() {
		global $wpdb;

		if ( empty( $this->discussion_board_ids ) ) {
			return 0;
		}

		$tb_comments             = pm_tb_prefix() . 'pm_comments';
		$discussion_board_format = pm_get_prepare_format( $this->discussion_board_ids );
		$query_data              = $this->discussion_board_ids;

		$query ="SELECT DISTINCT count(com.id) as total_comments, com.commentable_id as discussion_board_id
			FROM $tb_comments as com
			WHERE com.commentable_id IN ($discussion_board_format)
			AND com.commentable_type = %s
			group by com.commentable_id
		";

		array_push( $query_data, 'discussion_board' );
		
		$results  = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$discussion_board_id = $result->discussion_board_id;
			unset($result->discussion_board_id);
			$metas[$discussion_board_id] = $result->total_comments;
		}

		foreach ( $this->discussion_boards as $key => $discussion_board ) {
			$discussion_board->meta['total_comments'] = empty( $metas[$discussion_board->id] ) ? 0 : $metas[$discussion_board->id];
		}
		return $this;
	}

	private function total_files() {
		global $wpdb;
		
		if ( empty( $this->discussion_board_ids ) ) {
			return 0;
		}

		$tb_files                = pm_tb_prefix() . 'pm_files';
		$discussion_board_format = pm_get_prepare_format( $this->discussion_board_ids );
		$query_data              = $this->discussion_board_ids;

		$query = "SELECT DISTINCT count(fil.id) as total_files,
			fil.fileable_id as discussion_board_id
			FROM $tb_files as fil
			where fil.fileable_id IN ($discussion_board_format)
			AND fil.fileable_type=%s
			group by fil.fileable_id";

		array_push( $query_data, 'discussion_board' );
		
		$results  = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$discussion_board_id = $result->discussion_board_id;
			unset($result->discussion_board_id);
			$metas[$discussion_board_id] = $result->total_files;
		}

		foreach ( $this->discussion_boards as $key => $discussion_board ) {
			$discussion_board->meta['total_files'] = empty( $metas[$discussion_board->id] ) ? 0 : $metas[$discussion_board->id];
		}
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

		return 20;
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
		$this->tb_discussion_board = pm_tb_prefix() . 'pm_boards';
	}
}
