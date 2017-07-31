<?php
/**
 * CPM Task API controler
 */
class CPM_JSON_Tasks {

	/**
	 * Register the task-related routes
	 *
	 * @param array $routes Existing routes
	 * @return array Modified routes
	 */
	public function register_routes( $routes ) {

		$post_routes = array(
			// Post endpoints
			'/projects/(?P<project_id>\d+)/lists/(?P<list_id>\d+)/tasks' => array(
				array( array( $this, 'get_tasks' ),   WP_JSON_Server::READABLE ),
				array( array( $this, 'create_task' ), WP_JSON_Server::CREATABLE | WP_JSON_Server::ACCEPT_JSON ),
			),

			'/projects/(?P<project_id>\d+)/lists/(?P<list_id>\d+)/tasks/(?P<task_id>\d+)' => array(
				array( array( $this, 'get_task' ),    WP_JSON_Server::READABLE ),
				array( array( $this, 'edit_task' ),   WP_JSON_Server::EDITABLE | WP_JSON_Server::ACCEPT_JSON ),
				array( array( $this, 'delete_task' ), WP_JSON_Server::DELETABLE ),
			),
		);

		return array_merge( $routes, $post_routes );
	}

	/**
	 * get task.
	 *
	 * @param int $project_id
	 * @param int $list_id
	 * @param int $task_id
	 *
	 * - URL: http://example.com/cpm-json/projects/project_id/lists/list_id/tasks/task_id
	 * - Method: GET
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function get_task( $project_id, $list_id, $task_id ) {

		$project_id = (int) $project_id;
		$list_id    = (int) $list_id;

		if ( empty( $project_id ) ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		if ( empty( $list_id ) ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid task list ID.', 'cpm' ), array( 'status' => 404 ) );
		}
		$posts_list        = cpm()->task->get_task_list( $list_id );
		$manage_capability = cpm_can_manage_projects();

		if ( $manage_capability || cpm_is_single_project_manager( $project_id ) ) {
			$condition = true;
		} else if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );

		} else if ( $posts_list->private == 'yes' && !cpm_user_can_access( $project_id, 'tdolist_view_private' ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You do not have permission to view this task list.', 'cpm' ), array( 'status' => 404 ) );

		}

		if ( isset( $condition ) && $condition ) {
			$task = cpm()->task->get_task( $task_id );
		} else {
			$task = cpm()->task->get_task( $task_id );

			if ( isset( $task->task_privacy ) && $task->task_privacy == 'yes' ) {
				if ( ! cpm_user_can_access( $project_id, 'todo_view_private' ) ) {
					return new WP_Error( 'permission', __( 'Sorry! You do not have permission to view this task.', 'cpm' ), array( 'status' => 404 ) );
				}
			}
		}
		$response   = new WP_JSON_Response();
		$response->set_data( $task );

		return $response;
	}

	/**
	 * Retrieve all tasks for an individula project
	 *
	 * @param int $project_id
	 * @param int $list_id
	 *
	 * - URL: http://example.com/cpm-json/projects/project_id/lists/list_id/tasks
	 * - Method: GET
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function get_tasks( $project_id, $list_id ) {

		$project_id = (int) $project_id;
		$list_id    = (int) $list_id;

		if ( empty( $project_id ) ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		if ( empty( $list_id ) ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid task list ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		$posts_list        = cpm()->task->get_task_list( $list_id );
		$manage_capability = cpm_can_manage_projects();

		if ( $manage_capability || cpm_is_single_project_manager( $project_id ) ) {
			$condition = true;
		} else if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );

		} else if ( $posts_list->private == 'yes' && !cpm_user_can_access( $project_id, 'tdolist_view_private' ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You do not have permission to view this task list.', 'cpm' ), array( 'status' => 404 ) );

		} else if ( cpm_user_can_access( $project_id, 'todo_view_private' ) ) {
			$condition = true;
		}

		if ( isset( $condition ) && $condition ) {
			$tasks = cpm()->task->get_tasks( $list_id, true );
		} else {
			$tasks = cpm()->task->get_tasks( $list_id, false );
		}

		$response   = new WP_JSON_Response();
		$response->set_data( $tasks );

		return $response;
	}

	/**
	 * Create a new task.
	 *
	 * @param int $project_id
	 * @param int $list_id
	 * @param array $data
	 *
	 *  - task_text (string, required)
	 *  - task_privacy (string)
	 *  - task_assign (array)
	 *  - task_due (date format)
	 *  - task_start (date format)
	 *
	 *  - Method: POST
	 *  - URL: http://example.com/cpm-json/projects/project_id/lists/list_id/tasks
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function create_task( $project_id, $list_id, $data ) {
		$project_id = (int) $project_id;
		$list_id    = (int) $list_id;

		if ( ! $project_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		if ( ! $list_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid task list ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		if ( empty( $data['task_text'] ) ) {
			return new WP_Error( 'task_text', __( 'Task name is required.', 'cpm' ) );
		}
		$posts_list        = cpm()->task->get_task_list( $list_id );
		$manage_capability = cpm_can_manage_projects();

		if ( !$manage_capability && !cpm_is_single_project_manager( $project_id ) ) {

			if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
				return new WP_Error( 'permission', __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );
			}

			if ( ! cpm_user_can_access( $project_id, 'create_todolist' ) ) {
				return new WP_Error( 'permission', __( 'Sorry! You do not have permission to create task list.', 'cpm' ), array( 'status' => 404 ) );
			}

			if ( !cpm_user_can_access( $project_id, 'create_todo' ) ) {
				return new WP_Error( 'permission', __( 'Sorry! You do not have permission to create task.', 'cpm' ), array( 'status' => 404 ) );
			}
		}

		add_filter( 'cpm_new_task_notification', array( $this, 'change_notification_status' ) );


		$task_id  = cpm()->task->add_task( $list_id, $data );
		$get_task = cpm()->task->get_task( $task_id  );

		$response    = new WP_JSON_Response();
		$response->set_data( $get_task );

		return $response;
	}

	/**
	 * Disable email on task creating time
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
	 * Edit a task.
	 *
	 * @param int $project_id
	 * @param int $list_id
	 * @param int $task_id
	 * @param array $data
	 *
	 *  - task_text (string, required)
	 *  - task_privacy (string)
	 *  - task_assign (array)
	 *  - task_due (date format)
	 *  - task_start (date format)
	 *
	 *  - Method: POST
	 *  - URL: http://example.com/cpm-json/projects/project_id/lists/list_id/tasks/task_id
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function edit_task( $project_id, $list_id, $task_id, $data ) {
		$list_id    = (int) $list_id;
		$task_id    = (int) $task_id;
		$project_id = (int) $project_id;

		if ( ! $project_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		if ( ! $list_id ) {
			return new WP_Error( 'list_id', __( 'Invalid list ID.', 'cpm' ) );
		}

		if ( ! $task_id ) {
			return new WP_Error( 'task_id', __( 'Invalid task ID.', 'cpm' ) );
		}

		if ( empty( $data['task_text'] ) ) {
			return new WP_Error( 'task_text', __( 'Task name is required.', 'cpm' ) );
		}

		$task = get_post( $task_id  );

		if ( ! cpm_user_can_delete_edit( $project_id, $task ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You do not have permission to edit this task.', 'cpm' ), array( 'status' => 404 ) );
		}

		add_filter( 'cpm_new_task_notification', array( $this, 'change_notification_status' ) );

		$task_id  = cpm()->task->update_task( $list_id, $data, $task_id );
		$get_task = cpm()->task->get_task( $task_id );

		$response    = new WP_JSON_Response();
		$response->set_data( $get_task );

		return $response;
	}

	/**
	 * Delete a task
	 *
	 * @param int $project_id
	 * @param int $list_id
	 * @param int $task_id
	 * @param boolen $force
	 *
	 * - URL: http://example.com/cpm-json/projects/project_id/lists/list_id/tasks/task_id/?force=1
	 * - METHOD: DELETE
	 *
	 * @since 1.2
	 * @return array
	 */
	public function delete_task( $project_id, $list_id, $task_id, $force = false ) {
		$task_id    = (int) $task_id;
		$project_id = (int) $project_id;

		if ( ! $project_id ) {
			return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.', 'cpm' ), array( 'status' => 404 ) );
		}

		if ( ! $task_id ) {
			return new WP_Error( 'task_id', __( 'Invalid task ID.', 'cpm' ) );
		}

		$task = get_post( $task_id );

		if ( !cpm_user_can_delete_edit( $project_id, $task ) ) {
			return new WP_Error( 'permission', __( 'Sorry! You do not have permission to edit this task.', 'cpm' ), array( 'status' => 404 ) );
		}

		$force = $force ? true : false;
		$result = cpm()->task->delete_task( $task_id, $force );


		if ( $force ) {
			return array( 'message' => __( 'Permanently deleted post', 'cpm' ) );
		} else {
			// TODO: return a HTTP 202 here instead
			return array( 'message' => __( 'Deleted post', 'cpm' ) );
		}
	}
}
