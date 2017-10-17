<?php

namespace PM\Core\Permissions;

use PM\Core\Permissions\Abstract_Permission;
use WP_REST_Request;

class Administrator extends Abstract_Permission {
    public function check() {
        return true;
    }
}