<?php
global $wpdb;
return [
    'driver'    => 'mysql',
    'host'      => wedevs_pm_config( 'DB_HOST' ),
    'database'  => wedevs_pm_config( 'DB_NAME' ),
    'username'  => wedevs_pm_config( 'DB_USER' ),
    'password'  => wedevs_pm_config( 'DB_PASSWORD' ),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix'    => $wpdb->prefix,
];