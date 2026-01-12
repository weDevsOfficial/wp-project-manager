<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;

class Create_Users extends Abstract_Permission {
    /**
     * Check if the current user has permission to create users.
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

        // Only allow administrators and users with create_users capability
        if ( current_user_can( 'create_users' ) ) {
            return true;
        }

        return new \WP_Error(
            'rest_forbidden',
            __( 'You do not have permission to create users.', 'wedevs-project-manager' ),
            array( 'status' => 403 )
        );
    }
}
