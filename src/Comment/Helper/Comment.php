<?php
namespace WeDevs\PM\Comment\Helper;


class Comment {

	private static $_instance;
	private $query_params;
	private $select;
	private $join;
	private $where;
	private $limit;
	private $orderby;
	private $with;
	private $comments;
	private $comment_ids;
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

		if( $self->is_single_query && count( $response['data'] ) ) {
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
                'total_replies' => $comment->replies->count(),
           	]
        ]

        //$items = apply_filters( 'pm_comment_transform', $items, $comment );

		// $select_items = empty( $this->query_params['select'] ) ? null : $this->query_params['select'];

		// if ( ! is_array( $select_items ) && !is_null( $select_items ) ) {
		// 	$select_items = str_replace( ' ', '', $select_items );
		// 	$select_items = explode( ',', $select_items );
		// }

		// if ( empty( $select_items ) ) {
		// 	$items = $this->item_with( $items,$comment );
		// 	$items = $this->item_meta( $items,$comment );
		// 	return $items;
		// }

		// foreach ( $items as $item_key => $item ) {
		// 	if ( ! in_array( $item_key, $select_items ) ) {
		// 		unset( $items[$item_key] );
		// 	}
		// }

		$items = $this->item_with( $items, $comment );
		//$items = $this->item_meta( $items, $comment );

		return apply_filters( 'pm_comment_transform', $items, $comment );
	}

	private function item_with( $items, $comment ) {
        $with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

        if ( ! is_array( $with ) ) {
            $with = explode( ',', str_replace(' ', '', $with ) );
        }
        
        $comment_with_items =  array_intersect_key( (array) $comment, array_flip( $with ) );

        $items = array_merge( $items, $comment_with_items );

        return $items;
    }


}
