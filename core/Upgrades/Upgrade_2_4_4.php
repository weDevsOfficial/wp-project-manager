<?php
namespace WeDevs\PM\Core\Upgrades;

/**
*   Upgrade project manager 3.0
*/
class Upgrade_2_4_4 {
    /*initialize */
    public function upgrade_init() {
        $this->set_capabilities();
    }

    /**
     * Set page access capability for admin user
     *
     * @since 1.0
     *
     * @return void
     */
    public function set_capabilities() {
        $manage_roles    = (array) pm_get_setting( 'managing_capability' );
        $pj_create_roles = (array) pm_get_setting( 'project_create_capability' );

        $manage_roles[] = 'administrator';
        $manage_roles   = array_unique( $manage_roles ); 

        $admin_users   = get_users( [ 'role__in' => $manage_roles ] );
        $manager_users = get_users( [ 'role__in' => $pj_create_roles ] );

        if ( $manager_users ) {
            foreach ( $manager_users as $manger_user ) {
                $manger_user->add_cap( pm_manager_cap_slug() );
                update_user_meta( $manger_user->ID, 'pm_capability', pm_manager_cap_slug() );
            }
        }
        
        if ( $admin_users ) {
            foreach ( $admin_users as $admin_user ) {
                $admin_user->add_cap( pm_admin_cap_slug() );
                update_user_meta( $admin_user->ID, 'pm_capability', pm_admin_cap_slug() );
            }
        }
    }
}
