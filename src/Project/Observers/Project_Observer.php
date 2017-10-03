<?php

namespace CPM\Project\Observers;

use CPM\Core\Database\Model_Observer;
use CPM\Project\Models\Project;
use CPM\Activity\Models\Activity;
use Reflection;

class Project_Observer extends Model_Observer {

    public function created( $resource ) {
        Activity::create([
            'actor_id'      => $resource->created_by,
            'action'        => 'create-project',
            'action_type'   => 'creation',
            'resource_id'   => $resource->id,
            'resource_type' => 'project',
            'project_id'    => $resource->id,
        ]);
    }

    public function updated( $resource ) {
        $this->call_attribute_methods( $resource );
    }

    protected function title( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => 'update-project-title',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => serialize([
                'old' => $old_value,
                'new' => $item->title
            ]),
            'project_id'    => $resource->project_id,
        ]);
    }

    protected function description( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => 'update-project-description',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => serialize([
                'old' => $old_value,
                'new' => $item->description
            ]),
            'project_id'    => $resource->project_id,
        ]);
    }

    protected function status( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => 'update-project-status',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => serialize([
                'old' => Project::$status[$old_value],
                'new' => $item->status
            ]),
            'project_id'    => $resource->project_id,
        ]);
    }

    protected function budget( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => 'update-project-budget',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => serialize([
                'old' => $old_value,
                'new' => $item->budget
            ]),
            'project_id'    => $resource->project_id,
        ]);
    }

    protected function pay_rate( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => 'update-project-pay-rate',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => serialize([
                'old' => $old_value,
                'new' => $item->pay_rate
            ]),
            'project_id'    => $resource->project_id,
        ]);
    }

    protected function est_completion_date( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => 'update-project-est-completion-date',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => serialize([
                'old' => format_date( make_carbon_date( $old_value ) ),
                'new' => format_date( $item->est_completion_date )
            ]),
            'project_id'    => $resource->project_id,
        ]);
    }

    protected function color_code( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => 'update-project-color-code',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => serialize([
                'old' => $old_value,
                'new' => $item->color_code
            ]),
            'project_id'    => $resource->project_id,
        ]);
    }
}