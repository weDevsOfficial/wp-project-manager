<?php
/**
 * CPM Todo list API controler
 */
class CPM_JSON_Lists {
	/**
	 * Register the todo list-related routes
	 *
	 * @param array $routes Existing routes
	 * @return array Modified routes
	 */
	public function register_routes( $routes ) {

		$post_routes = array(
			// Post endpoints
			'/projects/(?P<project_id>\d+)/lists' => array(
				array( array( $this, 'get_lists' ),   WP_JSON_Server::READABLE ),
				array( array( $this, 'create_list' ), WP_JSON_Server::CREATABLE | WP_JSON_Server::ACCEPT_JSON ),
			),

			'/projects/(?P<project_id>\d+)/lists/(?P<list_id>\d+)' => array(
				array( array( $this, 'get_list' ),    WP_JSON_Server::READABLE ),
				array( array( $this, 'edit_list' ),   WP_JSON_Server::EDITABLE | WP_JSON_Server::ACCEPT_JSON ),
				array( array( $this, 'delete_list' ), WP_JSON_Server::DELETABLE ),
			),
		);

		return array_merge( $routes, $post_routes );
	}

	/**
	 * get single todo list.
	 *
	 * @param int $project_id
	 * @param int $list_id
	 *
	 * - URL: http://example.com/cpm-json/projects/project_id/lists/list_id
	 * - Method: GET
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function get_list( $project_id, $list_id ) {

		$project_id = (int) $project_id;
		$list_id    = (int) $list_id;

		if ( empty( $project_id ) ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		if ( empty( $list_id ) ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid task list ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		$manage_capability = cpm_can_manage_projects();

		if ( $manage_capability || cpm_is_single_project_manager( $project_id ) ) {
			$condition = true;
		} else if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );

		} else if ( cpm_user_can_access( $project_id, 'tdolist_view_private' ) ) {
			$condition = true;
		}

		if ( isset( $condition ) && $condition ) {
			$posts_list = cpm()->task->get_task_list( $list_id );
		} else {
			$posts_list = cpm()->task->get_task_list( $list_id );

			if ( isset( $posts_list->private ) && $posts_list->private == 'yes' ) {
				if ( !cpm_user_can_access( $project_id, 'tdolist_view_private' ) ) {
					return new WP_Error( 'permission', __( 'Sorry! You do not have permission to view this task list.', 'cpm' ), array( 'status' => 404 ) );
				}
			}
		}
		$response   = new WP_JSON_Response();
		$response->set_data( $posts_list );

		return $response;
	}

	/**
	 * Retrieve all todo list for an individula project
	 *
	 * @param int $project_id
	 *
	 * - URL: http://example.com/cpm-json/projects/project_id/lists
	 * - Method: GET
	 *
	 * @since 1.2
	 * @return obj
	 */
	public function get_lists( $project_id ) {
		$project_id = (int) $project_id;

		if ( empty( $project_id ) ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		$manage_capability = cpm_can_manage_projects();

		if ( $manage_capability || cpm_is_single_project_manager( $project_id ) ) {
			$condition = true;
		} else if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );

		} else if ( cpm_user_can_access( $project_id, 'tdolist_view_private' ) ) {
			$condition = true;
		}

		if ( isset( $condition ) && $condition ) {
			$posts_list = cpm()->task->get_task_lists( $project_id, true );
		} else {
			$posts_list = cpm()->task->get_task_lists( $project_id, false );
		}

		$response   = new WP_JSON_Response();
		$response->set_data( $posts_list );

		return $response;
	}

	/**
	 * Create a new todolist.
	 *
	 * @param int $project_id
	 * @param array $data
	 *
	 *  - tasklist_name (string, required)
	 *  - tasklist_detail (string)
	 *  - tasklist_privacy (string)
	 *  - tasklist_milestone (integer)
	 *
	 *  - Method: POST
	 *  - URL: http://example.com/cpm-json/projects/project_id/lists
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function create_list( $project_id, $data ) {

		$project_id = (int) $project_id;
		$list_id    = (int) $list_id;

		if ( ! $project_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		$manage_capability = cpm_can_manage_projects();

		if ( ! $manage_capability && ! cpm_is_single_project_manager( $project_id ) ) {

			if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
				return new WP_Error( 'permission', __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );
			}

			if ( !cpm_user_can_access( $project_id, 'create_todolist' ) ) {
				return new WP_Error( 'permission', __( 'Sorry! You do not have permission to create task list.', 'cpm' ), array( 'status' => 404 ) );
			}
		}

		if ( empty( $data['tasklist_name'] ) ) {
			return new WP_Error( 'task_list_name', __( 'Task list name is required.', 'cpm' ) );
		}

		$data['tasklist_milestone'] = isset( $data['tasklist_milestone'] ) ? $data['tasklist_milestone'] : '-1';
		$data['tasklist_privacy']   = isset( $data['tasklist_privacy'] ) ? $data['tasklist_privacy'] : 'no';

		$list_id  = cpm()->task->add_list( $project_id, $data );
		$get_list = cpm()->task->get_task_list( $list_id  );

		$response    = new WP_JSON_Response();
		$response->set_data( $get_list );

		return $response;
	}

	/**
	 * Edit todo list
	 *
	 * @param int $project_id
	 * @param int $list_id
	 * @param array $data
	 *
	 * - tasklist_name (string, required)
	 * - tasklist_detail (string)
	 * - tasklist_privacy (string)
	 * - tasklist_milestone (integer)
	 *
	 * - Method: POST
	 * - URL: http://example.com/cpm-json/projects/project_id/lists/list_id
	 *
	 * @since 1.2
	 * @return array $response;
	 */
	public function edit_list( $project_id, $list_id, $data ) {
		$list_id    = (int) $list_id;
		$project_id = (int) $project_id;

		if ( ! $project_id ) {
			return new WP_Error( 'project_id', __( 'Invalid project ID.', 'cpm' ) );
		}

		if ( ! $list_id ) {
			return new WP_Error( 'list_id', __( 'Invalid list ID.', 'cpm' ) );
		}

		if ( empty( $data['tasklist_name'] ) ) {
			return new WP_Error( 'task_list_name', __( 'Task list name is required.', 'cpm' ) );
		}

		$post = get_post( $list_id );

		if ( empty( $post->ID ) ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid post ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		$post = cpm()->task->get_task_list( $list_id );

		if ( cpm_user_can_delete_edit( $project_id, $post ) ) {
			$list_id  = cpm()->task->update_list( $project_id, $data, $list_id );
			$get_list = cpm()->task->get_task_list( $list_id );

			$response = new WP_JSON_Response();
			$response->set_data( $get_list );
			return $response;

		} else {
			return new WP_Error( 'create_capability', __( 'Sorry! Permission denied to edit task list.', 'cpm' ), array( 'status' => 404 ) );
		}
	}

	/**
	 * Delete todo list
	 *
	 * @param int $project_id
	 * @param int $list_id
	 * @param boolen $force
	 *
	 * - Method: DELETE
	 * - URL: http://example.com/cpm-json/projects/project_id/lists/list_id/?force=1
	 *
	 * @since 1.2
	 * @return array
	 */
	public function delete_list( $project_id, $list_id, $force = false ) {

		$list_id    = (int) $list_id;
		$project_id = (int) $project_id;

		if ( ! $project_id ) {
			return new WP_Error( 'project_id', __( 'Invalid project ID.', 'cpm' ) );
		}

		if ( ! $list_id ) {
			return new WP_Error( 'list_id', __( 'Invalid list ID.', 'cpm' ) );
		}

		$project_id = intval( $project_id );
		$list_id    = intval( $list_id );
		$post       = get_post( $list_id );

		if ( empty( $list_id ) || empty( $post->ID ) ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid post ID.', 'cpm' ), array( 'status' => 404 ) );
		}
		$post = cpm()->task->get_task_list( $list_id );
		if ( !cpm_user_can_delete_edit( $project_id, $post ) ) {
			return new WP_Error( 'premission', __( 'Permission denied.', 'cpm' ), array( 'status' => 404 ) );
		}

		$force = $force ? true : false;

		cpm()->task->delete_list( $list_id, $force );

		if ( $force ) {
			return array( 'message' => __( 'Permanently deleted post', 'cpm' ) );
		} else {
			// TODO: return a HTTP 202 here instead
			return array( 'message' => __( 'Deleted post', 'cpm' ) );
		}
	}

}
