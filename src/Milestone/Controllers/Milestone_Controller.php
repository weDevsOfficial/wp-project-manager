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
use CPM\Common\Traits\Request_Filter;
use CPM\Common\Models\Meta;

class Milestone_Controller {

    use Transformer_Manager, Request_Filter;

    public function index( WP_REST_Request $request ) {
        $per_page = $request->get_param( 'per_page' );
        $per_page = $per_page ? $per_page : 15;

        $page = $request->get_param( 'page' );
        $page = $page ? $page : 1;

        $milestones = Milestone::paginate( $per_page, ['*'], 'page', $page );

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
        // Grab non empty user input
        $data = $this->extract_non_empty_values( $request );

        // Milestone achieve date
        $achieve_date = $request->get_param( 'achieve_date' );

        // Create a milestone
        $milestone = Milestone::create( $data );

        // Set 'achieve_date' as milestone meta data
        if ( $achieve_date ) {
            Meta::create([
                'entity_id'   => $milestone->id,
                'entity_type' => 'milestone',
                'meta_key'    => 'achieve_date',
                'meta_value'  => make_carbon_date( $achieve_date )
            ]);
        }

        // Transform milestone data
        $resource  = new Item( $milestone, new Milestone_Transformer );

        // Return transformed data
        return $this->get_response( $resource );
    }

    public function update( WP_REST_Request $request ) {
        // Grab non empty user data
        $data = $this->extract_non_empty_values( $request );
        $achieve_date = $request->get_param( 'achieve_date' );

        // Set project id from url parameter
        $project_id   = $request->get_param( 'project_id' );

        // Set milestone id from url parameter
        $milestone_id = $request->get_param( 'milestone_id' );

        // Find milestone associated with project id and milestone id
        $milestone = Milestone::where( 'id', $milestone_id )
            ->where( 'project_id', $project_id )
            ->first();

        if ( $milestone ) {
            $milestone->update( $data );
        }

        if ( $milestone && $achieve_date ) {
            $meta = Meta::firstOrCreate([
                'entity_id'   => $milestone->id,
                'entity_type' => 'milestone',
                'meta_key'    => 'achieve_date',
            ]);

            $meta->update([
                'meta_value' => make_carbon_date( $achieve_date )
            ]);
        }

        $resource = new Item( $milestone, new Milestone_Transformer );

        return $this->get_response( $resource );
    }

    public function destroy( WP_REST_Request $request ) {
        $project_id   = $request->get_param( 'project_id' );
        $milestone_id = $request->get_param( 'milestone_id' );

        $milestone = Milestone::where( 'id', $milestone_id )
            ->where( 'project_id', $project_id )
            ->first();

        $milestone->boardables()->delete();
        $milestone->delete();
    }
}