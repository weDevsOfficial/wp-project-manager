<?php
global $wpdb;
return [
    'driver'    => 'mysql',
    'host'      => pm_wp_config( 'DB_HOST' ),
    'database'  => pm_wp_config( 'DB_NAME' ),
    'username'  => pm_wp_config( 'DB_USER' ),
    'password'  => pm_wp_config( 'DB_PASSWORD' ),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix'    => $wpdb->prefix,
];