<?php

namespace WeDevs\PM\Core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;
use WP_REST_Request;

class Authentic extends Abstract_Permission {
    public function check() {
        $user = wp_get_current_user();

        if (!$user->ID) {
            return false;
        }

        return true;
    }
}