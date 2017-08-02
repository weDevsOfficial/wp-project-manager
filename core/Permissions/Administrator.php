<?php

namespace CPM\Core\Permissions;

use CPM\Core\Permissions\Abstract_Permission;
use WP_REST_Request;

class Administrator extends Abstract_Permission {
    public function check() {
        return true;
    }
}