<?php

namespace WeDevs\PM\Core\Installer;

use PM_Create_Table;

class Installer {

 	public function do_install() {
 		new PM_Create_Table();
        (new \RoleTableSeeder())->run();

        $was_installed_before = get_option( 'pm_db_version', false );

        if ( ! $was_installed_before ) {
       		set_transient( '_pm_setup_page_redirect', true, 30 );
    	}

    	$this->set_admin_capability();
 	}

 	function set_admin_capability() {

        $admin_users   = get_users( [ 'role' => 'Administrator' ] );

        if ( $admin_users ) {
            foreach ( $admin_users as $admin_user ) {
                $admin_user->add_cap( pm_admin_cap_slug() );
            }
        }
 	}
 }
