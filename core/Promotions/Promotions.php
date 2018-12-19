<?php
namespace WeDevs\PM\Core\Promotions;

use WeDevs\PM\Core\Promotions\WeDevs_Promotion;

// if ( ! class_exists( 'WeDevs_Promotion' ) ) {
//     require_once DOKAN_LIB_DIR . '/promotions.php';
// }

/**
* Promotion class
*
* For displaying AI base add on admin panel
*/
class Promotions extends WeDevs_Promotion {

    /**
     * Time interval for displaying promo
     *
     * @var integer
     */
    public $time_interval = 5;//60*60*24*7;

    /**
     * Promo option key
     *
     * @var string
     */
    public $promo_option_key = '_pm_free_upgrade_promo';

    /**
     * Get prmotion data
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function get_promotion_data() {
        //if ( ! pm()->is_pro_exists() ) {
            return array(
                'product_subscriptiongn' => array(
                    'title'     => __( 'Visualize all the task progress and get full insights', 'wedevs-project-manager' ),
                    'content'   => __( 'Leverage the Gantt chart feature in your WP Project Manager Pro. Get exact progress illustration of all tasks, and never miss a deadline.', 'wedevs-project-manager' ),
                    'thumbnail' => 'http://localhost/pm/wp-content/plugins/pm-pro/modules/gantt/views/assets/images/gantt-chart.png',
                    'link'      => 'https://wedevs.com/wp-project-manager-pro/pricing/?utm_source=wp-project-manager-plugin&utm_medium=banner&utm_campaign=upgrade-to-pro',
                    'priority'  => 10,
                ),

                'vendor_reviewskans' => array(
                    'title'     => __( 'Get more organized and more efficient in Kanban Style', 'wedevs-project-manager' ),
                    'content'   => __( 'Utilize the popular Kanban method and improve your workflow significantly. Segment your tasks into a different category and utilize the most of project management tools.', 'wedevs-project-manager' ),
                    'thumbnail' => 'http://localhost/pm/wp-content/plugins/pm-pro/modules/kanboard/views/assets/images/kanban-board.png',
                    'link'      => 'https://wedevs.com/wp-project-manager-pro/pricing/?utm_source=wp-project-manager-plugin&utm_medium=banner&utm_campaign=upgrade-to-pro',
                    'priority'  => 20,
                ),

                'vendor_verificationtimes' => array(
                    'title'     => __( 'Time wastage is not an option!', 'wedevs-project-manager' ),
                    'content'   => __( 'Time is money! So make the most out of it. Use the advanced time tracker extension to get accurate insights about time management.', 'wedevs-project-manager' ),
                    'thumbnail' => 'http://localhost/pm/wp-content/plugins/pm-pro/modules/time_tracker/views/assets/images/time-tracker.png',
                    'link'      => 'https://wedevs.com/wp-project-manager-pro/pricing/?utm_source=wp-project-manager-plugin&utm_medium=banner&utm_campaign=upgrade-to-pro',
                    'priority'  => 30,
                ),

                'multiple_commissionsubts' => array(
                    'title'     => __( 'Small things bring great achievements!', 'wedevs-project-manager' ),
                    'content'   => __( 'Breakdown your main task into smaller parts and set milestones for them. Complete big tasks successfully easier than ever.', 'wedevs-project-manager' ),
                    'thumbnail' => 'http://localhost/pm/wp-content/plugins/pm-pro/modules/sub_tasks/views/assets/images/sub-task.png',
                    'link'      => 'https://wedevs.com/wp-project-manager-pro/pricing/?utm_source=wp-project-manager-plugin&utm_medium=banner&utm_campaign=upgrade-to-pro',
                    'priority'  => 40,
                ),
            );
        //};
    }
}
