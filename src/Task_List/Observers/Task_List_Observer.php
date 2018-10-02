<?php

namespace WeDevs\PM\Task_List\Observers;

use WeDevs\PM\Core\Database\Model_Observer;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\Task_List\Models\Task_List;
use Reflection;

class Task_List_Observer extends Model_Observer {

    public function created( $resource ) {
        $meta = [
            'task_list_title' => $resource->title,
        ];

        $this->log_activity( $resource, 'create_task_list', 'create', $meta );
    }

    public function deleting( $resource ) {
        $meta = [
            'deleted_task_list_title' => $resource->title,
        ];

        $this->log_activity( $resource, 'delete_task_list', 'delete', $meta );
    }

    public function updated( $resource ) {
        $this->call_attribute_methods( $resource );
    }

    public function title( Task_list $item, $old_value ) {
        $meta = [
            'task_list_title_old' => $old_value,
            'task_list_title_new' => $item->title,
        ];
        $this->log_activity( $item, 'update_task_list_title', 'update', $meta );
    }

    public function description( Task_list $item, $old_value ) {
        $meta = [
            'task_list_title' => $item->title,
        ];

        $this->log_activity( $item, 'update_task_list_description', 'update', $meta );
    }

    public function order( Task_list $item, $old_value ) {
        $meta = [
            'task_list_title'     => $item->title,
            'task_list_order_old' => $old_value,
            'task_list_order_new' => $item->order,
        ];

        $this->log_activity( $item, 'update_task_list_order', 'update', $meta );
    }

    public function status( Task_list $item, $old_value ) {
        $meta = [
            'task_list_title'     => $item->title,
            'task_list_status_old' => $old_value,
            'task_list_status_new' => $item->status,
        ];
        
        if ( $item->status == 'archived' ) {
            $action = 'archived_task_list';
        } else {
            $action = 'restore_task_list';
        }

        $this->log_activity( $item, $action, 'update', $meta );
    }

    private function log_activity( Task_list $item, $action, $action_type, $meta = null ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => $action,
            'action_type'   => $action_type,
            'resource_id'   => $item->id,
            'resource_type' => 'task_list',
            'meta'          => $meta,
            'project_id'    => $item->project_id,
        ]);
    }
}
