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
	
	private $found_rows;
	private $per_page;
	private $tb_activity;
	private $tb_project;

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

		if ( wedevs_pm_is_single_query( $params ) ) {
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
            'message'       => $this->get_activity_message_by_action( $activity->action ),
            'action'        => $activity->action,
            'action_type'   => $activity->action_type,
            'project_id'    => $activity->project_id,
            'meta'          => empty( $meta ) ? [] : $meta,
            'committed_at'  => wedevs_pm_format_date( $activity->created_at ),
            'resource_id'   => $activity->resource_id,
            'resource_type' => $activity->resource_type,
        ];

		$items = $this->item_with( $items, $activity );
		
		return apply_filters( 'wedevs_pm_activity_transform', $items, $activity );
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
                $trans_commentable_type = $this->get_resource_type_translation( $value );
                $meta['commentable_id'] = $activity->meta['commentable_id'];
                $meta['commentable_type'] = $activity->meta['commentable_type'];
                $meta['trans_commentable_type'] = $trans_commentable_type;
                $meta['commentable_title'] = $trans_commentable_type;
            } elseif ( $key == 'commentable_type' ) {
                $trans_commentable_type = $this->get_resource_type_translation( $value );
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

		$this->activities = apply_filters( 'wedevs_pm_activity_with',$this->activities, $this->activity_ids, $this->query_params );

		return $this;
	}

	private function project() {
		if ( empty( $this->activities ) ) {
			return $this;
		}

		$project_ids = wp_list_pluck( $this->activities, 'project_id' );
		$project_ids = array_unique( $project_ids );

		$projects = wedevs_pm_get_projects( [ 'id' => $project_ids ] );
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

		$actors = wedevs_pm_get_users( [ 'id' => $actor_ids ] );
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

		$updaters = wedevs_pm_get_users( [ 'id' => $updater_ids ] );
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
		$updated_at_between = !isset( $this->query_params['updated_at_between'] ) ? true : wedevs_pm_is_true( $this->query_params['updated_at_between'] );
		$operator_key       = !empty( $this->query_params['updated_at_operator'] ) ? $this->query_params['updated_at_operator'] : 'equal';
		

		if ( $updated_at === false ) {
			return $this;
		}

		if ( $updated_at_start ) {
			$com_start_reduce = gmdate('Y-m-d',(strtotime ( '-1 day' , strtotime ( $updated_at_start) ) ));
			$com_add          = gmdate('Y-m-d',(strtotime ( '+1 day' , strtotime ( $updated_at) ) ));
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
	 * @return self object
	 */
	private function where_resource_type() {
		global $wpdb;
		$resource_type = isset( $this->query_params['resource_type'] ) ? $this->query_params['resource_type'] : false;

		if ( empty( $resource_type ) ) {
			return $this;
		}

		$resource_type = wedevs_pm_get_prepare_data( $resource_type );

		if ( is_array( $resource_type ) ) {
			$query_format = wedevs_pm_get_prepare_format( $resource_type, true );
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
	 * @return self object
	 */
	private function where_id() {
		global $wpdb;
		$id = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false;

		if ( empty( $id ) ) {
			return $this;
		}

		$id = wedevs_pm_get_prepare_data( $id );

		if ( is_array( $id ) ) {
			$query_format = wedevs_pm_get_prepare_format( $id );
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

		$actor_id = wedevs_pm_get_prepare_data( $actor_id );

		if ( is_array( $actor_id ) ) {
			$query_format = wedevs_pm_get_prepare_format( $actor_id );
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
	 * @return self object
	 */
	private function where_resource_id() {
		global $wpdb;
		$resource_id = isset( $this->query_params['resource_id'] ) ? $this->query_params['resource_id'] : false;

		if ( empty( $resource_id ) ) {
			return $this;
		}

		$resource_id = wedevs_pm_get_prepare_data( $resource_id );

		if ( is_array( $resource_id ) ) {
			$query_format = wedevs_pm_get_prepare_format( $resource_id );
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

		$project_id = wedevs_pm_get_prepare_data( $project_id );

		if ( is_array( $project_id ) ) {
			$query_format = wedevs_pm_get_prepare_format( $project_id );
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

		// Whitelist of allowed columns for ordering
		$allowed_columns = array(
			'id',
			'actor_id',
			'action',
			'action_type',
			'resource_id',
			'resource_type',
			'created_at',
			'updated_at'
		);

		if ( is_string( $odr_prms ) ) {
        	$orders = [];
        	$odr_prms = str_replace( ' ', '', trim( $odr_prms ) );
        	$odr_prms = explode( ',', $odr_prms );

        	foreach ( $odr_prms as $key => $param ) {
        		$pair = explode( '|', $param );
				if (count($pair) !== 2) {
					continue;
				}
        		$tb_col = $pair[0];
				$value = strtolower($pair[1]);

				// Validate column and order
				if (! in_array($tb_col, $allowed_columns, true)) {
					continue;
				}
				if (! in_array($value, array('asc', 'desc'), true)) {
					$value = 'asc';
				}

				$orders[$tb_col] = $value;
        	}
        } else if ( is_array( $odr_prms ) ) {
			$orders = [];
			foreach ($odr_prms as $col => $dir) {
				if (! in_array($col, $allowed_columns, true)) {
					continue;
				}
				$dir = strtolower($dir);
				if (! in_array($dir, array('asc', 'desc'), true)) {
					$dir = 'asc';
				}
				$orders[$col] = $dir;
			}
        } else {
			$orders = [];
        }

        $order = [];
        
        foreach ( $orders as $key => $value ) {
			$order[] =  $this->tb_activity . '.' . esc_sql($key) . ' ' . esc_sql($value);
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

		// Ensure these are strings to avoid null/undefined issues
		$join = is_string($this->join) ? $this->join : '';
		$where = is_string($this->where) ? $this->where : '';
		$orderby = is_string($this->orderby) ? $this->orderby : '';
		$limit = is_string($this->limit) ? $this->limit : '';

		// phpcs:ignore PluginCheck.Security.DirectDB.UnescapedDBParameter -- $join is built safely via join() method using wpdb::prepare() and apply_filters()
		$results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT SQL_CALC_FOUND_ROWS DISTINCT %i.*
				FROM %i
				{$join}
				WHERE %d=%d {$where}
				{$orderby} {$limit}",
				$this->tb_activity,
				$this->tb_activity,
				1,
				1
			)
		);
		
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
		$this->tb_project  = esc_sql( wedevs_pm_tb_prefix() . 'pm_projects' );
		$this->tb_activity = esc_sql( wedevs_pm_tb_prefix() . 'pm_activities' );
	}

	/**
	 * Format activity message by replacing placeholders with actual values
	 * 
	 * @param array|string $message_data Array containing [message_template, placeholder_paths] or empty string
	 * @param object $activity Activity object with actor, meta, etc.
	 * @param array $parsed_meta Parsed meta data array
	 * @return string Formatted message with placeholders replaced
	 */
	private function format_activity_message( $message_data, $activity, $parsed_meta = array() ) {
		// Handle empty or invalid message data
		if ( empty( $message_data ) || ! is_array( $message_data ) ) {
			return '';
		}

		list( $message_template, $placeholder_paths ) = $message_data;

		// If no placeholders, return the template as-is
		if ( empty( $placeholder_paths ) || ! is_array( $placeholder_paths ) ) {
			return $message_template;
		}

		// Prepare the data structure for accessing nested values
		$actor_data = array( 'display_name' => '', 'user_nicename' => '' );
		if ( isset( $activity->actor ) && is_object( $activity->actor ) ) {
			$actor_data['display_name'] = isset( $activity->actor->display_name ) ? $activity->actor->display_name : '';
			$actor_data['user_nicename'] = isset( $activity->actor->user_nicename ) ? $activity->actor->user_nicename : '';
		}

		$data = array(
			'actor' => array( 'data' => $actor_data ),
			'meta' => ! empty( $parsed_meta ) ? $parsed_meta : ( is_array( $activity->meta ) ? $activity->meta : array() ),
		);

		// Extract values for each placeholder path
		$values = array();
		foreach ( $placeholder_paths as $path ) {
			$values[] = $this->get_nested_value( $data, $path );
		}

		// Format the message using sprintf
		return vsprintf( $message_template, $values );
	}

	/**
	 * Get nested value from array using dot notation path
	 * 
	 * @param array $data Data array
	 * @param string $path Dot-separated path (e.g., 'actor.data.display_name')
	 * @return string Value at the path or empty string if not found
	 */
	private function get_nested_value( $data, $path ) {
		$keys = explode( '.', $path );
		$value = $data;

		foreach ( $keys as $key ) {
			if ( is_array( $value ) && isset( $value[$key] ) ) {
				$value = $value[$key];
			} else {
				return '';
			}
		}

		return is_scalar( $value ) ? (string) $value : '';
	}

	/**
	 * Get activity message by action
	 *
	 * @param string $action Activity action name
	 * @return array|string Message template with placeholders or empty string if not found
	 */
	private function get_activity_message_by_action( $action ) {
		switch ( $action ) {
			// Project activities
			case 'create_project':
				/* translators: 1: User display name, 2: Project title */
				return __( '{{actor.data.display_name}} has created a project titled as {{meta.project_title}}.', 'wedevs-project-manager' );
			
			case 'update_project_title':
				/* translators: 1: User display name, 2: Old project title, 3: New project title */
				return __( '{{actor.data.display_name}} has updated the title of a project from "{{meta.project_title_old}}" to "{{meta.project_title_new}}".', 'wedevs-project-manager' );
			
			case 'update_project_description':
				/* translators: 1: User display name, 2: Project title */
				return __( '{{actor.data.display_name}} has updated the description of a project, {{meta.project_title}}.', 'wedevs-project-manager' );
			
			case 'update_project_status':
				/* translators: 1: User display name, 2: Project title, 3: Old project status, 4: New project status */
				return __( '{{actor.data.display_name}} has updated the status of a project, {{meta.project_title}}, from {{meta.project_status_old}} to {{meta.project_status_new}}.', 'wedevs-project-manager' );
			
			case 'update_project_budget':
				/* translators: 1: User display name, 2: Project title, 3: Old budget, 4: New budget */
				return __( '{{actor.data.display_name}} has updated the budget of a project, {{meta.project_title}}, from {{meta.project_budget_old}} to {{meta.project_budget_new}}.', 'wedevs-project-manager' );
			
			case 'update_project_pay_rate':
				/* translators: 1: User display name, 2: Project title, 3: Old pay rate, 4: New pay rate */
				return __( '{{actor.data.display_name}} has updated the pay rate of a project, {{meta.project_title}}, from {{meta.project_pay_rate_old}} to {{meta.project_pay_rate_new}}.', 'wedevs-project-manager' );
			
			case 'update_project_est_completion_date':
				/* translators: 1: User display name, 2: Project title, 3: Old completion date, 4: New completion date */
				return __( '{{actor.data.display_name}} has updated the estimated completion date of a project, {{meta.project_title}}, from {{meta.project_est_completion_date_old}} to {{meta.project_est_completion_date_new}}.', 'wedevs-project-manager' );
			
			case 'update_project_color_code':
				/* translators: 1: User display name, 2: Project title */
				return __( '{{actor.data.display_name}} has updated the color of a project, {{meta.project_title}}.', 'wedevs-project-manager' );
			
			// Discussion board activities
			case 'create_discussion_board':
				/* translators: 1: User display name, 2: Discussion board title */
				return __( '{{actor.data.display_name}} has created a discussion board titled as {{meta.discussion_board_title}}.', 'wedevs-project-manager' );
			
			case 'delete_discussion_board':
				/* translators: 1: User display name, 2: Deleted discussion board title */
				return __( '{{actor.data.display_name}} has deleted a discussion board titled as {{meta.deleted_discussion_board_title}}.', 'wedevs-project-manager' );
			
			case 'update_discussion_board_title':
				/* translators: 1: User display name, 2: Old discussion board title, 3: New discussion board title */
				return __( '{{actor.data.display_name}} has updated the title of a discussion board from "{{meta.discussion_board_title_old}}" to "{{meta.discussion_board_title_new}}".', 'wedevs-project-manager' );
			
			case 'update_discussion_board_description':
				/* translators: 1: User display name, 2: Discussion board title */
				return __( '{{actor.data.display_name}} has updated the description of a discussion board, {{meta.discussion_board_title}}.', 'wedevs-project-manager' );
			
			case 'update_discussion_board_order':
				/* translators: 1: User display name, 2: Discussion board title */
				return __( '{{actor.data.display_name}} has updated the order of a discussion board, {{meta.discussion_board_title}}.', 'wedevs-project-manager' );
			
			case 'update_discussion_board_status':
				/* translators: 1: User display name, 2: Discussion board title */
				return __( '{{actor.data.display_name}} has updated the status of a discussion board, {{meta.discussion_board_title}}.', 'wedevs-project-manager' );
			
			// Task list activities
			case 'create_task_list':
				/* translators: 1: User display name, 2: Task list title */
				return __( '{{actor.data.display_name}} has created a task list titled as {{meta.task_list_title}}.', 'wedevs-project-manager' );
			
			case 'delete_task_list':
				/* translators: 1: User display name, 2: Deleted task list title */
				return __( '{{actor.data.display_name}} has deleted a task list titled as {{meta.deleted_task_list_title}}.', 'wedevs-project-manager' );
			
			case 'update_task_list_title':
				/* translators: 1: User display name, 2: Old task list title, 3: New task list title */
				return __( '{{actor.data.display_name}} has updated the title of a task list from "{{meta.task_list_title_old}}" to "{{meta.task_list_title_new}}".', 'wedevs-project-manager' );
			
			case 'update_task_list_description':
				/* translators: 1: User display name, 2: Task list title */
				return __( '{{actor.data.display_name}} has updated the description of a task list, {{meta.task_list_title}}.', 'wedevs-project-manager' );
			
			case 'update_task_list_order':
				/* translators: 1: User display name, 2: Task list title */
				return __( '{{actor.data.display_name}} has updated the order of a task list, {{meta.task_list_title}}.', 'wedevs-project-manager' );
			
			case 'update_task_list_milestone_id':
				/* translators: 1: User display name, 2: Task list title */
				return __( '{{actor.data.display_name}} has updated the milestone of a task list, {{meta.task_list_title}}.', 'wedevs-project-manager' );
			
			// Milestone activities
			case 'create_milestone':
				/* translators: 1: User display name, 2: Milestone title */
				return __( '{{actor.data.display_name}} has created a milestone titled as {{meta.milestone_title}}.', 'wedevs-project-manager' );
			
			case 'delete_milestone':
				/* translators: 1: User display name, 2: Deleted milestone title */
				return __( '{{actor.data.display_name}} has deleted a milestone titled as {{meta.deleted_milestone_title}}.', 'wedevs-project-manager' );
			
			case 'update_milestone_title':
				/* translators: 1: User display name, 2: Old milestone title, 3: New milestone title */
				return __( '{{actor.data.display_name}} has updated the title of a milestone from "{{meta.milestone_title_old}}" to "{{meta.milestone_title_new}}".', 'wedevs-project-manager' );
			
			case 'update_milestone_description':
				/* translators: 1: User display name, 2: Milestone title */
				return __( '{{actor.data.display_name}} has updated the description of a milestone, {{meta.milestone_title}}.', 'wedevs-project-manager' );
			
			case 'update_milestone_start_at':
				/* translators: 1: User display name, 2: Milestone title, 3: Old start date, 4: New start date */
				return __( '{{actor.data.display_name}} has updated the start date of a milestone, {{meta.milestone_title}}, from {{meta.milestone_start_at_old}} to {{meta.milestone_start_at_new}}.', 'wedevs-project-manager' );
			
			case 'update_milestone_end_at':
				/* translators: 1: User display name, 2: Milestone title, 3: Old end date, 4: New end date */
				return __( '{{actor.data.display_name}} has updated the end date of a milestone, {{meta.milestone_title}}, from {{meta.milestone_end_at_old}} to {{meta.milestone_end_at_new}}.', 'wedevs-project-manager' );
			
			case 'update_milestone_order':
				/* translators: 1: User display name, 2: Milestone title */
				return __( '{{actor.data.display_name}} has updated the order of a milestone, {{meta.milestone_title}}.', 'wedevs-project-manager' );
			
			case 'update_milestone_achive_date':
				/* translators: 1: User display name, 2: Milestone title, 3: Old achieve date, 4: New achieve date */
				return __( '{{actor.data.display_name}} has updated the achieve date of a milestone, {{meta.milestone_title}}, from {{meta.milestone_achive_date_old}} to {{meta.milestone_achive_date_new}}.', 'wedevs-project-manager' );
			
			// Task activities
			case 'create_task':
				/* translators: 1: User display name, 2: Task title */
				return __( '{{actor.data.display_name}} has created a task titled as {{meta.task_title}}.', 'wedevs-project-manager' );
			
			case 'delete_task':
				/* translators: 1: User display name, 2: Deleted task title */
				return __( '{{actor.data.display_name}} has deleted a task titled as {{meta.deleted_task_title}}.', 'wedevs-project-manager' );
			
			case 'update_task_title':
				/* translators: 1: User display name, 2: Old task title, 3: New task title */
				return __( '{{actor.data.display_name}} has updated the title of a task from "{{meta.task_title_old}}" to "{{meta.task_title_new}}".', 'wedevs-project-manager' );
			
			case 'update_task_description':
				/* translators: 1: User display name, 2: Task title */
				return __( '{{actor.data.display_name}} has updated the description of a task, {{meta.task_title}}.', 'wedevs-project-manager' );
			
			case 'update_task_start_at':
				/* translators: 1: User display name, 2: Task title, 3: Old start date, 4: New start date */
				return __( '{{actor.data.display_name}} has updated the start date of a task, {{meta.task_title}}, from {{meta.task_start_at_old}} to {{meta.task_start_at_new}}.', 'wedevs-project-manager' );
			
			case 'update_task_due_date':
				/* translators: 1: User display name, 2: Task title, 3: Old due date, 4: New due date */
				return __( '{{actor.data.display_name}} has updated the due date of a task, {{meta.task_title}}, from {{meta.task_due_date_old}} to {{meta.task_due_date_new}}.', 'wedevs-project-manager' );
			
			case 'update_task_estimation':
				/* translators: 1: User display name, 2: Task title, 3: Old estimation, 4: New estimation */
				return __( '{{actor.data.display_name}} has updated the estimation of a task, {{meta.task_title}}, from {{meta.task_estimation_old}} to {{meta.task_estimation_new}}.', 'wedevs-project-manager' );
			
			case 'update_task_complexity':
				/* translators: 1: User display name, 2: Task title, 3: Old complexity, 4: New complexity */
				return __( '{{actor.data.display_name}} has updated the complexity of a task, {{meta.task_title}}, from {{meta.task_complexity_old}} to {{meta.task_complexity_new}}.', 'wedevs-project-manager' );
			
			case 'update_task_priority':
				/* translators: 1: User display name, 2: Task title, 3: Old priority, 4: New priority */
				return __( '{{actor.data.display_name}} has updated the priority of a task, {{meta.task_title}}, from {{meta.task_priority_old}} to {{meta.task_priority_new}}.', 'wedevs-project-manager' );
			
			case 'update_task_payable':
				/* translators: 1: User display name, 2: Task title, 3: Old payable status, 4: New payable status */
				return __( '{{actor.data.display_name}} has updated the payable status of a task, {{meta.task_title}}, from {{meta.task_payable_old}} to {{meta.task_payable_new}}.', 'wedevs-project-manager' );
			
			case 'update_task_recurrent':
				/* translators: 1: User display name, 2: Task title, 3: Old recurrency, 4: New recurrency */
				return __( '{{actor.data.display_name}} has updated the recurrency of a task, {{meta.task_title}}, from {{meta.task_recurrent_old}} to {{meta.task_recurrent_new}}.', 'wedevs-project-manager' );
			
			case 'update_task_status':
				/* translators: 1: User display name, 2: Task title, 3: Old task status, 4: New task status */
				return __( '{{actor.data.display_name}} has updated the status of a task, {{meta.task_title}}, from {{meta.task_status_old}} to {{meta.task_status_new}}.', 'wedevs-project-manager' );
			
			// Comment activities
			case 'comment_on_task':
			case 'update_comment_on_task':
			case 'delete_comment_on_task':
			case 'reply_comment_on_task':
			case 'update_reply_comment_on_task':
			case 'delete_reply_comment_on_task':
			case 'comment_on_task_list':
			case 'update_comment_on_task_list':
			case 'delete_comment_on_task_list':
			case 'reply_comment_on_task_list':
			case 'update_reply_comment_on_task_list':
			case 'delete_reply_comment_on_task_list':
			case 'comment_on_discussion_board':
			case 'update_comment_on_discussion_board':
			case 'delete_comment_on_discussion_board':
			case 'reply_comment_on_discussion_board':
			case 'update_reply_comment_on_discussion_board':
			case 'delete_reply_comment_on_discussion_board':
			case 'comment_on_milestone':
			case 'update_comment_on_milestone':
			case 'delete_comment_on_milestone':
			case 'reply_comment_on_milestone':
			case 'update_reply_comment_on_milestone':
			case 'delete_reply_comment_on_milestone':
			case 'comment_on_project':
			case 'update_comment_on_project':
			case 'delete_comment_on_project':
			case 'reply_comment_on_project':
			case 'update_reply_comment_on_project':
			case 'delete_reply_comment_on_project':
			case 'comment_on_file':
			case 'update_comment_on_file':
			case 'delete_comment_on_file':
			case 'reply_comment_on_file':
			case 'update_reply_comment_on_file':
			case 'delete_reply_comment_on_file':
				// Comment activities use simple format - can be handled by a helper
				return $this->get_comment_activity_message( $action );
			
			case 'duplicate_project':
				/* translators: 1: User display name, 2: Old project title */
				return __( '{{actor.data.display_name}} has duplicated project from, {{meta.old_project_title}}.', 'wedevs-project-manager' );
			
			case 'duplicate_list':
				/* translators: 1: User display name, 2: Old task list title */
				return __( '{{actor.data.display_name}} has duplicated list from, {{meta.old_task_list_title}}.', 'wedevs-project-manager' );
			
			default:
				return '';
		}
	}

	/**
	 * Get comment activity message by action key
	 * 
	 * @param string $action Activity action key
	 * @return string Translated message with {{placeholder}} syntax
	 */
	private function get_comment_activity_message( $action ) {
		// Parse action to determine operation and resource type
		$parts = explode( '_on_', $action );
		
		if ( count( $parts ) !== 2 ) {
			return '';
		}
		
		$operation = $parts[0];
		$resource_type = $parts[1];
		
		// Get resource type translation
		$resource_type_text = $this->get_resource_type_translation( $resource_type );
		
		// Get operation-specific message
		switch ( $operation ) {
			case 'comment':
				/* translators: 1: Resource type (task, project, etc.), 2: Resource type for meta path */
				return sprintf( __( '{{actor.data.display_name}} has commented on a %1$s, {{meta.%2$s_title}}.', 'wedevs-project-manager' ), $resource_type_text, $resource_type );
			
			case 'update_comment':
				/* translators: 1: Resource type (task, project, etc.), 2: Resource type for meta path */
				return sprintf( __( '{{actor.data.display_name}} has updated a comment on a %1$s, {{meta.%2$s_title}}.', 'wedevs-project-manager' ), $resource_type_text, $resource_type );
			
			case 'delete_comment':
				/* translators: 1: Resource type (task, project, etc.), 2: Resource type for meta path */
				return sprintf( __( '{{actor.data.display_name}} has deleted a comment from a %1$s, {{meta.%2$s_title}}.', 'wedevs-project-manager' ), $resource_type_text, $resource_type );
			
			case 'reply_comment':
				/* translators: 1: Resource type (task, project, etc.), 2: Resource type for meta path */
				return sprintf( __( '{{actor.data.display_name}} has replied to a comment on a %1$s, {{meta.%2$s_title}}.', 'wedevs-project-manager' ), $resource_type_text, $resource_type );
			
			case 'update_reply_comment':
				/* translators: 1: Resource type (task, project, etc.), 2: Resource type for meta path */
				return sprintf( __( '{{actor.data.display_name}} has updated a reply to a comment on a %1$s, {{meta.%2$s_title}}.', 'wedevs-project-manager' ), $resource_type_text, $resource_type );
			
			case 'delete_reply_comment':
				/* translators: 1: Resource type (task, project, etc.), 2: Resource type for meta path */
				return sprintf( __( '{{actor.data.display_name}} has deleted a reply to a comment on a %1$s, {{meta.%2$s_title}}.', 'wedevs-project-manager' ), $resource_type_text, $resource_type );
			
			default:
				return '';
		}
	}

	/**
	 * Get resource type translation
	 *
	 * @param string $resource_type Resource type name
	 * @return string Translated resource type name
	 */
	private function get_resource_type_translation( $resource_type ) {
		switch ( $resource_type ) {
			case 'project':
				return __( 'project', 'wedevs-project-manager' );
			
			case 'discussion_board':
				return __( 'discussion board', 'wedevs-project-manager' );
			
			case 'task_list':
				return __( 'task list', 'wedevs-project-manager' );
			
			case 'task':
				return __( 'task', 'wedevs-project-manager' );
			
			case 'milestone':
				return __( 'milestone', 'wedevs-project-manager' );
			
			case 'comment':
				return __( 'comment', 'wedevs-project-manager' );
			
			case 'file':
				return __( 'file', 'wedevs-project-manager' );
			
			default:
				return $resource_type;
		}
	}
}
