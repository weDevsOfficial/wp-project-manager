<?php

namespace WeDevs\PM\Settings\Controllers;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\Settings\Models\Settings;
use WeDevs\PM\Settings\Transformers\Settings_Transformer;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Core\File_System\File_System;
use WeDevs\PM\Settings\Helper\Settings as Helper;

class Settings_Controller {

    use Request_Filter, Transformer_Manager;

    public function index( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $key        = $request->get_param( 'key' );

        if ( $project_id && $key ) {
            $settings = Settings::where( 'project_id', $project_id )
                ->where( 'key', $key )
                ->first();
            if( $settings ){
                $resource = new Item( $settings, new Settings_Transformer );
            }else{
               $resource = null; 
            }
            return $this->get_response( $resource );
        } else if ( $key ) {
            $settings = Settings::where( 'key', $key )->get();
            $resource = new Collection( $settings, new Settings_Transformer );

            return $this->get_response( $resource );
        } else if ( $project_id ) {
            $settings = Settings::where( 'project_id', $project_id )->get();
            $resource = new Collection( $settings, new Settings_Transformer );

            return $this->get_response( $resource );
        } else {
            $settings = Settings::whereNull( 'project_id' )->get();
            $resource = new Collection( $settings, new Settings_Transformer );

            return $this->get_response( $resource );
        }

        
    }

    public function store( WP_REST_Request $request ) {
        $data       = $this->extract_non_empty_values( $request );
        $project_id = $request->get_param( 'project_id' );
        $settings   = $request->get_param( 'settings' );
        $id         = $request->get_param( 'id' );
        
        if ( is_array( $settings ) ) {
            $settings_collection = [];

            foreach ( $settings as $settings_data ) {
                $settings_collection[] = $this->save_settings( $settings_data, $project_id, $id );
            }

            $resource = new Collection( $settings_collection, new Settings_Transformer );
            ( new Helper )->update_project_permission( $settings, $project_id );
        } else {

            $settings = $this->save_settings( $data, $project_id, $id );
            $resource = new Item( $settings, new Settings_Transformer );
            ( new Helper )->update_project_permission( $data, $project_id );
        }

        do_action( 'pm_after_save_settings', $settings );
        
        $message = [
            'message' => pm_get_text('success_messages.setting_saved')
        ];
        return $this->get_response( $resource, $message );
    }

    public static function save_settings( $data, $project_id = 0, $id = 0 ) {
        $add_more = ! empty( $data['value']['settings_add_more_value'] ) && ( $data['value']['settings_add_more_value'] == 'data_continue' ) ? true : false; 
        
        if ( $add_more ) {
            return Settings::create([
                'key'        => $data['key'],
                'project_id' => $project_id,
                'value'      => $data['value']['data']
            ]);
        }

        if ( intval( $id ) ) {
            $settings = Settings::firstOrCreate([
                'key' => $data['key'],
                'id' => $id
            ]);
        } else if ( $project_id ) {
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

    public function destroy( WP_REST_Request $request ) {
        $id = $request->get_param( 'id' );

        $settings = Settings::where( 'id', $id )
            ->first();

        $settings->delete();

        $message = [
            'message' => __('Delete settings record', 'wedevs-project-manager')
        ];

        return $this->get_response(false, $message);
    }

    public function pluck_without_project(WP_REST_Request $request) {
        $key = $request->get_param('key');

        return pm_get_setting( $kye );
    }

    public function pluck_with_project(WP_REST_Request $request) {
        $project_id = $request->get_param('project_id');
        $key        = $request->get_param('key');

        return pm_get_setting( $kye, $project_id );
    }

    public function notice(WP_REST_Request $request) {
        $action = $request->get_param('action');
        
        update_option( $action, 'complete' );
    }
}
