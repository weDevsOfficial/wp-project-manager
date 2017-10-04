<?php

namespace CPM\Settings\Controllers;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use CPM\Common\Traits\Request_Filter;
use CPM\Settings\Models\Settings;
use CPM\Settings\Transformers\Settings_Transformer;
use CPM\Transformer_Manager;

class Settings_Controller {

    use Request_Filter, Transformer_Manager;

    public function index( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project' );

        if ( $project ) {
            $settings = Settings::where( 'project_id', $project_id )->get();
        } else {
            $settings = Settings::whereNull( 'project_id' )->get();
        }

        $resource = new Collection( $settings, new Settings_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        $data = $this->extract_non_empty_values( $request );
        $project_id = $request->get_param( 'project_id' );

        if ( $project_id ) {
            $settings = Settings::firstOrCreate([
                'key' => $request->get_param( 'key' ),
                'project_id' => $project_id
            ]);
        } else {
            $settings = Settings::firstOrCreate([
                'key' => $request->get_param( 'key' )
            ]);
        }

        $settings->update_model( $data );

        $resource = new Item( $settings, new Settings_Transformer );

        return $this->get_response( $resource );
    }
}