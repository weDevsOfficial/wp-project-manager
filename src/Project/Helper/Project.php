<?php
namespace WeDevs\PM\Project\Helper;

use WP_REST_Request;
use WeDevs\PM\Task_List\Helper\Task_List;

// data: {
// 	with: 'assignees,categories,overview_graph',
// 	per_page: '10',
// 	select: 'id, title',
// 	category: [2, 4],
// 	inUsers: [1,2],
// 	id: [1,2],
// 	title: 'Rocket', 'test'
// 	status: '0',
// 	page: 1,
//  orderby: 'title:asc,id:desc'
//  project_meta: 'otal_task_lists,total_tasks,total_complete_tasks,total_incomplete_tasks,total_discussion_boards,total_milestones,total_comments,total_files,total_activities'
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
	private $orderby;
	private $with;
	private $projects;
	private $project_ids;
	private $is_single_query = false;

	/**
	 * Class instance
	 *
	 * @return Object
	 */
	public static function getInstance() {
        return new self();
    }

    /**
     * Class constructor
     */
    public function __construct() {
    	$this->set_table_name();
    }

    /**
     * AJAX Get projects
     *
     * @param  array $request
     *
     * @return Object
     */
	public static function get_projects( WP_REST_Request $request ) {
		$self     = self::getInstance();
		$projects = self::get_results( $request->get_params() );

		wp_send_json( $projects );
	}

	/**
	 * Get projects
	 *
	 * @param  array $params
	 *
	 * @return array
	 */
	public static function get_results( $params ) {

		$self = self::getInstance();
		$self->query_params = $params;

		$self->select()
			->join()
			->where()
			->limit()
			->orderby()
			->get()
			->with()
			->meta();

		$response = $self->format_projects( $self->projects );

		if( pm_is_single_query( $params ) ) {
			return ['data' => $response['data'][0]];
		}

		return $response;
	}

	/**
	 * Format projects data
	 *
	 * @param array $projects
	 *
	 * @return array
	 */
	public function format_projects( $projects ) {
		$response = [
			'data' => [],
			'meta' => []
		];

		if ( ! is_array( $projects ) ) {
			$response['data'] = $this->fromat_project( $projects );

			return $response;
		}

		foreach ( $projects as $key => $project ) {
			$projects[$key] = $this->fromat_project( $project );
		}


		$response['data']  = $projects;
		$response['meta'] = $this->set_projects_meta();

		return $response;
	}

	/**
	 * Set meta data
	 */
	private function set_projects_meta() {

		$t_incomplete     = $this->count_project_by_type(0);
		$t_complete       = $this->count_project_by_type(1);
		$t_pending        = $this->count_project_by_type(2);
		$t_archived       = $this->count_project_by_type(3);
		$pagination_total = $this->get_pagination_total( $t_incomplete, $t_complete, $t_pending, $t_archived );

		return [
			'total_projects'   => $this->found_rows,
			'total_page'       => ceil( $this->found_rows/$this->get_per_page() ),
			'total_incomplete' => $t_incomplete,
			'total_complete'   => $t_complete,
			'total_pending'    => $t_pending,
			'total_archived'   => $t_archived,
			'total_favourite'  => $this->favourite_project_count(),
			'pagination'    => [
				"total"       => $pagination_total,
				"per_page"    => $this->get_per_page(),
				"total_pages" => ceil( $this->found_rows/$this->get_per_page() ),
			]
		];
	}

	private function get_pagination_total( $incomplete, $complete, $pending, $archived ) {
		$status = isset( $this->query_params['status'] ) ? $this->query_params['status'] : false;

		if ( ! $status ) {
			return (int) $incomplete + (int) $complete + (int) $pending + (int) $archived;
		}

		if ( $status == 'incomplete' ) {
			return (int) $incomplete;
		}

		if ( $status == 'complete' ) {
			return (int) $complete;
		}

		if ( $status == 'pending' ) {
			return (int) $pending;
		}

		if ( $status == 'archived' ) {
			return (int) $archived;
		}

		return 0;
	}

	private function count_project_by_type( $type) {
		global $wpdb;
		$tb_projects = pm_tb_prefix() . 'pm_projects';

		$query = "SELECT DISTINCT COUNT(id) FROM $tb_projects
				WHERE status =%s";

		$incomplete_project_count = $wpdb->get_var( $wpdb->prepare( $query, $type ) );

		return $incomplete_project_count;
	}

	private function favourite_project_count() {
		global $wpdb;
		$tb_projects = pm_tb_prefix() . 'pm_projects';
		$tb_meta     = pm_tb_prefix() . 'pm_meta';
		$current_user_id = get_current_user_id();

		$query = "SELECT COUNT($tb_projects.id) as favourite_project 
			FROM  $tb_projects
			LEFT JOIN $tb_meta ON $tb_meta.project_id = $tb_projects.id
			WHERE $tb_meta.meta_key = %s 
			AND $tb_meta.entity_id = %d
			AND $tb_meta.meta_value is not null";

		$favourite_project_count = $wpdb->get_var( $wpdb->prepare( $query, 'favourite_project', $current_user_id ) );

		return $favourite_project_count;

	}

	/**
	 * Format project data
	 *
	 * @param  Object $project
	 *
	 * @return array
	 */
	public function fromat_project( $project ) {
		$listmeta = pm_get_meta( $project->id, $project->id, 'task_list', 'list-inbox');

        if( $listmeta ) {
            $listmeta = $listmeta->meta_value;
        } else {
            $listmeta = 0;
		}

		$items = [
            'id'      	      	  => (int) $project->id,
			'title'   	  		  => isset( $project->title ) ? (string) $project->title : '',
			'description' 		  => isset( $project->description ) ? [ 'html' => pm_get_content( $project->description ), 'content' => $project->description ] : '',
			'status'	  		  => isset( $project->status ) ? $project->status : null,
			'budget'	  		  => isset( $project->budget ) ? $project->budget : null,
			'pay_rate'	  		  => isset( $project->pay_rate ) ? $project->pay_rate : null,
			'est_completion_date' => isset( $project->est_completion_date ) ? format_date( $project->est_completion_date ) : null,
			'order'				  => isset( $project->order ) ? $project->order : null,
			'projectable_type'	  => isset( $project->projectable_type ) ? $project->projectable_type : null,
			'favourite'	  		  => isset( $project->favourite ) ? $project->favourite : false,
			'created_at'		  => isset( $project->created_at ) ? format_date( $project->created_at ) : null,
			'list_inbox'		  => $listmeta,
        ];

		$select_items = empty( $this->query_params['select'] ) ? null : $this->query_params['select'];

		if ( ! is_array( $select_items ) && !is_null( $select_items ) ) {
			$select_items = str_replace( ' ', '', $select_items );
			$select_items = explode( ',', $select_items );
		}

		if ( empty( $select_items ) ) {
			$this->item_with($items,$project);
			$items = $this->item_meta( $items,$project );
			
			return $items;
		}

		foreach ( $items as $item_key => $item ) {
			if ( ! in_array( $item_key, $select_items ) ) {
				unset( $items[$item_key] );
			}
		}

		$this->item_with( $items,$project );
		$items = $this->item_meta( $items,$project );
		
		return $items;

	}


	private function item_with( &$items, $project ) {
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

		if ( ! is_array( $with ) ) {
			$with = explode( ',', $with );
		}

		$project_with_items =  array_intersect_key( (array) $project, array_flip( $with ) );
		$items = array_merge($items,$project_with_items);

		return $items;
	}

	private function item_meta( $items, $project ) {
		$meta = empty( $this->query_params['project_meta'] ) ? false : $this->query_params['project_meta'];

		if ( ! $meta ) {
			return $items;
		}

		$items['meta'] = empty( $project->meta ) ? ['data' => []] : ['data' => $project->meta];

		return $items;
	}


	/**
	 * Join others table information
	 *
	 * @return Object
	 */
	private function with() {
		$this->include_assignees()
			->include_categories();

		$this->projects = apply_filters( 'pm_project_with',$this->projects, $this->project_ids, $this->query_params );

		return $this;
	}

	private function meta() {
		$meta = empty( $this->query_params['project_meta'] ) ? false : $this->query_params['project_meta'];
		
		if ( ! $meta ) {
			return $this;
		}

		if ( $meta && !is_array( $meta ) && $meta != 'all' ) {
			$meta = explode( ',', $meta );
		}

		if ( $meta == 'all' ) {
			$this->project_task_list_count();
			$this->project_task_count();
			$this->project_task_complete();
			$this->project_incomplete_tasks();
			$this->project_discussion_board_count();
			$this->project_milestones_count();
			$this->project_comments_count();
			$this->project_files_count();
			$this->project_activities_count();
			$this->get_meta_tb_data();
			$this->set_project_favourite_status();

			return $this;
		}

		if ( in_array( 'total_task_lists', $meta ) ) {
			$this->project_task_list_count();
		}

		if ( in_array( 'total_tasks', $meta ) ) {
			$this->project_task_count();
		}

		if ( in_array( 'total_complete_tasks', $meta ) ) {
			$this->project_task_complete();
		}

		if ( in_array( 'total_incomplete_tasks', $meta ) ) {
			$this->project_incomplete_tasks();
		}

		if ( in_array( 'total_discussion_boards', $meta ) ) {
			$this->project_discussion_board_count();
		}

		if ( in_array( 'total_milestones', $meta ) ) {
			$this->project_milestones_count();
		}

		if ( in_array( 'total_comments', $meta ) ) {
			$this->project_comments_count();
		}

		if ( in_array('total_files', $meta ) ) {
			$this->project_files_count();
		}

		if ( in_array('total_activities', $meta) ) {
			$this->project_activities_count();
		}

		//if ( in_array('favourite', $meta) ) {
			$this->get_meta_tb_data();
		//}

		return $this;
	}

	private function set_project_favourite_status() {
		
		if ( empty( $this->project_ids ) ) {
			return $this;
		}

		global $wpdb;

		$metas           = [];
		$tb_projects     = pm_tb_prefix() . 'pm_projects';
		$tb_meta         = pm_tb_prefix() . 'pm_meta';
		$current_user_id = get_current_user_id();
		$project_format  = pm_get_prepare_format( $this->project_ids );
		$query_data      = $this->project_ids;

		$query = "SELECT DISTINCT $tb_meta.meta_key, $tb_meta.meta_value, $tb_meta.project_id
			FROM $tb_meta
			WHERE $tb_meta.project_id IN ($project_format)  
				AND $tb_meta.entity_type = %s
				AND $tb_meta.meta_key = %s
				AND $tb_meta.entity_id = %d";
		
		array_push( $query_data, 'project', 'favourite_project', $current_user_id );
		
		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		
		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			$metas[$project_id] = $result;
		}
		
		foreach ( $this->projects as $key => $project ) {
			if ( ! isset( $metas[$project->id] ) ) {
				$project->favourite = false;
				continue;
			}
			$project_meta = $metas[$project->id]; 
			$project->favourite = empty( $project_meta->meta_value ) ? false : true;
		}
		
		return $this;
	}

	private function get_meta_tb_data() {
		
		if ( empty( $this->project_ids ) ) {
			return $this;
		}

		global $wpdb;

		$metas          = [];
		$tb_projects    = pm_tb_prefix() . 'pm_projects';
		$tb_meta        = pm_tb_prefix() . 'pm_meta';
		$project_format = pm_get_prepare_format( $this->project_ids );
		$query_data     = $this->project_ids;

		$query = "SELECT DISTINCT $tb_meta.meta_key, $tb_meta.meta_value, $tb_meta.project_id, $tb_meta.entity_id
			FROM $tb_meta
			WHERE $tb_meta.project_id IN ($project_format)  
			AND $tb_meta.entity_type = %s";

		array_push( $query_data, 'project' );
		
		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		
		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			$metas[$project_id][] = $result;
		}

		foreach ( $this->projects as $key => $project ) {
			$filter_metas = empty( $metas[$project->id] ) ? [] : $metas[$project->id];
			foreach ( $filter_metas as $key => $filter_meta ) {
				$project->meta[$filter_meta->meta_key] = $filter_meta->meta_value;
			}
		}
		
		return $this;
	}

	private function project_incomplete_tasks() {

		if ( empty( $this->project_ids ) ) {
			return $this;
		}

		global $wpdb;

		$metas          = [];
		$tb_projects    = pm_tb_prefix() . 'pm_projects';
		$tb_task        = pm_tb_prefix() . 'pm_tasks';
		$project_format = pm_get_prepare_format( $this->project_ids );
		$query_data     = $this->project_ids;

		$query = "SELECT DISTINCT COUNT($tb_task.id) as task_count, $tb_task.project_id 
			FROM $tb_task
			WHERE $tb_task.project_id IN ($project_format)  
			AND $tb_task.status = %d
			GROUP by $tb_task.project_id";

		array_push( $query_data, 0 );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			$metas[$project_id] = $result->task_count;
		}

		foreach ( $this->projects as $key => $project ) {
			$project->meta['total_incomplete_tasks'] = empty( $metas[$project->id] ) ? 0 : $metas[$project->id];
		}

		return $this;
	}

	private function project_task_complete() {
		
		if ( empty( $this->project_ids ) ) {
			return $this;
		}

		global $wpdb;
		$metas          = [];
		$tb_projects    = pm_tb_prefix() . 'pm_projects';
		$tb_task        = pm_tb_prefix() . 'pm_tasks';
		$project_format = pm_get_prepare_format( $this->project_ids );
		$query_data     = $this->project_ids;

		$query = "SELECT DISTINCT COUNT($tb_task.id) as task_count, $tb_task.project_id 
			FROM $tb_task
			WHERE $tb_task.project_id IN ($project_format)  
			AND $tb_task.status = %d
			GROUP by $tb_task.project_id";

		array_push( $query_data, 1 );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			$metas[$project_id] = $result->task_count;
		}

		foreach ( $this->projects as $key => $project ) {
			$project->meta['total_complete_tasks'] = empty( $metas[$project->id] ) ? 0 : $metas[$project->id];
		}

		return $this;
	}

	public function get_prepare_format( $ids, $is_string = false ) {

		if ( ! is_array( $ids ) ) {
			if ( strpos( $ids, ',' ) !== false ) {
				$ids = str_replace( ' ', '', $ids );
				$ids = explode( ',', $ids );
			}
		}
		
        // how many entries will we select?
        $how_many = count( $ids );

        // prepare the right amount of placeholders
        // if you're looing for strings, use '%s' instead
        if( $is_string ) {
            $placeholders = array_fill( 0, $how_many, '%s' );
        } else {
            $placeholders = array_fill( 0, $how_many, '%d' );
        }

        // glue together all the placeholders...
        // $format = '%d, %d, %d, %d, %d, [...]'
        $format = implode( ', ', $placeholders );

        return $format;
    }

	private function project_task_count() {
		
		if ( empty( $this->project_ids ) ) {
			return $this;
		}

		global $wpdb;

		$metas          = [];
		$tb_projects    = pm_tb_prefix() . 'pm_projects';
		$tb_task        = pm_tb_prefix() . 'pm_tasks';
		$project_format = pm_get_prepare_format( $this->project_ids );
		$query_data     = $this->project_ids;

		$query = "SELECT DISTINCT COUNT(pt.id) as task_count, pt.project_id 
			FROM $tb_task as pt
			WHERE pt.project_id IN ($project_format)
			GROUP by pt.project_id";

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			$metas[$project_id] = $result->task_count;
		}

		foreach ( $this->projects as $key => $project ) {
			$project->meta['total_tasks'] = empty( $metas[$project->id] ) ? 0 : $metas[$project->id];
		}

		return $this;
	}

	private function project_task_list_count() {
		
		if ( empty( $this->project_ids ) ) {
			return $this;
		}

		global $wpdb;

		$metas          = [];
		$tb_projects    = pm_tb_prefix() . 'pm_projects';
		$tb_boards      = pm_tb_prefix() . 'pm_boards';
		$project_format = pm_get_prepare_format( $this->project_ids );
		$query_data     = $this->project_ids;

		$query = "SELECT DISTINCT COUNT(pb.id) as task_list_count ,  project_id
				FROM $tb_boards as pb
				WHERE pb.project_id IN ($project_format)
				AND pb.type=%s
				GROUP BY pb.project_id";

		array_push( $query_data, 'task_list' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data )  );

		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			$metas[$project_id] = $result->task_list_count;
		}

		foreach ( $this->projects as $key => $project ) {
			$project->meta['total_task_lists'] = empty( $metas[$project->id] ) ? 0 : $metas[$project->id];
		}

		return $this;
	}

	private function project_discussion_board_count() {
		
		if ( empty( $this->project_ids ) ) {
			return $this;
		}

		global $wpdb;

		$metas          = [];
		$tb_projects    = pm_tb_prefix() . 'pm_projects';
		$tb_boards      = pm_tb_prefix() . 'pm_boards';
		$project_format = pm_get_prepare_format( $this->project_ids );
		$query_data     = $this->project_ids;

		$query = "SELECT DISTINCT COUNT(pb.id) as discussion_count ,  project_id
				FROM $tb_boards as pb
				WHERE pb.project_id IN ($project_format)
				AND pb.type=%s
				GROUP BY pb.project_id";

		array_push( $query_data, 'discussion_board' );

		$results = $wpdb->get_results( $wpdb->prepare( $query,  $query_data ) );

		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			$metas[$project_id] = $result->discussion_count;
		}

		foreach ( $this->projects as $key => $project ) {
			$project->meta['total_discussion_boards'] = empty( $metas[$project->id] ) ? 0 : $metas[$project->id];
		}

		return $this;
	}


	private function project_comments_count() {
		
		if ( empty( $this->project_ids ) ) {
			return $this;
		}

		global $wpdb;

		$metas          = [];
		$tb_projects    = pm_tb_prefix() . 'pm_projects';
		$tb_comments    = pm_tb_prefix() . 'pm_comments';
		$project_format = pm_get_prepare_format( $this->project_ids );
		$query_data     = $this->project_ids;

		$query = "SELECT DISTINCT COUNT(pcm.id) as comment_count , project_id
			FROM $tb_comments as pcm
			WHERE pcm.project_id IN ($project_format)
			GROUP BY pcm.project_id";

		$results = $wpdb->get_results( $wpdb->prepare( $query,  $query_data ) );

		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			$metas[$project_id] = $result->comment_count;
		}

		foreach ( $this->projects as $key => $project ) {
			$project->meta['total_comments'] = empty( $metas[$project->id] ) ? 0 : $metas[$project->id];
		}

		return $this;
	}

	/**
	 * Project Milestone Count
	 *
	 * @return class
	 */
	private function project_milestones_count() {

		if ( empty( $this->project_ids ) ) {
			return $this;
		}

		global $wpdb;

		$metas          = [];
		$tb_projects    = pm_tb_prefix() . 'pm_projects';
		$tb_boards      = pm_tb_prefix() . 'pm_boards';
		$project_format = pm_get_prepare_format( $this->project_ids );
		$query_data     = $this->project_ids;

		$query = "SELECT DISTINCT COUNT(pb.id) as milestones_count ,  project_id
				FROM $tb_boards as pb
				WHERE pb.project_id IN ($project_format)
				AND pb.type=%s
				GROUP BY pb.project_id";

		array_push( $query_data, 'milestone' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			$metas[$project_id] = $result->milestones_count;
		}

		foreach ( $this->projects as $key => $project ) {
			$project->meta['total_milestones'] = empty( $metas[$project->id] ) ? 0 : $metas[$project->id];
		}

		return $this;
	}

	/**
	 *  Project Total Files Count
	 *
	 * @return class object
	 */
	private function project_files_count() {
		
		if ( empty( $this->project_ids ) ) {
			return $this;
		}

		global $wpdb;

		$metas          = [];
		$tb_projects    = pm_tb_prefix() . 'pm_projects';
		$tb_files       = pm_tb_prefix() . 'pm_files';
		$project_format = pm_get_prepare_format( $this->project_ids );
		$query_data     = $this->project_ids;

		$query = "SELECT DISTINCT COUNT(pf.id) as file_count , project_id
			FROM $tb_files as pf
			WHERE pf.project_id IN ($project_format)
			GROUP BY pf.project_id";

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			$metas[$project_id] = $result->file_count;
		}

		foreach ( $this->projects as $key => $project ) {
			$project->meta['total_files'] = empty( $metas[$project->id] ) ? 0 : $metas[$project->id];
		}

		return $this;
	}

	/**
	 *  Project Total Activities Count
	 *
	 * @return class object
	 */
	private function project_activities_count() {

		if ( empty( $this->project_ids ) ) {
			return $this;
		}

		global $wpdb;

		$metas = [];
		$tb_projects    = pm_tb_prefix() . 'pm_projects';
		$tb_activites   = pm_tb_prefix() . 'pm_activities';
		$project_format = pm_get_prepare_format( $this->project_ids );
		$query_data     = $this->project_ids;

		$query = "SELECT DISTINCT COUNT(pma.id) as activity_count , project_id
			FROM $tb_activites as pma
			WHERE pma.project_id IN ($project_format)
			GROUP BY pma.project_id";

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );


		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			$metas[$project_id] = $result->activity_count;
		}

		foreach ( $this->projects as $key => $project ) {
			$project->meta['total_activities'] = empty( $metas[$project->id] ) ? 0 : $metas[$project->id];
		}

		return $this;
	}

	/**
	 * Choose table select item
	 *
	 * @param  string $tb
	 * @param  string $key
	 *
	 * @return string
	 */
	private function get_selectable_items( $tb, $key ) {
		$select       = '';
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

	/**
	 * Set project categories
	 *
	 * @return class object
	 */
	private function include_categories() {
		global $wpdb;
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

		if ( ! is_array( $with ) ) {
			$with = explode( ',', $with );
		}

		$category = [];

		if ( ! in_array( 'categories', $with ) || empty( $this->project_ids ) ) {
			return $this;
		}

		$tb_categories  = pm_tb_prefix() . 'pm_categories';
		$tb_relation    = pm_tb_prefix() . 'pm_category_project';
		$project_format = pm_get_prepare_format( $this->project_ids );
		$query_data     = $this->project_ids;

		$query = "SELECT cats.id as id, cats.title, cats.description, rel.project_id
			FROM $tb_categories as cats
			LEFT JOIN $tb_relation as rel ON rel.category_id = cats.id
			where rel.project_id IN ($project_format) 
			AND cats.categorible_type=%s";

		array_push( $query_data, 'project' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			$category[$project_id] = $result;
		}

		foreach ( $this->projects as $key => $project ) {
			$project->categories['data'] = empty( $category[$project->id] ) ? [] : [$category[$project->id]];
		}

		return $this;
	}

	private function roles( $id ) {
		$roles = [
			1 => [
				'id'          => 1,
				'title'       => 'Manager',
				'slug'        => 'manager',
				'description' => 'Manager is a person who manages the project.'
			],
			2 => [
				'id'          => 2,
				'title'       => 'Co Worker',
				'slug'        => 'co_worker',
				'description' => 'Co-worker is person who works under a project.'
			],
			3 => [
				'id'          => 3,
				'title'       => 'Client',
				'slug'        => 'client',
				'description' => 'Client is a person who provid the project.'
			]
		];

		return isset( $roles[$id] ) ? $roles[$id] : false;
	}

	/**
	 * Set project ssignees
	 *
	 * @return class object
	 */
	private function include_assignees() {
		global $wpdb;
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

		if ( ! is_array( $with ) ) {
			$with = explode( ',', $with );
		}

		$users = [];

		if ( ! in_array( 'assignees', $with ) || empty( $this->project_ids ) ) {
			return $this;
		}

		$tb_assignees   = pm_tb_prefix() . 'pm_role_user';
		$tb_users       = $wpdb->base_prefix . 'users';
		$tb_user_meta   = $wpdb->base_prefix . 'usermeta';
		$project_format = pm_get_prepare_format( $this->project_ids );
		$query_data     = $this->project_ids;

		if ( is_multisite() ) {
			$meta_key = pm_user_meta_key();

			$query = "SELECT DISTINCT usr.ID as id, usr.display_name, usr.user_email as email, asin.project_id, asin.role_id
				FROM $tb_users as usr
				LEFT JOIN $tb_assignees as asin ON usr.ID = asin.user_id
				LEFT JOIN $tb_user_meta as umeta ON umeta.user_id = usr.ID
				where asin.project_id IN ($project_format) 
				AND umeta.meta_key='$meta_key'";
		} else {
			$query = "SELECT DISTINCT usr.ID as id, usr.display_name, usr.user_email as email, asin.project_id, asin.role_id
				FROM $tb_users as usr
				LEFT JOIN $tb_assignees as asin ON usr.ID = asin.user_id
				where asin.project_id IN ($project_format)";
		} 

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		
		foreach ( $results as $key => $result ) {
			$project_id = $result->project_id;
			unset( $result->project_id );
			
			$result->avatar_url = get_avatar_url( $result->id );
			$result->roles = [
				'data' => [$this->roles($result->role_id)] 
			];

			$users[$project_id][] = $result;
		}
		
		foreach ( $this->projects as $key => $project ) {
			$project->assignees['data'] = empty( $users[$project->id] ) ? [] : $users[$project->id];
		}

		return $this;
	}

	private function select() {
		global $wpdb;

		$select = '';

		if ( empty( $this->query_params['select'] ) ) {
			$this->select = $this->tb_project . ".*, {$wpdb->prefix}pm_meta.meta_value";

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

		$this->select = "{$wpdb->prefix}pm_meta.meta_value, " . substr( $select, 0, -1 );

		return $this;
	}

	private function join() {
		global $wpdb;
		$current_user_id = get_current_user_id();

		$this->join .= $wpdb->prepare(" 
			LEFT JOIN {$wpdb->prefix}pm_meta 
			ON {$wpdb->prefix}pm_meta.project_id={$wpdb->prefix}pm_projects.id
				AND {$wpdb->prefix}pm_meta.meta_key=%s 
				AND {$wpdb->prefix}pm_meta.entity_id=%d", 
			
			'favourite_project', $current_user_id 
		);
		
		$this->join .= " LEFT JOIN {$wpdb->prefix}pm_role_user ON {$wpdb->prefix}pm_role_user.project_id={$wpdb->prefix}pm_projects.id";
		
		$this->join = apply_filters( 'pm_project_join_query', $this->join, $this->query_params );

		return $this;
	}

	/**
	 * Set project where condition
	 *
	 * @return class object
	 */
	private function where() {

		$this->where_id()
			->where_category()
			->where_users()
			->where_title()
			->where_status();
		
		$this->where = apply_filters( 'pm_project_where_query', $this->where, $this->query_params );

		return $this;
	}

	/**
	 * Filter project by ID
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
			$query_format = pm_get_prepare_format( $id );
			$this->where .= $wpdb->prepare( " AND {$this->tb_project}.id IN ($query_format)", $id );
		}

		if ( !is_array( $id ) ) {
			$this->where .= $wpdb->prepare( " AND {$this->tb_project}.id IN (%d)", $id );

			$explode = explode( ',', $id );

			if ( count( $explode ) == 1 ) {
				$this->is_single_query = true;
			}
		}

		return $this;
	}

	/**
	 * Filter porject by status
	 *
	 * @return class object
	 */
	private function where_status() {
		global $wpdb;
		$status = isset( $this->query_params['status'] ) ? $this->query_params['status'] : false;

		if ( empty( $status ) ) {
			return $this;
		}

		if ( $status == 'favourite' ) {
			$current_user_id = get_current_user_id();
			
			$this->where .= $wpdb->prepare( " 
				AND {$wpdb->prefix}pm_meta.entity_id=%d
				AND {$wpdb->prefix}pm_meta.meta_value IS NOT NULL
				AND {$wpdb->prefix}pm_meta.meta_key=%s", 
				$current_user_id, 'favourite_project'
			);
		
		} else {
			$attr = [
				'incomplete' => 0,
				'complete'   => 1,
				'pending'    => 2,
				'archived'   => 3
			];

			if ( gettype( $status ) == 'string' ) {
				$status = $attr[$status];
			}
			$this->where .= $wpdb->prepare( " AND {$this->tb_project}.status=%d", $status );
		}

		return $this;
	}

	/**
	 * Filter project by title
	 *
	 * @return class object
	 */
	private function where_title() {
		global $wpdb;
		$title = isset( $this->query_params['title'] ) ? $this->query_params['title'] : false;

		if ( empty( $title ) ) {
			return $this;
		}

		$this->where .= $wpdb->prepare( " AND {$this->tb_project}.title LIKE %s", '%'.$title.'%' );

		return $this;
	}

	/**
	 * Filter project by users
	 *
	 * @return class object
	 */
	private function where_users() {
		global $wpdb;
		$inUsers = isset( $this->query_params['inUsers'] ) ? $this->query_params['inUsers'] : false;

		if ( empty( $inUsers ) ) {
			
			if ( pm_has_manage_capability( get_current_user_id() ) ) {
				return $this;
			}

			$inUsers = get_current_user_id();
		}

		//$this->join  .= " LEFT JOIN {$this->tb_project_user} ON {$this->tb_project_user}.project_id={$this->tb_project}.id";

		if ( is_array( $inUsers ) ) {
			$query_format = pm_get_prepare_format( $inUsers );
			$this->where .= $wpdb->prepare( " AND {$this->tb_project_user}.user_id IN ($query_format)", $inUsers );
		
		} else {
			$this->where .= $wpdb->prepare( " AND {$this->tb_project_user}.user_id IN (%d)", $inUsers );
		}
		
		return $this;
	}

	/**
	 * Filter project by category
	 *
	 * @return class object
	 */
	private function where_category() {
		global $wpdb;
		$category = isset( $this->query_params['category'] ) ? $this->query_params['category'] : false;

		if ( empty( $category ) ) {
			return $this;
		}
		
		$this->join  .= " LEFT JOIN {$this->tb_category_project} ON {$this->tb_category_project}.project_id={$this->tb_project}.id";

		if ( is_array( $category ) ) {
			$query_format = pm_get_prepare_format( $category );
			$this->where .= $wpdb->prepare( " AND {$this->tb_category_project}.category_id IN ($query_format)", $category );	
		} else {
			$this->where .= $wpdb->prepare( " AND {$this->tb_category_project}.category_id IN (%d)", $category );
		}
		

		return $this;
	}

	/**
	 * Generate project query limit
	 *
	 * @return class object
	 */
	private function limit() {
		global $wpdb;
		$per_page = isset( $this->query_params['per_page'] ) ? $this->query_params['per_page'] : false;

		if ( $per_page === false || $per_page == '-1' ) {
			return $this;
		}

		$this->limit = $wpdb->prepare( " LIMIT %d,%d", $this->get_offset(), $this->get_per_page() );

		return $this;
	}

	private function orderby() {
        global $wpdb;

		$tb_pj    = $wpdb->prefix . 'pm_projects';
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

        $this->orderby = "ORDER BY {$wpdb->prefix}pm_meta.meta_value DESC, " . implode( ', ', $order);

        return $this;
    }

	/**
	 * Get offset
	 *
	 * @return int
	 */
	private function get_offset() {
		$page   = isset( $this->query_params['page'] ) ? $this->query_params['page'] : false;
		$page   = empty( $page ) ? 1 : absint( $page );
		$limit  = $this->get_per_page();
		$offset = ( $page - 1 ) * $limit;

		return $offset;
	}

	/**
	 * Get the number for projects per page
	 *
	 * @return class instance
	 */
	private function get_per_page() {
		$per_page = isset( $this->query_params['per_page'] ) ? $this->query_params['per_page'] : false;

		if ( ! empty( $per_page ) && intval( $per_page ) ) {
			return (int) $per_page;
		}

		$per_page = pm_get_setting( 'project_per_page' );

		return empty( $per_page ) ? 10 : (int) $per_page;

		return 10;
	}

	/**
	 * Execute the projects query
	 *
	 * @return class instance
	 */
	private function get() {
		global $wpdb;
		$id = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false;
		
		$query = "SELECT SQL_CALC_FOUND_ROWS DISTINCT {$this->select}
			FROM 
				{$this->tb_project}
				{$this->join}
			WHERE %d=%d 
				{$this->where}
				{$this->orderby}
				{$this->limit}";
		
		$results = $wpdb->get_results( $wpdb->prepare( $query, 1, 1 ) );
		
		$this->found_rows = $wpdb->get_var( "SELECT FOUND_ROWS()" );

		$this->projects   = $results;

		if ( ! empty( $results ) && is_array( $results ) ) {
			$this->project_ids = wp_list_pluck( $results, 'id' );
		}

		if ( ! empty( $results ) && !is_array( $results ) ) {
			$this->project_ids = [$results->id];
		}

		return $this;
	}

	/**
	 * Set table name as class object
	 */
	private function set_table_name() {
		$this->tb_project          = pm_tb_prefix() . 'pm_projects';
		$this->tb_list             = pm_tb_prefix() . 'pm_boards';
		$this->tb_task             = pm_tb_prefix() . 'pm_tasks';
		$this->tb_project_user     = pm_tb_prefix() . 'pm_role_user';
		$this->tb_task_user        = pm_tb_prefix() . 'pm_assignees';
		$this->tb_categories       = pm_tb_prefix() . 'pm_categories';
		$this->tb_category_project = pm_tb_prefix() . 'pm_category_project';
	}
}
