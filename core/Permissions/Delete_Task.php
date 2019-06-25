<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;
use WeDevs\PM\Task\Models\Task;
use WP_REST_Request;

class Delete_Task extends Abstract_Permission {
    
    public function check() {
		$user_id    = get_current_user_id();
		$project_id = $this->request->get_param( 'project_id' );
		$task_id    = $this->request->get_param( 'task_id' );
		$task       = Task::where( 'id', $task_id )->where( 'project_id', $project_id )->first();

        if ( isset( $task->created_by ) && $task->created_by == $user_id ) {
        	return true;
        }

        $pm_task_delete_permission = apply_filters( 'pm_check_permission', true, $project_id, 'create_task' );

        if ( $pm_task_delete_permission ) {
        	return false;
        }

        return new \WP_Error( 'project', __( "You have no permission.", "wedevs-project-manager" ) );
    }
}
