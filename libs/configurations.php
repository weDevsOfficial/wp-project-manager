<?php

use WeDevs\PM\Core\Config\Config;

if ( ! function_exists( 'config' ) ) {
        
    function config( $key = null ) {
        return Config::get( $key );
    }
}

function pm_config( $key = null ) {
    return Config::get( $key );
}

function pm_wp_config( $key ) {
    return constant( $key );
}

function migrations_table_prefix() {
    $slug   = config( 'app.slug' );
    $prefix = str_replace( '-', '_', str_replace( ' ', '_', $slug ) );

    return $prefix;
}


/**
* php version notices
*  @return void
*/
function pm_php_version_notice() {
    
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }
    $php_version = phpversion();
    ?>
        <div class="error notice" id="pm-php-notice" style="padding: 1em; position: relative;">
            <p><?php echo sprintf( __("Your current PHP version is <strong>{$php_version}</strong>. You need to upgrade your PHP version to <strong>5.6 or later</strong> to run project manager.", "wedevs-project-manager" ) ); ?></p>
        </div>
    <?php 
}


