<?php

namespace WeDevs\PM\Core\Promotions;

/**
* Promotion class
*
* For displaying AI base add on admin panel
*/
class Offers {

    /**
     * Class constructor
     */
    public function __construct() {
        add_action( 'admin_notices', array( $this, 'promotional_offer' ) );
        add_action( 'wp_ajax_pm-dismiss-offer-notice', array( $this, 'dismiss_offer' ) );
    }

    /**
     * Retrieves offer data.
     *
     * @return object
     */
    public function get_offer() {
        $offer         = new \stdClass;
        $offer->status = false;
        $promo_notice  = get_transient( 'wppm_promo_notice' );

        if ( false === $promo_notice ) {
            $promo_notice_url = 'https://raw.githubusercontent.com/weDevsOfficial/wppm-util/master/promotions.json';
            $response         = wp_remote_get( $promo_notice_url, array( 'timeout' => 15 ) );

            if ( is_wp_error( $response ) || $response['response']['code'] !== 200 ) {
                return $offer;
            }

            $promo_notice = wp_remote_retrieve_body( $response );
            set_transient( 'wppm_promo_notice', $promo_notice, DAY_IN_SECONDS );
        }

        $promo_notice = json_decode( $promo_notice, true );
        $current_time = new \DateTimeImmutable( 'now', new \DateTimeZone('America/New_York') );
        $current_time = $current_time->format( 'Y-m-d H:i:s T' );
        $disabled_key = get_option( 'pm_offer_notice' );

        if ( $current_time >= $promo_notice['start_date'] && $current_time <= $promo_notice['end_date'] ) {
            $offer->link      = $promo_notice['action_url'];
            $offer->key       = $promo_notice['key'];
            $offer->btn_txt   = ! empty( $promo_notice['action_title'] ) ? $promo_notice['action_title'] : 'Get Now';
            $offer->message   = [];
            $offer->message[] = sprintf( __( '<strong>%s</strong>', 'wedevs-project-manager' ), $promo_notice['title'] );

            if ( ! empty( $promo_notice['description'] ) ) {
                $offer->message[] = sprintf( __( '%s', 'wedevs-project-manager' ), $promo_notice['description'] );
            }

            $offer->message[] = sprintf( __( '%s', 'wedevs-project-manager' ), $promo_notice['content'] );
            $offer->message   = implode( '<br>', $offer->message );

            if ( $disabled_key != $promo_notice['key'] ) {
                $offer->status = true;
            }
        }

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

        // Check if inside the wp-project-manager page
        if ( ! isset( $_GET['page'] ) || 'pm_projects' !== $_GET['page'] ) {
            return;
        }

        $offer = $this->get_offer();
        if ( ! $offer->status ) {
            return;
        }

        ?>
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

            <div class="notice notice-success is-dismissible pm-promotional-offer-notice" id="pm-notice">
                <div class="content">
                    <p>
                        <?php echo wp_kses( $offer->message, [ 'strong' => [], 'br' => [] ] ); ?>
                        <br>
                        <a class="link" target="_blank" href="<?php echo esc_url( $offer->link ); ?>">
                            <?php printf( esc_html__( '%s', 'wedevs-project-manager' ), $offer->btn_txt ); ?>
                        </a>
                    </p>
                </div>
            </div>

            <script type='text/javascript'>

                jQuery('body').on('click', '#pm-notice .notice-dismiss', function(e) {
                    e.preventDefault();

                    jQuery.ajax({
                        type: 'POST',
                        data: {
                            action: 'pm-dismiss-offer-notice',
                            nonce: '<?php echo esc_attr( wp_create_nonce( 'pm_dismiss_offer' ) ); ?>',
                            pm_offer_key: '<?php echo esc_attr( $offer->key ); ?>'
                        },
                        url: '<?php echo esc_url( admin_url( "admin-ajax.php" ) ); ?>',
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

        if ( empty( $_POST['nonce'] ) && ! isset( $_POST['pm_offer_key'] ) ) {
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

        $offer_key    = 'pm_offer_notice';
        $disabled_key = sanitize_text_field( wp_unslash( $_POST['pm_offer_key'] ) );

        update_option( $offer_key, $disabled_key );
    }
}
