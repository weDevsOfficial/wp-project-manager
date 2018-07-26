<?php

namespace WeDevs\PM\Category\Controllers;

use WP_REST_Request;
use WeDevs\PM\Category\Models\Category;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Category\Transformers\Category_Transformer;
// use Illuminate\Database\Capsule\Manager as DB;
use \WeDevs\ORM\Eloquent\Facades\DB;
use Illuminate\Pagination\Paginator;

class Category_Controller {

    use Transformer_Manager;

    public function index( WP_REST_Request $request ) {
        $type = $request->get_param( 'type' );

        $per_page = $request->get_param( 'per_page' );
        $per_page = $per_page ? $per_page : 20;

        $page = $request->get_param( 'page' );
        $page = $page ? $page : 1;

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

        if ( $type ) {
            $categories = Category::where('categorible_type', $type);
            if ( $per_page == '-1' ) {
                $per_page = $categories->count();
            }
            $categories = $categories->paginate($per_page);
        } else {

            if ( $per_page == '-1' ) {
                $per_page = Category::count();
            }
            $categories = Category::paginate($per_page);
        }

        $category_collection = $categories->getCollection();
        $resource = new Collection( $category_collection, new Category_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $categories ) );

        return $this->get_response( $resource );
    }

    public function show( WP_REST_Request $request ) {
        $id = $request->get_param( 'id' );

        $category = Category::findOrFail( $id );
        $resource = new Item( $category, new Category_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        $data = [
            'title' => $request->get_param( 'title' ),
            'description' => $request->get_param( 'description' ),
            'categorible_type' => $request->get_param( 'categorible_type' )
        ];
        $data = array_filter( $data );

        $category = Category::create( $data );
        $resource = new Item( $category, new Category_Transformer );
        $response = $this->get_response( $resource );

        $message = [
            'message' => pm_get_text('success_messages.category_created')
        ];

        return $this->get_response( $resource, $message );
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
        $resource = new Item( $category, new Category_Transformer );
        $response = $this->get_response( $resource );

        $message = [
            'message' => pm_get_text('success_messages.category_updated')
        ];

        return $this->get_response( $resource, $message );    }

    public function destroy( WP_REST_Request $request ) {
        $id = $request->get_param( 'id' );
        $category = Category::find( $id );

        $category->projects()->detach();
        $category->delete();

        $message = [
            'message' => pm_get_text('success_messages.category_deleted')
        ];

        return $this->get_response( false, $message );
    }

    public function bulk_destroy( WP_REST_Request $request ) {
        $category_ids = $request->get_param( 'category_ids' );
        
        if ( is_array( $category_ids ) ) {
            DB::table( 'pm_category_project' )->whereIn( 'category_id', $category_ids )->delete();
            Category::whereIn( 'id', $category_ids )->delete();
        }

        $message = [
            'message' => pm_get_text('success_messages.selected_category_deleted')
        ];

        return $this->get_response( false, $message );
    }
}