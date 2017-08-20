<?php

namespace CPM\Project\Controllers;

use Illuminate\Database\Capsule\Manager as Capsule;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
use CPM\Project\Models\Project;

class Project_Controller {

	public function index( WP_REST_Request $request ) {
		return Project::all();
        return "Working project index";
	}

	public function show( WP_REST_Request $request ) {
		$id = $request->get_param('id');

		$project =  Project::find( $id );

		return $project;
	}

	public function save( WP_REST_Request $request ) {
		$data    = $request->get_params();
		$project = Project::create( array_filter( $data ) );

		if ( $project ) {
			$data = [
				'code'    => 'project_created',
				'message' => __( 'A new project has been created successfully.', 'cpm' ),
				'data' => [
					'status'     => 200,
					'project_id' => $project->id,
				],
			];

			return new WP_REST_Response( $data );
		}

		// Add a custom status code
		$response->set_status( 401 );

		return $response;
	}

	public function update( WP_REST_Request $request ) {
		$data    = $request->get_params();
		$update  = Project::find( $data['id'] )
						->update( array_filter( $data ) );

		if ( $update ) {
			$data = [
				'code'    => 'project_created',
				'message' => __( 'Project has been update successfully.', 'cpm' ),
				'data' => [
					'status'     => 200,
					'project_id' => $data['id'],
				],
			];

			return new WP_REST_Response( $data );
		}

		// Add a custom status code
		$response->set_status( 401 );

		return $response;
	}

	public function destroy( WP_REST_Request $request ) {
		$id = $request->get_param('id');

		$project =  Project::find( $id );

		if ( $project ) {
			$project->delete();

			$data = [
				'code'    => 'Delete_project',
				'message' => __( 'Project has been deleted successfully.', 'cpm' ),
				'data' => [
					'status'     => 200,
					'project_id' => $id,
				],
			];

			return new WP_REST_Response( $data );
		}

		if ( ! $project ) {
			$data = [
				'code'    => 'Update_project',
				'message' => __( 'No project found.', 'cpm' ),
				'data' => [
					'status'     => 401,
					'project_id' => $id,
				],
			];

			return new WP_REST_Response( $data );
		}

		return $response;
	}
}