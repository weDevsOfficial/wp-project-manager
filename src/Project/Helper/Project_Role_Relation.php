<?php
namespace WeDevs\PM\Project\Helper;


class Project_Role_Relation {

	private $role_project_id;

	public function set_relation_after_create_project( $project ) {
		if ( empty( $project['id'] ) ) {
			return;
		}

		$this->role_project( $project, 2 )
			->role_project_capabilities_co_worker()
			->role_project_user( $project, 2 );

		$this->role_project( $project, 3 )
			->role_project_capabilities_client()
			->role_project_user( $project, 3 );

		$this->role_project( $project, 1 )
			->role_project_capabilities_manager()
			->role_project_user( $project, 1 );

	}

	public function set_relation_after_update_project( $project ) {
		if ( empty( $project['id'] ) ) {
			return;
		}

		$this->update_role_project_user( $project );

	}

	private function update_role_project_user( $project ) {

		global $wpdb;

		$table           = $wpdb->prefix . 'pm_role_project_users';
		$tb_role_project = $wpdb->prefix . 'pm_role_project';
		$project_id      = $project['id'];

		$role_project_ids = $wpdb->get_results( $wpdb->prepare( "SELECT rpu.role_project_id FROM $table as rpu 
			LEFT JOIN $tb_role_project as rp ON rp.id=rpu.role_project_id
			WHERE rp.project_id=%d", $project_id ) );
		
		$role_project_ids = wp_list_pluck( $role_project_ids, 'role_project_id' );

		foreach ( $role_project_ids as $key => $role_project_id ) {
			$wpdb->query(
				$wpdb->prepare( "DELETE FROM $table WHERE role_project_id=%d", $role_project_id ) 
			);
		}

		$this->role_project_id = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM $tb_role_project WHERE project_id=%d AND role_id=%d", $project_id, 2 ) );
		$this->role_project_user( $project, 2 );
		
		$this->role_project_id = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM $tb_role_project WHERE project_id=%d AND role_id=%d", $project_id, 3 ) );
		$this->role_project_user( $project, 3 );

		$this->role_project_id = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM $tb_role_project WHERE project_id=%d AND role_id=%d", $project_id, 1 ) );
		$this->role_project_user( $project, 1 );
	}

	private function role_project( $project, $role_id ) {
		global $wpdb;
		$table = $wpdb->prefix . 'pm_role_project';

		$wpdb->insert( $table, [ 'project_id' => $project['id'], 'role_id' => $role_id ] );
		$this->role_project_id = $wpdb->insert_id;
		
		return $this;
	}

	private function role_project_capabilities_manager() {
		global $wpdb;
		$rol_project_cap = $wpdb->prefix . 'pm_role_project_capabilities';

		for ( $i=1; $i <= 10; $i++ ) { 
			$wpdb->insert( $rol_project_cap, ['role_project_id' => $this->role_project_id, 'capability_id' => $i] );	
		}

		return $this;
	}

	private function role_project_capabilities_co_worker() {
		global $wpdb;
		$rol_project_cap = $wpdb->prefix . 'pm_role_project_capabilities';

		for ( $i=1; $i <= 10; $i++ ) { 
			$wpdb->insert( $rol_project_cap, ['role_project_id' => $this->role_project_id, 'capability_id' => $i] );	
		}

		return $this;
	}

	private function role_project_capabilities_client() {
		global $wpdb;
		$rol_project_cap = $wpdb->prefix . 'pm_role_project_capabilities';

		for ( $i=1; $i <= 10;  $i++ ) { 
			if ( $i%2 ) {
				$wpdb->insert( $rol_project_cap, ['role_project_id' => $this->role_project_id, 'capability_id' => $i] );	
			}
		}

		return $this;
	}

	private function role_project_user( $project, $role_id ) {
		global $wpdb;
		$rol_project_user = $wpdb->prefix . 'pm_role_project_users';
		$users = $project['assignees']['data'];
		$roles = [];

		foreach ( $users as $key => $user ) {
			$roles[$user['id']] = !empty( $user['roles']['data'] ) ? $user['roles']['data'][0]['id'] : false; 
		}
		
		foreach ( $roles as $user_id => $project_role ) {
			if ( $project_role == $role_id ) {
				$wpdb->insert( $rol_project_user, ['role_project_id' => $this->role_project_id, 'user_id' => $user_id] );
			}
		}

		return $this;
	}

	public function after_delete_project( $project_id ) {
		global $wpdb;
		
		$tb_rp = $wpdb->prefix . 'pm_role_project';
		$tb_rpu = $wpdb->prefix . 'pm_role_project_users';
		$tb_rpc = $wpdb->prefix . 'pm_role_project_capabilities';

		$rpids = $wpdb->get_results( $wpdb->prepare("SELECT id FROM $tb_rp WHERE project_id=%d", $project_id) );
		$rpids = wp_list_pluck( $rpids, 'id' );
		
		foreach ( $rpids as $key => $rpid ) {
			$wpdb->query( $wpdb->prepare( "DELETE FROM $tb_rpu WHERE role_project_id=%d", $rpid ) );
			$wpdb->query( $wpdb->prepare( "DELETE FROM $tb_rpc WHERE role_project_id=%d", $rpid ) );
		}

		$wpdb->query( $wpdb->prepare( "DELETE FROM $tb_rp WHERE project_id=%d", $project_id ) );
		
	}

}
