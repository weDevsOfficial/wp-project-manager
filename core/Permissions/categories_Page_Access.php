<?php

namespace WeDevs\PM\Core\Permissions;


use WeDevs\PM\Core\Permissions\Abstract_Permission;
use WP_REST_Request;

class Categories_Page_Access extends Abstract_Permission {

    public function check() {
        return pm_user_can_access( pm_manager_cap_slug() );
    }
}
