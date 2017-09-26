<?php

namespace CPM\Project\Observers;

use CPM\Core\Database\Model_Observer;
use CPM\Project\Models\Project;
use CPM\Activity\Models\Activity;
use Reflection;

class Project_Observer extends Model_Observer {

    public function created( $resource ) {
        Activity::create([
            'act'           => 'has created a project',
            'actor'         => 1,
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
            'act'           => $act,
            'actor'         => $item->updated_by,
            'resource_id'   => $item->id,
            'resource_type' => 'project',
        ]);
    }
}