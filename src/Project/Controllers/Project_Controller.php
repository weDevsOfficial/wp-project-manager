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

class Project_Controller {

	use Transformer_Manager, Request_Filter;

	public function index( WP_REST_Request $request ) {
		$per_page = $request->get_param( 'per_page' );
		$per_page = $per_page ? $per_page : 15;

		$page = $request->get_param( 'page' );
		$page = $page ? $page : 1;

		$projects = Project::paginate( $per_page, ['*'], 'page', $page );

		$project_collection = $projects->getCollection();
		$resource = new Collection( $project_collection, new Project_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $projects ) );

        return $this->get_response( $resource );
    }

	public function show( WP_REST_Request $request ) {
		$id 	  = $request->get_param('id');
		$project  =  Project::find( $id );
		$resource = new Item( $project, new Project_Transformer );

        return $this->get_response( $resource );
	}

	public function save( WP_REST_Request $request ) {
		// Extraction of no empty inputs and create project
		$data    = $this->extract_non_empty_values( $request );
		$project = Project::create( $data );

		// Establishing relationship
		$category_ids = $request->get_param( 'categories' );

		if ( is_array( $category_ids ) ) {
			$project->categories()->sync( $category_ids );
		}

		$assignees = $request->get_param( 'assignees' );

		if ( is_array( $assignees ) ) {
			foreach ( $assignees as $assignee ) {
				$project->assignees()->syncWithoutDetaching([
					$assignee['user_id'] => [
						'role_id' => $assignee['role_id']
					]
				]);
			}
		}

		// Transforming database model instance
		$resource = new Item( $project, new Project_Transformer );

        return $this->get_response( $resource );
	}

	public function update( WP_REST_Request $request ) {
		$data    = $this->extract_non_empty_values( $request );
		$project = Project::find( $data['id'] );

		$project->update( $data );

		// Establishing relationship
		$category_ids = $request->get_param( 'categories' );

		if ( is_array( $category_ids ) ) {
			$project->categories()->sync( $category_ids );
		}

		$assignees = $request->get_param( 'assignees' );
		$project->assignees()->detach();

		if ( is_array( $assignees ) ) {
			foreach ( $assignees as $assignee ) {
				$project->assignees()->syncWithoutDetaching([
					$assignee['user_id'] => [
						'role_id' => $assignee['role_id']
					]
				]);
			}
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
		$project->discussion_threads()->delete();
		$project->milestones()->delete();
		$project->comments()->delete();
		$project->assignees()->detach();

		// Delete the main resource
		$project->delete();
	}

}
