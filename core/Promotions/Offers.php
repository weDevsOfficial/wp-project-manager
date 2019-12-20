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

        if ( 
            date( 'Y-m-d', strtotime( current_time( 'mysql') ) ) < '2019-11-20' 
                ||
            date( 'Y-m-d', strtotime( current_time( 'mysql') ) ) > '2019-12-04' 
        ) {
            return;
        }

        global $wedevs_pm_pro;

        // check if it has already been dismissed
        $offer_key   = 'pm_christmas_notice';
        $hide_notice =  get_option( $offer_key, 'show' );

        if ( $hide_notice == 'hide' || $wedevs_pm_pro ) {
            return false;
        }

        $offer_link  = 'https://wedevs.com/wp-project-manager-pro/?add-to-cart=16273&variation_id=16274&attribute_pa_license=professional&coupon_code=BFCM2019';
        $content = __( '<p>In this Christmas, stay on top of budgets. Spend <strong>30%% LESS</strong> on <strong>WP Project Manager Pro</strong> and increase productivity for you and your organization. [Limited time ⏳😎]</p> <p><a target="_blank" class="button button-primary" href="%s">Grab The Deal</a></p>', 'wedevs-project-manager' );
        $img_url = PM_PLUGIN_ASSEST  . '/images/promo-logo.png';
        ?>
            <div class="notice notice-success is-dismissible" id="pm-christmas-notice">
                <div class="logo">
                    <img src="<?php esc_html_e( $img_url ); ?>" alt="wedevs-project-manager">
                </div>
                <div class="content">
                    <p>Biggest Sale of the year on this</p>
                    <h3> Black Friday & <span class="highlight-blue">Cyber Monday</span></h3>
                    <p>Claim your discount on
                        <span class="highlight-red">WP Project Manager </span>
                        till 4th December</p>
                </div>
                <div class="call-to-action">
                    <a href="https://wedevs.com/wp-project-manager-pro/pricing?utm_campaign=black_friday_&_cyber_monday&utm_medium=banner&utm_source=plugin_dashboard"
                    target="_blank">Save 33%</a>
                    <p> <span> Coupon: </span> &nbsp; BFCM2019</p>
                </div>
            </div>

            <style>
                #pm-christmas-notice {
                    font-size: 14px;
                    border-left: none;
                    background-image: linear-gradient(90deg, #6900CF, #8915FF);
                    color: #fff;
                    display: flex
                }
                #pm-christmas-notice .logo{
                    text-align: center;
                    text-align: center;
                    margin: 13px 30px 5px 15px;
                }
                #pm-christmas-notice .logo img{
                    width: 80%;
                }
                #pm-christmas-notice .highlight-red {
                    color: #FF76EA;
                }
                #pm-christmas-notice .highlight-blue {
                    color: #48ABFF;
                }
                #pm-christmas-notice .content {
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                }
                #pm-christmas-notice .content h3{
                    color: #FFF;
                    margin: 12px 0px;
                    font-size: 30px;
                }
                #pm-christmas-notice .content p{
                    margin: 0px 0px;
                    padding: 0px;
                    letter-spacing: 0.14px;
                    font-size: 15px;
                }
                #pm-christmas-notice .content p span.highlight-code{
                    margin: 0 0 0 10px;
                    border: 1px dotted #fff;
                    padding: 5px 10px;
                    border-radius: 15px;
                }
                #pm-christmas-notice .call-to-action {
                    margin-left: 8%;
                    margin-top: 25px;
                    text-align: center;
                }
                #pm-christmas-notice .call-to-action a {
                    border: none;
                    background: #FF53E5;
                    padding: 10px 15px;
                    font-size: 24px;
                    color: #fff;
                    border-radius: 20px;
                    text-decoration: none;
                    display: block;
                    text-align: center;
                    margin-bottom: 10px;
                    width:217px;
                    height: 40px;
                    box-sizing: border-box;
                    box-shadow: 0 5px 11px 0 rgba(66,0,132,0.37);
                    letter-spacing: 0.21px;
                }
                #pm-christmas-notice .call-to-action p {
                    font-size: 12px;
                    margin-top: 1px;
                }

                #pm-christmas-notice  #coupon-btn {
                    background: #FF0000;
                    border: none;
                    text-align: center;
                    padding: 6px 4px;
                    width: 30px;
                    border-radius: 100%;
                    cursor: pointer;
                    cursor: pointer;
                }
                #pm-christmas-notice .call-to-action p {
                    font-size: 15px;
                }

                #pm-christmas-notice .call-to-action p span {
                    color: #FF85A3;
                    font-size: 16px;
                }
                input#coupon-code {
                    background: none;
                    border: 2px dotted #f9f9f9;
                    text-align: center;
                    border-radius: 10px;
                    color: white;
                }

                .notice-dismiss:before {
                    color: #000 !important;
                }
            </style>

            <script type='text/javascript'>
                jQuery(document).on('click','#coupon-btn',function(e) {
                    e.preventDefault();
                    jQuery('#coupon-code').select();
                    document.execCommand("copy");
                });

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

        if ( isset( $_POST['nonce'] ) && ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'pm_christmas_offer' ) ) {
            wp_send_json_error( __( 'Invalid nonce', 'wedevs-project-manager' ) );
        }

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( __( 'You have no permission to do that', 'wedevs-project-manager' ) );
        }

        if ( isset( $_POST['pm_christmas_dismissed'] ) && ! empty( sanitize_text_field( wp_unslash( $_POST['pm_christmas_dismissed'] ) ) ) ) {
            $offer_key = 'pm_christmas_notice';
            update_option( $offer_key, 'hide' );
        }
    }
}
