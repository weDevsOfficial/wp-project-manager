<?php
global $wpdb;

$table_name = $wpdb->prefix . 'cpm_user_role';
$result     = $wpdb->get_results ("SHOW COLUMNS FROM  $table_name LIKE 'component' ");

if ( ! $result ) {
    $sql = " ALTER TABLE  $table_name ADD `component` varchar(20) CHARACTER SET utf8 NOT NULL ; ";
    $wpdb->query($sql) ;
}