<?php
namespace WeDevs\PM\Project\Helper;

use WP_REST_Request;

class Project {

	private static $_instance;
	private $tb_project;
	private $tb_list;
	private $tb_task;
	private $tb_project_user;
	private $tb_task_user;
	private $tb_categories;
	private $tb_category_project;
	private $params;
	private $join;
	private $where;

	public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    function __construct() {
    	$this->set_table_name();
    }

	public static function get_projects( WP_REST_Request $request ) {
		self::build_projects_query( $request->get_params() );
		
	}

	public static function build_projects_query( $params ) {
		global $wpdb;

		$self = self::getInstance();
		$self->get_join( $params );
		$self->get_where( $params );
		$self->params = $params;

		$query = "SELECT DISTINCT {$self->get_project_selects()} 
			FROM {$self->tb_project}
			{$self->join}
			WHERE 1=1 {$self->where}
			{$self->get_limit( $params )}";

		pmpr($query); die();
	}

	private function get_join( $params ) {

	}

	private function get_where( $params ) {
		
		$this->filter_by_category( $params );
		$this->filter_by_users( $params );

	}

	private function filter_by_users( $params ) {
		///$this->tb_project_user

		if ( empty( $params['assignees'] ) ) {
			return '';
		}

		$assignees = is_array( $params['assignees'] ) ? implode( ',', $params['assignees'] ) : $params['assignees'];

		$this->join .= " LEFT JOIN {$this->tb_project_user} ON {$this->tb_project_user}.project_id={$this->tb_project}.id";
		
		$this->where .= " AND {$this->tb_project_user}.user_id IN ({$assignees})";
	}

	private function filter_by_category( $params ) {
		if ( empty( $params['categories'] ) ) {
			return '';
		}
		$cats = is_array( $params['categories'] ) ? implode( ',', $params['categories'] ) : $params['categories'];

		$this->join .= " LEFT JOIN {$this->tb_category_project} ON {$this->tb_category_project}.project_id={$this->tb_project}.id";
		
		$this->where .= " AND {$this->tb_category_project}.project_id IN ({$cats})";
	}

	private function get_limit( $params ) {
		if ( ! empty( $params['projects_per_page'] ) && $params['projects_per_page'] == '-1' ) {
			return '';
		}

		return " LIMIT {$this->get_offset( $params )},{$this->get_per_page( $params )}";
	}

	private function get_offset( $params ) {
		$page   = empty( $params['page'] ) ? 1 : absint( $params['page'] );
		$limit  = $this->get_per_page( $params );
		$offset = ( $page - 1 ) * $limit;

		return $offset;
	}

	private function get_per_page( $params ) {
		if ( ! empty( $params['projects_per_page'] ) && absint( $params['projects_per_page'] ) ) {
			return absint( $params['projects_per_page'] );
		}

		return 10;
	}

	private function get_project_selects() {
		$select = '';
		$select .= $this->set_select_items( $this->params['project_select_items'] );

		return $select;
	}

	private function set_select_items( $items ) {
		$select = '';
		
		if ( empty( $items ) ) {
			return $this->tb_project . '.*';
		}

		$items = str_replace( ' ', '', $items );
		$items = explode( ',', $items );

		foreach ( $items as $key => $item ) {
			$select .= $this->tb_project . '.' . $item . ',';
		}

		return substr( $select, 0, -1 );
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
