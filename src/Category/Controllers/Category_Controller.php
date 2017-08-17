<?php

namespace CPM\Category\Controllers;

use WP_REST_Request;
use CPM\Category\Models\Category;

class Category_Controller {
    public function index( WP_REST_Request $request ) {
        return "index";
    }

    public function show( WP_REST_Request $request ) {
        return "show";
    }

    public function store( WP_REST_Request $request ) {
        $category = new Category();
        $category->title = $request->get_param('title');
        $cateogry->description = $request->get_param('description');
        $category->categorible_type = $request->get_param('categorible_type');
        $category->save();

        return $category;
    }

    public function update( WP_REST_Request $request ) {
        return "update";
    }

    public function destroy( WP_REST_Request $request ) {
        return "delete";
    }
}