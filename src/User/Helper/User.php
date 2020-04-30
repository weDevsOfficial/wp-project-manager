<?php
namespace WeDevs\PM\User\helper;

class User {
	
	private static $_instance;
	private $query_params;
	private $select;
	private $join;
	private $where;
	private $limit;
	private $orderby;
	private $with;
	private $users;
	private $user_ids;
	private $is_single_query = false;

	public static function getInstance() {

        return new self();
    }

    function __construct() {
    	$this->set_table_name();
    }

	public static function get_results( $params = [] ) {
		$self = self::getInstance();
		$self->query_params = $params;

		$self->join()
			->where()
			->limit()
			->orderby()
			->get();

		$response = $self->format_users( $self->users );

		if ( pm_is_single_query( $params ) ) {
			return ['data' => $response['data'][0]] ;
		}

		return $response;
	}

	/**
	 * Format TaskMilestone data
	 *
	 * @param array $users
	 *
	 * @return array
	 */
	public function format_users( $users ) {
		$response = [
			'data' => [],
			'meta' => []
		];

		foreach ( $users as $key => $user ) {
			$users[$key] = $this->fromat_user( $user );
		}

		$response['data']  = $users;
		$response ['meta'] = $this->set_users_meta();

		return $response;
	}

	/**
	 * Set meta data
	 */
	private function set_users_meta() {
		return [
			'pagination' => [
				'total'   => $this->found_rows,
				'per_page'  => ceil( $this->found_rows/$this->get_per_page() )
			]
		];
	}

	public function fromat_user( $user ) {
		
		$items = [
			'id'                => (int) $user->ID,
			'username'          => $user->user_login,
			'nicename'          => $user->user_nicename,
			'email'             => $user->user_email,
			'profile_url'       => $user->user_url,
			'display_name'      => $user->display_name,
			'manage_capability' => (int) pm_has_manage_capability($user->ID),
			'create_capability' => (int) pm_has_project_create_capability($user->ID),
			'avatar_url'        => get_avatar_url( $user->user_email ),
			'github'            => get_user_meta($user->ID,'github' ,true),
			'bitbucket'         => get_user_meta($user->ID,'bitbucket', true)
	    ];

		$items = $this->item_with( $items, $user );
		
		return apply_filters( 'pm_user_transform', $items, $user );
	}

	private function item_with( $items, $user ) {
        $with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

        if ( ! is_array( $with ) ) {
            $with = explode( ',', str_replace(' ', '', $with ) );
        }
        
        $user_with_items =  array_intersect_key( (array) $user, array_flip( $with ) );

        $items = array_merge( $items, $user_with_items );

        return $items;
    }

    private function where() {

		$this->where_id();

		return $this;
	}

	/**
	 * Filter user by ID
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

		$this->where .= $wpdb->prepare( " AND {$this->tb_user}.ID IN ($format)", $format_ids );

		if ( count( $format_ids ) == 1 ) {
			$this->is_single_query = true;
		}
		
		return $this;
	}

	private function join() {
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

		$tb_pj    = $wpdb->prefix . 'users';
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
		

		$query = "SELECT SQL_CALC_FOUND_ROWS DISTINCT {$this->tb_user}.*
			FROM {$this->tb_user}
			{$this->join}
			WHERE %d=%d {$this->where} 
			{$this->orderby} {$this->limit} ";

		$results = $wpdb->get_results( $wpdb->prepare( $query, 1, 1 ) );

		$this->found_rows = $wpdb->get_var( "SELECT FOUND_ROWS()" );
		$this->users = $results;

		if ( ! empty( $results ) && is_array( $results ) ) {
			$this->user_ids = wp_list_pluck( $results, 'ID' );
		}

		if ( ! empty( $results ) && !is_array( $results ) ) {
			$this->user_ids = [$results->id];
		}

		return $this;
	}

		/**
	 * Set table name as class object
	 */
	private function set_table_name() {
		$this->tb_user    = pm_tb_prefix() . 'users';
	}
}
