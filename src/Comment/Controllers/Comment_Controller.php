<?php

namespace CPM\Comment\Controllers;

use WP_REST_Request;

class Comment_Controller {
    public function index( WP_REST_Request $request ) {
        return "index";
    }

    public function show( WP_REST_Request $request ) {
        return "show";
    }

    public function store( WP_REST_Request $request ) {
        return "store";
    }

    public function update( WP_REST_Request $request ) {
        return "update";
    }

    public function destroy( WP_REST_Request $request ) {
        return "destroy";
    }
}