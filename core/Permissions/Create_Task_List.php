<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;
use WP_REST_Request;

class Create_Task_List extends Abstract_Permission {
   
    public function check() {
        $project_id = $this->request->get_param( 'project_id' );

        if ( pm_user_can( 'create_list', $project_id) ){
            return true;
        }

        return new \WP_Error( 'project', __( "You have no permission.", "wedevs-project-manager" ) );
    }
}