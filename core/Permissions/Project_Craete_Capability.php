<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;
use WP_REST_Request;

class Project_Create_Capability extends Abstract_Permission {
    public function check() {
        
        if ( pm_has_manage_capability() ) {
            return true;
        }
        if ( pm_has_project_create_capability() ) {
            return true;  
        }
        return new \WP_Error( 'project', __( "You have no permission to create project.", "wedevs-project-manager" ) );
    }
}