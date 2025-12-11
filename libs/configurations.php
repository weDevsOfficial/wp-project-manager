<?php

use WeDevs\PM\Core\Config\Config;

function wedevs_pm_config( $key = null ) {
    return Config::get( $key );
}

function wedevs_pm_wp_config( $key ) {
    return constant( $key );
}

function wedevs_pm_migrations_table_prefix() {
    $slug   = wedevs_pm_config( 'app.slug' );
    $prefix = str_replace( '-', '_', str_replace( ' ', '_', $slug ) );

    return $prefix;
}

/**
* php version notices
*  @return void
*/
function wedevs_pm_php_version_notice() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }
    $php_version = phpversion();
    ?>
        <div class="error notice" id="pm-php-notice" style="padding: 1em; position: relative;">
            <p><?php
                printf(
                    /* translators: 1: Current PHP version, 2: Required PHP version */
                    esc_html__( 'Your current PHP version is %1$s. You need to upgrade your PHP version to %2$s or later to run project manager.', 'wedevs-project-manager' ),
                    '<strong>' . esc_html( $php_version ) . '</strong>',
                    '<strong>5.6</strong>'
                );
            ?></p>
        </div>
    <?php
}
