<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;
use WP_REST_Request;

class Access_Project extends Abstract_Permission {
   
    public function check() { 
        $project_id = $this->request->get_param( 'project_id' );

        if ( empty($project_id) ) {
            $project_id = $this->request->get_param( 'id' );
        }

        // $user_id = $this->request->get_param( 'user_id' ); 
        // $user_id = empty( $user_id ) ? 0 : intval( $user_id );

        if ( pm_user_can( 'view_project', $project_id ) ) {
            return true;
        }

        return new \WP_Error( 'project', __( "You have no permission.", "wedevs-project-manager" ) );
    }
}
