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
        $fillable_attributes = $resource->getFillable();
        $old = $resource->getOriginal();
        $new = $resource->getAttributes();

        foreach ( $fillable_attributes as $attribute ) {
            if ( $old[$attribute] != $new[$attribute]  && method_exists( $this, $attribute ) ) {
                $this->$attribute( $resource, $old[$attribute] );
            }
        }
    }

    protected function title( Project $item, $old_value ) {
        Activity::create([
            'actor'         => $item->updated_by,
            'action'        => 'update-project-title',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => serialize([
                'old' => $old_value,
                'new' => $item->title
            ])
        ]);
    }

    protected function description( Project $item, $old_value ) {
        Activity::create([
            'actor'         => $item->updated_by,
            'action'        => 'update-project-description',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => serialize([
                'old' => $old_value,
                'new' => $item->description
            ])
        ]);
    }

    protected function status( Project $item, $old_value ) {
        Activity::create([
            'actor'         => $item->updated_by,
            'action'        => 'update-project-status',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => serialize([
                'old' => Project::$status[$old_value],
                'new' => $item->status
            ])
        ]);
    }

    protected function budget( Project $item, $old_value ) {
        Activity::create([
            'actor'         => $item->updated_by,
            'action'        => 'update-project-budget',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => serialize([
                'old' => $old_value,
                'new' => $item->budget
            ])
        ]);
    }

    protected function pay_rate( Project $item, $old_value ) {
        Activity::create([
            'actor'         => $item->updated_by,
            'action'        => 'update-project-pay-rate',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => serialize([
                'old' => $old_value,
                'new' => $item->pay_rate
            ])
        ]);
    }

    protected function est_completion_date( Project $item, $old_value ) {
        Activity::create([
            'actor'         => $item->updated_by,
            'action'        => 'update-project-est-completion-date',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => serialize([
                'old' => format_date( make_carbon_date( $old_value ) ),
                'new' => format_date( $item->est_completion_date )
            ])
        ]);
    }

    protected function color_code( Project $item, $old_value ) {
        Activity::create([
            'actor'         => $item->updated_by,
            'action'        => 'update-project-color-code',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => serialize([
                'old' => $old_value,
                'new' => $item->color_code
            ])
        ]);
    }
}