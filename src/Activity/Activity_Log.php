<?php

namespace CPM\Activity;

use ReflectionClass;
use CPM\Activity\Models\Activity;

class Activity_Log {

    public static function entry( $resource, $act ) {
        $reflector = new ReflectionClass( $resource );
        $resource_type = $reflector->getShortName();

        // Handler is a function name that needs to be called
        // to create activity log
        $handler = strtolower( $resource_type );
        $handler = $handler . '_' . $act;

        self::$handler( $resource );
    }

    public function project_created( $resource ) {
        Activity::create([
            'act' => 'has created a project',
            'actor' => 1,
            'resource_id' => $resource->id,
            'resource_type' => 'project',
        ]);
    }

    public function project_updated( $resource ) {
        Activity::create([
            'act' => 'has updated a project',
            'actor' => 1,
            'resource_id' => $resource->id,
            'resource_type' => 'project',
        ]);
    }
}