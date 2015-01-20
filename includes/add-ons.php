<div class="wrap">
    <h2><?php _e( 'WP Project Manager - add-ons', 'cpm' ); ?></h2>

    <?php
    $add_ons = get_transient( 'cpm_addons' );

    if ( false === $add_ons ) {
        $response = wp_remote_get( 'http://wedevs.com/api/cpm/addons.php', array('timeout' => 15) );
        $update = wp_remote_retrieve_body( $response );

        if ( is_wp_error( $response ) || $response['response']['code'] != 200 ) {
            return false;
        }

        set_transient( 'cpm_addons', $update, 12 * HOUR_IN_SECONDS );
    }

    $add_ons = json_decode( $add_ons );

    if ( count( $add_ons ) ) {
        foreach ($add_ons as $addon) {
            ?>

            <div class="wpuf-addon">
                <div class="wpuf-addon-thumb">
                    <a href="<?php echo $addon->url; ?>" target="_blank">
                        <img src="<?php echo $addon->thumbnail; ?>" alt="<?php echo esc_attr( $addon->title ); ?>" />
                    </a>
                </div>

                <div class="wpuf-detail">
                    <h3 class="title">
                        <a href="<?php echo $addon->url; ?>" target="_blank"><?php echo $addon->title; ?></a>
                    </h3>

                    <div class="text"><?php echo $addon->desc; ?></div>
                </div>

                <div class="wpuf-links">
                    <?php if ( class_exists( $addon->class ) ) { ?>
                        <a class="button button-disabled" href="<?php echo $addon->url; ?>" target="_blank"><?php _e( 'Installed', 'cpm' ); ?></a>
                    <?php } else { ?>
                        <a class="button" href="<?php echo $addon->url; ?>" target="_blank"><?php _e( 'View Details', 'cpm' ); ?></a>
                    <?php } ?>
                </div>
            </div>

            <?php
        }
    } else {
        echo '<div class="error"><p>' . __( 'Error fetching add-ons. Please try again later!', 'cpm' ) . '</p></div>';
    }
    ?>
    
    
    <div class="clear"></div>
    <a href="http://wedevs.com/plugin/wp-project-manager/" target="_blank">
        <img src="<?php echo plugins_url( '', dirname( __FILE__ ) ); ?>/images/banner.png" alt="Get PRO version" title="Get the PRO version">
    </a>

    <style type="text/css">
        .wpuf-addon {
            width: 220px;
            float: left;
            margin: 10px;
            border: 1px solid #E6E6E6;
        }

        .wpuf-addon-thumb img {
            max-width: 220px;
            max-height: 140px;
        }

        .wpuf-detail {
            padding: 6px 10px 10px;
            min-height: 110px;
            background: #f9f9f9;
        }

        .wpuf-detail h3.title {
            margin: 5px 0 10px;
            padding: 0;
        }

        .wpuf-detail h3.title a {
            text-decoration: none;
            color: #111;
        }

        .wpuf-links {
            padding: 10px;
            background: #F5F5F5;
            border-top: 1px solid #E6E6E6;
        }

        a.button.disabled {
            background: #eee;
        }
    </style>

</div>