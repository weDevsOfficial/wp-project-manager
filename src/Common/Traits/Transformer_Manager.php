<?php

namespace WeDevs\PM\Common\Traits;

use League\Fractal;
use League\Fractal\Manager as Manager;
use League\Fractal\Serializer\DataArraySerializer;

trait Transformer_Manager {

    use Request_Context;

    public function get_response( $resource, $extra = [] ) {
        $manager = new Manager();
        $manager->setSerializer( new DataArraySerializer() );

        // Set request context for transformers - nonce already verified at REST API layer.
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Nonce verified at REST API layer via register_rest_route() in WP_Router.
        self::set_request_context( $_GET );

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Nonce verified at REST API layer via register_rest_route() in WP_Router.
        if ( isset( $_GET['with'] ) ) {
            // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Nonce verified at REST API layer via register_rest_route() in WP_Router.
            $manager->parseIncludes( sanitize_text_field( wp_unslash( $_GET['with'] ) ) ) ;
        }

        if ($resource) {
            $response = $manager->createData( $resource )->toArray();

        } else {
            $response = [];
        }
       
        return array_merge( $extra, $response );
    }

    public function get_json_response( $resource, $extra = [] ) {
        $manager = new Manager();
        $manager->setSerializer( new DataArraySerializer() );

        // Set request context for transformers - nonce already verified at REST API layer.
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Nonce verified at REST API layer via register_rest_route() in WP_Router.
        self::set_request_context( $_GET );
        
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Nonce verified at REST API layer via register_rest_route() in WP_Router.
        if ( isset( $_GET['with'] ) ) {
            // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Nonce verified at REST API layer via register_rest_route() in WP_Router.
            $manager->parseIncludes( sanitize_text_field( wp_unslash( $_GET['with'] ) ) );
        }

        if ($resource) {
            $response = $manager->createData( $resource )->toArray();
        } else {
            $response = [];
        }

        return json_encode( array_merge( $extra, $response ) );
    }

    public function set_created_by( $resource ) {
        $user = wp_get_current_user();
        $resource->created_by = $user->ID;
        $resource->updated_by = $user->ID;
        return $resource;
    }

    public function set_updated_by( $resource ) {
        $user = wp_get_current_user();
        $resource->updated_by = $user->ID;
        return $resource;
    }
}
