<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;
use WP_REST_Request;

class Project_Create_Capability extends Abstract_Permission {
    public function check() {

        if ( pm_user_can_access( pm_manager_cap_slug() ) ) {
            return true;
        }
        
        return new \WP_Error( 'project', __( "You have no permission to create project.", "wedevs-project-manager" ) );
    }
}
