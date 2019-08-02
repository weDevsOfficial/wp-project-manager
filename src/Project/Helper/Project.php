<?php
namespace WeDevs\PM\Project\Helper;

use WP_REST_Request;
use WeDevs\PM\Task_List\Helper\Task_List;

// data: {
// 	with: 'lists,tasks,assignees,categories',
// 	task_lists_per_page: '10',
// 	tasks_per_page: '10',
// 	per_page: '10',
// 	select: 'id, title',
// 	task_lists_select_items: 'id, title',
// 	task_select_items: 'id, title',
// 	categories: [2, 4],
// 	assignees: [1,2],
// 	id: [1,2],
// 	title: 'Rocket',
// 	status: '0',
// 	page: 1
// },

class Project {

	private static $_instance;
	private $tb_project;
	private $tb_list;
	private $tb_task;
	private $tb_projectuser;
	private $tb_task_user;
	private $tb_categories;
	private $tb_category_project;
	private $query_params;
	private $select;
	private $join;
	private $where;
	private $limit;
	private $with;
	private $projects;
	private $project_ids;

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
		self::get_results( $request->get_params() );
		
	}

	public static function get_results( $params ) {
		//global $wpdb;

		$self = self::getInstance();
		$self->query_params = $params;

		$self->select()
			->join()
			->where()
			->limit()
			->get()
			->with();


	}

	private function with() {
		$this->include_assignees()
			->include_categories()
			->include_task_lists();
			// ->include_tasks();

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

	private function include_task_lists() {
		global $wpdb;
		$args = [
			'project_id' => [4,2],
			'select' => ['id', 'title', 'project_id']
		];

		$lists = Task_List::get_results( $args );

		$tb_meta = pm_tb_prefix() . 'pm_meta';
		$user_id = get_current_user_id();
		$project_ids = implode( ',', $this->project_ids);

		$query = "SELECT DISTINCT lst.id as list_id, lst.project_id
			FROM $this->tb_list as lst
		 	left JOIN $this->tb_project_user as pusr ON pusr.project_id=lst.project_id 
		 	left JOIN $tb_meta as mt ON mt.entity_id=lst.id AND mt.entity_type='task_list'
			left JOIN wp_project_permission as pmp ON pmp.project_id=lst.project_id
			WHERE pusr.user_id = $user_id
			AND
			lst.type = 'task_list'
			AND
			lst.project_id IN ($project_ids)
			AND
			lst.status='1'
			AND ( 
					((
					(pusr.role_id = 2 OR pusr.role_id = 3) 
					AND pmp.permission_key='list_view_private' 
					AND pmp.value='yes'
					AND mt.meta_key='privacy'
					AND mt.meta_value!='1'
					)
				  OR (
					pmp.permission_key is NULL
					or
					( pmp.permission_key='list_view_private' AND pmp.value='no')
					or
					(`mt`.`meta_key` = 'privacy' AND `mt`.`meta_value` != 1)
            		OR
            		(`mt`.`meta_key` != 'privacy')
           			OR
            		(`mt`.`meta_key` is null)
            		))
            		OR pusr.role_id = 1
				)";
			
			
		$results = $wpdb->get_results( $query );
		$ids = [];
		
		foreach ( $results as $key => $result ) {
			$ids[$result->project_id][] = $result->list_id;
		}

		$offset = $this->get_offset();
		$per_page = $this->get_per_page();

		foreach ( $ids as $key => $id ) {
			
		}

		pmpr($offset, $per_page); die();


		
	}

	private function include_categories() {
		global $wpdb;
		$with = empty( $this->query_params['with'] ) ? false : $this->query_params['with'];
		$with = explode( ',', $with );
		$category = [];

		if ( ! in_array( 'categories', $with ) && empty( $this->project_ids ) ) {
			return $this;
		}

		$tb_categories = pm_tb_prefix() . 'pm_categories';
		$tb_relation   = pm_tb_prefix() . 'pm_category_project';
		$project_ids   = implode( ',', $this->project_ids );

		$query = "SELECT cats.id as id, cats.title, cats.description, rel.project_id 
			FROM $tb_categories as cats
			LEFT JOIN $tb_relation as rel ON rel.category_id = cats.id 
			where rel.project_id IN ($project_ids) AND cats.categorible_type='project'";
		
		$results = $wpdb->get_results( $query );

		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			$category[$project_id] = $result;
		}
		
		foreach ( $this->projects as $key => $project ) {
			$project->category = empty( $category[$project->id] ) ? '' : $category[$project->id]; 
		}

		return $this;
	}

	private function include_assignees() {
		global $wpdb;
		$with = empty( $this->query_params['with'] ) ? false : $this->query_params['with'];
		$with = explode( ',', $with );
		$users = [];

		if ( ! in_array( 'assignees', $with ) && empty( $this->project_ids ) ) {
			return $this;
		}

		$tb_assignees = pm_tb_prefix() . 'pm_role_user';
		$tb_users     = pm_tb_prefix() . 'users';
		$project_ids  = implode( ',', $this->project_ids );

		$query = "SELECT usr.ID as id, usr.display_name, usr.user_email as email, asin.project_id
			FROM $tb_users as usr
			LEFT JOIN $tb_assignees as asin ON usr.ID = asin.user_id 
			where asin.project_id IN ($project_ids)";


		$results = $wpdb->get_results( $query );

		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			$users[$project_id][] = $result;
		}
		
		foreach ( $this->projects as $key => $project ) {
			$project->users = empty( $users[$project->id] ) ? [] : $users[$project->id]; 
		}

		return $this;
	}

	private function select() {
		$select = '';
		
		if ( empty( $this->query_params['select'] ) ) {
			$this->select = $this->tb_project . '.*';

			return $this;
		}

		$select_items = $this->query_params['select'];

		if ( ! is_array( $select_items ) ) {
			$select_items = str_replace( ' ', '', $select_items );
			$select_items = explode( ',', $select_items );
		}

		foreach ( $select_items as $key => $item ) {
			$item = str_replace( ' ', '', $item );
			$select .= $this->tb_project . '.' . $item . ',';
		}
		
		$this->select = substr( $select, 0, -1 );
		
		return $this;
	}

	private function join() {
		return $this;
	}

	private function where() {
		
		$this->where_id()
			->where_category()
			->where_users()
			->where_title()
			->where_status();

		return $this;
	}

	private function where_id() {

		$id = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false; 

		if ( empty( $id ) ) {
			return $this;
		}

		if ( is_array( $id ) ) {
			$query_id = implode( ',', $id );
			$this->where .= " AND {$this->tb_project}.id IN ($query_id)";
		}

		if ( !is_array( $id ) ) {
			$this->where .= " AND {$this->tb_project}.id = $id";
		}

		return $this;
	}

	private function where_status() {

		$status = isset( $this->query_params['status'] ) ? $this->query_params['status'] : false;

		if ( $status === false ) {
			return $this;
		}

		$this->where .= " AND {$this->tb_project}.status='$status'";

		return $this;
	}

	private function where_title() {

		$title = isset( $this->query_params['title'] ) ? $this->query_params['title'] : false;

		if ( empty( $title ) ) {
			return $this;
		}

		$this->where .= " AND {$this->tb_project}.title LIKE '%$title%'";

		return $this;
	}

	private function where_users() {

		$assignees = isset( $this->query_params['assignees'] ) ? $this->query_params['assignees'] : false;
		
		if ( empty( $assignees ) ) {
			return $this;
		}

		$assignees = is_array( $assignees ) ? implode( ',', $assignees ) : $assignees;

		$this->join .= " LEFT JOIN {$this->tb_project_user} ON {$this->tb_project_user}.project_id={$this->tb_project}.id";
		
		$this->where .= " AND {$this->tb_project_user}.user_id IN ({$assignees})";

		return $this;
	}

	private function where_category() {

		$categories = isset( $this->query_params['categories'] ) ? $this->query_params['categories'] : false;

		if ( empty( $categories ) ) {
			return $this;
		}
		$categories = is_array( $categories ) ? implode( ',', $categories ) : $categories;

		$this->join .= " LEFT JOIN {$this->tb_category_project} ON {$this->tb_category_project}.project_id={$this->tb_project}.id";
		
		$this->where .= " AND {$this->tb_category_project}.project_id IN ({$categories})";

		return $this;
	}

	private function limit() {

		$per_page = isset( $this->query_params['per_page'] ) ? $this->query_params['per_page'] : false;
		
		if ( $per_page === false || $per_page == '-1' ) {
			return $this;
		}

		$this->limit = " LIMIT {$this->get_offset()},{$this->get_per_page()}";

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

		$query = "SELECT DISTINCT {$this->select} 
			FROM {$this->tb_project}
			{$this->join}
			WHERE 1=1 {$this->where}
			{$this->limit}";
		
		if ( $id && ( ! is_array( $id ) ) ) {
			$results = $wpdb->get_row( $query );
		} else { 
			$results = $wpdb->get_results( $query );
		} 

		$this->projects = $results;

		if ( ! empty( $results ) && is_array( $results ) ) {
			$this->project_ids = wp_list_pluck( $results, 'id' );
		} 

		if ( ! empty( $results ) && !is_array( $results ) ) {
			$this->project_ids = [$results->id];
		} 

		return $this;
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
