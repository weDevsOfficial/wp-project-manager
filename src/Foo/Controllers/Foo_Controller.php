<?php

namespace CPM\Foo\Controllers;

use WP_REST_Request;
use WP_REST_Response;

class Foo_Controller {

	public function index( WP_REST_Request $request) {
        // wirte code to list something

        return $request->get_params();
	}

	public function store( WP_REST_Request $request ) {
        $params = $request->get_params();

        // write code to store something

		return new WP_REST_Response( $params );
	}

    public function show( WP_REST_Request $request ) {
        // write code to show someting

        return $request->get_params();
    }

    public function update( WP_REST_Request $request ) {
        $params = $request->get_params();

        // write code to update something

        return $params;
    }

    public function destroy( WP_REST_Request $request ) {
        // write code to delete something

        return $request->get_params();
    }
}