<?php

namespace WeDevs\PM\Common\Traits;

use League\Fractal;
use League\Fractal\Manager as Manager;
use League\Fractal\Serializer\DataArraySerializer;

trait Transformer_Manager {

    public function get_response( $resource ) {
        $manager = new Manager();
        $manager->setSerializer( new DataArraySerializer() );

        if ( isset( $_GET['with'] ) ) {
            $manager->parseIncludes( $_GET['with'] );
        }
        
        return $manager->createData( $resource )->toArray();
    }

    public function get_json_response( $resource ) {
        $manager = new Manager();
        $manager->setSerializer( new DataArraySerializer() );

        if ( isset( $_GET['with'] ) ) {
            $manager->parseIncludes( $_GET['with'] );
        }

        return json_encode( $manager->createData( $resource )->toArray() );
    }
}