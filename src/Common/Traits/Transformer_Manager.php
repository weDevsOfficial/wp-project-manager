<?php

namespace WeDevs\PM\Common\Traits;

use League\Fractal;
use League\Fractal\Manager as Manager;
use League\Fractal\Serializer\DataArraySerializer;

trait Transformer_Manager {

    public function get_response( $resource, $extra = [] ) {
        $manager = new Manager();
        $manager->setSerializer( new DataArraySerializer() );

        if ( isset( $_GET['with'] ) ) {
            $manager->parseIncludes( $_GET['with'] );
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

        if ( isset( $_GET['with'] ) ) {
            $manager->parseIncludes( $_GET['with'] );
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