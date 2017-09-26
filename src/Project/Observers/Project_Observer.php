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
            'act'           => 'has created a project',
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
        $act = 'has changed project title "' . $old_value . '" to "' . $item->title . '"';
        Activity::create([
            'actor'         => $item->updated_by,
            'act'           => $act,
            'action'        => 'update-project-title',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
        ]);
    }
}