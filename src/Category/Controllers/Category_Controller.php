<?php

namespace CPM\Category\Controllers;

use WP_REST_Request;
use CPM\Category\Models\Category;

class Category_Controller {
    public function index( WP_REST_Request $request ) {
        $categories = Category::all();

        return $categories;
    }

    public function show( WP_REST_Request $request ) {
        $id = $request->get_param( 'id' );
        $category = Category::findOrFail( $id );

        return $category;
    }

    public function store( WP_REST_Request $request ) {
        $data = [
            'title' => $request->get_param( 'title' ),
            'description' => $request->get_param( 'description' ),
            'categorible_type' => $request->get_param( 'categorible_type' )
        ];
        $data = array_filter( $data );

        $category = Category::create( $data );

        return $category;
    }

    public function update( WP_REST_Request $request ) {
        $id = $request->get_param( 'id' );

        $data = [
            'title' => $request->get_param( 'title' ),
            'description' => $request->get_param( 'description' ),
            'categorible_type' => $request->get_param( 'categorible_type' )
        ];

        $category = Category::findOrFail( $id );
        $data = array_filter( $data );

        $category->update( $data );

        return $category;
    }

    public function destroy( WP_REST_Request $request ) {
        $id = $request->get_param( 'id' );
        $category = Category::findOrFail( $id );
        $category->delete();
    }
}