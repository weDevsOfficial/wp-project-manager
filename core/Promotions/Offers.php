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

        $promotion1_start = $current_time->setDate( '2021', '10', '21' )->setTime( '09', '00', '00' );
        $promotion1_end   = $current_time->setDate( '2021', '10', '31' )->setTime( '23', '59', '59' );

        if ( $current_time >= $promotion1_start && $current_time <= $promotion1_end ) {
            $offer->status  = $disabled_key == 'pm_halloween_offer_2021' ? false : true;
            $offer->message = __( '<strong>Get Yourself a Spooky Delight !</strong></br>Get Up To <strong>40% OFF</strong> on <strong>WP Project Manager Pro</strong>.', 'wedevs-project-manager' );
            $offer->link    = 'https://wedevs.com/wp-project-manager-pro/pricing?utm_medium=text&utm_source=wordpress-wppm-halloween20212021';
            $offer->key     = 'pm_halloween_offer_2021';

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
                    <p>
                        <?php echo $offer->message; ?>
                        <a class="link" target="_blank" href="<?php echo $offer->link; ?>"><?php _e( 'Get Now', 'wedevs-project-manager' ) ; ?></a>
                    </p>
                </div>

            </div>

            <style>
                #pm-notice .content {
                    display: flex;
                    align-items: center;
                }

                .pm-promotional-offer-notice {
                    background: linear-gradient(30deg, #f2f2f2, #a761d3);
                    color: #602a81b8;
                    border-left: 5px solid #a761d3;
                }

                .pm-promotional-offer-notice p {
                    font-size: 16px;
                    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
                }

                .pm-promotional-offer-notice a {
                    color: lightcyan;
                    border: 0.5px solid #a761d3;
                    border-radius: 3px;
                    padding: 2px 5px 1px 5px;
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: 300;
                    background: #a761d3;
                    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                }

                .pm-promotional-offer-notice a:hover {
                    color: white;
                    border: 0.5px solid  #9a51c7;
                    background:  #9a51c7;
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
