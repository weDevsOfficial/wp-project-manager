<?php
namespace WeDevs\PM\Task_List\Helper;

use WeDevs\PM\Milestone\Helper\Milestone;
use WeDevs\PM\task\Helper\Task;
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
//  list_meta: 'total_task_lists,total_tasks,total_complete_tasks,total_incomplete_tasks,total_$this->list_ids,total_milestones,total_comments,total_files,total_activities'
// },

class Task_List {
	private static $_instance;
	private $query_params;
	private $select;
	private $join;
	private $where;
	private $limit;
	private $orderby;
	private $with = ['creator', 'updater', 'milestone'];
	private $lists;
	private $list_ids;
	private $is_single_query = false;

	public static function getInstance() {
        return new self();
    }

    function __construct() {
    	$this->set_table_name();
    }

    public static function get_task_lists( WP_REST_Request $request ) {
		$lists = self::get_results( $request->get_params() );

		wp_send_json( $lists );
	}

	public static function get_results( $params ) {
		$self = self::getInstance();
		$self->query_params = $params;

		$self->join()
			->where()
			->limit()
			->orderby()
			->get()
			->with()
			->meta();

		$response = $self->format_tasklists( $self->lists );

		if ( pm_is_single_query( $params ) ) {
			return ['data' => $response['data'][0]] ;
		}

		return $response;
	}

	/**
	 * Format TaskList data
	 *
	 * @param array $tasklists
	 *
	 * @return array
	 */
	public function format_tasklists( $tasklists ) {
		$response = [
			'data' => [],
			'meta' => []
		];

		foreach ( $tasklists as $key => $tasklist ) {
			$tasklists[$key] = $this->fromat_tasklist( $tasklist );
		}

		$response['data']  = $tasklists;
		$response ['meta'] = $this->set_tasklist_meta();

		return $response;
	}

	/**
	 * Set meta data
	 */
	private function set_tasklist_meta() {
		return [
			'pagination' => [
				'total'    => $this->found_rows,
				'per_page' => ceil( $this->found_rows/$this->get_per_page() )
			]
		];
	}

	public function fromat_tasklist( $tasklist ) {
		$items = [
			'id'          => (int) $tasklist->id,
			'title'       => isset( $tasklist->title ) ? (string) $tasklist->title : null,
			'description' => isset( $tasklist->description ) ? pm_filter_content_url( $tasklist->description ) : null,
			'order'       => isset( $tasklist->order ) ? (int) $tasklist->order : null,
			'status'      => isset( $tasklist->status ) ? $tasklist->status : null,
			'created_at'  => isset( $tasklist->status ) ?  format_date( $tasklist->created_at ) : null,
			'extra'       => true,
			'project_id'  => isset( $tasklist->project_id ) ?  $tasklist->project_id : null,
			'meta'        => $tasklist->meta
        ];

		$items = $this->item_with( $items, $tasklist );
		
		return $items;
	}

	private function item_with( $items, $tasklist ) {
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

		if ( ! is_array( $with ) ) {
			$with = explode( ',', $with );
		}

		$with = array_merge( $this->with, $with );

		$tasklist_with_items =  array_intersect_key( (array) $tasklist, array_flip( $with ) );

		$items = array_merge($items,$tasklist_with_items);

		return $items;
	}

	private function with() {
		$this->milestone()
			->complete_tasks()
			->incomplete_tasks()
			->creator()
			->updater()
			->comments()
			->files();
			
		$this->lists = apply_filters( 'pm_tasklist_with',$this->lists, $this->list_ids, $this->query_params );

		return $this;
	}

	private function comments() {
		global $wpdb;

		if ( empty( $this->list_ids ) ) {
			return $this;
		}

		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', str_replace(' ', '', $with ) );
		}

		if ( ! in_array( 'comments', $with ) || empty( $this->list_ids ) ) {
			return $this;
		}

		$tb_comments = pm_tb_prefix() . 'pm_comments';
		$list_format = pm_get_prepare_format( $this->list_ids );
		$query_data  = $this->list_ids;

		$query ="SELECT DISTINCT com.id as comment_id, com.commentable_id as list_id
			FROM $tb_comments as com
			WHERE com.commentable_id IN ($list_format)
			AND com.commentable_type = %s
		";

		array_push( $query_data, 'task_list' );
		
		$results  = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$comment_ids = wp_list_pluck( $results, 'comment_id' );
		
		$comments = Comment::get_results([
			'id' => array_unique( $comment_ids )
		]);

		$comments     = empty( $comments['data']['id'] ) ? $comments['data'] : [$comments['data']];
		$key_comments = [];
		$items        = [];

        foreach ( $comments as $key => $comment ) {
        	if ( empty( $comment['id'] ) ) {
        		continue;
        	}

            $key_comments[$comment['id']] = $comment;
        }

        foreach ( $results as $key => $result ) {
            $items[$result->list_id][] = $key_comments[$result->comment_id];
        }
        
        foreach ( $this->lists as $key => $list ) {
            $list->comments['data'] = empty( $items[$list->id] ) ? [] : $items[$list->id];
        }
        
        return $this;
	}

	private function files() {
		global $wpdb;

		if ( empty( $this->list_ids ) ) {
			return $this;
		}

		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', str_replace(' ', '', $with ) );
		}

		if ( ! in_array( 'files', $with ) || empty( $this->list_ids ) ) {
			return $this;
		}

		$tb_files     = pm_tb_prefix() . 'pm_files';
		$list_format  = pm_get_prepare_format( $this->list_ids );
		$query_data   = $this->list_ids;

		$query = "SELECT DISTINCT fil.id as file_id,
			fil.fileable_id as list_id
			FROM $tb_files as fil
			where fil.fileable_id IN ($list_format)
			AND fil.fileable_type=%s";

		array_push( $query_data, 'task_list' );
		
		$results  = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$file_ids = wp_list_pluck( $results, 'file_id' );
		
		$files = File::get_results([
			'id' => array_unique( $file_ids )
		]);

		$files     = empty( $files['data']['id'] ) ? $files['data'] : [$files['data']];
		$key_files = [];
		$items     = [];

        foreach ( $files as $key => $file ) {
        	if ( empty( $file['id'] ) ) {
        		continue;
        	}

            $key_files[$file['id']] = $file;
        }

        foreach ( $results as $key => $result ) {
            $items[$result->list_id][] = $key_files[$result->file_id];
        }
        
        foreach ( $this->lists as $key => $list ) {
            $list->files['data'] = empty( $items[$list->id] ) ? [] : $items[$list->id];
        }
        
        return $this;
	}

	private function complete_tasks() {
		global $wpdb;

		if ( empty( $this->list_ids ) ) {
			return $this;
		}

		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', str_replace(' ', '', $with ) );
		}

		if ( ! in_array( 'complete_tasks', $with ) || empty( $this->list_ids ) ) {
			return $this;
		}

		$tb_boardable = pm_tb_prefix() . 'pm_boardables';
		$tb_tasks     = pm_tb_prefix() . 'pm_tasks';
		$list_format  = pm_get_prepare_format( $this->list_ids );
		$query_data   = $this->list_ids;

		$query = "SELECT DISTINCT bor.board_id as list_id,
				bor.boardable_id as task_id
			FROM $tb_boardable as bor
				LEFT JOIN $tb_tasks as tk ON tk.id=bor.boardable_id
			where 1=1 
				AND bor.board_id IN ($list_format)
				AND bor.board_type=%s
				AND bor.boardable_type=%s
				AND tk.status=%s";

		array_push( $query_data, 'task_list', 'task', '1' );
		
		$results  = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$task_ids = wp_list_pluck( $results, 'task_id' );
		
		$tasks = Task::get_results([
			'id' => array_unique( $task_ids )
		]);

		$tasks     = empty( $tasks['data']['id'] ) ? $tasks['data'] : [$tasks['data']];
		$key_tasks = [];
		$items     = [];

        foreach ( $tasks as $key => $task ) {
        	if ( empty( $task['id'] ) ) {
        		continue;
        	}

            $key_tasks[$task['id']] = $task;
        }

        foreach ( $results as $key => $result ) {
            $items[$result->list_id][] = $key_tasks[$result->task_id];
        }
        
        foreach ( $this->lists as $key => $list ) {
            $list->complete_tasks['data'] = empty( $items[$list->id] ) ? [] : $items[$list->id];
        }
        
        return $this;
	}

	private function incomplete_tasks() {
		global $wpdb;

		if ( empty( $this->list_ids ) ) {
			return $this;
		}

		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', str_replace(' ', '', $with ) );
		}

		if ( ! in_array( 'incomplete_tasks', $with ) || empty( $this->list_ids ) ) {
			return $this;
		}

		$tb_boardable = pm_tb_prefix() . 'pm_boardables';
		$tb_tasks     = pm_tb_prefix() . 'pm_tasks';
		$list_format  = pm_get_prepare_format( $this->list_ids );
		$query_data   = $this->list_ids;

		$query = "SELECT DISTINCT bor.board_id as list_id,
				bor.boardable_id as task_id
			FROM $tb_boardable as bor
				LEFT JOIN $tb_tasks as tk ON tk.id=bor.boardable_id
			where 1=1 
				AND bor.board_id IN ($list_format)
				AND bor.board_type=%s
				AND bor.boardable_type=%s
				AND tk.status=%s";

		array_push( $query_data, 'task_list', 'task', '0' );
		
		$results  = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$task_ids = wp_list_pluck( $results, 'task_id' );
		
		$tasks = Task::get_results([
			'id' => array_unique( $task_ids )
		]);

		$tasks     = empty( $tasks['data']['id'] ) ? $tasks['data'] : [$tasks['data']];
		$key_tasks = [];
		$items     = [];

        foreach ( $tasks as $key => $task ) {
        	if ( empty( $task['id'] ) ) {
        		continue;
        	}

            $key_tasks[$task['id']] = $task;
        }

        foreach ( $results as $key => $result ) {
            $items[$result->list_id][] = $key_tasks[$result->task_id];
        }
        
        foreach ( $this->lists as $key => $list ) {
            $list->incomplete_tasks['data'] = empty( $items[$list->id] ) ? [] : $items[$list->id];
        }
        
        return $this;
	}

	private function milestone() {
		global $wpdb;

		if ( empty( $this->list_ids ) ) {
			return $this;
		}

		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', str_replace(' ', '', $with ) );
		}

		if ( ! in_array( 'milestone', $with ) || empty( $this->list_ids ) ) {
			return $this;
		}

		$tb_boardable   = pm_tb_prefix() . 'pm_boardables';
		$list_format = pm_get_prepare_format( $this->list_ids );
		$query_data     = $this->list_ids;

		$query = "SELECT DISTINCT bor.boardable_id as list_id,
			bor.board_id as milestone_id
			FROM $tb_boardable as bor
			where bor.boardable_id IN ($list_format)
			AND bor.board_type=%s
			AND bor.boardable_type=%s";

		array_push( $query_data, 'milestone', 'task_list' );
		
		$results       = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$milestone_ids = wp_list_pluck( $results, 'milestone_id' );
		
		$milestones = Milestone::get_results([
			'id' => array_unique( $milestone_ids )
		]);

		$milestones     = empty( $milestones['data']['id'] ) ? $milestones['data'] : [$milestones['data']];
		$key_milestones = [];
		$items          = [];

        foreach ( $milestones as $key => $milestone ) {
            $key_milestones[$milestone['id']] = $milestone;
        }

        foreach ( $results as $key => $result ) {
            $items[$result->list_id] = $key_milestones[$result->milestone_id];
        }
        
        foreach ( $this->lists as $key => $list ) {
            $list->milestone['data'] = empty( $items[$list->id] ) ? [] : $items[$list->id];
        }

        return $this;
	}

	private function creator() {
		if ( empty( $this->list_ids ) ) {
			return $this;
		}

		$creator_ids = wp_list_pluck( $this->lists, 'created_by' );
		$creator_ids = array_unique( $creator_ids );

		$creators = pm_get_users( [ 'id' => $creator_ids ] );
		$creators = $creators['data'];
		
		$items = []; 
		
		foreach ( $creators as $key => $creator ) {
			$items[$creator['id']] = $creator;
		}

		foreach ( $this->lists as $key => $list ) {
			$l_creator = empty( $items[$list->created_by] ) ? [] : $items[$list->created_by];

			$list->creator = [ 'data' => $l_creator ];
		}

		return $this;
	}

	private function updater() {

        if ( empty( $this->list_ids ) ) {
			return $this;
		}

		$updater_ids = wp_list_pluck( $this->lists, 'updated_by' );
		$updater_ids = array_unique( $updater_ids );

		$updaters = pm_get_users( [ 'id' => $updater_ids ] );
		$updaters = $updaters['data'];
		
		$items = []; 
		
		foreach ( $updaters as $key => $updater ) {
			$items[$updater['id']] = $updater;
		}

		foreach ( $this->lists as $key => $list ) {
			$l_updater = empty( $items[$list->updated_by] ) ? [] : $items[$list->updated_by];

			$list->updater = [ 'data' => $l_updater ];
		}

		return $this;
	}

	private function meta() {
		
			$this->get_meta_tb_data()
				->total_tasks_count()
				->total_complete_tasks_count()
				->total_incomplete_tasks_count()
				->total_comments_count()
				->total_assignees_count();

		return $this;
	}

	private function get_meta_tb_data() {
		if ( empty( $this->list_ids ) ) {
			return $this;
		}
        global $wpdb;
		$metas           = [];
		$tb_projects     = pm_tb_prefix() . 'pm_projects';
		$tb_meta         = pm_tb_prefix() . 'pm_meta';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

        $query = "SELECT DISTINCT $tb_meta.meta_key, $tb_meta.meta_value, $tb_meta.entity_id
            FROM $tb_meta
            WHERE $tb_meta.entity_id IN ($tasklist_format)
            AND $tb_meta.entity_type = %s ";

        array_push( $query_data, 'task_list' );

        $results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

        foreach ( $results as $key => $result ) {
            $list_id = $result->entity_id;
            unset( $result->entity_id );
            $metas[$list_id][] = $result;
        }

        foreach ( $this->lists as $key => $list ) {
            $filter_metas = empty( $metas[$list->id] ) ? [] : $metas[$list->id];

            foreach ( $filter_metas as $key => $filter_meta ) {
                $list->meta[$filter_meta->meta_key] = $filter_meta->meta_value;
            }
        }

        return $this;
    }

	private function total_tasks_count() {
		global $wpdb;
		$metas           = [];
		$tb_tasks        = pm_tb_prefix() . 'pm_tasks';
		$tb_boardable    = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

		$query ="SELECT DISTINCT count($tb_tasks.id) as task_count, $tb_boardable.board_id as list_id 
			FROM $tb_tasks
			LEFT JOIN $tb_boardable ON $tb_boardable.boardable_id = $tb_tasks.id
			WHERE $tb_boardable.board_id IN ($tasklist_format)
			AND $tb_boardable.boardable_type=%s
			AND $tb_boardable.board_type=%s
			group by $tb_boardable.board_id
		";

		array_push( $query_data, 'task', 'task_list' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->task_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['total_tasks'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
		}

		return $this;
	}

	private function  total_complete_tasks_count() {
		global $wpdb;
		$metas           = [];
		$tb_tasks        = pm_tb_prefix() . 'pm_tasks';
		$tb_boardable    = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

		$query ="SELECT DISTINCT count($tb_tasks.id) as task_count, $tb_boardable.board_id as list_id FROM $tb_tasks
			LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_tasks.id
			WHERE $tb_boardable.board_id IN ($tasklist_format)
			AND $tb_boardable.boardable_type=%s
			AND $tb_boardable.board_type=%s
			AND $tb_tasks.status = %d
			group by $tb_boardable.board_id
		";

		array_push( $query_data, 'task', 'task_list', '1' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->task_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['total_complete_tasks'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
		}

		return $this;
	}

	private function total_incomplete_tasks_count() {
		global $wpdb;
		$metas           = [];
		$tb_tasks        = pm_tb_prefix() . 'pm_tasks';
		$tb_boardable    = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

		$query ="SELECT DISTINCT count($tb_tasks.id) as task_count, $tb_boardable.board_id as list_id FROM $tb_tasks
			LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_tasks.id
			WHERE $tb_boardable.board_id IN ($tasklist_format)
			AND $tb_boardable.boardable_type=%s
			AND $tb_boardable.board_type=%s
			AND $tb_tasks.status = %d
			group by $tb_boardable.board_id
		";

		array_push( $query_data, 'task', 'task_list', '0' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->task_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['total_incomplete_tasks'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
		}

		return $this;
	}

	private function total_comments_count() {
		global $wpdb;
		$metas           = [];
		$tb_pm_comments  = pm_tb_prefix() . 'pm_comments';
		$tb_boards       = pm_tb_prefix() . 'pm_boards';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

		$query ="SELECT DISTINCT count($tb_pm_comments.id) as comment_count,
		$tb_boards.id as list_id FROM $tb_pm_comments
			LEFT JOIN $tb_boards  ON $tb_boards.id = $tb_pm_comments.commentable_id
			WHERE $tb_boards.id IN ($tasklist_format)
			AND $tb_pm_comments.commentable_type = %s
			group by $tb_boards.id
		";

		array_push( $query_data, 'task_list' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->comment_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['total_comments'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
		}

		return $this;
	}

	private function total_assignees_count() {
		global $wpdb;
		$metas           = [];
		$tb_users       = $wpdb->base_prefix . 'users';
		$tb_user_meta   = $wpdb->base_prefix . 'usermeta';
		$tb_boardable    = pm_tb_prefix() . 'pm_boardables';
		$tasklist_format = pm_get_prepare_format( $this->list_ids );
		$query_data      = $this->list_ids;

		if ( is_multisite() ) {
			$meta_key = pm_user_meta_key();

			$query ="SELECT DISTINCT count($tb_users.id) as user_count,
				$tb_boardable.board_id as list_id 
				FROM $tb_users
					LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_users.ID
					LEFT JOIN $tb_user_meta as umeta ON umeta.user_id = $tb_users.ID
					WHERE $tb_boardable.board_id IN ( $tasklist_format )
					AND $tb_boardable.board_type = %s
					AND $tb_boardable.boardable_type = %s
					AND umeta.meta_key='$meta_key'
					group by $tb_boardable.board_id
				";
		} else {
			$query ="SELECT DISTINCT count($tb_users.id) as user_count,
				$tb_boardable.board_id as list_id 
				FROM $tb_users
					LEFT JOIN $tb_boardable  ON $tb_boardable.boardable_id = $tb_users.id
					WHERE $tb_boardable.board_id IN ( $tasklist_format )
					AND $tb_boardable.board_type = %s
					AND $tb_boardable.boardable_type = %s
					group by $tb_boardable.board_id
				";
		} 

		array_push( $query_data, 'task_list', 'user' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );

		foreach ( $results as $key => $result ) {
			$list_id = $result->list_id;
			unset($result->list_id);
			$metas[$list_id] = $result->comment_count;
		}

		foreach ( $this->lists as $key => $list ) {
			$list->meta['total_assignees'] = empty( $metas[$list->id] ) ? 0 : $metas[$list->id];
		}

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

	private function select() {
		$select = '';

		if ( empty( $this->query_params['select'] ) ) {
			$this->select = $this->tb_list . '.*';

			return $this;
		}

		$select_items = $this->query_params['select'];

		if ( ! is_array( $select_items ) ) {
			$select_items = str_replace( ' ', '', $select_items );
			$select_items = explode( ',', $select_items );
		}

		foreach ( $select_items as $key => $item ) {
			$item = str_replace( ' ', '', $item );
			$select .= $this->tb_list . '.' . $item . ',';
		}

		$this->select = substr( $select, 0, -1 );

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
	 * Filter list by ID
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
		
		$this->where .= $wpdb->prepare( " AND {$this->tb_list}.id IN ($format)", $format_ids );

		if ( count( $format_ids ) == 1 ) {
			$this->is_single_query = true;
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

		// $this->where .= " AND {$this->tb_list}.title LIKE '%$title%'";
		$this->where .= $wpdb->prepare( " AND {$this->tb_list}.title LIKE %s", '%'.$title.'%' );

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
			//$this->where .= " AND {$this->tb_list}.project_id IN ($query_id)";
			$query_format = pm_get_prepare_format( $id );
			$this->where .= $wpdb->prepare( " AND {$this->tb_list}.project_id IN ($query_format)", $id );
		}

		if ( !is_array( $id ) ) {
		//	$this->where .= " AND {$this->tb_list}.project_id = $id";
			$this->where .= $wpdb->prepare( " AND {$this->tb_list}.project_id IN (%d)", $id );
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

		$per_page = pm_get_setting( 'list_per_page' );

		return empty( $per_page ) ? 10 : (int) $per_page;
	}

	private function get() {
		global $wpdb;
		$id = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false;

		$query = "SELECT SQL_CALC_FOUND_ROWS DISTINCT {$this->tb_list}.*
			FROM {$this->tb_list}
			{$this->join}
			WHERE %d=%d {$this->where} AND $this->tb_list.type=%s
			{$this->orderby} {$this->limit} ";
		
		$results = $wpdb->get_results( $wpdb->prepare( $query, 1, 1, 'task_list' ) );

		$this->found_rows = $wpdb->get_var( "SELECT FOUND_ROWS()" );
		$this->lists = $results;

		if ( ! empty( $results ) && is_array( $results ) ) {
			$this->list_ids = wp_list_pluck( $results, 'id' );
		}

		if ( ! empty( $results ) && !is_array( $results ) ) {
			$this->list_ids = [$results->id];
		}

		return $this;
	}

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
