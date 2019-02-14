<?php


function pm_update_milestone_duedate_meta() {
	global $wpdb;

	$tb_meta = pm_db_prefix() . 'pm_meta';

	$query = $wpdb->prefix("SELECT meta_value FROM $tb_meta WHERE entity_type='%s' AND meta_key='%s'", 'milestone', 'achieve_date');

	$results = $wpdb->get_results( $query );

	
}
