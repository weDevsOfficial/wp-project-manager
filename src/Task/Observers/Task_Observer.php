<?php

namespace CPM\Task\Observers;

use CPM\Core\Database\Model_Observer;
use CPM\Activity\Models\Activity;
use CPM\Task\Models\Task;
use Carbon\Carbon;

class Task_Observer extends Model_Observer {

    public function created( $resource ) {
        $meta = [
            'task_title' => $resource->title,
        ];

        $this->log_activity( $resource, 'create-task', 'create', $meta );
    }

    public function updated( $resource ) {
        $this->call_attribute_methods( $resource );
    }

    public function title( Task $item, $old_value ) {
        $meta = [
            'task_title_old' => $old_value,
            'task_title_new' => $item->title,
        ];
        $this->log_activity( $item, 'update-task-title', 'update', $meta );
    }

    public function description( Task $item, $old_value ) {
        $meta = [
            'task_title' => $item->title,
        ];

        $this->log_activity( $item, 'update-task-description', 'update', $meta );
    }

    public function estimation( Task $item, $old_value ) {
        $meta = [
            'task_title'          => $item->title,
            'task_estimation_old' => $old_value,
            'task_estimation_new' => $item->estimation,
        ];

        $this->log_activity( $item, 'update-task-estimation', 'update', $meta );
    }

    public function start_at( Task $item, $old_value ) {
        var_dump( $old_value );
        $meta = [
            'task_title'        => $item->title,
            'task_start_at_old' => $old_value,
            'task_start_at_new' => $item->start_at instanceof Carbon ? $item->start_at->toDateTimeString() : null,
        ];

        $this->log_activity( $item, 'update-task-start-at', 'update', $meta );
    }

    public function due_date( Task $item, $old_value ) {
        $meta = [
            'task_title'        => $item->title,
            'task_due_date_old' => $old_value,
            'task_due_date_new' => $item->due_date instanceof Carbon ? $item->due_date->toDateTimeString() : null,
        ];

        $this->log_activity( $item, 'update-task-due-date', 'update', $meta );
    }

    public function complexity( Task $item, $old_value ) {
        $meta = [
            'task_title'          => $item->title,
            'task_complexity_old' => $old_value,
            'task_complexity_new' => $item->complexity,
        ];

        $this->log_activity( $item, 'update-complexity', 'update', $meta );
    }

    public function priority( Task $item, $old_value ) {
        $meta = [
            'task_title'        => $item->title,
            'task_priority_old' => $old_value,
            'task_priority_new' => $item->priority,
        ];

        $this->log_activity( $item, 'update-priority', 'update', $meta );
    }

    public function payable( Task $item, $old_value ) {
        $meta = [
            'task_title'       => $item->title,
            'task_payable_old' => $old_value,
            'task_payable_new' => $item->payable,
        ];

        $this->log_activity( $item, 'update-payable', 'update', $meta );
    }

    public function recurrent( Task $item, $old_value ) {
        $meta = [
            'task_title'         => $item->title,
            'task_recurrent_old' => $old_value,
            'task_recurrent_new' => $item->recurrent,
        ];

        $this->log_activity( $item, 'update-recurrent', 'update', $meta );
    }

    public function status( Task $item, $old_value ) {
        $meta = [
            'task_title'      => $item->title,
            'task_status_old' => $old_value,
            'task_status_new' => $item->status,
        ];

        $this->log_activity( $item, 'update-status', 'update', $meta );
    }

    private function log_activity( Task $item, $action, $action_type, $meta = null ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => $action,
            'action_type'   => $action_type,
            'resource_id'   => $item->id,
            'resource_type' => 'task',
            'meta'          => $meta,
            'project_id'    => $item->project_id,
        ]);
    }
}