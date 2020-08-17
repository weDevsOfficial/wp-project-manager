<?php
namespace WeDevs\PM\Activity\Helper;


use WP_REST_Request;
// data: {
// 	with: '',
// 	per_page: '10',
// 	select: 'id, title',
// 	id: [1,2],
// 	title: 'Rocket', 'test'
// 	page: 1,
//  orderby: [title=>'asc', 'id'=>desc] OR created_at|ASC,id|DESC
//  activity_meta: 'total_task_activities,total_tasks,total_complete_tasks,total_incomplete_tasks,total_activities,total_activities,total_comments,total_files,total_activities'
// },

class Activity {
	private static $_instance;
	private $query_params;
	private $select;
	private $join;
	private $where;
	private $limit;
	private $orderby;
	private $with = ['actor', 'project'];
	private $activities;
	private $activity_ids;
	private $is_single_query = false;

	public static function getInstance() {
        return new self();
    }

    function __construct() {
    	$this->set_table_name();
    }

    public static function get_activities( WP_REST_Request $request ) {
		$activities = self::get_results( $request->get_params() );

		wp_send_json( $activities );
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

		$response = $self->format_activities( $self->activities );

		if ( pm_is_single_query( $params ) ) {
			return ['data' => $response['data'][0]] ;
		}

		return $response;
	}

	/**
	 * Format Taskactivity data
	 *
	 * @param array $activities
	 *
	 * @return array
	 */
	public function format_activities( $activities ) {
		$response = [
			'data' => [],
			'meta' => []
		];

		foreach ( $activities as $key => $activity ) {
			$activities[$key] = $this->fromat_activity( $activity );
		}

		$response['data'] = $activities;
		$response['meta'] = $this->set_activities_meta();

		return $response;
	}

	/**
	 * Set meta data
	 */
	private function set_activities_meta() {
		return [
			'pagination' => [
				'total'   => $this->found_rows,
				'total_pages'  => ceil( $this->found_rows/$this->get_per_page() )
			]
		];
	}

	public function fromat_activity( $activity ) {

		$meta = $this->parse_meta( $activity );

		$items = [
            'id'            => (int) $activity->id,
            'message'       => pm_get_text( "activities.{$activity->action}" ),
            'action'        => $activity->action,
            'action_type'   => $activity->action_type,
            'project_id'    => $activity->project_id,
            'meta'          => empty( $meta ) ? [] : $meta,
            'committed_at'  => format_date( $activity->created_at ),
            'resource_id'   => $activity->resource_id,
            'resource_type' => $activity->resource_type,
        ];

		$items = $this->item_with( $items, $activity );
		
		return apply_filters( 'pm_activity_transform', $items, $activity );
	}

	private function item_with( $items, $activity ) {
        $with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

        if ( ! is_array( $with ) ) {
            $with = explode( ',', str_replace(' ', '', $with ) );
        }

        $with = array_merge( $this->with, $with );

        $activity_with_items =  array_intersect_key( (array) $activity, array_flip( $with ) );

        $items = array_merge( $items, $activity_with_items );

        return $items;
    }

    private function parse_meta( $activity ) {
        $parsed_meta = [];

        switch ( $activity->resource_type ) {
            case 'task':
                $parsed_meta = $this->parse_meta_for_task( $activity );
                break;

            case 'task_list':
                $parsed_meta = $this->parse_meta_for_task_list( $activity );
                break;

            case 'discussion_board':
                $parsed_meta = $this->parse_meta_for_discussion_board( $activity );
                break;

            case 'milestone':
                $parsed_meta = $this->parse_meta_for_milestone( $activity );
                break;

            case 'project':
                $parsed_meta = $this->parse_meta_for_project( $activity );
                break;

            case 'comment':
                $parsed_meta = $this->parse_meta_for_comment( $activity );
                break;

            case 'file':
                $parsed_meta = $this->parse_meta_for_file( $activity );
                break;
        }

        return $parsed_meta;
    }

    private function parse_meta_for_task( $activity ) {
        return is_serialized( $activity->meta ) ? maybe_unserialize( $activity->meta ) : $activity->meta;
    }

    private function parse_meta_for_task_list( $activity ) {
        return is_serialized( $activity->meta ) ? maybe_unserialize( $activity->meta ) : $activity->meta;
    }

    private function parse_meta_for_discussion_board( $activity ) {
        return is_serialized( $activity->meta ) ? maybe_unserialize( $activity->meta ) : $activity->meta;
    }

    private function parse_meta_for_milestone( $activity ) {
        return is_serialized( $activity->meta ) ? maybe_unserialize( $activity->meta ) : $activity->meta;
    }

    private function parse_meta_for_project( $activity ) {
        return is_serialized( $activity->meta ) ? maybe_unserialize( $activity->meta ) : $activity->meta;
    }

    private function parse_meta_for_file( $activity ) {
        return is_serialized( $activity->meta ) ? maybe_unserialize( $activity->meta ) : $activity->meta;
    }

    private function parse_meta_for_comment( $activity ) {
        $meta = [];

        if ( ! is_array( $activity ) ) {
            return $meta;
        }

        $activity->meta = is_serialized( $activity->meta ) ? maybe_unserialize( $activity->meta ) : $activity->meta;

        foreach ($activity->meta as $key => $value) {
            if ( $key == 'commentable_type' && $value == 'file' ) {
                $trans_commentable_type = pm_get_text( "resource_types.{$value}" );
                $meta['commentable_id'] = $activity->meta['commentable_id'];
                $meta['commentable_type'] = $activity->meta['commentable_type'];
                $meta['trans_commentable_type'] = $trans_commentable_type;
                $meta['commentable_title'] = $trans_commentable_type;
            } elseif ( $key == 'commentable_type' ) {
                $trans_commentable_type = pm_get_text( "resource_types.{$value}" );
                $meta['commentable_id'] = $activity->meta['commentable_id'];
                $meta['commentable_type'] = $activity->meta['commentable_type'];
                $meta['trans_commentable_type'] = $trans_commentable_type;
                $meta['commentable_title'] = $activity->meta['commentable_title'];
            }
        }

        return $meta;
    }


	private function with() {
		
		$this->actor()
			->project();

		$this->activities = apply_filters( 'pm_activity_with',$this->activities, $this->activity_ids, $this->query_params );

		return $this;
	}

	private function project() {
		if ( empty( $this->activities ) ) {
			return $this;
		}

		$project_ids = wp_list_pluck( $this->activities, 'project_id' );
		$project_ids = array_unique( $project_ids );

		$projects = pm_get_projects( [ 'id' => $project_ids ] );
		$projects = $projects['data'];
		
		$items = []; 
		
		foreach ( $projects as $key => $project ) {
			$items[$project['id']] = $project;
		}

		foreach ( $this->activities as $key => $activity ) {
			$project = empty( $items[$activity->project_id] ) ? [] : $items[$activity->project_id];

			$activity->project = [ 'data' => $project ];
		}

		return $this;
	}

	private function actor() {
		if ( empty( $this->activities ) ) {
			return $this;
		}

		$actor_ids = wp_list_pluck( $this->activities, 'actor_id' );
		$actor_ids = array_unique( $actor_ids );

		$actors = pm_get_users( [ 'id' => $actor_ids ] );
		$actors = $actors['data'];
		
		$items = []; 
		
		foreach ( $actors as $key => $actor ) {
			$items[$actor['id']] = $actor;
		}

		foreach ( $this->activities as $key => $activity ) {
			$actor = empty( $items[$activity->actor_id] ) ? [] : $items[$activity->actor_id];

			$activity->actor = [ 'data' => $actor ];
		}

		return $this;
	}

	private function updater() {

        if ( empty( $this->activities ) ) {
			return $this;
		}

		$updater_ids = wp_list_pluck( $this->activities, 'updated_by' );
		$updater_ids = array_unique( $updater_ids );

		$updaters = pm_get_users( [ 'id' => $updater_ids ] );
		$updaters = $updaters['data'];
		
		$items = []; 
		
		foreach ( $updaters as $key => $updater ) {
			$items[$updater['id']] = $updater;
		}

		foreach ( $this->activities as $key => $activity ) {
			$c_updater = empty( $items[$activity->updated_by] ) ? [] : $items[$activity->updated_by];

			$activity->updater = [ 'data' => $c_updater ];
		}

		return $this;
	}

	private function meta() {
		return $this;
	}

	private function join() {
		return $this;
	}

	private function where() {

		$this->where_id()
			->where_actor_id()
			->where_project_id()
			->where_resource_id()
			->where_resource_type()
			->where_updated_at();

		return $this;
	}

	private function where_updated_at() {
		global $wpdb;

		$updated_at         = !empty( $this->query_params['updated_at'] ) ? $this->query_params['updated_at'] : false;
		$updated_at_start   = !empty( $this->query_params['updated_at_start'] ) ? $this->query_params['updated_at_start'] : false;
		$updated_at_between = !isset( $this->query_params['updated_at_between'] ) ? true : pm_is_true( $this->query_params['updated_at_between'] );
		$operator_key       = !empty( $this->query_params['updated_at_operator'] ) ? $this->query_params['updated_at_operator'] : 'equal';
		

		if ( $updated_at === false ) {
			return $this;
		}

		if ( $updated_at_start ) {
			$com_start_reduce = date('Y-m-d',(strtotime ( '-1 day' , strtotime ( $updated_at_start) ) ));
			$com_add          = date('Y-m-d',(strtotime ( '+1 day' , strtotime ( $updated_at) ) ));
		}

		//If its contain between condition
		if ( $updated_at_start ) {

			if ( $updated_at_between ) {
				$query = $wpdb->prepare( " {$this->tb_activity}.updated_at BETWEEN %s AND %s ", $com_start_reduce, $com_add );
			} else {
				$query = $wpdb->prepare( " {$this->tb_activity}.updated_at NOT BETWEEN %s AND %s ", $com_start_reduce, $com_add );
			}
			
			$this->where .= " AND ( $query ) ";

			return $this;
		}
		//close between condition
		

		$operator = $this->get_operator( $operator_key );
		$this->where .=  $wpdb->prepare( " AND {$this->tb_activity}.updated_at $operator %s", $updated_at );


		return $this;
	}

	private function get_operator( $param ) {

		$default = [
			'equal'              => '=',
			'less_than'          => '<',
			'less_than_equal'    => '<=',
			'greater_than'       => '>',
			'greater_than_equal' => '>=',
			'null'               => 'is null',
			'empty'              => "= ''",
		];

		return empty( $default[$param] ) ? '' : $default[$param]; 
	}

	/**
	 * Filter activity by ID
	 *
	 * @return class object
	 */
	private function where_resource_type() {
		global $wpdb;
		$resource_type = isset( $this->query_params['resource_type'] ) ? $this->query_params['resource_type'] : false;

		if ( empty( $resource_type ) ) {
			return $this;
		}

		$resource_type = pm_get_prepare_data( $resource_type );

		if ( is_array( $resource_type ) ) {
			$query_format = pm_get_prepare_format( $resource_type, true );
			$this->where .= $wpdb->prepare( " AND {$this->tb_activity}.resource_type IN ($query_format)", $resource_type );
		}

		if ( !is_array( $resource_type ) ) {
			$this->where .= $wpdb->prepare( " AND {$this->tb_activity}.resource_type IN (%s)", $resource_type );
		}

		return $this;
	}

	/**
	 * Filter activity by ID
	 *
	 * @return class object
	 */
	private function where_id() {
		global $wpdb;
		$id = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false;

		if ( empty( $id ) ) {
			return $this;
		}

		$id = pm_get_prepare_data( $id );

		if ( is_array( $id ) ) {
			$query_format = pm_get_prepare_format( $id );
			$this->where .= $wpdb->prepare( " AND {$this->tb_activity}.id IN ($query_format)", $id );
		}

		if ( !is_array( $id ) ) {
			$this->where .= $wpdb->prepare( " AND {$this->tb_activity}.id IN (%d)", $id );
		}

		return $this;
	}

	private function where_actor_id() {
		global $wpdb;
		$actor_id = isset( $this->query_params['users'] ) ? $this->query_params['users'] : false;

		if ( empty( $actor_id ) ) {
			return $this;
		}

		$actor_id = pm_get_prepare_data( $actor_id );

		if ( is_array( $actor_id ) ) {
			$query_format = pm_get_prepare_format( $actor_id );
			$this->where .= $wpdb->prepare( " AND {$this->tb_activity}.actor_id IN ($query_format)", $actor_id );
		}

		if ( !is_array( $actor_id ) ) {
			$this->where .= $wpdb->prepare( " AND {$this->tb_activity}.actor_id IN (%d)", $actor_id );
		}

		return $this;
	}

	/**
	 * Filter task by title
	 *
	 * @return class object
	 */
	private function where_resource_id() {
		global $wpdb;
		$resource_id = isset( $this->query_params['resource_id'] ) ? $this->query_params['resource_id'] : false;

		if ( empty( $resource_id ) ) {
			return $this;
		}

		$resource_id = pm_get_prepare_data( $resource_id );

		if ( is_array( $resource_id ) ) {
			$query_format = pm_get_prepare_format( $resource_id );
			$this->where .= $wpdb->prepare( " AND {$this->tb_activity}.resource_id IN ($query_format)", $resource_id );
		}

		if ( !is_array( $resource_id ) ) {
			$this->where .= $wpdb->prepare( " AND {$this->tb_activity}.resource_id IN (%d)", $resource_id );
		}

		return $this;
	}

	private function where_project_id() {
		global $wpdb;
		$project_id = isset( $this->query_params['project_id'] ) ? $this->query_params['project_id'] : false;

		if ( empty( $project_id ) ) {
			return $this;
		}

		$project_id = pm_get_prepare_data( $project_id );

		if ( is_array( $project_id ) ) {
			$query_format = pm_get_prepare_format( $project_id );
			$this->where .= $wpdb->prepare( " AND {$this->tb_activity}.project_id IN ($query_format)", $project_id );
		}

		if ( !is_array( $project_id ) ) {
			$this->where .= $wpdb->prepare( " AND {$this->tb_activity}.project_id IN (%d)", $project_id );
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

		$odr_prms = isset( $this->query_params['orderby'] ) ? $this->query_params['orderby'] : false;
		
        if ( $odr_prms === false ) {
            return $this;
        }

        if ( is_string( $odr_prms ) ) {
        	$orders = [];
        	$odr_prms = str_replace( ' ', '', trim( $odr_prms ) );
        	$odr_prms = explode( ',', $odr_prms );

        	foreach ( $odr_prms as $key => $param ) {
        		$pair = explode( '|', $param );
        		$tb_col = $pair[0];
        		$value = $pair[1];
        		$orders[$tb_col] = $value;
        	}
        } else if ( is_array( $odr_prms ) ) {
        	$orders = $odr_prms;
        } else {
        	$ordes = [];
        }

        $order = [];
        
        foreach ( $orders as $key => $value ) {
            $order[] =  $this->tb_activity .'.'. $key . ' ' . $value;
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

		$query = "SELECT SQL_CALC_FOUND_ROWS DISTINCT {$this->tb_activity}.*
			FROM {$this->tb_activity}
			{$this->join}
			WHERE %d=%d {$this->where}
			{$this->orderby} {$this->limit} ";
		
		$results = $wpdb->get_results( $wpdb->prepare( $query, 1, 1 ) );
		
		$this->found_rows = $wpdb->get_var( "SELECT FOUND_ROWS()" );
		$this->activities = $results;

		if ( ! empty( $results ) && is_array( $results ) ) {
			$this->activity_ids = wp_list_pluck( $results, 'id' );
		}

		if ( ! empty( $results ) && !is_array( $results ) ) {
			$this->activity_ids = [$results->id];
		}

		return $this;
	}

	private function set_table_name() {
		$this->tb_project  = pm_tb_prefix() . 'pm_projects';
		$this->tb_activity = pm_tb_prefix() . 'pm_activities';
	}
}
