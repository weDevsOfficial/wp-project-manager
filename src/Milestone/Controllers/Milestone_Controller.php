<?php

namespace WeDevs\PM\Milestone\Controllers;

use WP_REST_Request;
use WeDevs\PM\Milestone\Models\Milestone;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Milestone\Transformers\Milestone_Transformer;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\Common\Models\Meta;
use Carbon\Carbon;
use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Pagination\Paginator;

class Milestone_Controller {

    use Transformer_Manager, Request_Filter;

    private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    public function index( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $per_page   = $request->get_param( 'per_page' );
        $status     = $request->get_param( 'status' );
        $per_page   = $per_page ? $per_page : -1;

        $page       = $request->get_param( 'page' );
        $page       = $page ? $page : 1;

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

        $milestones = Milestone::with('metas')
            ->where( 'project_id', $project_id );

        if ( ! empty( $status ) ) {
            $milestones = $milestones->where( 'status',  $status);
        }

        $milestones = apply_filters("pm_milestone_index_query", $milestones, $project_id, $request );

        if ( $per_page == '-1' ) {
            $per_page = $milestones->count();
        }

        $milestones = $milestones->paginate( $per_page );

        $milestone_collection = $milestones->getCollection();

        $resource = new Collection( $milestone_collection, new Milestone_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $milestones ) );
        return $this->get_response( $resource );
    }

    private function get_milestone_collection( $metas = [] ) {
        $milestones = [];

        foreach ($metas as $meta) {
            $milestones[] = $meta->milestone;
        }

        return $milestones;
    }

    public function show( WP_REST_Request $request ) {
        $project_id   = $request->get_param( 'project_id' );
        $milestone_id = $request->get_param( 'milestone_id' );

        $milestone = Milestone::where( 'id', $milestone_id )
            ->where( 'project_id', $project_id );
        $milestone = apply_filters( "pm_milestone_show_query", $milestone, $project_id, $request );
        $milestone = $milestone->first();
        if ( $milestone == NULL ) {
            return $this->get_response( null,  [
                'message' => pm_get_text('success_messages.no_element')
            ] );
        }
        $resource = new Item( $milestone, new Milestone_Transformer );

        return $this->get_response( $resource );
    }

    public static function create_milestone( $data ) {
        $self = self::getInstance();
        $is_private    = $data[ 'privacy' ];
        $data['is_private']    = $is_private == 'true' || $is_private === true ? 1 : 0;
        // Milestone achieve date
        $achieve_date = $data['achieve_date'];

        // Create a milestone
        $milestone    = Milestone::create( $data );

        // Set 'achieve_date' as milestone meta data
        Meta::create([
            'entity_id'   => $milestone->id,
            'entity_type' => 'milestone',
            'meta_key'    => 'achieve_date',
            'meta_value'  => $achieve_date ? date( 'Y-m-d H:i:s', strtotime( $achieve_date ) ) : null,
            'project_id'  => $milestone->project_id,
        ]);

        do_action("pm_new_milestone_before_response", $milestone, $data );
        // Transform milestone data
        $resource  = new Item( $milestone, new Milestone_Transformer );

        $message = [
            'message' => pm_get_text('success_messages.milestone_created')
        ];
        $response = $self->get_response( $resource, $message );

        do_action( 'cpm_milestone_new', $milestone->id, $data[ 'project_id' ], $data );
        do_action("pm_after_new_milestone", $response, $data );

        return $response;
    }

    public function store( WP_REST_Request $request ) {
        // Grab non empty user input
        $data = $this->extract_non_empty_values( $request );
        $is_private    = $request->get_param( 'privacy' );
        $data['is_private']    = $is_private == 'true' || $is_private === true ? 1 : 0;

        // Milestone achieve date
        $achieve_date = $request->get_param( 'achieve_date' );

        // Create a milestone
        $milestone    = Milestone::create( $data );

        // Set 'achieve_date' as milestone meta data
        Meta::create([
            'entity_id'   => $milestone->id,
            'entity_type' => 'milestone',
            'meta_key'    => 'achieve_date',
            'meta_value'  => $achieve_date ? date( 'Y-m-d H:i:s', strtotime( $achieve_date ) ) : null,
            'project_id'  => $milestone->project_id,
        ]);

        do_action("pm_new_milestone_before_response", $milestone, $request->get_params() );
        // Transform milestone data
        $resource  = new Item( $milestone, new Milestone_Transformer );

        $message = [
            'message' => pm_get_text('success_messages.milestone_created')
        ];
        $response = $this->get_response( $resource, $message );

        do_action( 'cpm_milestone_new', $milestone->id, $request->get_param( 'project_id' ), $request->get_params() );
        do_action("pm_after_new_milestone", $response, $request->get_params() );

        return $response;
    }

    public function update( WP_REST_Request $request ) {
        // Grab non empty user data
        $data         = $this->extract_non_empty_values( $request );
        $achieve_date = $request->get_param( 'achieve_date' );
        $status       = $request->get_param( 'status' );

        $is_private    = $request->get_param( 'privacy' );
        $data['is_private']    = $is_private == 'true' || $is_private === true ? 1 : 0;

        // Set project id from url parameter
        $project_id   = $request->get_param( 'project_id' );

        // Set milestone id from url parameter
        $milestone_id = $request->get_param( 'milestone_id' );

        // Find milestone associated with project id and milestone id
        $milestone    = Milestone::where( 'id', $milestone_id )
            ->where( 'project_id', $project_id )
            ->first();

        if ( $milestone ) {
            $milestone->update_model( $data );
        }

        if ( $milestone && $achieve_date ) {
            $meta = Meta::firstOrCreate([
                'entity_id'   => $milestone->id,
                'entity_type' => 'milestone',
                'meta_key'    => 'achieve_date',
                'project_id'  => $milestone->project_id,
            ]);

            $meta->meta_value = date( 'Y-m-d H:i:s', strtotime( $achieve_date ) );
            $meta->save();
        }

        do_action( 'cpm_milestone_update', $milestone_id, $project_id, $request->get_params() );
        do_action("pm_update_milestone_before_response", $milestone, $request->get_params() );
        $resource = new Item( $milestone, new Milestone_Transformer );

        $message = [
            'message' => pm_get_text('success_messages.milestone_updated')
        ];

        $response = $this->get_response( $resource, $message );
        do_action("pm_after_update_milestone", $response, $request->get_params() );

        return $response;
    }

    public function destroy( WP_REST_Request $request ) {
        $project_id   = $request->get_param( 'project_id' );
        $milestone_id = $request->get_param( 'milestone_id' );

        $milestone = Milestone::where( 'id', $milestone_id )
            ->where( 'project_id', $project_id )
            ->first();

        $milestone->boardables()->delete();
        $milestone->metas()->delete();
        $milestone->delete();

        $message = [
            'message' => pm_get_text('success_messages.milestone_deleted')
        ];
        do_action( 'cpm_milestone_delete', $milestone_id, false );

        return $this->get_response(false, $message);
    }
    public function privacy( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $milestone_id = $request->get_param( 'milestone_id' );
        $privacy = $request->get_param( 'is_private' );
        $milestone = Milestone::find( $milestone_id );
        $milestone->update_model( [
            'is_private' => $privacy
        ] );
        pm_update_meta( $milestone_id, $project_id, 'milestone', 'privacy', $privacy );
        return $this->get_response( NULL);
    }
}
