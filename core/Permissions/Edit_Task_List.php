<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;
use WeDevs\PM\Task_List\Models\Task_List;
use WP_REST_Request;

class Edit_Task_List extends Abstract_Permission {
   
    public function check() {
        $id = $this->request->get_param( 'task_list_id' );
        $project_id = $this->request->get_param( 'project_id' );
        $user_id = get_current_user_id();

        if ( $user_id ) {

        	if ( $project_id && pm_has_project_managing_capability( $project_id, $user_id ) ) {
	            return true;
	        }
            
            $task_list = Task_List::find( $id );

	        if ( $task_list && $task_list->created_by == $user_id ){
	        	return true;
	        }

        }

        return new \WP_Error( 'TaskList', __( "You have no permission.", "wedevs-project-manager" ) );
    }
}