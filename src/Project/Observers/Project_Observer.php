<?php

namespace CPM\Project\Observers;

use CPM\Core\Database\Model_Observer;
use CPM\Project\Models\Project;
use CPM\Activity\Models\Activity;

class Project_Observer extends Model_Observer {

    public function created( $resource ) {
        Activity::create([
            'act' => 'has created a project',
            'actor' => 1,
            'resource_id' => $resource->id,
            'resource_type' => 'project',
        ]);
    }

    public function updated( $resource ) {
        Activity::create([
            'act' => 'has updated a project',
            'actor' => 1,
            'resource_id' => $resource->id,
            'resource_type' => 'project',
        ]);
    }
}