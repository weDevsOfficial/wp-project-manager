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
        $project_id = $request->get_param( 'project_id' );

        if ( $project_id ) {
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
        $settings = $request->get_param( 'settings' );

        if ( is_array( $settings ) ) {
            $settings_collection = [];

            foreach ( $settings as $settings_data ) {
                $settings_collection[] = $this->save_settings( $settings_data, $project_id );
            }

            $resource = new Collection( $settings_collection, new Settings_Transformer );
        } else {
            $settings = $this->save_settings( $data, $project_id );
            $resource = new Item( $settings, new Settings_Transformer );
        }

        return $this->get_response( $resource );
    }

    private function save_settings( $data, $project_id = 0 ) {
        if ( $project_id ) {
            $settings = Settings::firstOrCreate([
                'key' => $data['key'],
                'project_id' => $project_id
            ]);
        } else {
            $settings = Settings::firstOrCreate([
                'key' => $data['key']
            ]);
        }

        $settings->update_model( $data );

        return $settings;
    }
}