<?php
/**
 * CPM Message API controler
 */
class CPM_JSON_Messages {

	/**
	 * Register the message-related routes
	 *
	 * @param array $routes Existing routes
	 * @return array Modified routes
	 */
	public function register_routes( $routes ) {

		$post_routes = array(
			'/projects/(?P<project_id>\d+)/messages' => array(
				array( array( $this, 'get_messages' ),   WP_JSON_Server::READABLE ),
				array( array( $this, 'create_message' ), WP_JSON_Server::CREATABLE | WP_JSON_Server::ACCEPT_JSON ),
			),

			'/projects/(?P<project_id>\d+)/messages/(?P<message_id>\d+)' => array(
				array( array( $this, 'get_message' ),    WP_JSON_Server::READABLE ),
				array( array( $this, 'edit_message' ),   WP_JSON_Server::EDITABLE | WP_JSON_Server::ACCEPT_JSON ),
				array( array( $this, 'delete_message' ), WP_JSON_Server::DELETABLE ),
			),
		);

		return array_merge( $routes, $post_routes );
	}

	/**
	 * Retrieve individual message
	 *
	 * @param int $project_id
	 * @param int $message_id
	 *
	 * - URL: http://example.com/cpm-json/projects/project_id/messages/message_id
	 * - METHOD: GET
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function get_message( $project_id, $message_id ) {

		$project_id = intval( $project_id );
		$message_id = intval( $message_id );

		if ( ! $project_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		if ( ! $message_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		$manage_capability = cpm_can_manage_projects();

		if ( $manage_capability && cpm_is_single_project_manager( $project_id ) ) {
			$condition = true;
		} else if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );

		} else if ( cpm_user_can_access( $project_id, 'msg_view_private' ) ) {
			$condition = true;
		}

		if ( isset( $condition ) && $condition ) {
			$message = cpm()->message->get( $message_id );
		} else {
			$message = cpm()->message->get( $message_id );

			if ( isset( $message->private ) && $message->private == 'yes' ) {
				if ( ! cpm_user_can_access( $project_id, 'msg_view_private' ) ) {
					return new WP_Error( 'permission', __( 'Sorry! You do not have permission to view this message.', 'cpm' ), array( 'status' => 404 ) );
				}
			}
		}

		$response   = new WP_JSON_Response();
		$response->set_data( $message );
		return $response;
	}

	/**
	 * Retrieve all messages for an individula project
	 *
	 * @param int $project_id
	 *
	 * - URL: http://example.com/cpm-json/projects/project_id/messages/
	 * - METHOD: GET
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function get_messages( $project_id ) {
		$project_id = intval( $project_id );

		if ( ! $project_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		$manage_capability = cpm_can_manage_projects();

		if ( $manage_capability || cpm_is_single_project_manager( $project_id ) ) {
			$condition = true;

		} else if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );

		} else if ( cpm_user_can_access( $project_id, 'msg_view_private' ) ) {
			$condition = true;
		}

		if ( isset( $condition ) && $condition ) {
			$messages = cpm()->message->get_all( $project_id, true );
		} else {
			$messages = cpm()->message->get_all( $project_id, false );
		}

        $response   = new WP_JSON_Response();
		$response->set_data( $messages );

		return $response;
	}

	/**
	 * Create a new message.
	 *
	 * @param int $project_id
	 * @param array $data
	 *
	 *  - message_title (string, required)
	 *  - message_detail (string)
	 *  - message_privacy (string)
	 *  - milestone (integer )
	 *
	 *  - Method: POST
	 *  - URL: http://example.com/cpm-json/projects/project_id/messages
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function create_message( $project_id, $data ) {
		$project_id = intval( $project_id );

		if ( ! $project_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		if ( empty( $data['message_title'] ) ) {
			return new WP_Error( 'message_title', __( 'Message name is required.', 'cpm' ) );
		}

		$manage_capability = cpm_can_manage_projects();

		if ( ! $manage_capability && ! cpm_is_single_project_manager( $project_id ) ) {

			if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
				return new WP_Error( 'permission', __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );
			}

			if ( !cpm_user_can_access( $project_id, 'create_message' ) ) {
				return new WP_Error( 'permission', __( 'Sorry! You do not have permission to create message.', 'cpm' ), array( 'status' => 404 ) );
			}
		}

		$message_id  = cpm()->message->create( $project_id, $data );
		$get_message = cpm()->message->get( $message_id  );

		$response    = new WP_JSON_Response();
		$response->set_data( $get_message );

		return $response;
	}

	/**
	 * Disable email on message creating time
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
	 * Edit a message.
	 *
	 * @param int $project_id
	 * @param int $message_id
	 * @param array $data
	 *
	 *  - message_title (string, required)
	 *  - message_detail (string)
	 *  - message_privacy (string)
	 *  - milestone (integer)
	 *
	 *  - Method: POST
	 *  - URL: http://example.com/cpm-json/projects/project_id/messages/message_id
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function edit_message( $project_id, $message_id, $data ) {
		$project_id = intval( $project_id );
		$message_id = intval( $message_id );

		if ( ! $project_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}
		if ( ! $message_id ) {
			return new WP_Error( 'message_id', __( 'Invalid message ID.', 'cpm' ) );
		}

		if ( empty( $data['message_title'] ) ) {
			return new WP_Error( 'message_title', __( 'Message name is required.', 'cpm' ) );
		}

		$message = get_post( $message_id );

		if ( ! cpm_user_can_delete_edit( $project_id, $message ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You do not have permission to edit this message.', 'cpm' ), array( 'status' => 404 ) );
		}

		$message_id  = cpm()->message->update( $message_id, $data, $message_id );
		$get_message = cpm()->message->get( $message_id );

		$response    = new WP_JSON_Response();
		$response->set_data( $get_message );


		return $response;
	}

	/**
	 * Delete a message
	 *
	 * @param int $project_id
	 * @param int $message_id
	 * @param boolen $force
	 *
	 * - URL: http://example.com/cpm-json/projects/project_id/messages/message_id/?force=1
	 * - METHOD: DELETE
	 *
	 * @since 1.2
	 * @return array
	 */
	public function delete_message( $project_id, $message_id, $force = false ) {
		$project_id = intval( $project_id );
		$message_id = intval( $message_id );

		if ( ! $project_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		if ( ! $message_id ) {
			return new WP_Error( 'message_id', __( 'Invalid message ID.', 'cpm' ) );
		}

		if ( ! cpm_user_can_delete_edit( $project_id, $message ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You do not have permission to edit this message.', 'cpm' ), array( 'status' => 404 ) );
		}

		$force  = $force ? true : false;
		$result = cpm()->message->delete( $message_id, $force );

		if ( $force ) {
			return array( 'message' => __( 'Permanently deleted post', 'cpm' ) );
		} else {
			// TODO: return a HTTP 202 here instead
			return array( 'message' => __( 'Deleted post', 'cpm' ) );
		}
	}
}
