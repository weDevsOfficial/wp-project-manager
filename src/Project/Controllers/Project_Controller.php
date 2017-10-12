<?php

namespace CPM\Project\Controllers;

use WP_REST_Request;
use CPM\Project\Models\Project;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use CPM\Transformer_Manager;
use CPM\Project\Transformer\Project_Transformer;
use CPM\Common\Traits\Request_Filter;
use CPM\User\Models\User;
use CPM\User\Models\User_Role;
use CPM\Category\Models\Category;
use CPM\Common\Traits\File_Attachment;

class Project_Controller {

	use Transformer_Manager, Request_Filter, File_Attachment;

	public function index( WP_REST_Request $request ) {
		$per_page = $request->get_param( 'per_page' );
		$page     = $request->get_param( 'page' );
		$status   = $request->get_param( 'status' );
		$category = $request->get_param( 'category' );

		$per_page_from_settings = get_cpm_settings( 'project_per_page' );
		$per_page_from_settings = $per_page_from_settings ? $per_page_from_settings : 15;

		$per_page = $per_page ? $per_page : $per_page_from_settings;
		$page     = $page ? $page : 1;

		$projects = $this->fetch_projects( $category, $status, $per_page, $page );

		$project_collection = $projects->getCollection();
		$resource = new Collection( $project_collection, new Project_Transformer );

		$resource->setMeta( $this->projects_meta( $category ) );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $projects ) );
        
        return $this->get_response( $resource );
    }

    private function projects_meta( $category ) {
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

		$meta  = [
			'total_projects'   => $total_projects,
			'total_incomplete' => $total_incomplete,
			'total_complete'   => $total_complete,
			'total_pending'    => $total_pending,
			'totla_archived'   => $total_archived,
		];

		return $meta;
    }

    private function fetch_projects( $category, $status, $per_page = 15, $page = 1 ) {
    	$projects = $this->fetch_projects_by_category( $category );

    	if ( in_array( $status, Project::$status ) ) {
			$status   = array_search( $status, Project::$status );
			$projects = $projects->where( 'status', $status );
		}

		return $projects->paginate( $per_page, ['*'], 'page', $page );
    }

    private function fetch_projects_by_category( $category = null ) {
    	$category = Category::where( 'categorible_type', 'project' )
    		->where( 'id', $category )
    		->first();

    	if ( $category ) {
    		$projects = $category->projects()->orderBy( 'created_at', 'DESC' );
    	} else {
    		$projects = Project::orderBy( 'created_at', 'DESC' );
    	}

    	return $projects;
    }

	public function show( WP_REST_Request $request ) {
		$id 	  = $request->get_param('id');
		$project  =  Project::find( $id );
		$resource = new Item( $project, new Project_Transformer );

        return $this->get_response( $resource );
	}

	public function store( WP_REST_Request $request ) {
		// Extraction of no empty inputs and create project
		$data    = $this->extract_non_empty_values( $request );
		$project = Project::create( $data );

		// Establishing relationships
		$category_ids = $request->get_param( 'categories' );
		$project->categories()->sync( $category_ids );

		$assignees = $request->get_param( 'assignees' );

		if ( is_array( $assignees ) ) {
			$this->assign_users( $project, $assignees );
		}

		// Transforming database model instance
		$resource = new Item( $project, new Project_Transformer );

        return $this->get_response( $resource );
	}

	public function update( WP_REST_Request $request ) {
		// Extract non empty inputs and update project
		$data    = $this->extract_non_empty_values( $request );
		$project = Project::find( $data['id'] );

		$project->update_model( $data );

		// Establishing relationships
		$category_ids = $request->get_param( 'categories' );
		$project->categories()->sync( $category_ids );

		$assignees = $request->get_param( 'assignees' );

		if ( is_array( $assignees ) ) {
			$project->assignees()->detach();
			$this->assign_users( $project, $assignees );
		}

		$resource = new Item( $project, new Project_Transformer );

        return $this->get_response( $resource );
	}

	public function destroy( WP_REST_Request $request ) {
		$id = $request->get_param('id');

		// Find the requested resource
		$project =  Project::find( $id );

		// Delete related resourcess
		$project->categories()->detach();
		$project->task_lists()->delete();
		$project->tasks()->delete();
		$project->discussion_boards()->delete();
		$project->milestones()->delete();
		$project->comments()->delete();
		$project->assignees()->detach();
		$this->detach_files( $project );
		$project->settings()->delete();
		$project->meta()->delete();

		// Delete the main resource
		$project->delete();
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


}
