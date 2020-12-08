<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Permission;
use WP_REST_Request;

abstract class Abstract_Permission implements Permission {
    /**
     * This variable holds an instance of WP_REST_Request.
     *
     * @var Object
     */
    public $request;

    /**
     * Instantiate the $request property.
     *
     * @param WP_REST_Request $request (Current request to the site as
     * WP_REST_Request)
     */
    public function __construct( WP_REST_Request $request ) {
        $this->request = $request;

        $user_id = $request->get_param( 'user_id' );
        $user_id = empty( $user_id ) ? 0 : intval( $user_id );

        if ( empty( $user_id ) && ! empty( get_current_user_id() ) ) {
            $user_id = get_current_user_id();
        }

        wp_set_current_user( $user_id );
    }

    /**
     * Check for a specific permission.
     *
     * @return boolean (true if operation is permitted; otherwise false).
     */
    abstract public function check();
}
