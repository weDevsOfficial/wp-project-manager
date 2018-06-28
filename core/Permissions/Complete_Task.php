<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;
use WeDevs\PM\Task\Models\Task;
use WP_REST_Request;

class Complete_Task extends Abstract_Permission {
   
    public function check() {
        $id = $this->request->get_param( 'task_id' );
        $project_id = $this->request->get_param( 'project_id' );
        $user_id = get_current_user_id();

        if ( $user_id ) {

        	if ( $project_id && pm_has_project_managing_capability( $project_id, $user_id ) ) {
	            return true;
	        }
            
            $task = Task::with('assignees')
                ->where('id', $id)
                ->first();

            if ( isset( $task->created_by ) && $task->created_by == $user_id ){
               return true;
            }

            if ( pm_user_can_complete_task( $task, $user_id ) ) {
                return true;
            }

        }

        return new \WP_Error( 'Task', __( "You have no permission to change task status.", "wedevs-project-manager" ) );
    }
}