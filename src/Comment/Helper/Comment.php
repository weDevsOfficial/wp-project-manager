<?php

namespace WeDevs\PM\Comment\Helper;

use WeDevs\PM\File\Helper\File;

class Comment {

	private static $_instance;
	private $query_params;
	private $select;
	private $join;
	private $where;
	private $limit;
	private $orderby;
	private $with = ['creator', 'updater', 'files'];
	private $comments;
	private $comment_ids;
	private $is_single_query = false;

	public static function getInstance() {
        return new self();
    }

    function __construct() {
    	$this->set_table_name();
    }

    public static function get_task_comments( WP_REST_Request $request ) {
		$comments = self::get_results( $request->get_params() );

		wp_send_json( $comments );
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

		$response = $self->format_comments( $self->comments );

		if ( pm_is_single_query( $params ) ) {
			return ['data' => $response['data'][0]] ;
		}

		return $response;
	}

	/**
	 * Format TaskMilestone data
	 *
	 * @param array $comments
	 *
	 * @return array
	 */
	public function format_comments( $comments ) {
		$response = [
			'data' => [],
			'meta' => []
		];

		// if ( ! is_array( $comments ) ) {
		// 	$response['data'] = $this->fromat_comment( $comments );

		// 	return $response;
		// }

		foreach ( $comments as $key => $comment ) {
			$comments[$key] = $this->fromat_comment( $comment );
		}

		$response['data']  = $comments;
		$response ['meta'] = $this->set_comments_meta();

		return $response;
	}

	/**
	 * Set meta data
	 */
	private function set_comments_meta() {
		return [
			'pagination' => [
				'total'   => $this->found_rows,
				'per_page'  => ceil( $this->found_rows/$this->get_per_page() )
			]
		];
	}

	public function fromat_comment( $comment ) {
		
		$items =  [
			'id'               => (int) $comment->id,
            'content'          => pm_get_content( $comment->content ),
            'commentable_type' => $comment->commentable_type,
            'commentable_id'   => $comment->commentable_id,
            'created_at'       => format_date( $comment->created_at ),
            'meta'       => [
                //'total_replies' => $comment->replies->count(),
           	]
        ];

		$items = $this->item_with( $items, $comment );

		return apply_filters( 'pm_comment_transform', $items, $comment );
	}

	private function join() {
		return $this;
	}

	private function with() {
		$this->creator()
			->updater()
			->files();

		return $this;
	}

	private function where() {
		$this->where_id();

		return $this;
	}

		/**
	 * Filter comment by ID
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

		$this->where .= $wpdb->prepare( " AND {$this->tb_comment}.id IN ($format)", $format_ids );

		if ( count( $format_ids ) == 1 ) {
			$this->is_single_query = true;
		}
		
		return $this;
	}

	private function files() {
		global $wpdb;

		if ( empty( $this->comment_ids ) ) {
			return $this;
		}

		$tb_files       = pm_tb_prefix() . 'pm_files';
		$comment_format = pm_get_prepare_format( $this->comment_ids );
		$query_data     = $this->comment_ids;

		$query = "SELECT DISTINCT fil.id as file_id,
			fil.fileable_id as comment_id
			FROM $tb_files as fil
			where fil.fileable_id IN ($comment_format)
			AND fil.fileable_type=%s";

		array_push( $query_data, 'comment' );
		
		$results  = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$file_ids = wp_list_pluck( $results, 'file_id' );
		
		$files = File::get_results([
			'id' => $file_ids
		]);

		$key_files = [];


        foreach ( $files['data'] as $key => $file ) {
            $key_files[$file['id']] = $file;
        }

        foreach ( $results as $key => $result ) {
            $files[$result->comment_id][] = $key_files[$result->file_id];
        }

        foreach ( $this->comments as $key => $comment ) {
            $comment->files['data'] = empty( $files[$comment->id] ) ? [] : $files[$comment->id];
        }
        
        return $this;
	}

	private function creator() {
		
		if ( empty( $this->comments ) ) {
			return $this;
		}

		$creator_ids = wp_list_pluck( $this->comments, 'created_by' );
		$creator_ids = array_unique( $creator_ids );

		$creators = pm_get_users( [ 'id' => $creator_ids ] );

		$creators = $creators['data'];
		
		$items = []; 
		
		foreach ( $creators as $key => $creator ) {
			$items[$creator['id']] = $creator;
		}

		foreach ( $this->comments as $key => $comment ) {
			$c_creator = empty( $items[$comment->created_by] ) ? [] : $items[$comment->created_by];

			$comment->creator = [ 'data' => $c_creator ];
		}

		return $this;
	}

	private function updater() {
		if ( empty( $this->comments ) ) {
			return $this;
		}

		$updater_ids = wp_list_pluck( $this->comments, 'updated_by' );
		$updater_ids = array_unique( $updater_ids );

		$updaters = pm_get_users( [ 'id' => $updater_ids ] );
		$updaters = $updaters['data'];
		
		$items = []; 
		
		foreach ( $updaters as $key => $updater ) {
			$items[$updater['id']] = $updater;
		}

		foreach ( $this->comments as $key => $comment ) {
			$c_updater = empty( $items[$comment->updated_by] ) ? [] : $items[$comment->updated_by];

			$comment->updater = [ 'data' => $c_updater ];
		}

		return $this;
	}

	private function meta() {
		return $this;
	}

	private function item_with( $items, $comment ) {
        $with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

        if ( ! is_array( $with ) ) {
            $with = explode( ',', str_replace(' ', '', $with ) );
        }

        $with = array_merge( $this->with, $with );
        
        $comment_with_items =  array_intersect_key( (array) $comment, array_flip( $with ) );

        $items = array_merge( $items, $comment_with_items );

        return $items;
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

		$query = "SELECT SQL_CALC_FOUND_ROWS DISTINCT {$this->tb_comment}.*
			FROM {$this->tb_comment}
			{$this->join}
			WHERE %d=%d {$this->where} 
			{$this->orderby} {$this->limit}";

		$results = $wpdb->get_results( $wpdb->prepare( $query, 1, 1 ) );

		$this->found_rows = $wpdb->get_var( "SELECT FOUND_ROWS()" );
		$this->comments = $results;

		if ( ! empty( $results ) && is_array( $results ) ) {
			$this->comment_ids = wp_list_pluck( $results, 'id' );
		}

		if ( ! empty( $results ) && !is_array( $results ) ) {
			$this->comment_ids = [$results->id];
		}

		return $this;
	}

    private function set_table_name() {
		$this->tb_comment = pm_tb_prefix() . 'pm_comments';
	}

}
