<?php

namespace CPM\Discussion_Board\Controllers;

use WP_REST_Request;
use CPM\Discussion_Board\Models\Discussion_Board;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use CPM\Transformer_Manager;
use CPM\Discussion_Board\Transformer\Discussion_Board_Transformer;

class Discussion_Board_Controller {
    use Transformer_Manager;

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
        return "delete";
    }
}