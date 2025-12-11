<?php

namespace WeDevs\PM\Core\Permissions;


use WeDevs\PM\Core\Permissions\Abstract_Permission;
use WP_REST_Request;

class Settings_Page_Access extends Abstract_Permission {

    public function check() {
        return wedevs_pm_user_can_access( wedevs_pm_admin_cap_slug() );
    }
}
