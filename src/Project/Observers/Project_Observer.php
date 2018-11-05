<?php

namespace WeDevs\PM\Project\Observers;

use WeDevs\PM\Core\Database\Model_Observer;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Activity\Models\Activity;
use Carbon\Carbon;

class Project_Observer extends Model_Observer {

    public function created( $resource ) {
        Activity::create([
            'actor_id'      => get_current_user_id(),
            'action'        => 'create_project',
            'action_type'   => 'create',
            'resource_id'   => $resource->id,
            'resource_type' => 'project',
            'meta'          => [
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
            'actor_id'      => get_current_user_id(),
            'action'        => 'update_project_title',
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
            'actor_id'      => get_current_user_id(),
            'action'        => 'update_project_description',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => [
                'project_title' => $item->title,
            ],
            'project_id'    => $item->id,
        ]);
    }

    protected function status( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => get_current_user_id(),
            'action'        => 'update_project_status',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => [
                'project_title'      => $item->title,
                'project_status_old' => Project::$status[$old_value],
                'project_status_new' => $item->status
            ],
            'project_id'    => $item->id,
        ]);
    }

    protected function budget( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => get_current_user_id(),
            'action'        => 'update_project_budget',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => [
                'project_title'      => $item->title,
                'project_budget_old' => $old_value,
                'project_budget_new' => $item->budget
            ],
            'project_id'    => $item->id,
        ]);
    }

    protected function pay_rate( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => get_current_user_id(),
            'action'        => 'update_project_pay_rate',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => [
                'project_title'        => $item->title,
                'project_pay_rate_old' => $old_value,
                'project_pay_rate_new' => $item->pay_rate
            ],
            'project_id'    => $item->id,
        ]);
    }

    protected function est_completion_date( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => get_current_user_id(),
            'action'        => 'update_project_est_completion_date',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => [
                'project_title'                   => $item->title,
                'project_est_completion_date_old' => $old_value,
                'project_est_completion_date_new' => $item->est_completion_date instanceof Carbon
                    ? $item->est_completion_date->toDateTimeString() : null,
            ],
            'project_id'    => $item->id,
        ]);
    }

    protected function color_code( Project $item, $old_value ) {
        Activity::create([
            'actor_id'      => get_current_user_id(),
            'action'        => 'update_project_color_code',
            'action_type'   => 'update',
            'resource_id'   => $item->id,
            'resource_type' => 'project',
            'meta'          => [
                'project_title'          => $item->title,
                'project_color_code_old' => $old_value,
                'project_color_code_new' => $item->color_code
            ],
            'project_id'    => $item->id,
        ]);
    }
}