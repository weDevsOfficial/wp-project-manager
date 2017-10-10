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
            'action_type'   => 'create',
            'resource_id'   => $resource->id,
            'resource_type' => 'project',
            'meta'          => [
                'project_id'    => $resource->id,
                'project_title' => $resource->title,
            ],
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
            'meta'          => [
                'project_title_old' => $old_value,
                'project_title_new' => $item->title
            ],
            'project_id'    => $item->id,
        ]);
    }

    protected function description( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => 'update-project-description',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'project_id'    => $item->id,
        ]);
    }

    protected function status( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => 'update-project-status',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => [
                'project_status_old' => Project::$status[$old_value],
                'project_status_new' => $item->status
            ],
            'project_id'    => $item->id,
        ]);
    }

    protected function budget( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => 'update-project-budget',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => [
                'project_status_old' => $old_value,
                'project_status_new' => $item->budget
            ],
            'project_id'    => $item->id,
        ]);
    }

    protected function pay_rate( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => 'update-project-pay-rate',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => [
                'project_pay_rate_old' => $old_value,
                'project_pay_rate_new' => $item->pay_rate
            ],
            'project_id'    => $item->id,
        ]);
    }

    protected function est_completion_date( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => 'update-project-est-completion-date',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => [
                'project_est_completion_date_old' => format_date( make_carbon_date( $old_value ) ),
                'project_est_completion_date_new' => format_date( $item->est_completion_date )
            ],
            'project_id'    => $item->id,
        ]);
    }

    protected function color_code( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => 'update-project-color-code',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => [
                'project_color_code_old' => $old_value,
                'project_color_code_new' => $item->color_code
            ],
            'project_id'    => $item->id,
        ]);
    }
}