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

class Project_Controller {
	use Transformer_Manager, Request_Filter;

	public function index( WP_REST_Request $request ) {
		$projects = Project::paginate();
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
		$project = Project::create( array_filter( $data ) );

		// Establishing relationship
		$category_ids = $request->get_param( 'categories' );

		if ( is_array( $category_ids ) ) {
			$project->categories()->sync( $category_ids );
		}

		// Transforming database model instance
		$resource = new Item( $project, new Project_Transformer );

        return $this->get_response( $resource );
	}

	public function update( WP_REST_Request $request ) {
		$data    = $this->extract_non_empty_values( $request );
		$project = Project::find( $data['id'] );

		$project->update( array_filter( $data ) );

		// Establishing relationship with categories
		$category_ids = explode(',', $request->get_param( 'categories' ) );

		if ( !empty( $category_ids ) ) {
			$project->categories()->sync( $category_ids );
		}

		$resource = new Item( $project, new Project_Transformer );

        return $this->get_response( $resource );
	}

	public function destroy( WP_REST_Request $request ) {
		$id = $request->get_param('id');

		// Find the requested resource
		$project =  Project::with([
			'task_lists',
			'tasks',
			'discussion_threads',
			'milestones',
			'comments',
			// 'files'
		])->find( $id );

		// Delete related resourcess
		$project->categories()->detach();
		$project->task_lists()->delete();
		$project->tasks()->delete();
		$project->discussion_threads()->delete();
		$project->milestones()->delete();
		$project->comments()->delete();
		// $project->files()->delete();

		// Delete the main resource
		$project->delete();
	}
}
