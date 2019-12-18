<?php
namespace WeDevs\PM\Core\Admin_Notice;

class Admin_Notice {

	function __construct() {
		add_action( 'admin_notices', [$this, 'pm_pro_notice_2_1_0'] );

		if ( class_exists('WeDevs_CPM_Pro') ) {
			add_action( 'admin_notices', [$this, 'pm_pro_notice'] );
		}
	}

	function pm_pro_notice_2_1_0() {
		if ( ! function_exists( 'pm_pro_config' ) ) {
			return;
		}

		$pro_version = pm_pro_config('app.version');

		if ( version_compare( $pro_version, '2.0.12' , '<' ) ) {
            ?>
            <div class="notice is-dismissible" id="wpuf-update-offer-notice">
                <table>
                    <tbody>
                        <tr>
                            <td class="image-container">
                                <img src="https://ps.w.org/wedevs-project-manager/assets/icon-256x256.png" alt="">
                            </td>
                            <td class="message-container">
                                <p style="font-size: 13px">
				                    <strong class="highlight-text" style="font-size: 18px; display:block; margin-bottom:8px">
				                    	<?php esc_html_e( 'UPDATE REQUIRED', 'wedevs-project-manager' ); ?> 
				                    </strong>
				                    <?php esc_html_e( 'WP Project Manager Pro is not working because you are using an old version of WP Project Manager Pro. Please update', 'wedevs-project-manager'); ?>
				                    <strong>
					                    <?php esc_html_e( 'WP Project Manager Pro', 'wedevs-project-manager'); ?>
					                    		
					                    <?php esc_html_e( 'to >= v2.0.12', 'wedevs-project-manager') ?> 
				                	</strong> 

				                    <?php esc_html_e( 'to work with the latest version of WP Project Manager', 'wedevs-project-manager'); ?>
				                </p>
                            </td>
                            <td><a href="https://wedevs.com/account/downloads/" class="button button-primary promo-btn" target="_blank"><?php esc_html_e( 'Update WP Project Manager Pro Now', 'wedevs-project-manager' ); ?></a></td>
                        </tr>
                    </tbody>
                </table>
                <!-- <a href="https://wedevs.com/account/downloads/" class="button button-primary promo-btn" target="_blank"><?php esc_html_e( 'Update WP Project Manager Pro NOW', 'wedevs-project-manager' ); ?></a> -->
            </div><!-- #wpuf-update-offer-notice -->

            <style>
                #wpuf-update-offer-notice {
                    background-size: cover;
                    border: 0px;
                    padding: 10px;
                    opacity: 0;
                    border-left: 3px solid red;
                }

                .wrap > #wpuf-update-offer-notice {
                    opacity: 1;
                }

                #wpuf-update-offer-notice table {
                    border-collapse: collapse;
                    width: 70%;
                }

                #wpuf-update-offer-notice table td {
                    padding: 0;
                }

                #wpuf-update-offer-notice table td.image-container {
                    background-color: #fff;
                    vertical-align: middle;
                    width: 95px;
                }


                #wpuf-update-offer-notice img {
                    max-width: 100%;
                    max-height: 100px;
                    vertical-align: middle;
                    border-radius: 100%;
                }

                #wpuf-update-offer-notice table td.message-container {
                    padding: 0 10px;
                }

                #wpuf-update-offer-notice h2{
                    color: #000;
                    margin-bottom: 10px;
                    font-weight: normal;
                    margin: 16px 0 14px;
                    -webkit-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    -moz-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    -o-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                }


                #wpuf-update-offer-notice h2 span {
                    position: relative;
                    top: 0;
                }

                #wpuf-update-offer-notice p{
                    color: #000;
                    font-size: 14px;
                    margin-bottom: 10px;
                    -webkit-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    -moz-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    -o-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                }

                #wpuf-update-offer-notice p strong.highlight-text{
                    color: #000;
                }

                #wpuf-update-offer-notice p a {
                    color: #000;
                }

                #wpuf-update-offer-notice .notice-dismiss:before {
                    color: #fff;
                }

                #wpuf-update-offer-notice span.dashicons-megaphone {
                    position: absolute;
                    bottom: 46px;
                    right: 248px;
                    color: rgba(253, 253, 253, 0.29);
                    font-size: 96px;
                    transform: rotate(-21deg);
                }

                #wpuf-update-offer-notice a.promo-btn{
                    background: #0073aa;
                    /*border-color: #fafafa #fafafa #fafafa;*/
                    box-shadow: 0 1px 0 #fafafa;
                    color: #fff;
                    text-decoration: none;
                    text-shadow: none;
                    position: absolute;
                    top: 40px;
                    right: 26px;
                    height: 40px;
                    line-height: 40px;
                    width: 300px;
                    text-align: center;
                    font-weight: 600;
                }

            </style>
            <!-- <script type='text/javascript'>
                jQuery('body').on('click', '#wpuf-update-offer-notice .notice-dismiss', function(e) {
                    e.preventDefault();

                    wp.ajax.post('wpuf-dismiss-update-offer-notice', {
                        dismissed: true
                    });
                });
            </script> -->
            <?php
        }
	}

	public function pm_pro_notice() {
		$offer  = __( '<h2>WP Project Manager Pro required version 2.0 or above.</span></h2>', "wedevs-project-manager" );
        $offer .= __( '<p>To migrate version 2.0, Please read mmigration docs </p>', 'wedevs-project-manager' );

        $offer_msg = sprintf( '%s', $offer );
		 ?>
		 <div class="notice" id="pm-promotional-offer-notice">

                <img class="pm-logo" src="<?php echo esc_url(config('frontend.url') . 'views/assets/images/pm-icon.png'); ?>" alt="">
                <div class="pm-offer-msg-wrap"><?php echo esc_html($offer_msg); ?></div>
                <span class="dashicons dashicons-megaphone"></span>
                <a href="https://wedevs.com/docs/wp-project-manager/how-to-migrate-to-wp-project-manager-v2-0/?utm_source=wp-admin&utm_medium=pm-action-link&utm_campaign=pm-docs" class="button button-primary promo-btn" target="_blank"><?php esc_html_e( 'Read Docs', 'wedevs-project-manager' ); ?></a>
            </div>

            <style>
                .pm-offer-msg-wrap {
                    margin-top: 18px;
                    margin-left: 20px;
                }
                #pm-promotional-offer-notice {
                    background-color: #e53935;
                    border-left: 0px;
                    padding-left: 83px;
                    height: 89px;
                    position: relative;
                }

                #pm-promotional-offer-notice a.promo-btn{
                    background: #fff;
                    border-color: #fafafa #fafafa #fafafa;
                    box-shadow: 0 1px 0 #fafafa;
                    color: #616161;
                    text-decoration: none;
                    text-shadow: none;
                    position: absolute;
                    top: 30px;
                    right: 26px;
                    height: 40px;
                    line-height: 40px;
                    width: 130px;
                    text-align: center;
                }

                #pm-promotional-offer-notice h2{
                    font-size: 18px;
                    width: 85%;
                    color: rgba(250, 250, 250, 1);
                    margin-bottom: 8px;
                    font-weight: normal;
                    margin-top: 15px;
                    -webkit-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    -moz-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    -o-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                }

                #pm-promotional-offer-notice .pm-logo {
                    position: absolute;
                    width: auto;
                    height: 100%;
                    left: 0px;
                    background: #D32F2F;
                    top: 0;
                }

                #pm-promotional-offer-notice h2 .dashicons-megaphone {
                    position: relative;
                    top: -1px;
                }

                #pm-promotional-offer-notice p{
                    width: 85%;
                    color: rgba(250, 250, 250, 0.77);
                    font-size: 14px;
                    margin-bottom: 10px;
                    -webkit-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    -moz-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    -o-text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                    text-shadow: 0.1px 0.1px 0px rgba(250, 250, 250, 0.24);
                }

                #pm-promotional-offer-notice p strong.highlight-text{
                    color: #fff;
                }

                #pm-promotional-offer-notice p a {
                    color: #fafafa;
                }

                #pm-promotional-offer-notice .notice-dismiss:before {
                    color: #fff;
                }

                #pm-promotional-offer-notice span.dashicons-megaphone {
                    position: absolute;
                    top: 16px;
                    right: 248px;
                    color: rgba(253, 253, 253, 0.29);
                    font-size: 96px;
                    transform: rotate(-21deg);
                }

            </style>

		 <?php
	}

}
