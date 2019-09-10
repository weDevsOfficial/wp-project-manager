<?php
namespace WeDevs\PM\Settings\Helper;


class Settings {
	private $co_worker_role_project_id;
	private $client_role_project_id;
	private $manager_role_project_id;

	public function update_project_permission( $pmison_setts, $project_id  ) {

		if ( is_array( $pmison_setts ) ) { 
			foreach ( $pmison_setts as $key => $pmison_sett ) {
				if ( $pmison_sett['key'] == 'capabilities' ) {
					$this->update( $pmison_sett, $project_id );
 				}
			}
		} else {
			if ( $pmison_setts['key'] == 'capabilities' ) {
				$this->update( $pmison_setts, $project_id );
			}
		}
	}

	private function update( $settings, $project_id ) {
		$this->delete_cap( $project_id )
			->set_co_worker_role_project_id( $project_id )
			->set_client_role_project_id( $project_id )
			->set_manager_role_project_id( $project_id );

		$this->set_cap( $settings['value']['co_worker'],  $this->co_worker_role_project_id );
		$this->set_cap( $settings['value']['client'], $this->client_role_project_id );
		$this->set_cap( $this->manager_cap(), $this->manager_role_project_id );
	}

	private function manager_cap() {
		return [
	        'create_message'         => 1,
	        'view_private_message'   => 1,
	        'create_list'            => 1,
	        'view_private_list'      => 1,
	        'create_milestone'       => 1,
	        'view_private_milestone' => 1,
	        'create_task'            => 1,
	        'view_private_task'      => 1,
	        'create_file'            => 1,
	        'view_private_file'      => 1
	    ];
	}

	private function set_cap( $caps, $rol_project_id ) {
		global $wpdb;
		$tb_cap = $wpdb->prefix . 'pm_role_project_capabilities';
		
		foreach ( $caps as $cap_key => $cap ) {
			
			if ( ! $cap || ( $cap == 'false' || $cap === false ) ) {
				continue;
			}

			$cap_id = pm_get_capabilities_relation( $cap_key );

			$wpdb->insert( 
				$tb_cap, 
				[
					'role_project_id' => $rol_project_id, 
					'capability_id' => $cap_id
				],
				['%d', '%d']
			);
		}
	}

	private function set_co_worker_role_project_id( $project_id ) {
		global $wpdb;
		$tb_rol = $wpdb->prefix . 'pm_role_project';

		$query = "SELECT id FROM $tb_rol
			WHERE project_id=%d and role_id=%d";

		$this->co_worker_role_project_id = $wpdb->get_var( $wpdb->prepare( $query, $project_id, 2  ) );
		
		return $this;
	}

	private function set_client_role_project_id( $project_id ) {
		global $wpdb;
		$tb_rol = $wpdb->prefix . 'pm_role_project';

		$query = "SELECT id FROM $tb_rol
			WHERE project_id=%d and role_id=%d";

		$this->client_role_project_id = $wpdb->get_var( $wpdb->prepare( $query, $project_id, 3  ) );

		return $this;
	}

	private function set_manager_role_project_id( $project_id ) {
		global $wpdb;
		$tb_rol = $wpdb->prefix . 'pm_role_project';

		$query = "SELECT id FROM $tb_rol
			WHERE project_id=%d and role_id=%d";

		$this->manager_role_project_id = $wpdb->get_var( $wpdb->prepare( $query, $project_id, 1  ) );

		return $this;
	}

	private function delete_cap( $project_id ) {
		global $wpdb;
		$tb_rol = $wpdb->prefix . 'pm_role_project';
		$tb_cap = $wpdb->prefix . 'pm_role_project_capabilities';

		$query = "DELETE cp FROM $tb_cap as cp
			LEFT JOIN $tb_rol as rp ON rp.id=cp.role_project_id
			WHERE rp.project_id=%d";

		$wpdb->query( $wpdb->prepare( $query, $project_id ) );

		return $this;
	}
}
