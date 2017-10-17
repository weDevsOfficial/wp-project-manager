<?php

namespace PM\Task_List\Observers;

use PM\Core\Database\Model_Observer;
use PM\Activity\Models\Activity;
use PM\Task_List\Models\Task_List;
use Reflection;

class Task_List_Observer extends Model_Observer {

    public function created( $resource ) {
        $meta = [
            'task_list_title' => $resource->title,
        ];

        $this->log_activity( $resource, 'create-task-list', 'create', $meta );
    }

    public function updated( $resource ) {
        $this->call_attribute_methods( $resource );
    }

    public function title( Task_list $item, $old_value ) {
        $meta = [
            'task_list_title_old' => $old_value,
            'task_list_title_new' => $item->title,
        ];
        $this->log_activity( $item, 'update-task-list-title', 'update', $meta );
    }

    public function description( Task_list $item, $old_value ) {
        $meta = [
            'task_list_title' => $item->title,
        ];

        $this->log_activity( $item, 'update-task-list-description', 'update', $meta );
    }

    public function order( Task_list $item, $old_value ) {
        $meta = [
            'task_list_title'     => $item->title,
            'task_list_order_old' => $old_value,
            'task_list_order_new' => $item->order,
        ];

        $this->log_activity( $item, 'update-task-list-order', 'update', $meta );
    }

    private function log_activity( Task_list $item, $action, $action_type, $meta = null ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => $action,
            'action_type'   => $action_type,
            'resource_id'   => $item->id,
            'resource_type' => 'task-list',
            'meta'          => $meta,
            'project_id'    => $item->project_id,
        ]);
    }
}