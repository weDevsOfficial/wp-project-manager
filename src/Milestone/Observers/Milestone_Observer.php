<?php

namespace WeDevs\PM\Milestone\Observers;

use WeDevs\PM\Core\Database\Model_Observer;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\Milestone\Models\Milestone;
use Reflection;

class Milestone_Observer extends Model_Observer {

    public function created( $resource ) {
        $meta = [
            'milestone_title' => $resource->title,
        ];

        $this->log_activity( $resource, 'create_milestone', 'create', $meta );
    }
    public function deleting( $resource ) {
        $meta = [
            'deleted_milestone_title' => $resource->title,
        ];

        $this->log_activity( $resource, 'delete_milestone', 'delete', $meta );
    }

    public function updated( $resource ) {
        $this->call_attribute_methods( $resource );
    }

    public function title( Milestone $item, $old_value ) {
        $meta = [
            'milestone_title_old' => $old_value,
            'milestone_title_new' => $item->title,
        ];
        $this->log_activity( $item, 'update_milestone_title', 'update', $meta );
    }

    public function description( Milestone $item, $old_value ) {
        $meta = [
            'milestone_title' => $item->title,
        ];

        $this->log_activity( $item, 'update_milestone_description', 'update', $meta );
    }

    public function order( Milestone $item, $old_value ) {
        $meta = [
            'milestone_title'     => $item->title,
            'milestone_order_old' => $old_value,
            'milestone_order_new' => $item->order,
        ];

        $this->log_activity( $item, 'update_milestone_order', 'update', $meta );
    }

    private function log_activity( Milestone $item, $action, $action_type, $meta = null ) {
        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => $action,
            'action_type'   => $action_type,
            'resource_id'   => $item->id,
            'resource_type' => 'milestone',
            'meta'          => $meta,
            'project_id'    => $item->project_id,
        ]);
    }
}
