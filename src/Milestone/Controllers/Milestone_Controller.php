<?php

namespace CPM\Milestone\Controllers;

use WP_REST_Request;
use CPM\Milestone\Models\Milestone;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use CPM\Transformer_Manager;
use CPM\Milestone\Transformer\Milestone_Transformer;

class Milestone_Controller {
    use Transformer_Manager;

    public function index( WP_REST_Request $request ) {
        $milestones = Milestone::paginate();
        
        $milestone_collection = $milestones->getCollection();
        
        $resource = new Collection( $milestone_collection, new Milestone_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $milestones ) );

        return $this->get_response( $resource );
    }

    public function show( WP_REST_Request $request ) {
        $project_id   = $request->get_param( 'project_id' );
        $milestone_id = $request->get_param( 'milestone_id' );

        $milestone = Milestone::where( 'id', $milestone_id )
            ->where( 'project_id', $project_id )
            ->first();

        $resource = new Item( $milestone, new Milestone_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        
        $data = [
            'title'       => $request->get_param( 'title' ),
            'description' => $request->get_param( 'description' ),
            'order'       => $request->get_param( 'order' ),
            'project_id'  => $request->get_param( 'project_id' )
        ];
        $data      = array_filter( $data );
        
        $milestone = Milestone::create( $data );
        
        $resource  = new Item( $milestone, new Milestone_Transformer );

        return $this->get_response( $resource );
    }

    public function update( WP_REST_Request $request ) {
        $project_id   = $request->get_param( 'project_id' );
        $milestone_id = $request->get_param( 'milestone_id' );

        $milestone = Milestone::where( 'id', $milestone_id )
            ->where( 'project_id', $project_id )
            ->first();

        $data = [
            'title'       => $request->get_param( 'title' ),
            'description' => $request->get_param( 'description' ),
            'order'       => $request->get_param( 'order' ),
        ];
        $data = array_filter( $data );

        $milestone->update( $data );

        $resource = new Item( $milestone, new Milestone_Transformer );

        return $this->get_response( $resource );
    }

    public function destroy( WP_REST_Request $request ) {
        $project_id   = $request->get_param( 'project_id' );
        $milestone_id = $request->get_param( 'milestone_id' );

        $milestone = Milestone::where( 'id', $milestone_id )
            ->where( 'project_id', $project_id )
            ->first();

        $milestone->delete();
    }
}