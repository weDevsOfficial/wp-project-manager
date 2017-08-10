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

	public function save( WP_REST_Request $request ) {
		$data = $request->get_params();

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

		$data = [
			'code'    => 'no_author',
			'message' => 'Invalid author',
			'data' => [
				'status'     => 200,
				'project_id' => $project->id,
			],
		];

		// Create the response object
		$response = new WP_REST_Response( $data );

		// Add a custom status code
		$response->set_status( 401 );

		return $response;
	}

	public function update( WP_REST_Request $request ) {
		$data = $request->get_params();

		// Create the response object
		$response = new WP_REST_Response( $data );

		// Add a custom status code
		$response->set_status( 401 );

		return $response;
	}
}