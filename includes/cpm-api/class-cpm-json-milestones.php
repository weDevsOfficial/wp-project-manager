<?php

/**
 * CPM Milestone API controler
 */
class CPM_JSON_Milestones {

	/**
	 * Register the milestone-related routes
	 *
	 * @param array $routes Existing routes
	 * @return array Modified routes
	 */
	public function register_routes( $routes ) {

		$post_routes = array(
			// Post endpoints
			'/projects/(?P<project_id>\d+)/milestones' => array(
				array( array( $this, 'get_milestones' ),   WP_JSON_Server::READABLE ),
				array( array( $this, 'create_milestone' ), WP_JSON_Server::CREATABLE | WP_JSON_Server::ACCEPT_JSON ),
			),

			'/projects/(?P<project_id>\d+)/milestones/(?P<milestone_id>\d+)' => array(
				array( array( $this, 'get_milestone' ),    WP_JSON_Server::READABLE ),
				array( array( $this, 'edit_milestone' ),      WP_JSON_Server::EDITABLE | WP_JSON_Server::ACCEPT_JSON ),
				array( array( $this, 'delete_milestone' ),    WP_JSON_Server::DELETABLE ),
			),
		);

		return array_merge( $routes, $post_routes );
	}

	/**
	 * get milestone.
	 *
	 * @param int $project_id
	 * @param int $milestone_id
	 *
	 * - URL: http://example.com/cpm-json/projects/project_id/milestones/milestone_id
	 * - Method: GET
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function get_milestone( $project_id, $milestone_id ) {

		$project_id = intval( $project_id );
		$milestone_id = intval( $milestone_id );

		if ( ! $project_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		if ( ! $milestone_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		$manage_capability = cpm_can_manage_projects();

		if ( ! $manage_capability && ! cpm_is_single_project_manager( $project_id ) ) {
			$condition = true;
		} if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
			return new WP_Error( 'permission', __( 'Sorry! Permission denied.', 'cpm' ), array( 'status' => 404 ) );

		}

		if ( isset( $condition ) && $condition ) {
			$milestone = cpm()->milestone->get( $milestone_id );
		} else {
			$milestone = cpm()->milestone->get( $milestone_id );
			if ( isset( $milestone->private ) && $task->private == 'yes' ) {
				if ( !cpm_user_can_access( $project_id, 'msg_view_private' ) ) {
					return new WP_Error( 'permission', __( 'Sorry! You do not have permission to view this milestone.', 'cpm' ), array( 'status' => 404 ) );
				}
			}
		}

		$response   = new WP_JSON_Response();
		$response->set_data( $milestone );
		return $response;
	}

	/**
	 * Retrieve all milestone for an individula project
	 *
	 * @param int $project_id
	 *
	 * - URL: http://example.com/projects/project_id/milestones
	 * - Method: GET
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function get_milestones( $project_id ) {

		$project_id = intval( $project_id );

		if ( ! $project_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		$manage_capability = cpm_can_manage_projects();

		if ( $manage_capability || cpm_is_single_project_manager( $project_id ) ) {
			$condition = true;

		} else if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );

		} else if ( cpm_user_can_access( $project_id, 'milestone_view_private' ) ) {
			$condition = true;
		}

		if ( isset( $condition ) && $condition ) {
			$milestones = cpm()->milestone->get_by_project( $project_id, true );
		} else {
			$milestones = cpm()->milestone->get_by_project( $project_id, false );
		}

        $response   = new WP_JSON_Response();
		$response->set_data( $milestones );

		return $response;
	}

	/**
	 * Create a new milestone.
	 *
	 * @param int $project_id
	 * @param array $data
	 *
	 *  - milestone_name (string, required)
	 *  - milestone_due (date format)
	 *  - milestone_detail (string)
	 *  - milestone_privacy (string)
	 *
	 *  - Method: POST
	 *  - URL: http://example.com/cpm-json/projects/project_id/milestones
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function create_milestone( $project_id, $data ) {
		$project_id = intval( $project_id );

		if ( ! $project_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		if ( isset( $data['milestone_name'] ) &&  empty( $data['milestone_name'] ) ) {
			return new WP_Error( 'milestone_name', __( 'Milestone name is required.', 'cpm' ) );
		}

		$manage_capability = cpm_can_manage_projects();

		if ( !$manage_capability && !cpm_is_single_project_manager( $project_id ) ) {

			if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
				return new WP_Error( 'permission', __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );
			}

			if ( !cpm_user_can_access( $project_id, 'create_milestone' ) ) {
				return new WP_Error( 'permission', __( 'Sorry! You do not have permission to create milestone.', 'cpm' ), array( 'status' => 404 ) );
			}
		}

		$milestone_id  = cpm()->milestone->create( $project_id, $data );
		$get_milestone = cpm()->milestone->get( $milestone_id  );

		$response    = new WP_JSON_Response();
		$response->set_data( $get_milestone );

		return $response;
	}

	/**
	 * Disable email on milestone creating time
	 *
	 * @param boolen $status
	 *
	 * @since 1.2
	 * @return boolen
	 */
	function change_notification_status( $status ) {
		return false;
	}

	/**
	 * Edit a milestone.
	 *
	 * @param int $project_id
	 * @param int $milestone_id
	 * @param array $data
	 *
	 *  - milestone_name (string, required)
	 *  - milestone_detail (string)
	 *  - milestone_privacy (string)
	 *  - milestone_due (string)
	 *
	 *  - Method: POST
	 *  - URL: http://example.com/cpm-json/projects/project_id/milestones/milestone_id
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function edit_milestone( $project_id, $milestone_id, $data ) {

		$project_id   = intval( $project_id );
		$milestone_id = intval( $milestone_id );

		if ( ! $project_id ) {
			return new WP_Error( 'milestone_id', __( 'Invalid project ID.', 'cpm' ) );
		}

		if ( ! $milestone_id ) {
			return new WP_Error( 'milestone_id', __( 'Invalid milestone ID.', 'cpm' ) );
		}

		if ( ! isset( $data['milestone_name'] ) ) {
			return new WP_Error( 'milestone_name', __( 'Milestone name is required.', 'cpm' ) );
		}

		if ( empty( $data['milestone_name'] ) ) {
			return new WP_Error( 'milestone_name', __( 'Milestone name is required.', 'cpm' ) );
		}

		$milestone = get_post( $milestone_id );

		if ( ! cpm_user_can_delete_edit( $project_id, $milestone ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You do not have permission to edit this milestone.', 'cpm' ), array( 'status' => 404 ) );
		}

		$milestone_id  = cpm()->milestone->update( $project_id, $milestone_id );
		$get_milestone = cpm()->milestone->get( $milestone_id );

		$response    = new WP_JSON_Response();
		$response->set_data( $get_milestone );

		return $response;
	}


	/**
	 * Delete a milestone
	 *
	 * @param int $project_id
	 * @param int $milestone_id
	 * @param boolen $force
	 *
	 * - URL: http://example.com/cpm-json/projects/project_id/milestones/milestone_id/?force=1
	 * - METHOD: DELETE
	 *
	 * @since 1.2
	 * @return array
	 */
	public function delete_milestone( $project_id, $milestone_id, $force = false ) {
		$project_id   = intval( $project_id );
		$milestone_id = intval( $milestone_id );

		if ( ! $project_id ) {
			return new WP_Error( 'milestone_id', __( 'Invalid project ID.', 'cpm' ) );
		}

		if ( ! $milestone_id ) {
			return new WP_Error( 'milestone_id', __( 'Invalid milestone ID.', 'cpm' ) );
		}

		$milestone = get_post( $milestone_id );

		if ( ! cpm_user_can_delete_edit( $project_id, $milestone ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You do not have permission to delete this milestone.', 'cpm' ), array( 'status' => 404 ) );
		}

		$force = $force ? true : false;

		cpm()->milestone->delete( $milestone_id, $force );

		if ( $force ) {
			return array( 'message' => __( 'Permanently deleted post' ) );
		} else {
			// TODO: return a HTTP 202 here instead
			return array( 'message' => __( 'Deleted post', 'cpm' ) );
		}
	}
}
