<?php
/*global $wpdb;
$table_name = $wpdb->prefix . 'cpm_file_relationship';

$sql = "
CREATE TABLE IF NOT EXISTS $table_name (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `pid` int(11) unsigned NOT NULL,
  `dir_id` int(11) unsigned NOT NULL,
  `dir_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `attachment_id` int(11) unsigned NOT NULL,
  `parent_id` int(11) unsigned NOT NULL,
  `is_dir` tinyint(1) unsigned NOT NULL,
  `private` tinyint(1) unsigned NOT NULL,
  `created_by` int(11) unsigned NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pid` (`pid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ; " ;

$wpdb->query($sql) ;
 * 
 */