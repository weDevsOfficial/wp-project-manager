<?php
namespace WeDevs\PM\Core\Promotions;

/**
* Promotion class
*
* For displaying AI base add on admin panel
*/
class Offers {

    function __construct() {
        add_action( 'admin_notices', array( $this, 'promotional_offer' ) );
        add_action( 'wp_ajax_pm-dismiss-offer-notice', array( $this, 'dismiss_offer' ) );
    }

    public function get_offer() {
        $offer        = new \stdClass;
        
        $current_time = new \DateTimeImmutable( 'now', new \DateTimeZone('America/New_York') );
        $disabled_key = get_option( 'pm_offer_notice' );

        $promotion1_start = $current_time->setDate( 2020, 12, 22 )->setTime( 09, 0, 0 );
        $promotion1_end   = $current_time->setDate( 2021, 01, 08 )->setTime( 23, 59, 00 );

        // $promotion1_start = $current_time->setDate( 2020, 12, 17 )->setTime( 23, 1, 0 );
        // $promotion1_end   = $current_time->setDate( 2020, 12, 17 )->setTime( 23, 59, 00 );

        if ( $current_time >= $promotion1_start && $current_time <= $promotion1_end ) {
            $offer->status  = $disabled_key == 'pm_holiday_offer' ? false : true;
            $offer->message = __( 'Enjoy Up To <strong>50% OFF</strong> on <strong>WP Project Manager Pro</strong>. Get Your ', 'wedevs-project-manager' );
            $offer->link    = 'https://wedevs.com/wp-project-manager-pro/pricing?utm_medium=text&utm_source=wordpress-wppm-holidays';
            $offer->key     = 'pm_holiday_offer';

            return $offer;
        }

        // $promotion2_start = $promotion1_end->setTime( 14, 0, 1 );
        // $promotion2_end = $promotion2_start->modify( '+4 days' )->setTime( 23, 59, 59 );

        // if ( $current_time >= $promotion2_start && $current_time <= $promotion2_end ) {
        //     $offer->status  = $disabled_key == 'pm_offer_2' ? false : true;
        //     $offer->message = __( 'Enjoy Up To <strong>50% OFF</strong> on <strong>WP Project Manager Pro</strong>. Get Your Black Friday', 'wedevs-project-manager' );
        //     $offer->link    = 'https://wedevs.com/wp-project-manager-pro/pricing?utm_medium=text&utm_source=wordpress-wppm';
        //     $offer->key     = 'pm_offer_2';

        //     return $offer;
        // }
        
        // $promotion3_start = $promotion2_end->modify( 'next day' )->setTime( 0, 0, 0);
        // $promotion3_end   = $current_time->setDate( 2020, 12, 4 )->setTime( 23, 59, 59 );

        // if ( $current_time >= $promotion3_start && $current_time <= $promotion3_end ) {
        //     $offer->status  = $disabled_key == 'pm_offer_3' ? false : true;
        //     $offer->message = __( 'Enjoy Up To <strong>50% OFF</strong> on <strong>WP Project Manager Pro</strong>. Get Your Cyber Monday', 'wedevs-project-manager' );
        //     $offer->link    = 'https://wedevs.com/wp-project-manager-pro/pricing?utm_medium=text&utm_source=wordpress-wppm';
        //     $offer->key     = 'pm_offer_3';

        //     return $offer;
        // }
        
        $offer->status = false;

        return $offer;
    }

    /**
     * Get prmotion data
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function promotional_offer() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        // global $wedevs_pm_pro;

        // if ( $wedevs_pm_pro ) {
        //     return false;
        // }

        $offer = $this->get_offer();

        if ( ! $offer->status ) {
            return;
        }

        ?>
            <div class="notice notice-success is-dismissible" id="pm-notice">
                <div class="content">
                    <p><?php echo $offer->message; ?></p>
                    <a class="link" target="_blank" href="<?php echo $offer->link; ?>"><strong><?php _e( 'Holiday Deals Now', 'wedevs-project-manager' ) ; ?></strong></a>
                </div>
                
            </div>

            <style>
                #pm-notice .content {
                    display: flex;
                    align-items: center;
                }
            </style>

            <script type='text/javascript'>

                jQuery('body').on('click', '#pm-notice .notice-dismiss', function(e) {
                    e.preventDefault();
                    
                    jQuery.ajax({
                        type: 'POST',
                        data: {
                            action: 'pm-dismiss-offer-notice',
                            nonce: '<?php echo esc_attr( wp_create_nonce( 'pm_dismiss_offer' ) ); ?>',
                            pm_offer_key: '<?php echo $offer->key; ?>'
                        },
                        url: '<?php echo admin_url( "admin-ajax.php" ); ?>',
                        success: function (res) {

                        }
                    });
                });
            </script>
        <?php
    }

    /**
     * Dismiss promotion notice
     *
     * @since  2.5.6
     *
     * @return void
     */
    public function dismiss_offer() {

        if ( isset( $_POST['nonce'] ) && ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'pm_dismiss_offer' ) ) {
            wp_send_json_error( __( 'Invalid nonce', 'wedevs-project-manager' ) );
        }

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( __( 'You have no permission to do that', 'wedevs-project-manager' ) );
        }

        $offer_key  = 'pm_offer_notice';
        $disabled_key = sanitize_text_field( $_POST['pm_offer_key'] );

        update_option( $offer_key, $disabled_key );
    }
}
