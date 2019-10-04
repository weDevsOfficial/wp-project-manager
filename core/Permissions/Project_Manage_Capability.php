<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;
use WP_REST_Request;

class Project_Manage_Capability extends Abstract_Permission {
    public function check() {
        $user_id = get_current_user_id();

        $project_id = $this->request->get_param( 'project_id' );
        $id         = $this->request->get_param( 'id' );

        if ( !$project_id ) {
            $project_id = $id;
        }

        if ( $user_id ) {
            if ( pm_has_manage_capability() )  {
                return true;
            }
            if ( $project_id && pm_has_project_managing_capability( $project_id, $user_id ) ) {
                return true;
            }
        }

        return new \WP_Error( 'project', __( "You have no permission.", "wedevs-project-manager" ) );
    }
}
