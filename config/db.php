<?php
global $wpdb;
return [
    'driver'    => 'mysql',
    'host'      => wp_config( 'DB_HOST' ),
    'database'  => wp_config( 'DB_NAME' ),
    'username'  => wp_config( 'DB_USER' ),
    'password'  => wp_config( 'DB_PASSWORD' ),
    'prefix'    => $wpdb->prefix,
];