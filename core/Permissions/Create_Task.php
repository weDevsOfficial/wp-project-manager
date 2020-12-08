<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;
use WP_REST_Request;

class Create_Task extends Abstract_Permission {
    public function check() {
        $project_id = $this->request->get_param( 'project_id' );

        $pm_task_create_permission = apply_filters( 'pm_check_permission', true, $project_id, 'create_task' );

        if ( $pm_task_create_permission ) {
        	return true;
        }

        return new \WP_Error( 'project', __( "You have no permission.", "wedevs-project-manager" ) );
    }
}
