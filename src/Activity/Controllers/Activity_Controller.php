<?php

namespace WeDevs\PM\Activity\Controllers;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\Activity\Transformers\Activity_Transformer;
use Illuminate\Pagination\Paginator;
use Illuminate\Database\Capsule\Manager as DB;

class Activity_Controller {

    use Transformer_Manager;

    public function index( WP_REST_Request $request ) {
        
        $per_page   = $request->get_param( 'per_page' );
        $page       = $request->get_param( 'page' );
        $project_id = $request->get_param( 'project_id' );

        $per_page   = $per_page ? $per_page : 20;
        $page       = $page ? intval($page) : 1;

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        }); 

        if ( empty( $project_id ) ) {
            $activities = Activity::orderBy( 'created_at', 'DESC' )
            ->paginate( $per_page );
        } else {
            $activities = Activity::where( pm_tb_prefix() .'pm_activities.project_id', $project_id )
            ->orderBy( pm_tb_prefix() .'pm_activities.created_at', 'desc' )
            ->paginate( $per_page );
            
        }
        
        $activity_collection = $activities->getCollection();
        $resource = new Collection( $activity_collection, new Activity_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $activities ) );

        return $this->get_response( $resource );
    }
}

            


            
