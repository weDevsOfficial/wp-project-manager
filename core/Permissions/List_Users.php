<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;

class List_Users extends Abstract_Permission {
    /**
     * Check if the current user has permission to list users.
     *
     * @return bool|\WP_Error
     */
    public function check() {
        $user_id = get_current_user_id();

        if ( empty( $user_id ) ) {
            return new \WP_Error(
                'rest_forbidden',
                __( 'You must be logged in to access this resource.', 'wedevs-project-manager' ),
                array( 'status' => 401 )
            );
        }

        // Allow administrators and users with list_users capability
        if ( current_user_can( 'list_users' ) ) {
            return true;
        }

        // Allow users with PM manage capability
        if ( wedevs_pm_user_can_access( wedevs_pm_manager_cap_slug() ) ) {
            return true;
        }

        return new \WP_Error(
            'rest_forbidden',
            __( 'You do not have permission to list users.', 'wedevs-project-manager' ),
            array( 'status' => 403 )
        );
    }
}
