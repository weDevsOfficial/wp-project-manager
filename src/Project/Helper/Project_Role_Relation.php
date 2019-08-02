<?php
namespace WeDevs\PM\Project\Helper;


class Project_Role_Relation {

	private $role_project_id;

	public function set_relation( $project ) {
		if ( empty( $project['id'] ) ) {
			return;
		}

		$this->role_project( $project, 2 )
			->role_project_capabilities_co_worker()
			->role_project_user( $project, 2 );

		$this->role_project( $project, 3 )
			->role_project_capabilities_client()
			->role_project_user( $project, 3 );

	}

	private function role_project( $project, $role_id ) {
		global $wpdb;
		$table = $wpdb->prefix . 'pm_role_projects';

		$wpdb->insert( $table, [ 'project_id' => $project['id'], 'role_id' => $role_id ] );
		$this->role_project_id = $wpdb->insert_id;
		
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

}
