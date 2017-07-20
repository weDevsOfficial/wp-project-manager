<?php
/**
 * CPM Project API controler
 */
class CPM_JSON_Projects {

	/**
	 * Register the project-related routes
	 *
	 * @param array $routes
	 */
	public function register_routes( $routes ) {

		$post_routes = array(
			'/projects' => array(
				array( array( $this, 'get_projects' ),   WP_JSON_Server::READABLE ),
				array( array( $this, 'create_project' ), WP_JSON_Server::CREATABLE | WP_JSON_Server::ACCEPT_JSON ),
			),

			'/projects/(?P<project_id>\d+)' => array(
				array( array( $this, 'get_project' ),    WP_JSON_Server::READABLE ),
				array( array( $this, 'edit_project' ),   WP_JSON_Server::EDITABLE | WP_JSON_Server::ACCEPT_JSON ),
				array( array( $this, 'delete_project' ), WP_JSON_Server::DELETABLE ),
			),
		);

		return array_merge( $routes, $post_routes );
	}

	/**
	 * Retrieve all projects
	 *
	 * - URL: http://example.com/cpm-json/projects/?count=-1
	 * - Method: GET
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function get_projects( $count = -1 ) {

		$projects = cpm()->project->get_projects( $count );
		$response = new WP_JSON_Response();
		$response->set_data( $projects );
		return $response;
	}

	/**
	 * Retrieve an individual project.
	 *
	 * @param int $project_id
	 *
	 * - URL: http://example.com/cpm-json/projects/project_id
	 * - Method: GET
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function get_project( $project_id ) {

		$id = (int) $project_id;
		$manage_capability = cpm_can_manage_projects();

		if( ! $manage_capability && ! cpm_project_user_role_pre_chache( $id ) ) {
			return new WP_Error( 'assigned_user', __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );
		}

		$post = get_post( $id, ARRAY_A );

		if ( empty( $id ) || empty( $post['ID'] ) ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid post ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		$project  = cpm()->project->get( $id );
		$response = new WP_JSON_Response();
		$response->set_data( $project );

		return $response;
	}

	/**
	 * Create a new project.
	 *
	 * @param array $data
	 *
	 * - project_name string (required)
 	 * - project_description string
     * - project_cat int
     * - role array
     *
	 * - URL: http://example.com/cpm-json/projects/
	 * - Method: POST
	 *
	 * @since 1.2
     * @return array $response
	 */
	public function create_project( $data ) {

		if ( ! cpm_can_create_projects() ) {
			return new WP_Error( 'project_create_capability', __( 'You do not have permission to create projects.', 'cpm' ) );
		}

		if ( !isset( $data['project_name'] ) ) {
			return new WP_Error( 'project_name', __( 'Project name is required.', 'cpm' ) );
		}

		if ( empty( $data['project_name'] ) ) {
			return new WP_Error( 'project_name', __( 'Project name is required.', 'cpm' ) );
		}

		$data['project_notify'] = false;
		$project_id   = cpm()->project->create( 0, $data );

		if ( ! $project_id ) {
			return new WP_Error( 'project_create_capability', __( 'Cannot create project, something wrong!', 'cpm' ) );
		}

		$get_project = cpm()->project->get( $project_id );
		$response    = new WP_JSON_Response();
		$response->set_data( $get_project );

		return $response;
	}

	/**
	 * Edit project
	 *
	 * @param int $project_id
	 * @param array $data
	 *
	 * - project_name string (required)
 	 * - project_description string
     * - project_cat int
     * - role array
     *
     * - URL: http://example.com/cpm-json/projects/project_id
	 * - Method: POST
	 *
	 * @since 1.2
     * @return array $response
	 */
	public function edit_project( $project_id, $data ) {

		$id = intval( $project_id );

		if ( ! $id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}
		$manage_capability = cpm_can_manage_projects();

		if ( ! $manage_capability && ! cpm_project_user_role_pre_chache( $id ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );
		}

		if ( ! cpm_user_can_access( $id ) ) {
			return new WP_Error( 'project_edit_capability', __( 'You do not have permission to edit this project.', 'cpm' ) );
		}

		if ( empty( $data['project_name'] ) ) {
			return new WP_Error( 'project_name', __( 'Project name is required.', 'cpm' ) );
		}
		$data['project_notify'] = false;

		$project_id  = cpm()->project->update( $id, $data );

		if( ! $project_id ) {
			return new WP_Error( 'project_edit_capability', __( 'Cannot edit project, something wrong!', 'cpm' ) );
		}
		$get_project = cpm()->project->get( $project_id );

		$response    = new WP_JSON_Response();
		$response->set_data( $get_project );

		return $response;
	}

	/**
	 * Delete project
	 *
	 * @param int $project_id
	 * @param boolen $force
	 *
	 * - URL: http://example.com/cpm-json/projects/project_id/?force=1
	 * - Method: DELETE
	 *
	 * @since 1.2
	 * @return array
	 */
	public function delete_project( $project_id, $force = false ) {

		$id = intval( $project_id );

		if ( ! $id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		$manage_capability = cpm_can_manage_projects();

		if ( ! $manage_capability && ! cpm_project_user_role_pre_chache( $id ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );
		}

		if ( ! cpm_user_can_access( $id ) ) {
			return new WP_Error( 'project_edit_capability', __( 'You do not have permission to delete this project.', 'cpm' ) );
		}

		$post = get_post( $id, ARRAY_A );

		if ( empty( $post['ID'] ) ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid post ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		cpm()->project->delete( $id, $force );

		if ( $force ) {
			return array( 'message' => __( 'Permanently deleted post', 'cpm' ) );
		} else {
			return array( 'message' => __( 'Deleted post', 'cpm' ) );
		}
	}
}
