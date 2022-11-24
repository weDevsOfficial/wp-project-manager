<?php

namespace WeDevs\PM\Core\Pro;

/**
 * Class Menu
 *
 * @since 2.5.1
 *
 * @package WeDevs\PM\Core\Pro
 */
class Menu {

    /**
     * Prompts menu capabilities.
     *
     * @since 2.5.1
     *
     * @var string
     */
    private static $capability = 'read';

    /**
     * Register pro prompts menu.
     *
     * @since 2.5.1
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

        if ( pm_has_manage_capability() ) {
            $submenu['pm_projects'][] = array( self::pro_menu_string( 'Woo Project' ), self::$capability, 'admin.php?page=pm_projects#/woo-project' );
        }

        $submenu['pm_projects'][] = array( self::pro_menu_string( 'Calendar' ), self::$capability, 'admin.php?page=pm_projects#/calendar' );
        if ( pm_has_manage_capability() ) {
            $submenu['pm_projects'][] = array( $this->pro_menu_string( 'Progress' ), self::$capability, 'admin.php?page=pm_projects#/progress' );
            $submenu['pm_projects'][] = array( $this->pro_menu_string( 'Reports' ), self::$capability, 'admin.php?page=pm_projects#/reports' );
            $submenu['pm_projects'][] = array( __( 'Modules', 'wedevs-project-manager' ), self::$capability, 'admin.php?page=pm_projects#/modules' );
        }

        add_action( 'admin_print_styles-' . $slug, array( $this, 'scripts' ) );
        wp_enqueue_style( 'pm-badge-styles' );
    }

    /**
     * Get the menu string with pro badge.
     *
     * @since 2.5.1
     *
     * @param string $menu_name
     *
     * @return string
     */
    private function pro_menu_string( $menu_name ) {
        return sprintf(
            __( '%1$s %2$sPro%3$s %4$s', 'wedevs-project-manager' ),
            $menu_name,
            '<span class="pm-pro-badge">',
            '</span>',
            $this->get_pro_preview_tooltip()
        );
    }

    /**
     * Get the upgrade tooltip html for wp menu.
     *
     * @since 2.5.1
     *
     * @return string
     */
    public function get_pro_preview_tooltip() {
        $features = array(
            'Enjoy 10+ premium modules',
            'Advanced reporting filters',
            '24/7 customer support',
            'Real-time project updates',
            'Complete control of user roles & permissions',
        );

        $tooltip_header = __( 'Available in Pro. Unlock & enjoy:', 'wedevs-project-manager' );
        $crown_icon     = pm_config( 'define.url' ) . 'core/Pro/assets/images/crown.svg';
        $check_icon     = pm_config( 'define.url' ) . 'core/Pro/assets/images/check.svg';

        $html = '<div class="pm-pro-field-tooltip">';
        $html .= "<a href='#'></a><h3 class='tooltip-header'>{$tooltip_header}</h3>";
        $html .= '<ul>';

        foreach ( $features as $feature ) {
            $html .= sprintf(
                '<li><span class="tooltip-check">%1$s</span> %2$s</li>',
                file_get_contents( $check_icon ),
                esc_html( $feature )
            );
        }

        $html .= '</ul>';
        $html .= sprintf( '
            <div class="pro-link">
                <a href="%1$s" target="%2$s" class="%3$s">
                    %4$s<span class="pro-icon icon-white"> %5$s</span>
                </a>
            </div>',
            esc_url( $this->get_upgrade_to_pro_popup_url() ),
            '_blank',
            'pro-button button-upgrade-to-pro',
            __( 'Upgrade to PRO', 'wedevs-project-manager' ),
            file_get_contents( $crown_icon )
        );

        $html .= '<i></i>';
        $html .= '</div>';

        return $html;
    }

    /**
     * Get the upgrade to pro url from the PRO Prompts.
     *
     * @since 2.5.1
     *
     * @return string
     */
    public function get_upgrade_to_pro_popup_url() {
        return esc_url( 'https://wedevs.com/wp-project-manager-pro/pricing/?utm_source=freeplugin&utm_medium=pm-action-link&utm_campaign=pm-pro-prompt' );
    }

    /**
     * Enqueue pro prompts related styles.
     *
     * @since 2.5.1
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
