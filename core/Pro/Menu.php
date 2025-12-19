<?php

namespace WeDevs\PM\Core\Pro;

/**
 * Class Menu
 *
 * @since 2.6.0
 *
 * @package WeDevs\PM\Core\Pro
 */
class Menu {

    /**
     * Prompts menu capabilities.
     *
     * @since 2.6.0
     *
     * @var string
     */
    private static $capability = 'read';

    /**
     * Register pro prompts menu.
     *
     * @since 2.6.0
     *
     * @param string $slug
     *
     * @return void
     */
    public function admin_menu( $slug ) {
        global $submenu, $wedevs_pm_pro;

        // If pm pro exists then stop pro execution.
        if ( $wedevs_pm_pro ) {
            return;
        }

//        if ( wedevs_pm_has_manage_capability() ) {
//            $submenu['pm_projects'][] = array( __( 'Woo Project', 'wedevs-project-manager' ), self::$capability, 'admin.php?page=pm_projects#/woo-project' );
//        }

        // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- Intentionally adding custom submenu items to WordPress admin menu
        $submenu['pm_projects'][] = array( __( 'Calendar', 'wedevs-project-manager' ), self::$capability, 'admin.php?page=pm_projects#/calendar' );
        if ( wedevs_pm_has_manage_capability() ) {
            // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- Intentionally adding custom submenu items to WordPress admin menu
            $submenu['pm_projects'][] = array( __( 'Progress', 'wedevs-project-manager' ), self::$capability, 'admin.php?page=pm_projects#/progress' );
            // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- Intentionally adding custom submenu items to WordPress admin menu
            $submenu['pm_projects'][] = array( __( 'Reports', 'wedevs-project-manager' ), self::$capability, 'admin.php?page=pm_projects#/reports' );
            // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- Intentionally adding custom submenu items to WordPress admin menu
            $submenu['pm_projects'][] = array( __( 'Modules', 'wedevs-project-manager' ), self::$capability, 'admin.php?page=pm_projects#/modules' );
        }

        add_action( 'admin_print_styles-' . $slug, array( $this, 'scripts' ) );
    }

    /**
     * Enqueue pro prompts related styles.
     *
     * @since 2.6.0
     *
     * @return void
     */
	public function scripts() {
        wp_enqueue_style( 'swiffy-slider' );
        wp_enqueue_style( 'pm-pro-styles' );

        wp_enqueue_script( 'swiffy-slider' );
        wp_enqueue_script( 'swiffy-slider-extension' );
	}
}
