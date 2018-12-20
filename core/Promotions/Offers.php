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
        add_action( 'wp_ajax_pm-dismiss-christmas-offer-notice', array( $this, 'dismiss_christmas_offer' ) );
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
        
        if ( date( 'Y-m-d', current_time( 'timestamp') ) > '2018-12-31' ) {
            return;
        }
        
        global $wedevs_pm_pro;

        // check if it has already been dismissed
        $offer_key   = 'pm_christmas_notice';
        $hide_notice =  get_option( $offer_key, 'show' );
        
        if ( $hide_notice == 'hide' || $wedevs_pm_pro ) {
            return false;
        }

        $offer_link  = 'https://wedevs.com/wp-project-manager-pro/?add-to-cart=16273&variation_id=16274&attribute_pa_license=professional&coupon_code=xmas30';
        $content = __( '<p>In this Christmas, stay on top of budgets. Spend <strong>30%% LESS</strong> on <strong>WP Project Manager Pro</strong> and increase productivity for you and your organization. [Limited time ⏳😎]</p> <p><a target="_blank" class="button button-primary" href="%s">Grab The Deal</a></p>', 'wedevs-project-manager' );

        ?>
            <div class="notice notice-success is-dismissible" id="pm-christmas-notice">
                <?php printf( $content, esc_url( $offer_link ) ); ?>
            </div>

            <style>
                #pm-christmas-notice p {
                    /*font-size: 15px;*/
                }
            </style>

            <script type='text/javascript'>
                jQuery('body').on('click', '#pm-christmas-notice .notice-dismiss', function(e) {
                    e.preventDefault();

                    wp.ajax.post( 'pm-dismiss-christmas-offer-notice', {
                        pm_christmas_dismissed: true,
                        nonce: '<?php echo esc_attr( wp_create_nonce( 'pm_christmas_offer' ) ); ?>'
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
    public function dismiss_christmas_offer() {

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( __( 'You have no permission to do that', 'wedevs-project-manager' ) );
        }
        $nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';
        if ( ! wp_verify_nonce( $nonce, 'pm_christmas_offer' ) ) {
            wp_send_json_error( __( 'Invalid nonce', 'wedevs-project-manager' ) );
        }

        if ( ! empty( $_POST['pm_christmas_dismissed'] ) ) {
            $offer_key = 'pm_christmas_notice';
            update_option( $offer_key, 'hide' );
        }
    }
}
