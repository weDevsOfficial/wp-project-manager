<?php

namespace WeDevs\PM\Search\Controllers;

use WP_REST_Request;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\User\Models\User_Role;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\User\Models\User;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Common\Models\Board;
use Illuminate\Database\Capsule\Manager as DB;

class Search_Controller {
	use Transformer_Manager, Request_Filter;

	public function search( WP_REST_Request $request ) {
		$string     = $request->get_param( 'query' );
    	$project_id = $request->get_param( 'project_id' );
		$model      = $request->get_param( 'model' ); //[milestone, discussion_board, task_list, task]
		$model 		= empty( $model ) ? '' : $model;

		if ( empty( trim( $string ) ) ) {
			return $this->get_default_result();
		}

    	if ( $project_id || !empty( $model ) ) {
    		return $this->get_result_for_project( $string, $project_id, $model );
    	}
    	return $this->get_all_result( $string );
	}

    public function searchTopBar( WP_REST_Request $request ) {
        $string     = $request->get_param( 'query' );
        $type     = $request->get_param( 'type' );
        $model      = $request->get_param( 'model' ); //[milestone, discussion_board, task_list, task]
        $model 		= empty( $model ) ? '' : $model;

        if ( empty( trim( $string ) ) ) {
            return $this->get_default_result();
        }

        return $this->search_project_type( $string, 0 );
    }

	public function search_by_client( WP_REST_Request $request ) {
        $string = $request->get_param('query');
		$current_user_id = get_current_user_id();
		$projects = [];

		$project_ids = [];

		if ( ! pm_has_manage_capability( $current_user_id ) ) {
			$project_ids = $this->user_in_projects( $current_user_id );
		}


        $users = User::with( 'projects' )
                ->where( 'display_name', 'like', '%'.$string.'%' )
                ->orWhere( 'user_login',  'like', '%'.$string.'%' )
                ->orWhere( 'user_nicename',  'like', '%'.$string.'%' )
                ->orWhere( 'user_email', 'like', '%'.$string.'%' )
                ->get();


        $users->map( function( $user ) use ( &$projects, $project_ids ) {
            $user->projects->map( function( $project ) use ( &$projects, $project_ids ) {

				if ( ! empty( $project_ids ) ) {
					if (  in_array( $project->id, $project_ids ) ) {
						$projects[] = $project->toArray();
					}
				} else {
					$projects[] = $project->toArray();
				}
			});

        });

        if ( empty( $projects ) ) {
            $projects = [ [ "no_result" => __( "No results found.", 'wedevs-project-manager' )] ];
        }

        return $projects;
    }



	public function get_result_for_project ( $string, $project_id, $model ) {
		if ( ! $string ) {
			return [];
		}
		$items = [];

		if ( 'tasks' === $model ) {
			$items = array_merge( $items, $this->search_in_tasks( $string, $project_id ) );
		} else if ( 'milestone'=== $model  ) {
			$items = array_merge($items, $this->search_in_broad( $string, $project_id, ['milestone'] ) );
		} else if ( 'discussion_board' === $model ) {
			$items = array_merge( $items, $this->search_in_broad( $string, $project_id, ['discussion_board'] ) );
		} else if ( 'task_list'=== $model  ) {
			$items = array_merge( $items, $this->search_in_broad( $string, $project_id, ['task_list'] ) );
		} elseif ( 'project' === $model ) {
			$items = array_merge( $items, $this->search_in_project( $string ) );
		}

        return $items;

	}

    public function get_all_result( $string, $project_id = false ) {
		if ( ! $string ) {
			return [];
		}
		$items = [];

		$items = array_merge( $items, $this->search_in_project( $string, $project_id ) );

		$items = array_merge( $items, $this->search_in_tasks( $string, $project_id ));

		$items = array_merge( $items, $this->search_in_broad( $string, $project_id ));

        if ( empty( $items ) ) {
            $items = [ [ "no_result" => __( "No results found.", 'wedevs-project-manager' ) ]];
		}

        return $items;
	}

	function search_in_project ( $string, $user_id = false ) {
		$user_id = empty($user_id) ? get_current_user_id() : $user_id;

		$projects = Project::where( 'title', 'like', '%'. $string.'%')->orderBy( 'created_at', 'DESC' );;

		// user is assigneed in project
		if ( !pm_has_manage_capability( $user_id ) ){
    		$projects = $projects->whereHas('assignees', function( $q ) use ( $user_id ) {
				$q->where('user_id', $user_id );
			});
		}

		$projects = $projects->get(['id', 'title', 'description']);


		return $this->get_items( $projects, 'project' );

	}

    function search_project_type ( $string, $type = 0, $user_id = false) {
        $user_id = empty($user_id) ? get_current_user_id() : $user_id;

        $projects = Project::where( 'title', 'like', '%'. $string.'%')
            ->where( 'status', '=', $type);

        // user is assigneed in project
        if ( !pm_has_manage_capability( $user_id ) ){
            $projects = $projects->whereHas('assignees', function( $q ) use ( $user_id ) {
                $q->where('user_id', $user_id );
            });
        }

        $projects = $projects->get(['id', 'title', 'description']);


        return $this->get_items( $projects, 'project' );

    }
	/**
	 * Search i tasks
	 *
	 * @param $string Query string
	 * @param $project_id
	 *
	 * @return Array result items
	 */
	function search_in_tasks (  $string, $project_id = false ) {

		$tasks = Task::with( [
			'metas' =>  function( $q ) {
				$q->where('meta_key', 'privacy')->where('meta_value', 1);
			}
		])
		->where( 'title', 'like', '%'. $string.'%')
		->orderBy( 'created_at', 'DESC' );

		if ( $project_id ) {

			$tasks = $tasks->where( 'project_id', $project_id );
			$tasks = $this->tasks_privacy( $tasks, $project_id );

		} else {
			if (! pm_has_manage_capability() ) {
				$tasks = $this->remove_private_task( $tasks );
			}
		}

		$tasks = $tasks->get(['id', 'title', 'description', 'parent_id', 'project_id']);

		return $this->get_items( $tasks, 'task' );
	}

	/**
	 * Search i tasks
	 *
	 * @param $string Query string
	 * @param $project_id
	 * @param $type [  ]
	 *
	 * @return Array result items
	 */

	function search_in_broad ($string,  $project_id = false, $type = [] ) {

		$board = Board::with([
			'metas'	=> function( $q ) {
				$q->where( 'meta_key', 'privacy' )->where( 'meta_value', 1);
			}
		])
		->where( 'title', 'like', '%'. $string.'%')
		->orderBy( 'created_at', 'DESC' );

		if ( $project_id ) {
			$board = $board->where( 'project_id', $project_id );
			$board = $this->board_privacy( $board, $type, $project_id );


		} else {
			if (! pm_has_manage_capability() ) {

				$project_ids = $this->user_in_projects();

				$board = $board->whereIn( 'project_id', $project_ids );
				foreach ( $project_ids as $pid ) {
					$board = $this->board_privacy( $board, $type, $pid );
				}
			}
		}



		if ( ! empty( $type ) ) {
			$board = $board->whereIn( 'type', $type );
		}

		$board = $board->get(['id', 'title', 'description', 'type', 'project_id']);

		return $this->get_items( $board, 'board' );
	}


	function board_privacy ( $board, $board_type, $project_id ) {

		if ( pm_is_manager( $project_id ) ) {
			return $board;
		}

		if ( in_array( 'milestone', $board_type ) && pm_user_can( 'view_private_milestone', $project_id ) ) {
			return $board;
		}

		if ( in_array( 'discussion_board', $board_type ) && pm_user_can( 'view_private_message', $project_id ) ) {
			return $board;
		}

		if ( in_array( 'task_list', $board_type ) && pm_user_can( 'view_private_list', $project_id ) ) {
			return $board;
		}

		$board = $board->doesntHave( 'metas', 'and', function ($query) use ( $project_id ) {
			$query->where( 'meta_key', '=', 'privacy' )
					->where( 'meta_value', '!=', '0' )
					->where( 'project_id', '=', $project_id );
			});

		return $board;
	}
	/**
	 * Get Results of search
	 *
	 * @param $item search items
	 * @param $type result type
	 *
	 * @return Array
	 */
	public function get_items( $items, $type ) {
    	$items_array = [];

    	foreach ( $items as $item ) {
    		$result = [];
    		$result['type']  = $type;

    		if ( $type !== 'project' ) {
    			$result['project_id'] = $item->project_id;
    			$project_id =  $item->project_id;
    		} else {
    			$project_id = $item->id;
    		}


    		if ( $type == 'task' ) {



    			if ( $item->parent_id !== "0" ) {
	    			$result['type'] = 'subtask';
	    			$result['parent_id'] = $item->parent_id;
	    		}
    		}

    		if ( $type == 'board' ) {
    			if (
    				isset( $item->metas[0] )
    				&&  $item->type == 'milestone'
    				&& !pm_user_can( 'view_private_milestone', $item->project_id )
    			) {
    				continue ;
    			}
    			if (
    				isset( $item->metas[0] )
    				&&  $item->type == 'discussion_board'
    				&& !pm_user_can( 'view_private_message', $item->project_id )
    			) {
    				continue ;
    			}

    			if (
    				isset( $item->metas[0] )
    				&&  $item->type == 'task_list'
    				&& !pm_user_can( 'view_private_list', $item->project_id )
    			) {
    				continue ;
    			}
    			$result['type'] = $item->type;
    		}

			$result['title'] = $item->title;
			$result['id']    = $item->id;

    		$items_array[] = $result;
    	}

    	return $items_array;
	}

	/**
	 * Here is a complex situation
	 * you are searching in gloablly not in project,
	 * you Dosen't know have ability to view the project
	 * 		&& have permissions to view tasks (task is private)
	 * 		&& also task list is private
	 */
	function remove_private_task ( $tasks, $user_id = false ) {
		$user_id = empty($user_id) ? get_current_user_id() : $user_id;

		// remove Task from projects where yoiu have not abilit to view
		$project_ids = $this->user_in_projects($user_id);

		$tasks = $tasks->whereIn('project_id', $project_ids );

		foreach ( $project_ids as $pid ) {
			// filter private tasks if not ability
			$tasks = $this->tasks_privacy( $tasks, $pid );
		}

		return $tasks;

	}

	/**
	 * task privacy query for tasks,
	 *
	 * @param $tasks QueryBuilder
	 * @param $project_id initeger
	 *
	 * @return QueryBuilder
	 */
	function tasks_privacy ( $tasks, $project_id ) {

		if ( pm_is_manager( $project_id ) ) {
			return $tasks;
		}

		if ( ! pm_user_can( 'view_private_task', $project_id ) ) {
			// when tasks are praivate and not ability to view
			$tasks = $tasks->doesntHave( 'metas', 'and', function ( $query ) use( $project_id ) {
					$query->where( 'meta_key', '=', 'privacy' )
						->where( 'meta_value', '!=', '0' )
						->where( 'project_id', '=', $project_id );

				});
		}

		// When list is private and not avility to view list
		if ( ! pm_user_can( 'view_private_list', $project_id )  ) {
			$tasks = $tasks->doesntHave( 'task_lists.metas', 'and', function ( $query ) use ( $project_id ) {

					$query->where( 'meta_key', '=', 'privacy' )
						->where( 'meta_value', '!=', '0' )
						->where( 'project_id', '=', $project_id );

				});
		}

		return $tasks;
	}

	function user_in_projects ( $user_id = false ) {
		$user_id = empty( $user_id ) ? get_current_user_id() : $user_id;

		$projects_ids =  User_Role::where( 'user_id', $user_id )->get(['project_id'])->toArray();

		return wp_list_pluck( $projects_ids, 'project_id' );
	}

	function get_default_result() {
		$user_id = get_current_user_id();
		$projects = Project::where( 'status', 0 );

		if ( !pm_has_manage_capability( $user_id ) ){
    		$projects = $projects->whereHas('assignees', function( $q ) use ( $user_id ) {
    					$q->where('user_id', $user_id );
    				});
    	}

		$projects = $projects->leftJoin( pm_tb_prefix() . 'pm_meta', function ( $join ) use( $user_id ) {
			$join->on( pm_tb_prefix().'pm_projects.id', '=',  pm_tb_prefix().'pm_meta.project_id' )
			->where('meta_key', '=', 'favourite_project')->where('entity_id', '=', $user_id);
		})
		->selectRaw( pm_tb_prefix().'pm_projects.*' )
		->groupBy( pm_tb_prefix().'pm_projects.id' )
		->orderBy( pm_tb_prefix().'pm_meta.meta_value', 'DESC');

		$projects = $projects->orderBy(  pm_tb_prefix().'pm_projects.created_at', 'DESC' )->take(5);
		$projects = $projects->get(['id', 'title', 'description']);


		return $this->get_items( $projects, 'project' );
	}
}
