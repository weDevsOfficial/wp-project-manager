<?php

use Wprl\Core\Config\Config;

function config( $key = null ) {
    return Config::get( $key );
}

function wp_config( $key ) {
    return constant( $key );
}

function migrations_table_prefix() {
    $slug = config( 'app.slug' );
    $prefix = str_replace( '-', '_', str_replace( ' ', '_', $slug ) );

    return $prefix;
}