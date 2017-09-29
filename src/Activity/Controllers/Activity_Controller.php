<?php

namespace CPM\Activity\Controllers;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use CPM\Transformer_Manager;
use CPM\Activity\Models\Activity;
use CPM\Activity\Transformers\Activity_Transformer;

class Activity_Controller {

    use Transformer_Manager;

    public function index( WP_REST_Request $request ) {
        $per_page = $request->get_param( 'per_page' );
        $per_page = $per_page ? $per_page : 15;

        $page = $request->get_param( 'page' );
        $page = $page ? $page : 1;

        $activities = Activity::orderBy( 'created_at', 'DESC' )->paginate( $per_page, ['*'], 'page', $page );

        $activity_collection = $activities->getCollection();
        $resource = new Collection( $activity_collection, new Activity_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $activities ) );

        return $this->get_response( $resource );
    }
}