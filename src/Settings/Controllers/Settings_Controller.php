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
        $project_id = intval( $request->get_param( 'project_id' ) );
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
        $project_id = intval( $request->get_param( 'project_id' ) );
        $settings   = $request->get_param( 'settings' );
        $id         = intval( $request->get_param( 'id' ) );
        
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

        do_action( 'wedevs_pm_after_save_settings', $settings );
        
        $message = [
            'message' => __( 'Settings has been changed successfully.', 'wedevs-project-manager' )
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
            // Ensure project_id is in the data array for update_model
            $data['project_id'] = $project_id;
        } else {
            $settings = Settings::firstOrCreate([
                'key' => $data['key']
            ]);
        }

        $settings->update_model( $data );
        
        return $settings;
    }

    public function destroy( WP_REST_Request $request ) {
        $id = intval( $request->get_param( 'id' ) );

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

        return wedevs_pm_get_setting( $key );
    }

    public function pluck_with_project(WP_REST_Request $request) {
        $project_id = $request->get_param('project_id');
        $key        = $request->get_param('key');

        return wedevs_pm_get_setting( $key, $project_id );
    }

    public function notice(WP_REST_Request $request) {
        $action = $request->get_param('action');
        // verify the nonce
        if (!wp_verify_nonce($request->get_param('_wpnonce'), 'wp_rest')) {
            return $this->get_response(false, ['message' => __('Nonce verification failed', 'wedevs-project-manager')]);
        }

        update_option( $action, 'complete' );
    }

    /**
     * Reveal a single hidden setting in clear text. Admin-only, nonce-required.
     * Used by the Settings UI to show the actual stored token on explicit "show" toggle.
     */
    public function reveal( WP_REST_Request $request ) {
        if ( ! current_user_can( 'manage_options' ) ) {
            return new \WP_Error( 'permission_denied', __( 'Forbidden.', 'wedevs-project-manager' ), [ 'status' => 403 ] );
        }

        $nonce = $request->get_header( 'x_wp_nonce' );
        if ( empty( $nonce ) ) {
            $nonce = $request->get_param( '_wpnonce' );
        }
        if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
            return new \WP_Error( 'invalid_nonce', __( 'Nonce verification failed.', 'wedevs-project-manager' ), [ 'status' => 403 ] );
        }

        $key = sanitize_key( $request->get_param( 'key' ) );
        if ( empty( $key ) || ! in_array( $key, Settings::$hideSettings, true ) ) {
            return new \WP_Error( 'invalid_key', __( 'Invalid setting key.', 'wedevs-project-manager' ), [ 'status' => 400 ] );
        }

        $row = Settings::where( 'key', $key )->whereNull( 'project_id' )->first();
        if ( ! $row || empty( $row->value ) ) {
            return $this->get_response( false, [ 'value' => '' ] );
        }

        $value = $row->value;

        // AI API keys are encrypted at rest; decrypt for the reveal response only.
        if ( strpos( $key, 'ai_api_key_' ) === 0 ) {
            $decrypted = AI_Settings_Controller::decrypt_api_key_static( $value );
            if ( $decrypted !== '' ) {
                $value = $decrypted;
            }
        }

        return $this->get_response( false, [ 'key' => $key, 'value' => $value ] );
    }
}
