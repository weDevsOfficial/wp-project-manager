<?php

namespace WeDevs\PM\Core\Pro;

//use WeDevs\PM\Core\WP\Output as Output;
use WeDevs\PM\Core\Pro\Enqueue_Scripts;
//use WeDevs\PM\User\Models\User;
//use WeDevs\PM\User\Models\User_Role;

class Menu {

    private static $capability = 'read';

    /**
     * Menu constructor.
     */
    public function __construct() {
        add_action( 'pm_menu_before_load_scripts', [ $this, 'admin_menu' ] );
    }

	public function admin_menu( $slug ) {
        global $submenu, $wedevs_pm_pro;

        // If pm pro exists then stop pro execution.
        if ( $wedevs_pm_pro ) {
            return;
        }

        if ( pm_has_manage_capability() ) {
            $submenu['pm_projects'][] = array( self::pro_menu_string( 'Woo Project' ), self::$capability, 'admin.php?page=pm_projects#/woo-project' );
//            add_action( 'admin_print_styles-' . $home, array($this, 'woo_project_load_scripts') );
        }

        if ( current_user_can( 'activate_plugins' ) ) {
            $submenu['pm_projects'][] = array( self::pro_menu_string( 'License' ), 'activate_plugins', 'admin.php?page=pm_projects#/license' );
//            add_action( 'admin_print_styles-' . $hook, array( $this, 'scripts' ) );
        }

//        $submenu['pm_projects']['calendar'] = array( self::pro_menu_string( 'Calendar' ), self::$capability, 'admin.php?page=pm_projects#/calendar' );
//        add_submenu_page( 'pm_projects', $this->pro_menu_string( 'Calendar' ), $this->pro_menu_string( 'Calendar' ), self::$capability, 'calendar', [ static::class, 'modules_preview_page' ] );

        if ( pm_has_manage_capability() ) {
//            $submenu['pm_projects'][]          = array( $this->pro_menu_string( 'Progress' ), self::$capability, 'admin.php?page=pm_projects#/progress' );
//            $submenu['pm_projects']['reports'] = array( $this->pro_menu_string( 'Reports' ), self::$capability, 'admin.php?page=pm_projects#/reports' );
//            $submenu['pm_projects'][]          = array( $this->pro_menu_string( 'Modules' ), self::$capability, 'admin.php?page=pm_projects#/modules' );
            $hook = add_submenu_page( 'pm_projects', $this->pro_menu_string( 'Modules' ), $this->pro_menu_string( 'Modules' ), self::$capability, 'modules', [ static::class, 'modules_preview_page' ] );
            add_action( 'admin_head-' . $hook, array( $this, 'scripts' ) );
        }



        add_action( 'pm_modules_page_contents', [ static::class, 'modules_page_contents' ] );

//        add_action( 'admin_print_styles-' . $slug, array( $this, 'scripts' ) );

        do_action( 'pm_pro_menu', $slug );
	}

    private function pro_menu_string( $menu_name ) {
        return sprintf(
            __( '%1$s %2$sPro%3$s', 'wedevs-project-manager' ),
            $menu_name,
            '<span class="pm-pro-badge">',
            '</span>'
        );
    }

    /**
     * A preview page to show the Pro Modules of PM.
     *
     * @return void
     */
    public static function modules_preview_page() {
        $modules = self::pro_modules_info();
        do_action( 'pm_modules_page_contents', $modules );
    }

    /**
     * Get the info of the pro modules as an array
     *
     * @since WPUF_SINCE
     *
     * @return string[][]
     */
    public static function pro_modules_info() {
        return array(
            'Kanboard/Kanboard.php'                   => array(
                'id'          => 'kanbanboard',
                'name'        => __( 'KanBan Board', 'wedevs-project-manager' ),
                'thumbnail'   => 'kanban-board.png',
                'description' => __( 'Turn your projects into Trello like boards and organize them using drag and drop feature.', 'wedevs-project-manager' ),
            ),
            'Sub_Tasks/Sub_Tasks.php'                 => array(
                'id'          => 'subtask',
                'name'        => __( 'Sub Task', 'wedevs-project-manager' ),
                'thumbnail'   => 'sub-task.png',
                'description' => __( 'Break down your to-dos into smaller tasks for better management and project tracking.', 'wedevs-project-manager' ),
            ),
            'Custom_Fields/Custom_Fields.php'         => array(
                'id'          => 'customfields',
                'name'        => __( 'Custom Fields', 'wedevs-project-manager' ),
                'thumbnail'   => 'custom-fields.png',
                'description' => __( 'Generate invoice for your projects anytime; print, download and send emails to your client.', 'wedevs-project-manager' ),
            ),
            'Woo_Project/Woo_Project.php'             => array(
                'id'          => 'woocommerceorder',
                'name'        => __( 'WooCommerce Order', 'wedevs-project-manager' ),
                'thumbnail'   => 'woo-project.png',
                'description' => __( 'Create projects instantly for each of the orders placed on your WooCommerce store.', 'wedevs-project-manager' ),
            ),
            'Task_Recurring/Task_Recurring.php'       => array(
                'id'          => 'recurringtask',
                'name'        => __( 'Recurring Task', 'wedevs-project-manager' ),
                'thumbnail'   => 'task-recurring.png',
                'description' => __( 'Repeatedly creates tasks if you set recurrence.', 'wedevs-project-manager' ),
            ),
            'Gantt/Gantt.php'                         => array(
                'id'          => 'ganttchart',
                'name'        => __( 'Gantt Chart', 'wedevs-project-manager' ),
                'thumbnail'   => 'gantt-chart.png',
                'description' => __( 'Create detailed Gantt charts for your projects and become a professional project manager.', 'wedevs-project-manager' ),
            ),
            'PM_Pro_Buddypress/PM_Pro_Buddypress.php' => array(
                'id'          => 'buddypressintegration',
                'name'        => __( 'BuddyPress Integration', 'wedevs-project-manager' ),
                'thumbnail'   => 'buddy-press.png',
                'description' => __( 'Manage your projects group wise directly from the frontend using this premium integration.', 'wedevs-project-manager' ),
            ),
            'Sprint/Sprint.php'                       => array(
                'id'          => 'sprint',
                'name'        => __( 'Sprint', 'wedevs-project-manager' ),
                'thumbnail'   => 'sprint.png',
                'description' => __( 'Generate invoice for your projects anytime; print, download and send emails to your client.', 'wedevs-project-manager' ),
            ),
            'Time_Tracker/Time_Tracker.php'           => array(
                'id'          => 'timetracker',
                'name'        => __( 'Time Tracker', 'wedevs-project-manager' ),
                'thumbnail'   => 'time-tracker.png',
                'description' => __( 'Track time for each of your project tasks for increasing overall team productivity.', 'wedevs-project-manager' ),
            ),
            'Stripe/Stripe.php'                       => array(
                'id'          => 'invoicestripepaymentgateway',
                'name'        => __( 'Invoice stripe payment gateway', 'wedevs-project-manager' ),
                'thumbnail'   => 'stripe.png',
                'description' => __( 'Get payment with stripe account', 'wedevs-project-manager' ),
            ),
            'Invoice/Invoice.php'                     => array(
                'id'          => 'projectinvoice',
                'name'        => __( 'Project Invoice', 'wedevs-project-manager' ),
                'thumbnail'   => 'invoice.png',
                'description' => __( 'Generate invoice for your projects anytime; print, download and send emails to your client.', 'wedevs-project-manager' ),
            ),
        );
    }

    /**
     * The content of the module page.
     *
     * @param array $modules
     *
     * @return void
     */
    public static function modules_page_contents( $modules ) {
        $diamond_icon = file_get_contents( pm_config( 'define.url' ) . 'core/Pro/assets/images/diamond.svg' );
        $check_icon   = file_get_contents( pm_config( 'define.url' ) . 'core/Pro/assets/images/check.svg' );
        $crown_icon   = file_get_contents( pm_config( 'define.url' ) . 'core/Pro/assets/images/crown.svg' );
        $close_icon   = file_get_contents( pm_config( 'define.url' ) . 'core/Pro/assets/images/x.svg' );

        wp_enqueue_style( 'swiffy-slider' );
        wp_enqueue_script( 'swiffy-slider' );
        wp_enqueue_script( 'swiffy-slider-extension' );
        ?>
        <div id="pm-upgrade-popup" class="pm-popup-window">
            <div class="modal-window">
                <div class="modal-window-inner">
                    <div class="content-area">
                        <div class="popup-close-button">
                            <?php echo $close_icon; ?>
                        </div>
                        <div class="popup-diamond">
                            <?php echo $diamond_icon; ?>
                        </div>
                        <div class="pm-popup-header">
                            <h2 class="font-orange header-one">Upgrade to</h2>
                            <h2 class="header-two">WP Project Manager <span class="font-bold">Pro</span></h2>
                            <h2 class="header-three font-gray">unlock and take advantage of our premium features 🎉</h2>
                        </div>
                        <div class="pm-popup-list-area">
                            <div class="single-checklist">
                                <div class="check-icon">
                                    <?php echo $check_icon; ?>
                                </div>
                                <div class="check-list">
                                    <p>
                                        Give your team & projects additional pace with 10+ premium modules such as -
                                        <span class="bold font-black">Stripe Gateway, Time Tracker, Sub Task, Invoice, Kanban Board, Gantt Chart, WooCommerce Order, BuddyPress</span> etc.
                                    </p>
                                </div>
                            </div>
                            <div class="single-checklist">
                                <div class="check-icon">
                                    <?php echo $check_icon; ?>
                                </div>
                                <div class="check-list">
                                    <p>
                                        Experience the <span class="bold font-black">Advanced Files Manager</span>
                                        the helps you to <span class="bold font-black">upload, store</span> or
                                        <span class="bold font-black">create files, documents, custom fields,</span>
                                        and <span class="bold font-black">images</span> from one place and keeps you hassle free.
                                    </p>
                                </div>
                            </div>
                            <div class="single-checklist">
                                <div class="check-icon">
                                    <?php echo $check_icon; ?>
                                </div>
                                <div class="check-list">
                                    <p>
                                        Get more <span class="bold font-black">Advanced Reporting, Automatic</span>
                                        Daily Digest Mail, and <span class="bold font-black">Real-Time Updates</span>.
                                    </p>
                                </div>
                            </div>
                            <div class="single-checklist">
                                <div class="check-icon">
                                    <?php echo $check_icon; ?>
                                </div>
                                <div class="check-list">
                                    <p>
                                        <span class="bold font-black">Collaborate</span> with your team members privately with
                                        <span class="bold font-black">Built-in Private Messenger</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <a href="<?php echo self::get_upgrade_to_pro_popup_url(); ?>" target="_blank" class="pro-button button-upgrade-to-pro">
                            <?php
                            /* translators: %s: Crown Icon */
                            echo sprintf( __( 'Upgrade to PRO <span class="pro-icon">%s</span>', 'wedevs-project-manager' ), $crown_icon );
                            ?>
                        </a>
                    </div>
                    <div class="slider-area">
                        <div class="pm-slider slider-indicators-outside slider-indicators-round slider-nav-mousedrag slider-nav-autoplay slider-nav-autopause" id="pm-slider">
                            <div class="swiffy-slider">
                                <ul class="slider-container">
                                    <li><img src="<?php echo pm_config( 'define.url' ) . 'core/Pro/assets/images/popup-slider/slider-1.jpg'; ?>"></li>
                                    <li><img src="<?php echo pm_config( 'define.url' ) . 'core/Pro/assets/images/popup-slider/slider-2.jpg'; ?>"></li>
                                    <li><img src="<?php echo pm_config( 'define.url' ) . 'core/Pro/assets/images/popup-slider/slider-3.jpg'; ?>"></li>
                                    <li><img src="<?php echo pm_config( 'define.url' ) . 'core/Pro/assets/images/popup-slider/slider-4.jpg'; ?>"></li>
                                </ul>

                                <div class="slider-indicators">
                                    <button class="active"></button>
                                    <button></button>
                                    <button></button>
                                    <button></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="footer-feature">
                        <p><?php echo $check_icon; ?> Industry leading 24x7 support</p>
                        <p><?php echo $check_icon; ?> 14 days no questions asked refund policy</p>
                        <p><?php echo $check_icon; ?> Secured payment</p>
                    </div>
                </div>
            </div>
        </div>
        <div id="wedevs-project-manager" class="wedevs-pm-wrap wrap wp-core-ui pm pm-page-wrapper">
            <h2><?php esc_html_e( 'Modules', 'wedevs-project-manager' ); ?></h2>
            <div class="pm-wrap module-list-area">
                <?php foreach ( $modules as $module ) : ?>
                    <div class="plugin-card">
                        <div class="plugin-card-top" id='<?php echo esc_attr( $module['id'] ); ?>'>
                            <div class="name column-name">
                                <h3>
                                    <span class="plugin-name"><?php echo esc_html( $module['name'] ); ?></span>
                                    <img src="<?php echo pm_config( 'define.url' ) . 'core/Pro/assets/images/' . esc_attr( $module['thumbnail'] ); ?>"
                                        alt="<?php echo esc_attr( $module['name'] ); ?>" style="height: 96px; width: 96px;"
                                        class="plugin-icon pm-pro-module-icon" />
                                </h3>
                            </div>
                            <div class="action-links">
                                <ul class="plugin-action-buttons">
                                    <li><span class="pm-toggle-switch big"></span></li>
                                </ul>
                            </div>
                            <div class="desc column-description">
                                <p><?php echo esc_html( $module['description'] ); ?></p>
                            </div>
                        </div>
                        <div class="form-create-overlay">
                            <a href="#pm-upgrade-popup" class="pro-button button-upgrade-to-pro">
                                <?php
                                /* translators: %s: Crown Icon */
                                echo sprintf( __( 'Upgrade to PRO <span class="pro-icon">%s</span>', 'wedevs-project-manager' ), $crown_icon );
                                ?>
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
    }

    /**
     * Get the upgrade to pro url from the PRO Prompts
     *
     * @since 2.5.1
     *
     * @return string
     */
    public static function get_upgrade_to_pro_popup_url() {
        return esc_url( 'https://wedevs.com/wp-user-frontend-pro/pricing/?utm_source=wpdashboard&utm_medium=popup' );
    }

	public function scripts() {
//		Enqueue_Scripts::scripts();
//		Enqueue_Scripts::styles();

        wp_enqueue_style( 'pm-pro-styles' );
        wp_enqueue_script( 'pm-pro-script' );
	}
}
