<?php

namespace WeDevs\PM\Project\Controllers;

use WP_REST_Request;
use WeDevs\PM\Project\Models\Project;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Project\Transformers\Project_Transformer;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\User\Models\User;
use WeDevs\PM\User\Models\User_Role;
use WeDevs\PM\Category\Models\Category;
use WeDevs\PM\Common\Traits\File_Attachment;
use Illuminate\Pagination\Paginator;
use WeDevs\PM\Common\Models\Meta;
use WeDevs\PM\Task_List\Models\Task_List;
use WeDevs\PM\Project\Helper\Project_Role_Relation;
use WeDevs\PM\Settings\Models\Settings;
use WeDevs\PM\Settings\Controllers\AI_Settings_Controller;

class Project_Controller {

	use Transformer_Manager, Request_Filter, File_Attachment;

	// Token limit constants for AI generation
	const MIN_MAX_TOKENS = 500;
	const MAX_MAX_TOKENS = 16384;
    const MAX_JSON_CONTENT_SIZE = 1000000; // 1MB limit for JSON repair operations
    const TIMEOUT_DURATION = 300;

    public function index( WP_REST_Request $request ) {
		$per_page = intval( $request->get_param( 'per_page' ) );
		$page     = intval( $request->get_param( 'page' ) );
		$status   = sanitize_text_field($request->get_param('status'));
		$category = intval($request->get_param('category'));
		$project_transform = sanitize_text_field($request->get_param('project_transform'));

		$per_page_from_settings = wedevs_pm_get_setting( 'project_per_page' );
		$per_page_from_settings = $per_page_from_settings ? $per_page_from_settings : 15;

		$per_page = $per_page ? $per_page : $per_page_from_settings;
		$page     = $page ? $page : 1;

		Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

		$projects = $this->fetch_projects( $category, $status );

		$projects = apply_filters( 'wedevs_pm_project_query', $projects, $request->get_params() );

		$projects = $projects->orderBy(  wedevs_pm_tb_prefix().'pm_projects.created_at', 'DESC' );

		if ( -1 === intval( $per_page ) || $per_page == 'all' ) {
			$per_page = $projects->get()->count();
		}

		if( $project_transform == 'false' ) {
 			wp_send_json_success( $projects->get()->toArray() );
		}

		$projects = $projects->paginate( $per_page );

		$project_collection = $projects->getCollection();
		$resource = new Collection( $project_collection, new Project_Transformer );

		$resource->setMeta( $this->projects_meta( $category ) );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $projects ) );

        return $this->get_response( $resource );
    }

    private function projects_meta( $category ) {
		$user_id = get_current_user_id();
		$eloquent_sql     = $this->fetch_projects_by_category( $category );
		$total_projects   = $eloquent_sql->count();
		$eloquent_sql     = $this->fetch_projects_by_category( $category );
		$total_incomplete = $eloquent_sql->where( 'status', Project::INCOMPLETE )->count();
		$eloquent_sql     = $this->fetch_projects_by_category( $category );
		$total_complete   = $eloquent_sql->where( 'status', Project::COMPLETE )->count();
		$eloquent_sql     = $this->fetch_projects_by_category( $category );
		$total_pending    = $eloquent_sql->where( 'status', Project::PENDING )->count();
		$eloquent_sql     = $this->fetch_projects_by_category( $category );
		$total_archived   = $eloquent_sql->where( 'status', Project::ARCHIVED )->count();
		$eloquent_sql     = $this->fetch_projects_by_category( $category );
		$favourite 		  = $eloquent_sql->whereHas( 'meta', function ( $query ) use( $user_id ) {
						$query->where('meta_key', '=', 'favourite_project')
							->where('entity_id', '=', $user_id)
							->whereNotNull( 'meta_value' );
					} )->count();
		$user_id          = get_current_user_id();

		$meta  = [
			'total_projects'   => $total_projects,
			'total_incomplete' => $total_incomplete,
			'total_complete'   => $total_complete,
			'total_pending'    => $total_pending,
			'total_archived'   => $total_archived,
			'total_favourite'  => $favourite,
		];

		return $meta;
    }

    private function fetch_projects( $category, $status ) {
		$projects = $this->fetch_projects_by_category( $category );
		$user_id = get_current_user_id();

		if ($status == 'favourite' ) {
			$projects = $projects->whereHas( 'meta', function ( $query ) use( $user_id ) {
				$query->where('meta_key', '=', 'favourite_project')
					->where('entity_id', '=', $user_id)
					->whereNotNull( 'meta_value' );
			} );
		}

    	if ( in_array( $status, Project::$status ) ) {
			$status   = array_search( $status, Project::$status );
			$projects = $projects->where( 'status', $status );
		}

		$projects = $projects->leftJoin( wedevs_pm_tb_prefix() . 'pm_meta', function ( $join ) use( $user_id ) {
			$join->on( wedevs_pm_tb_prefix().'pm_projects.id', '=',  wedevs_pm_tb_prefix().'pm_meta.project_id' )
			->where('meta_key', '=', 'favourite_project')->where('entity_id', '=', $user_id);
		})
		->selectRaw( wedevs_pm_tb_prefix().'pm_projects.*' )
		->groupBy( wedevs_pm_tb_prefix().'pm_projects.id' )
		->orderBy( wedevs_pm_tb_prefix().'pm_meta.meta_value', 'DESC');

		return $projects;
    }

    private function fetch_projects_by_category( $category = null ) {
    	$user_id = get_current_user_id();

		if ( $category ) {
    		$category = Category::where( 'categorible_type', 'project' )
	    		->where( 'id', $category )
	    		->first();

	    	if ( $category ) {
	    		$projects = $category->projects()->with('assignees');
	    	} else {
	    		$projects = Project::with('assignees');
	    	}

    	} else {
    		$projects = Project::with('assignees');
    	}
    	if ( !wedevs_pm_has_manage_capability( $user_id ) ){
    		$projects = $projects->whereHas('assignees', function( $q ) use ( $user_id ) {
    					$q->where('user_id', $user_id );
    				});
    	}

    	return $projects;
    }

	public function show( WP_REST_Request $request ) {
		$id 	  = intval($request->get_param('id'));
		$user_id  = get_current_user_id();
		$project  = Project::find($id);

		if ( !$project  ) {
			return new \WP_Error( 'project', __( 'No projects found.', 'wedevs-project-manager' ), array( 'status'=> 404 ) );
		}

        $projectId_git_bit_hash = get_option('projectId_git_bit_hash_'.$project->id);
		if(!$projectId_git_bit_hash){
            add_option('projectId_git_bit_hash_'.$project->id , sha1(strtotime("now").$project->id));
        }

		$resource = new Item( $project, new Project_Transformer );
		$list_view = wedevs_pm_get_meta( $user_id, $id, 'list_view', 'list_view_type' );
		$resource->setMeta([
			'list_view_type' => $list_view ? $list_view->toArray() : null
		]);

        return $this->get_response( $resource );
	}

	public function create_project(  $data ) {
		$project = Project::create( $data );
		add_option('projectId_git_bit_hash_'.$project->id , sha1(strtotime("now").$project->id));
		// Establishing relationships
		$category_ids = isset( $data[ 'categories' ] ) ? $data[ 'categories' ]  : [];
		if ( $category_ids ) {
			$project->categories()->sync( $category_ids );
		}

		$assignees = isset( $data[ 'assignees' ] ) ? $data['assignees'] : [];
		$assignees[] = [
			'user_id' => wp_get_current_user()->ID,
			'role_id' => 1, // 1 for manager
		];
		//craeate list inbox when create project
		$this->create_list_inbox($project->id);

		if ( is_array( $assignees ) ) {
			$this->assign_users( $project, $assignees );
		}
		do_action( 'wedevs_pm_project_new', $project, $data );
		// Transforming database model instance
		$resource = new Item( $project, new Project_Transformer );
		$response = $this->get_response( $resource );
		$response['message'] = __( 'A new project has been created successfully.', 'wedevs-project-manager' );
		do_action( 'wedevs_cpm_project_new', $project->id, $project->toArray(), $data ); // will deprecated
		do_action( 'wedevs_pm_after_new_project', $response, $data );

		( new Project_Role_Relation )->set_relation_after_create_project( $response['data'] );

        return $response;
	}

	public function store( WP_REST_Request $request ) {
		// Extraction of no empty inputs and create project
		$data    = $this->extract_non_empty_values( $request );
		$project = Project::create( $data );
		add_option('projectId_git_bit_hash_'.$project->id , sha1(strtotime("now").$project->id));
		// Establishing relationships
		$category_ids = map_deep( $request->get_param( 'categories' ), 'intval' );

		if ( $category_ids ) {
			$project->categories()->sync( $category_ids );
		}

		$assignees = wedevs_pm_validate_assignee( $request->get_param( 'assignees' ) );

		$assignees[] = [
			'user_id' => wp_get_current_user()->ID,
			'role_id' => 1, // 1 for manager
		];
		//craeate list inbox when create project
		$this->create_list_inbox($project->id);
		if ( is_array( $assignees ) ) {
			$this->assign_users( $project, $assignees );
		}
		do_action( 'wedevs_pm_project_new', $project, $request->get_params());
		// Transforming database model instance
		$resource = new Item( $project, new Project_Transformer );
		$response = $this->get_response( $resource );
		$response['message'] = __( 'A new project has been created successfully.', 'wedevs-project-manager' );

		do_action( 'wedevs_cpm_project_new', $project->id, $project->toArray(), $request->get_params() ); // will deprecated
		do_action( 'wedevs_pm_after_new_project', $response, $request->get_params() );

		( new Project_Role_Relation )->set_relation_after_create_project( $response['data'] );

        return $response;
	}

	public function update( WP_REST_Request $request ) {
		// Extract non empty inputs and update project
		$data    = $request->get_params();//$this->extract_non_empty_values( $request );
		$project = Project::find( $data['id'] );

		$project->update_model( $data );

		// Establishing relationships
		$category_ids = map_deep( $request->get_param( 'categories' ), 'intval' );
		if ( $category_ids ) {
			$project->categories()->sync( $category_ids );
		}

		$assignees = wedevs_pm_validate_assignee( $request->get_param( 'assignees' ) );

		if ( is_array( $assignees ) ) {
			$project->assignees()->detach();
			$this->assign_users( $project, $assignees );
		}

		do_action( 'wedevs_pm_project_update', $project, $request->get_params() );

		$resource = new Item( $project, new Project_Transformer );
		$response = $this->get_response( $resource );
		$response['message'] = __( 'A project has been updated successfully.', 'wedevs-project-manager' );
		do_action( 'wedevs_cpm_project_update', $project->id, $project->toArray(), $request->get_params() );
		do_action( 'wedevs_pm_after_update_project', $response, $request->get_params() );

		( new Project_Role_Relation )->set_relation_after_update_project( $response['data'] );

        return $response;
	}

	public function delete_projects_all() {
		$projects = Project::all();
		foreach ($projects as  $project ) {

			do_action( 'wedevs_cpm_delete_project_prev', $project->id ); // will be deprecated
			do_action( 'wedevs_cpm_project_delete', $project, true );
			do_action( 'wedevs_pm_before_delete_project', $project, $project->id );
			// Delete related resourcess
			$project->categories()->detach();

			$tasks = $project->tasks;
	        foreach ( $tasks as $task ) {
	            $task->files()->delete();
	            $task->assignees()->delete();
	            $task->metas()->delete();
	        }
			$project->tasks()->delete();

			$task_lists = $project->task_lists;
			foreach ( $task_lists as $task_list ) {
				$task_list->boardables()->delete();
		        $task_list->metas()->delete();
		        $task_list->files()->delete();
			}
			$project->task_lists()->delete();

			$project->discussion_boards()->delete();
			$project->milestones()->delete();
			$project->comments()->delete();
			$project->assignees()->detach();
			$this->detach_files( $project );
			$project->settings()->delete();
			$project->activities()->delete();
			$project->meta()->delete();
			(new Project_Role_Relation)->after_delete_project( $project->id );

			// Delete the main resource
			$project->delete();
			do_action( 'wedevs_pm_after_delete_project', $project );
			do_action( 'wedevs_cpm_delete_project_after', $project->id );
		}
			return [
				'message' => __( 'A project has been deleted successfully.', 'wedevs-project-manager' )
			];
	}

	public function destroy( WP_REST_Request $request ) {
		$id = intval( $request->get_param('id') );

		// Find the requested resource
		$project =  Project::find( $id );
		do_action( 'wedevs_cpm_delete_project_prev', $id ); // will be deprecated
		do_action( 'wedevs_cpm_project_delete', $id, true );
		do_action( 'wedevs_pm_before_delete_project', $project, $request->get_params() );
		// Delete related resourcess
		$project->categories()->detach();

		$tasks = $project->tasks;
        foreach ( $tasks as $task ) {
            $task->files()->delete();
            $task->assignees()->delete();
            $task->metas()->delete();
        }
		$project->tasks()->delete();

		$task_lists = $project->task_lists;
		foreach ( $task_lists as $task_list ) {
			$task_list->boardables()->delete();
	        $task_list->metas()->delete();
	        $task_list->files()->delete();
		}
		$project->task_lists()->delete();

		$project->discussion_boards()->delete();
		$project->milestones()->delete();
		$project->comments()->delete();
		$project->assignees()->detach();
		$this->detach_files( $project );
		$project->settings()->delete();
		$project->activities()->delete();
		$project->meta()->delete();
		(new Project_Role_Relation)->after_delete_project( $id );

		// Delete the main resource
		$project->delete();
		do_action( 'wedevs_pm_after_delete_project', $project );
		do_action( 'wedevs_cpm_delete_project_after', $id );
		return [
			'message' => __( 'A project has been deleted successfully.', 'wedevs-project-manager' )
		];
	}

	private function assign_users( Project $project, $assignees = [] ) {
		$assignees = is_array( $assignees ) ? $assignees : [];

		foreach ( $assignees as $assignee ) {
			User_Role::firstOrCreate([
				'user_id'    => $assignee['user_id'],
				'role_id'    => $assignee['role_id'],
				'project_id' => $project->id,
			]);
		}
	}

	public function favourite_project (WP_REST_Request $request) {
        $project_id = intval( $request->get_param( 'id' ) );
        $favourite  = sanitize_text_field( $request->get_param( 'favourite' ) ) ;
        $user_id    = get_current_user_id();


        if ( $favourite == 'true' || $favourite === true ) {
            // phpcs:disable WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- Custom Eloquent model table (pm_meta), not WordPress core meta tables.
            $lastFavourite = Meta::where([
				'entity_id'   => $user_id,
				'entity_type' => 'project',
				'meta_key'    => 'favourite_project'
			])->max('meta_value');
            // phpcs:enable WordPress.DB.SlowDBQuery.slow_db_query_meta_key

            $lastFavourite = intval($lastFavourite ) + 1;

			wedevs_pm_update_meta( $user_id, $project_id, 'project', 'favourite_project', $lastFavourite );

        } else {
            wedevs_pm_update_meta( $user_id, $project_id, 'project', 'favourite_project', null );
		}

		do_action( "wedevs_pm_after_favaurite_project", $request );

		if ( $favourite == 'true' ) {
			$response = $this->get_response( null, [ 'message' =>  __( "The project has been marked as favorite", 'wedevs-project-manager' ) ] );
		} else {

			$response = $this->get_response( null, [ 'message' =>  __( "The project has been removed from favorite", 'wedevs-project-manager' ) ] );
		}

        return $response;
	}

	function create_list_inbox($project_id) {

		// phpcs:disable WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- Custom Eloquent model table (pm_meta), not WordPress core meta tables.
		$meta = Meta::firstOrCreate([
			'entity_id'	=> $project_id,
			'entity_type' => 'task_list',
			'meta_key' => 'list-inbox',
			'project_id' => $project_id,
		]);
		// phpcs:enable WordPress.DB.SlowDBQuery.slow_db_query_meta_key

		if ( empty( $meta->meta_value ) ) {

			$list = Task_List::create([
				'title' => __('Inbox', 'wedevs-project-manager'),
				'description' => __('This is a system default task list. Any task without an assigned tasklist will appear here.', 'wedevs-project-manager'),
				'order' => 999999,
				'project_id' => $project_id,
			]);

			$meta->meta_value = $list->id;
			$meta->save();

		}
	}

	/**
	 * Get AI generation limits with filter hooks
	 *
	 * @return array Array of limit values
	 */
    private function get_ai_generation_limits() {
        return [
            'max_task_groups'       => apply_filters( 'wedevs_pm_ai_max_task_groups', 8 ),
            'max_tasks_per_group'   => apply_filters( 'wedevs_pm_ai_max_tasks_per_group', 8 ),
            'max_initial_tasks'     => apply_filters( 'wedevs_pm_ai_max_initial_tasks', 8 ),
            'max_task_title_length' => apply_filters( 'wedevs_pm_ai_max_task_title_length', 200 ),
        ];
    }

	/**
	 * Generate project structure using AI
	 *
	 * @param WP_REST_Request $request
	 * @return mixed
	 */
	public function ai_generate( WP_REST_Request $request ) {
		$prompt = sanitize_text_field( $request->get_param( 'prompt' ) );

		if ( empty( $prompt ) ) {
			return $this->get_response( null, [
				'success' => false,
				'message' => __( 'Prompt is required.', 'wedevs-project-manager' )
			] );
		}

		// Get AI settings - combine into single query for better performance
		$settings_keys = [ 'ai_provider', 'ai_model', 'ai_max_tokens', 'ai_temperature' ];
		$settings = Settings::whereIn( 'key', $settings_keys )->get()->keyBy( 'key' );

		$provider = isset( $settings['ai_provider'] ) ? sanitize_text_field( $settings['ai_provider']->value ) : 'openai';
		$model = isset( $settings['ai_model'] ) ? sanitize_text_field( $settings['ai_model']->value ) : 'gpt-3.5-turbo';
		$max_tokens = isset( $settings['ai_max_tokens'] ) ? intval( $settings['ai_max_tokens']->value ) : 2000;
		$temperature = isset( $settings['ai_temperature'] ) ? floatval( $settings['ai_temperature']->value ) : 0.7;

		// Enforce token limits for safety
		$max_tokens = max( self::MIN_MAX_TOKENS, min( self::MAX_MAX_TOKENS, $max_tokens ) );

		// Get API key (separate query as it's provider-specific)
		$api_key_key = 'ai_api_key_' . $provider;
		$api_key_setting = Settings::where( 'key', $api_key_key )->first();

		if ( !$api_key_setting || empty( $api_key_setting->value ) ) {
			return $this->get_response( null, [
				'success' => false,
				'message' => __( 'AI API key is not configured. Please configure it in Settings.', 'wedevs-project-manager' )
			] );
		}

		$api_key = AI_Settings_Controller::decrypt_api_key_static( $api_key_setting->value );

		if ( empty( $api_key ) ) {
			return $this->get_response( null, [
				'success' => false,
				'message' => __( 'AI API key is invalid. Please check your settings.', 'wedevs-project-manager' )
			] );
		}

		// Get limits with filter hooks
		$limits = $this->get_ai_generation_limits();
		$max_task_groups = $limits['max_task_groups'];
		$max_tasks_per_group = $limits['max_tasks_per_group'];
		$max_initial_tasks = $limits['max_initial_tasks'];
		$max_task_title_length = $limits['max_task_title_length'];

		// Prepare AI prompt
		$ai_prompt = "Based on the following project description, generate a structured project plan with:\n";
		$ai_prompt .= "1. A project title\n";
		$ai_prompt .= "2. Initial tasks (tasks without a group) - Maximum {$max_initial_tasks} tasks\n";
		$ai_prompt .= "3. Task groups with tasks under each group - Maximum {$max_task_groups} groups, {$max_tasks_per_group} tasks per group\n\n";
		$ai_prompt .= "IMPORTANT LIMITS:\n";
		$ai_prompt .= "- Maximum {$max_initial_tasks} initial tasks (tasks without a group)\n";
		$ai_prompt .= "- Maximum {$max_task_groups} task groups\n";
		$ai_prompt .= "- Maximum {$max_tasks_per_group} tasks per task group\n";
		$ai_prompt .= "- Keep task titles concise (under {$max_task_title_length} characters)\n\n";
		$ai_prompt .= "CRITICAL: NO DUPLICATE TASKS\n";
		$ai_prompt .= "- Each task title must be unique across the entire project\n";
		$ai_prompt .= "- Do not repeat the same task title in initial tasks\n";
		$ai_prompt .= "- Do not repeat the same task title within a task group\n";
		$ai_prompt .= "- Do not use the same task title in both initial tasks and task groups\n";
		$ai_prompt .= "- Task titles are compared case-insensitively (e.g., 'Task Name' and 'task name' are considered duplicates)\n\n";
		$ai_prompt .= "Project description: " . $prompt . "\n\n";
		$ai_prompt .= "TOKEN LIMIT WARNING:\n";
		$ai_prompt .= "- Your response is limited to {$max_tokens} tokens (max_tokens parameter)\n";
		$ai_prompt .= "- You MUST stay within this limit and return COMPLETE, valid JSON\n";
		$ai_prompt .= "- If you cannot fit all tasks within the limit, prioritize and reduce the number of tasks/groups\n";
		$ai_prompt .= "- NEVER return incomplete or truncated JSON - it's better to return fewer complete tasks than many incomplete ones\n\n";
		$ai_prompt .= "CRITICAL JSON FORMATTING RULES:\n";
		$ai_prompt .= "- Return ONLY valid, complete JSON - no markdown, no code blocks, no explanations\n";
		$ai_prompt .= "- ALWAYS use DOUBLE QUOTES (\") for all JSON strings - NEVER use single quotes (')\n";
		$ai_prompt .= "- Each string must start with ONE double quote and end with ONE double quote\n";
		$ai_prompt .= "- Example of CORRECT formatting: {\"title\": \"Task Name\"}\n";
		$ai_prompt .= "- Example of WRONG formatting: {'title': 'Task Name'} or {\"title\": \"Task Name\"\"}\n";
		$ai_prompt .= "- The JSON must be complete and properly closed (all brackets and braces must match)\n";
		$ai_prompt .= "- Do not truncate or cut off any strings - ensure all task titles are complete\n";
		$ai_prompt .= "- The response must be parseable by standard JSON parsers\n\n";
		$ai_prompt .= "Return ONLY a valid JSON object with this exact structure:\n";
		$ai_prompt .= "{\n";
		$ai_prompt .= "  \"title\": \"Project Name\",\n";
		$ai_prompt .= "  \"description\": \"Project description\",\n";
		$ai_prompt .= "  \"tasks\": [{\"title\": \"Initial Task 1\"}, {\"title\": \"Initial Task 2\"}],\n";
		$ai_prompt .= "  \"task_groups\": [{\n";
		$ai_prompt .= "    \"title\": \"Group Name\",\n";
		$ai_prompt .= "    \"tasks\": [{\"title\": \"Group Task 1\"}, {\"title\": \"Group Task 2\"}]\n";
		$ai_prompt .= "  }]\n";
		$ai_prompt .= "}\n\n";
		$ai_prompt .= "FINAL CHECK: Before responding, verify that:\n";
		$ai_prompt .= "1. All strings use double quotes (\") not single quotes (')\n";
		$ai_prompt .= "2. No string has double closing quotes (\"\" at the end)\n";
		$ai_prompt .= "3. All brackets and braces are properly closed\n";
		$ai_prompt .= "4. The JSON is complete and not truncated";

		// Call AI API based on provider
		$result = $this->call_ai_api( $provider, $api_key, $model, $max_tokens, $temperature, $ai_prompt );

		if ( !$result['success'] ) {
			return $this->get_response( null, [
				'success' => false,
				'message' => $result['message']
			] );
		}

		// Parse and return the generated structure
		return $this->get_response( null, [
			'success' => true,
			'data' => $result['data']
		] );
	}

	/**
	 * Call AI API
	 *
	 * @param string $provider
	 * @param string $api_key
	 * @param string $model
	 * @param int $max_tokens
	 * @param float $temperature
	 * @param string $prompt
	 * @return array
	 */
	private function call_ai_api( $provider, $api_key, $model, $max_tokens, $temperature, $prompt ) {
		$provider = strtolower( sanitize_text_field( $provider ) );
		$allowed_providers = array_keys( \WeDevs\PM\Settings\Controllers\AI_Settings_Controller::get_providers() );

		if ( !in_array( $provider, $allowed_providers, true ) ) {
			return [
				'success' => false,
				'message' => __( 'Invalid AI provider.', 'wedevs-project-manager' )
			];
		}

		// Get provider config
		$providers_config = \WeDevs\PM\Settings\Controllers\AI_Settings_Controller::get_providers();
		$provider_config = $providers_config[ $provider ];

		// Get model config
		$models_config = \WeDevs\PM\Settings\Controllers\AI_Settings_Controller::get_models();
		$model_config = isset( $models_config[ $model ] ) ? $models_config[ $model ] : null;

		// Validate model exists
		if ( !$model_config ) {
			return [
				'success' => false,
				// translators: %s: model name
				'message' => sprintf( __( 'Model "%s" is not available. Please select a valid model from settings.', 'wedevs-project-manager' ), $model )
			];
		}

		// Prepare request based on provider
		if ( $provider === 'openai' ) {
			$url = $provider_config['endpoint'];

			// Check if model supports temperature
			$supports_temperature = $this->model_supports_temperature( $model, $model_config );

			$body = [
				'model' => $model,
				'messages' => [
					[
						'role' => 'user',
						'content' => $prompt
					]
				],
				'max_tokens' => $max_tokens
			];

			// Only add temperature if model supports it
			if ( $supports_temperature ) {
				$body['temperature'] = $temperature;
			}

            $args = [
                'method'    => 'POST',
                'timeout'   => self::TIMEOUT_DURATION,
                'sslverify' => true,
                'headers'   => [
                    'Authorization' => 'Bearer ' . $api_key,
                    'Content-Type'  => 'application/json',
                ],
                'body'      => json_encode( $body ),
            ];
		} elseif ( $provider === 'anthropic' ) {
			$url = $provider_config['endpoint'];

			// Check if model supports temperature
			$supports_temperature = $this->model_supports_temperature( $model, $model_config );

			$body = [
				'model' => $model,
				'messages' => [
					[
						'role' => 'user',
						'content' => $prompt
					]
				],
				'max_tokens' => $max_tokens
			];

			// Only add temperature if model supports it
			if ( $supports_temperature ) {
				$body['temperature'] = $temperature;
			}

            $args = [
                'method'    => 'POST',
                'timeout'   => self::TIMEOUT_DURATION,
                'sslverify' => true,
                'headers'   => [
                    'x-api-key'         => $api_key,
                    'anthropic-version' => '2023-06-01',
                    'Content-Type'      => 'application/json',
                ],
                'body'      => json_encode( $body ),
            ];
		} else { // google
			// For Google, use model_path if available, otherwise use model_id
			$google_model = isset( $model_config['model_path'] ) && !empty( $model_config['model_path'] )
				? $model_config['model_path']
				: $model;

			// Remove 'models/' prefix if present (endpoint already includes it)
			if ( strpos( $google_model, 'models/' ) === 0 ) {
				$google_model = substr( $google_model, 7 );
			}

			$url = str_replace( '{model}', $google_model, $provider_config['endpoint'] ) . '?key=' . urlencode( $api_key );

			// Check if model supports temperature
			$supports_temperature = $this->model_supports_temperature( $model, $model_config );

			// Check if model supports JSON mode
			$supports_json_mode = isset( $model_config['supports_json_mode'] ) && $model_config['supports_json_mode'];

			$generationConfig = [
				'maxOutputTokens' => $max_tokens
			];

			// Only add temperature if model supports it
			if ( $supports_temperature ) {
				$generationConfig['temperature'] = $temperature;
			}

			// Enable JSON mode if supported (forces structured JSON output)
			if ( $supports_json_mode ) {
				$generationConfig['responseMimeType'] = 'application/json';
			}

			$body = [
				'contents' => [
					[
						'parts' => [
							[
								'text' => $prompt
							]
						]
					]
				],
				'generationConfig' => $generationConfig
			];

            $args = [
                'method'    => 'POST',
                'timeout'   => self::TIMEOUT_DURATION,
                'sslverify' => true,
                'headers'   => [
                    'Content-Type' => 'application/json',
                ],
                'body'      => json_encode( $body ),
            ];
		}

		$response = wp_remote_request( $url, $args );

		if ( is_wp_error( $response ) ) {
			$error_msg = $response->get_error_message();
			return [
				'success' => false,
				// translators: %s: error message
				'message' => sprintf( __( 'AI API error: %s', 'wedevs-project-manager' ), esc_html( $error_msg ) )
			];
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		$response_body = wp_remote_retrieve_body( $response );
		$response_data = json_decode( $response_body, true );

		if ( $response_code !== 200 ) {
			$error_message = __( 'AI API request failed.', 'wedevs-project-manager' );

			// Try to extract detailed error message from response
			if ( isset( $response_data['error']['message'] ) ) {
				$error_message = sanitize_text_field( $response_data['error']['message'] );
			} elseif ( isset( $response_data['error'] ) && is_string( $response_data['error'] ) ) {
				$error_message = sanitize_text_field( $response_data['error'] );
			} elseif ( isset( $response_data['message'] ) ) {
				$error_message = sanitize_text_field( $response_data['message'] );
			} elseif ( isset( $response_data['error']['code'] ) ) {
				$error_message = sprintf(
					// translators: %s: error code
					__( 'AI API error (Code: %s)', 'wedevs-project-manager' ),
					sanitize_text_field( $response_data['error']['code'] )
				);
			} else {
				$error_message = sprintf(
					// translators: %d: HTTP status code
					__( 'AI API request failed with status code: %d', 'wedevs-project-manager' ),
					$response_code
				);
			}

			return [
				'success' => false,
				'message' => $error_message
			];
		}

		// Extract content from response
		$content = '';
		if ( $provider === 'openai' ) {
			if ( isset( $response_data['choices'][0]['message']['content'] ) ) {
				$content = $response_data['choices'][0]['message']['content'];
			} elseif ( isset( $response_data['choices'][0]['text'] ) ) {
				// Fallback for older OpenAI API format
				$content = $response_data['choices'][0]['text'];
			}
		} elseif ( $provider === 'anthropic' ) {
			// Anthropic API returns content as an array of content blocks
			if ( isset( $response_data['content'] ) && is_array( $response_data['content'] ) ) {
				// Loop through content blocks to find text
				foreach ( $response_data['content'] as $content_block ) {
					if ( isset( $content_block['type'] ) && $content_block['type'] === 'text' && isset( $content_block['text'] ) ) {
						$content = $content_block['text'];
						break;
					} elseif ( isset( $content_block['text'] ) ) {
						// Fallback: if no type field, assume it's text
						$content = $content_block['text'];
						break;
					}
				}
			}
		} else { // google
			// Check for finish reason first (Google Gemini specific)
			if ( isset( $response_data['candidates'][0]['finishReason'] ) ) {
				$finish_reason = $response_data['candidates'][0]['finishReason'];

				if ( $finish_reason === 'MAX_TOKENS' ) {
					// Response was truncated due to token limit
					$usage_metadata = isset( $response_data['usageMetadata'] ) ? $response_data['usageMetadata'] : [];
					$total_tokens = isset( $usage_metadata['totalTokenCount'] ) ? $usage_metadata['totalTokenCount'] : 0;
					$thoughts_tokens = isset( $usage_metadata['thoughtsTokenCount'] ) ? $usage_metadata['thoughtsTokenCount'] : 0;
					$candidates_tokens = isset( $usage_metadata['candidatesTokenCount'] ) ? $usage_metadata['candidatesTokenCount'] : 0;

					// Try to extract content even if truncated - it might still be parseable
					// We'll attempt to parse it and if it fails, show the error
					$truncated_content = '';
					if ( isset( $response_data['candidates'][0]['content']['parts'][0]['text'] ) ) {
						$truncated_content = $response_data['candidates'][0]['content']['parts'][0]['text'];
					} elseif ( isset( $response_data['candidates'][0]['content']['parts'] ) && is_array( $response_data['candidates'][0]['content']['parts'] ) ) {
						foreach ( $response_data['candidates'][0]['content']['parts'] as $part ) {
							if ( isset( $part['text'] ) ) {
								$truncated_content = $part['text'];
								break;
							}
						}
					}

					// If we have content, try to use it (will be cleaned and parsed later)
					// Otherwise, show error with recommendation
					if ( empty( $truncated_content ) ) {
						// Calculate recommended tokens: thoughts tokens + desired response tokens + buffer
						$recommended_tokens = max( 5000, $thoughts_tokens + 2000 + 500 );

						$error_message = sprintf(
							// translators: %1$d: total tokens used, %2$d: thoughts tokens, %3$d: response tokens, %4$d: recommended tokens
							__( 'Response was truncated due to token limit. Used %1$d tokens total (%2$d for internal reasoning, %3$d for response). This model requires higher token limits. Recommended: at least %4$d tokens for complete responses.', 'wedevs-project-manager' ),
							$total_tokens,
							$thoughts_tokens,
							$candidates_tokens,
							$recommended_tokens
						);

						return [
							'success' => false,
							'message' => $error_message
						];
					} else {
						// We have truncated content - try to parse it
						$content = $truncated_content;
					}
				} elseif ( $finish_reason === 'SAFETY' ) {
					return [
						'success' => false,
						'message' => __( 'Response was blocked due to safety filters. Please try a different project description.', 'wedevs-project-manager' )
					];
				} elseif ( $finish_reason === 'RECITATION' ) {
					return [
						'success' => false,
						'message' => __( 'Response was blocked due to recitation filters. Please try a different project description.', 'wedevs-project-manager' )
					];
				}
			}

			// Extract content from Google response
			if ( isset( $response_data['candidates'][0]['content']['parts'][0]['text'] ) ) {
				$content = $response_data['candidates'][0]['content']['parts'][0]['text'];
			} elseif ( isset( $response_data['candidates'][0]['content']['parts'] ) && is_array( $response_data['candidates'][0]['content']['parts'] ) ) {
				// Loop through parts to find text
				foreach ( $response_data['candidates'][0]['content']['parts'] as $part ) {
					if ( isset( $part['text'] ) ) {
						$content = $part['text'];
						break;
					}
				}
			} elseif ( isset( $response_data['candidates'][0]['output'] ) ) {
				// Fallback for different Google API format
				$content = $response_data['candidates'][0]['output'];
			}
		}

		if ( empty( $content ) ) {
			// Try to provide a more helpful error message
			$error_message = __( 'No content received from AI. The API response may have an unexpected structure.', 'wedevs-project-manager' );

			// Check if there's an error in the response
			if ( isset( $response_data['error'] ) ) {
				if ( isset( $response_data['error']['message'] ) ) {
					$error_message = sprintf(
						// translators: %s: error message
						__( 'AI API error: %s', 'wedevs-project-manager' ),
						sanitize_text_field( $response_data['error']['message'] )
					);
				} elseif ( isset( $response_data['error']['type'] ) ) {
					$error_message = sprintf(
						// translators: %s: error type
						__( 'AI API error: %s', 'wedevs-project-manager' ),
						sanitize_text_field( $response_data['error']['type'] )
					);
				}
			}

			return [
				'success' => false,
				'message' => $error_message
			];
		}

		// Repair and normalize malformed JSON from AI responses
		$content = $this->repair_incomplete_json( $content );

		// Try parsing with JSON_INVALID_UTF8_IGNORE flag if available
		if ( defined( 'JSON_INVALID_UTF8_IGNORE' ) ) {
			$parsed_data = json_decode( $content, true, 512, JSON_INVALID_UTF8_IGNORE );
		} else {
			$parsed_data = json_decode( $content, true );
		}

		if ( json_last_error() !== JSON_ERROR_NONE || !is_array( $parsed_data ) ) {
			$json_error = json_last_error_msg();

			return [
				'success' => false,
				'message' => __( 'The AI response exceeds the token limit. Please try increasing the "Max Tokens" setting in AI Settings and try again.', 'wedevs-project-manager' )
			];
		}

		// Get limits with filter hooks (same as used in prompt generation)
		$limits = $this->get_ai_generation_limits();
		$max_task_groups = $limits['max_task_groups'];
		$max_tasks_per_group = $limits['max_tasks_per_group'];
		$max_initial_tasks = $limits['max_initial_tasks'];
		$max_task_title_length = $limits['max_task_title_length'];

		// Ensure required structure
		$result = [
			'title' => isset( $parsed_data['title'] ) ? sanitize_text_field( $parsed_data['title'] ) : '',
			'description' => isset( $parsed_data['description'] ) ? sanitize_textarea_field( $parsed_data['description'] ) : '',
			'tasks' => [],
			'task_groups' => []
		];

		// Process initial tasks (limit to max_initial_tasks)
		if ( isset( $parsed_data['tasks'] ) && is_array( $parsed_data['tasks'] ) ) {
			$task_count = 0;
			foreach ( $parsed_data['tasks'] as $task ) {
				if ( $task_count >= $max_initial_tasks ) {
					break; // Stop if limit reached
				}
				if ( isset( $task['title'] ) && !empty( $task['title'] ) ) {
					$task_title = sanitize_text_field( $task['title'] );
					// Truncate if exceeds character limit
					if ( strlen( $task_title ) > $max_task_title_length ) {
						$task_title = substr( $task_title, 0, $max_task_title_length );
					}
					$result['tasks'][] = [
						'title' => $task_title
					];
					$task_count++;
				}
			}
		}

		// Process task groups (limit to max_task_groups)
		if ( isset( $parsed_data['task_groups'] ) && is_array( $parsed_data['task_groups'] ) ) {
			$group_count = 0;
			foreach ( $parsed_data['task_groups'] as $group ) {
				if ( $group_count >= $max_task_groups ) {
					break; // Stop if limit reached
				}
				if ( isset( $group['title'] ) && !empty( $group['title'] ) ) {
					$group_data = [
						'title' => sanitize_text_field( $group['title'] ),
						'tasks' => []
					];

					// Process tasks in group (limit to max_tasks_per_group)
					if ( isset( $group['tasks'] ) && is_array( $group['tasks'] ) ) {
						$task_count = 0;
						foreach ( $group['tasks'] as $task ) {
							if ( $task_count >= $max_tasks_per_group ) {
								break; // Stop if limit reached
							}
							if ( isset( $task['title'] ) && !empty( $task['title'] ) ) {
								$task_title = sanitize_text_field( $task['title'] );
								// Truncate if exceeds character limit
								if ( strlen( $task_title ) > $max_task_title_length ) {
									$task_title = substr( $task_title, 0, $max_task_title_length );
								}
								$group_data['tasks'][] = [
									'title' => $task_title
								];
								$task_count++;
							}
						}
					}

					$result['task_groups'][] = $group_data;
					$group_count++;
				}
			}
		}

		return [
			'success' => true,
			'data' => $result
		];
	}

	/**
	 * Check if a model supports temperature parameter
	 *
	 * @param string $model Model ID
	 * @param array|null $model_config Model configuration array
	 * @return bool True if model supports temperature, false otherwise
	 */
	private function model_supports_temperature( $model, $model_config ) {
		if ( !isset( $model_config['supports_custom_temperature'] ) || !$model_config['supports_custom_temperature'] ) {
			return false;
		}

		// Additional safety check: exclude temperature for known models that don't support it
		// even if config says they do (handles edge cases)
		// Models that don't support temperature:
		// - o1 models (reasoning models)
		// - search-api models (search API models)
		// - Any model with "search" in the name
		if ( strpos( $model, 'o1' ) === 0 ||
			 strpos( $model, 'search' ) !== false ||
			 strpos( $model, 'search-api' ) !== false ) {
			return false;
		}

		return true;
	}

	/**
	 * Repair and normalize malformed JSON from AI responses
	 *
	 * Handles common JSON issues:
	 * - Mixed quotes: {'title': 'value'} or {"title": 'value'}
	 * - Double closing quotes: "value""
	 * - Mismatched quotes: 'value" or "value'
	 * - Control characters from truncation
	 * - Incomplete JSON structures
	 *
	 * @param string $content Raw content from AI API
	 * @return string Cleaned and normalized JSON string
	 */
	private function repair_incomplete_json( $content ) {
		// Validate input size to prevent regex DoS attacks
		if ( strlen( $content ) > self::MAX_JSON_CONTENT_SIZE ) {
			return $content; // Return as-is if too large, let json_decode handle the error
		}

		// Extract JSON from response (handle markdown code blocks)
		$content = trim( $content );
		if ( preg_match( '/```json\s*(.*?)\s*```/s', $content, $matches ) ) {
			$content = $matches[1];
		} elseif ( preg_match( '/```\s*(.*?)\s*```/s', $content, $matches ) ) {
			$content = $matches[1];
		}

		// Try to extract JSON object if content contains it
		if ( preg_match( '/\{[\s\S]*\}/', $content, $json_matches ) ) {
			$content = $json_matches[0];
		}

		// Step 1: Remove control characters that cause JSON parsing errors
		$content = preg_replace( '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $content );

		// Step 2: Fix mixed quotes - Convert single quotes to double quotes in JSON string values
		// Pattern 1: {"key": 'value'} -> {"key": "value"}
		$content = preg_replace_callback(
			'/([{,]\s*"[^"]+"\s*:\s*)\'([^\']*?)\'/',
			function( $matches ) {
				// Escape any double quotes inside the single-quoted string
				$value = str_replace( '"', '\\"', $matches[2] );
				return $matches[1] . '"' . $value . '"';
			},
			$content
		);

		// Pattern 2: {'key': 'value'} -> {"key": "value"} (single-quoted keys)
		$content = preg_replace( '/([{,]\s*)\'([^\']+?)\'(\s*:)/', '$1"$2"$3', $content );

		// Pattern 3: Fix mismatched quotes like 'value" or "value'
		$content = preg_replace( '/:\s*\'([^"\']*?)"/', ': "$1"', $content );
		$content = preg_replace( '/:\s*"([^"\']*?)\'/', ': "$1"', $content );

		// Step 3: Fix double/triple quotes at end of strings
		$content = preg_replace( '/""([,}\]\s])/', '"$1', $content );
		$content = preg_replace( '/""$/', '"', $content );
		$content = preg_replace( '/"{3,}/', '"', $content );

		// Try to fix incomplete JSON by finding the last complete structure
		$open_braces = substr_count( $content, '{' ) - substr_count( $content, '}' );
		$open_brackets = substr_count( $content, '[' ) - substr_count( $content, ']' );

		// Check for incomplete strings (unclosed quotes)
		$quote_count = substr_count( $content, '"' );
		$has_incomplete_string = ( $quote_count % 2 !== 0 );

		// If structures are unbalanced or strings are incomplete, find where to truncate
		if ( $open_braces > 0 || $open_brackets > 0 || $has_incomplete_string ) {
			// Find the last position before any incomplete content
			// Look for the last complete object/array structure
			$last_brace = strrpos( $content, '}' );
			$last_bracket = strrpos( $content, ']' );

			// Also check for incomplete strings - find last complete string
			$last_complete_quote = -1;
			if ( $has_incomplete_string ) {
				// Find pairs of quotes working backwards
				$quote_positions = [];
				$content_length = strlen( $content );
				for ( $i = $content_length - 1; $i >= 0; $i-- ) {
					if ( $content[$i] === '"' && ( $i === 0 || $content[$i-1] !== '\\' ) ) {
						$quote_positions[] = $i;
					}
				}
				// If we have an odd number, find the last complete pair
				if ( count( $quote_positions ) > 0 && count( $quote_positions ) % 2 === 1 ) {
					// Remove the last (incomplete) quote
					array_shift( $quote_positions );
				}
				if ( count( $quote_positions ) > 0 ) {
					$last_complete_quote = $quote_positions[0];
				}
			}

			// Determine the best truncation point
			$truncate_at = -1;
			$candidates = array_filter( [ $last_brace, $last_bracket, $last_complete_quote ] );
			if ( !empty( $candidates ) ) {
				$truncate_at = max( $candidates );
			}

			if ( $truncate_at >= 0 ) {
				// Truncate to the last complete structure
				$content = substr( $content, 0, $truncate_at + 1 );

				// If we truncated at a quote, we need to close the string and structure
				if ( $truncate_at === $last_complete_quote ) {
					$content = rtrim( $content, '"' );
					// Find what structure this string was in and close it
					$before_string = substr( $content, 0, strrpos( $content, '"' ) );
					$last_colon = strrpos( $before_string, ':' );
					if ( $last_colon !== false ) {
						// This was a string value, close it and the structure
						$content = rtrim( $content ) . '"}';
					}
				}

				// Close any remaining open structures
				// Recalculate after truncation
				$remaining_open_brackets = substr_count( $content, '[' ) - substr_count( $content, ']' );
				$remaining_open_braces = substr_count( $content, '{' ) - substr_count( $content, '}' );

				for ( $i = 0; $i < $remaining_open_brackets; $i++ ) {
					$content = rtrim( $content ) . ']';
				}
				for ( $i = 0; $i < $remaining_open_braces; $i++ ) {
					$content = rtrim( $content ) . '}';
				}
			}
		}

		return $content;
	}

}
