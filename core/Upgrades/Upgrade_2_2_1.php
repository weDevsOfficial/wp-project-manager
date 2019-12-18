<?php
namespace WeDevs\PM\Core\Upgrades;

/**
 *   Upgrade project manager 2.2.1
 */
class Upgrade_2_2_1 {
    

    /*initialize */
    public function upgrade_init() {
        $this->pm_update_milestone_duedate_meta();
    }

	function pm_update_milestone_duedate_meta() {
		global $wpdb;

		$tb_meta = pm_tb_prefix() . 'pm_meta';

		$query = $wpdb->prepare("SELECT id, meta_value FROM {$wpdb->prefix}pm_meta WHERE entity_type=%s AND meta_key=%s", 'milestone', 'achieve_date');

		$results = $wpdb->get_results( $wpdb->prepare("SELECT id, meta_value FROM {$wpdb->prefix}pm_meta WHERE entity_type=%s AND meta_key=%s", 'milestone', 'achieve_date') );

		foreach ( $results as $key => $meta ) {
			$meta_value = maybe_unserialize( $meta->meta_value );
			
			if ( is_object( $meta_value ) ) {
				$date = date( 'Y-m-d H:i:s', strtotime( $meta_value->date ) );

				$wpdb->update( $tb_meta, ['meta_value' => $date], ['id' => $meta->id] );
			}
		}
	}

}
