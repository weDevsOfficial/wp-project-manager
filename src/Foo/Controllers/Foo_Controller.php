<?php

namespace CPM\Foo\Controllers;

use Illuminate\Database\Capsule\Manager as Capsule;
use WP_REST_Request;
use WP_REST_Response;
use CPM\Foo\Models\CPM_Project;

class Foo_Controller {

	public function index() {
        return "foo index";
	}

	public function store( WP_REST_Request $request ) {
        $params = $request->get_params();

        CPM_Project::create([
            'title' => $request->get_param('title'),
            'description' => $request->get_param('description'),
            // 'category_id' => $request->get_param('category_id'),
        ]);

		return new WP_REST_Response( $params );
	}

    public function show( WP_REST_Request $request ) {
        return "showing conent of foo of id " . $request->get_param( 'id' );
    }

    public function update( WP_REST_Request $request ) {
        $params = $request->get_params();

        return $params;
    }

    public function destroy( WP_REST_Request $request ) {
        return "foo of id " . $request->get_param( 'id' ) . " has been deleted.";
    }
}