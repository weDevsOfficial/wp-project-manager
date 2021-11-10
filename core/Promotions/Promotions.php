<?php
namespace WeDevs\PM\Core\Promotions;

use WeDevs\PM\Core\Promotions\Wedevs_Promotion;

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
}
