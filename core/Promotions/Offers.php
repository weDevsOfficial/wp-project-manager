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

        $promotion1_start = $current_time->setDate( '2021', '03', '15' )->setTime( '09', '00', '00' );
        $promotion1_end   = $current_time->setDate( '2021', '03', '22' )->setTime( '23', '59', '59' );

        if ( $current_time >= $promotion1_start && $current_time <= $promotion1_end ) {
            $offer->status  = $disabled_key == 'pm_wedevs_birthday_offer' ? false : true;
            $offer->message = __( 'It\'s Our Birthday! Enjoy Up To <strong>45% OFF</strong> on <strong>WP Project Manager Pro</strong>. ', 'wedevs-project-manager' );
            $offer->link    = 'https://wedevs.com/wp-project-manager-pro/pricing?utm_medium=text&utm_source=wordpress-wppm-wedevs-birthday';
            $offer->key     = 'pm_wedevs_birthday_offer';

            return $offer;
        }
        
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

        $offer = $this->get_offer();

        if ( ! $offer->status ) {
            return;
        }

        ?>
            <div class="notice notice-success is-dismissible pm-promotional-offer-notice" id="pm-notice">
                <div class="content">
                    <p><?php echo $offer->message; ?></p>
                    <a class="link" target="_blank" href="<?php echo $offer->link; ?>"><?php _e( 'Get Now', 'wedevs-project-manager' ) ; ?></a>
                </div>
                
            </div>

            <style>
                #pm-notice .content {
                    display: flex;
                    align-items: center;
                }

                .pm-promotional-offer-notice {
                    background: linear-gradient(45deg, #8c43ba, #dda8ff);
                    color: rgb(255, 255, 222);
                    border-left: 6px solid #e6e3dc;
                }

                .pm-promotional-offer-notice p {
                    font-size: 20px;
                }

                .pm-promotional-offer-notice a {
                    color: rgb(250, 250, 208);
                    border: 0.5px solid rgb(252, 252, 199);
                    border-radius: 4px;
                    padding: 4px;
                    text-decoration: none;
                    font-size: 20px;
                    font-weight: 200;
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

        if ( empty( $_POST['nonce'] ) ) {
            return;
        }

        if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'pm_dismiss_offer' ) ) {
            wp_send_json_error( __( 'Invalid nonce', 'wedevs-project-manager' ) );
            return;
        }

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( __( 'You have no permission to do that', 'wedevs-project-manager' ) );
            return;
        }

        $offer_key  = 'pm_offer_notice';
        $disabled_key = sanitize_text_field( $_POST['pm_offer_key'] );

        update_option( $offer_key, $disabled_key );
    }
}
