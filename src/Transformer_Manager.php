<?php

namespace CPM;

use League\Fractal;
use League\Fractal\Manager as Manager;
use League\Fractal\Serializer\DataArraySerializer;

trait Transformer_Manager
{
    public function get_response( $resource )
    {
        $manager = new Manager();
        $manager->setSerializer( new DataArraySerializer() );

        return $manager->createData( $resource )->toArray();
    }

    public function get_json_response( $resource )
    {
        $manager = new Manager();
        $manager->setSerializer( new DataArraySerializer() );

        return json_encode( $manager->createData( $resource )->toArray() );
    }
}