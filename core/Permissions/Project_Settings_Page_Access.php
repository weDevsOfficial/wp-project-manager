<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;
use WP_REST_Request;

class Project_Settings_Page_Access extends Abstract_Permission {
    
    public function check() {
        $user_id    = get_current_user_id();
        $project_id = $this->request->get_param( 'project_id' );

        if ( empty( $user_id ) || empty( $project_id ) ) {
            return new \WP_Error( 'project', __( "You have no permission.", "wedevs-project-manager" ) );
        }

        if ( pm_user_can_access( pm_manager_cap_slug() ) )  {
            return true;
        }

        if ( pm_is_manager( $project_id, $user_id ) ) {
            return true;
        }
        
        return new \WP_Error( 'project', __( "You have no permission.", "wedevs-project-manager" ) );
    }
}
