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
        global $submenu;


        if ( pm_has_manage_capability() ) {
            $submenu['pm_projects'][] = array( self::pro_menu_string( 'Woo Project' ), self::$capability, 'admin.php?page=pm_projects#/woo-project' );
//            add_action( 'admin_print_styles-' . $home, array($this, 'woo_project_load_scripts') );
        }

        if ( current_user_can( 'activate_plugins' ) ) {
            $submenu['pm_projects'][] = array( self::pro_menu_string( 'License' ), 'activate_plugins', 'admin.php?page=pm_projects#/license' );
//            add_action( 'admin_print_styles-' . $hook, array( $this, 'scripts' ) );
        }

        $submenu['pm_projects']['calendar'] = array( self::pro_menu_string( 'Calendar' ), self::$capability, 'admin.php?page=pm_projects#/calendar' );

        if ( pm_has_manage_capability() ) {
            $submenu['pm_projects'][]          = array( $this->pro_menu_string( 'Progress' ), self::$capability, 'admin.php?page=pm_projects#/progress' );
            $submenu['pm_projects']['reports'] = array( $this->pro_menu_string( 'Reports' ), self::$capability, 'admin.php?page=pm_projects#/reports' );
            $submenu['pm_projects'][]          = array( $this->pro_menu_string( 'Modules' ), self::$capability, 'admin.php?page=pm_projects#/modules', self::modules_preview_page() );
        }

        add_action( 'pm_modules_page_contents', self::modules_page_contents() );

//        add_action( 'admin_print_styles-' . $slug, array( $this, 'scripts' ) );

        do_action( 'pm_pro_menu', $slug );
	}

    private function pro_menu_string( $menu_name ) {
        global $wedevs_pm_pro;

        if ( ! $wedevs_pm_pro ) {
            return sprintf(
                __( '%1$s %2$sPro%3$s', 'wedevs-project-manager' ),
                $menu_name,
                '<span class="pm-pro-badge">',
                '</span>'
            );
        }

        return __( $menu_name, 'wedevs-project-manager' );
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
    public static function modules_page_contents() {
        $modules = self::pro_modules_info();
        ?>
        <div id="wedevs-project-manager" class="wedevs-pm-wrap wrap wp-core-ui pm pm-page-wrapper">
            <h2 style="display: none;"></h2>
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
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
    }

	public function scripts() {
		Enqueue_Scripts::scripts();
		Enqueue_Scripts::styles();
	}
}
