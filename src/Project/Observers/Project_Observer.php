<?php

namespace CPM\Project\Observers;

use CPM\Core\Database\Model_Observer;
use CPM\Project\Models\Project;
use CPM\Activity\Models\Activity;
use Reflection;

class Project_Observer extends Model_Observer {

    public function created( $resource ) {
        Activity::create([
            'actor'         => $resource->created_by,
            'action'        => 'create-project',
            'resource_id'   => $resource->id,
            'resource_type' => 'project',
        ]);
    }

    public function updated( $resource ) {
        foreach ( $resource->getOriginal() as $key => $value ) {
            if ( $resource->$key != $value  && method_exists( $this, $key ) ) {
                $this->$key( $resource, $value );
            }
        }
    }

    protected function title( Project $item, $old_value ) {
        Activity::create([
            'actor'         => $item->updated_by,
            'action'        => 'update-project-title',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
        ]);
    }

    protected function description( Project $item, $old_value ) {
        Activity::create([
            'actor'         => $item->updated_by,
            'action'        => 'update-project-description',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
        ]);
    }

    protected function status( Project $item, $old_value ) {
        Activity::create([
            'actor'         => $item->updated_by,
            'action'        => 'update-project-status',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
        ]);
    }
}