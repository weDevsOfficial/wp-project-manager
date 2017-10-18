<?php

namespace WeDevs\PM\Activity;

use ReflectionClass;
use Reflection;
use WeDevs\PM\Activity\Models\Activity;

class Activity_Log {

    public static function entry( $resource, $act ) {
        $reflector = new ReflectionClass( $resource );
        $resource_name = $reflector->getName();
        $resource_short_name = $reflector->getShortName();

        $observer = str_replace(
            "Models\\{$resource_short_name}",
            "Observers\\",
            $resource_name
        );

        $observer .= $resource_short_name . "_Observer";

        if ( class_exists( $observer ) ) {
            (new $observer)->handle( $resource, $act );
        }
    }
}