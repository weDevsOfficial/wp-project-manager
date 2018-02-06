<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;
use WP_REST_Request;

class Project_Manage_Capability extends Abstract_Permission {
    public function check() {
        
        if ( pm_has_manage_capability() ) {
            return true;
        }
        return new \WP_Error( 'project', __( "You have no permission.", "pm" ) );
    }
}