<?php
/**
 * CPM Comment API controler
 */
class CPM_JSON_Comments {
	/**
	 * Register the comment-related routes
	 *
	 * @param array $routes Existing routes
	 * @return array Modified routes
	 */
	public function register_routes( $routes ) {

		$post_routes = array(
			// Post endpoints
			'/projects/(?P<project_id>\d+)/messages/(?P<post_id>\d+)/comments' => array(
				array( array( $this, 'get_comments' ),   WP_JSON_Server::READABLE ),
				array( array( $this, 'create_comment' ), WP_JSON_Server::CREATABLE | WP_JSON_Server::ACCEPT_JSON ),
			),
			'/projects/(?P<project_id>\d+)/lists/(?P<post_id>\d+)/comments' => array(
				array( array( $this, 'get_comments' ),   WP_JSON_Server::READABLE ),
				array( array( $this, 'create_comment' ), WP_JSON_Server::CREATABLE | WP_JSON_Server::ACCEPT_JSON ),
			),
			'/projects/(?P<project_id>\d+)/task/(?P<post_id>\d+)/comments' => array(
				array( array( $this, 'get_comments' ),   WP_JSON_Server::READABLE ),
				array( array( $this, 'create_comment' ), WP_JSON_Server::CREATABLE | WP_JSON_Server::ACCEPT_JSON ),
			),

			'/projects/(?P<project_id>\d+)/messages/(?P<post_id>\d+)/comments/(?P<comment_id>\d+)' => array(
				array( array( $this, 'get_comment' ),    WP_JSON_Server::READABLE ),
			 	array( array( $this, 'edit_comment' ),   WP_JSON_Server::EDITABLE | WP_JSON_Server::ACCEPT_JSON ),
			 	array( array( $this, 'delete_comment' ), WP_JSON_Server::DELETABLE ),
			),
			'/projects/(?P<project_id>\d+)/lists/(?P<post_id>\d+)/comments/(?P<comment_id>\d+)' => array(
				array( array( $this, 'get_comment' ),    WP_JSON_Server::READABLE ),
			 	array( array( $this, 'edit_comment' ),   WP_JSON_Server::EDITABLE | WP_JSON_Server::ACCEPT_JSON ),
			 	array( array( $this, 'delete_comment' ), WP_JSON_Server::DELETABLE ),
			),
			'/projects/(?P<project_id>\d+)/task/(?P<post_id>\d+)/comments/(?P<comment_id>\d+)' => array(
				array( array( $this, 'get_comment' ),    WP_JSON_Server::READABLE ),
			 	array( array( $this, 'edit_comment' ),   WP_JSON_Server::EDITABLE | WP_JSON_Server::ACCEPT_JSON ),
			 	array( array( $this, 'delete_comment' ), WP_JSON_Server::DELETABLE ),
			),
		);

		return array_merge( $routes, $post_routes );
	}

	/**
	 * Get individual comment for message, todo list, task
	 *
	 * @param int $project_id
	 * @param int $post_id
	 * @param int $comment_id
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function get_comment( $project_id, $post_id, $comment_id ) {
		$permission = $this->check_get_comment_permission( $project_id, $post_id );
		if ( $premission !== true  ) {
			return new WP_Error( $premission['key'], $premission['message'], array( 'status' => 404 ) );
		}
		remove_filter( 'comments_clauses', 'cpm_hide_comments', 99 );
	 	$comments = cpm()->comment->get( $comment_id );
	 	$response = new WP_JSON_Response();
	 	$response->set_data( $comments );

	 	return $response;
	}

	/**
	 * Check comment view permission
	 *
	 * @param int $project_id
	 * @param int $post_id
	 *
	 * @since 1.2
	 * @return boolen | array
	 */
	function check_get_comment_permission( $project_id, $post_id ) {
		$post_id    = intval( $post_id );
		$project_id = intval( $project_id );

		if ( ! $post_id ) {
			return array( 'key' => 'json_post_invalid_id', 'message' => __( 'Invalid post ID.', 'cpm' ) );
		}

		if ( ! $project_id ) {
			return array( 'key' => 'json_post_invalid_id', 'message' => __( 'Invalid project ID.', 'cpm' ) );
		}

		$post      = get_post( $post_id );
		$post_type = $post->post_type;

		switch ( $post_type ) {
			case 'cpm_message':
				$manage_capability = cpm_can_manage_projects();

				if ( $manage_capability || cpm_is_single_project_manager( $project_id ) ) {
					return true;

				} else if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
					return array( 'key' => 'permission', 'message' => __( 'Sorry! You are not assigned to this project.', 'cpm' ) );

				} else {
					$message = cpm()->message->get( $post_id );

					if ( isset( $message->message_privacy ) && $task->task_privacy == 'yes' ) {
						if ( !cpm_user_can_access( $project_id, 'msg_view_private' ) ) {
							return array( 'key' => 'permission', 'message' => __( 'Sorry! You do not have permission to view this comments.', 'cpm' ) );
						}
					}
				}
				break;

			case 'cpm_task':
				$manage_capability = cpm_can_manage_projects();

				if ( $manage_capability || cpm_is_single_project_manager( $project_id ) ) {
					$condition = true;
				} else if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
					return array( 'key' => 'permission', 'message' => __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );

				} else if ( !cpm_user_can_access( $project_id, 'tdolist_view_private' ) ) {
					return array( 'key' => 'permission', 'message' => __( 'Sorry! You do not have permission to view this comment.', 'cpm' ), array( 'status' => 404 ) );

				} else {
					$task = cpm()->task->get_task( $post_id );

					if ( isset( $task->task_privacy ) && $task->task_privacy == 'yes' ) {
						if ( !cpm_user_can_access( $project_id, 'todo_view_private' ) ) {
							return array( 'key' => 'permission', 'message' => __( 'Sorry! You do not have permission to view this comment.', 'cpm' ), array( 'status' => 404 ) );
						}
					}

				}
				break;
			case 'cpm_task_list':
				$manage_capability = cpm_can_manage_projects();

				if ( $manage_capability || cpm_is_single_project_manager( $project_id ) ) {
					return true;
				} else if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
					return array( 'key' => 'permission', 'message' => __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );

				} else {
					$task_list = cpm()->task->get_task_list( $post_id );
					if ( isset( $milestone->_tasklist_privacy ) && $task->_tasklist_privacy == 'yes' ) {
						if ( !cpm_user_can_access( $project_id, 'tdolist_view_private' ) ) {
							return array( 'key' => 'permission', 'message' => __( 'Sorry! You do not have permission to view this comment.', 'cpm' ), array( 'status' => 404 ) );
						}
					}
				}
				break;
		}

		return true;
	}

	/**
	 * Edit comment for message, todo list and task
	 *
	 * @param int $project_id
	 * @param int $post_id
	 * @param int $comment_id
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function edit_comment( $project_id, $post_id, $comment_id ) {
		$premission = $this->check_comment_edit_permission( $project_id, $post_id );

		if ( $premission !== true  ) {
			return new WP_Error( $premission['key'], $premission['message'], array( 'status' => 404 ) );
		}

		$data = array(
			'text' => isset( $_POST['text'] ) ? $_POST['text'] : ''
		);
		cpm()->comment->update( $data, $comment_id );
		$comment_data = cpm()->comment->get( $comment_id );
		$response     = new WP_JSON_Response();
		$response->set_data( $comment_data );

		return $response;
	}

	/**
	 * Check comment edit permission
	 *
	 * @param int $project_id
	 * @param int $post_id
	 *
	 * @since 1.2
	 * @return boolen | array
	 */
	function check_comment_edit_permission( $project_id, $post_id ) {
		$post_id    = intval( $post_id );
		$project_id = intval( $project_id );

		if ( ! $post_id ) {
			return array( 'key' => 'json_post_invalid_id', 'message' => __( 'Invalid post ID.', 'cpm' ) );
		}

		if ( ! $project_id ) {
			return array( 'key' => 'json_post_invalid_id', 'message' => __( 'Invalid project ID.', 'cpm' ) );
		}

		$post      = get_post( $post_id );
		$post_type = $post->post_type;

		if ( ! cpm_user_can_delete_edit( $project_id, $post ) ) {
			return array( 'key' => 'permission', 'message' => __( 'Sorry! You do not have permission to edit this comment.', 'cpm' ), array( 'status' => 404 ) );
		}

		return true;
	}

	/**
	 * Delete comment
	 *
	 * @param int $project_id
	 * @param int $post_id
	 * @param int $comment_id
	 *
	 * @since 1.2
	 * @return void
	 */
	public function delete_comment( $project_id, $post_id, $comment_id ) {
		$premission = $this->check_comment_edit_permission( $project_id, $post_id );

		if ( $premission !== true  ) {
			return new WP_Error( $premission['key'], $premission['message'], array( 'status' => 404 ) );
		}
		cpm()->comment->delete( $comment_id );
	}

	/**
	 * Create comment
	 *
	 * @param int $project_id
	 * @param int $post_id
	 *
	 * @since 1.2
	 * @return void
	 */
	public function create_comment( $project_id, $post_id ) {
		$premission = $this->check_create_comment_permission( $project_id, $post_id );

		if ( $premission !== true  ) {
			return new WP_Error( $premission['key'], $premission['message'], array( 'status' => 404 ) );
		}
		$comment_data = array(
			'comment_post_ID' => $post_id,
			'comment_content' => isset( $_POST['comment_content'] ) ? $_POST['comment_content'] : '',
		);

		//add_filter( 'cpm_comment_user' array( $this, 'comment_user' ) );

		$files        = isset( $_POST['cpm_attachment'] ) ? $_POST['cpm_attachment'] : array();
		$comment_id   = cpm()->comment->create( $comment_data, $files );
		$comment_data = cpm()->comment->get( $comment_id );
		$response     = new WP_JSON_Response();
		$response->set_data( $comment_data );

		return $response;
	}

	/**
	 * Check comment create permission
	 *
	 * @param int $project_id
	 * @param int $post_id
	 *
	 * @since 1.2
	 * @return boolen | array
	 */
	function check_create_comment_permission( $project_id, $post_id ) {
		$post_id    = intval( $post_id );
		$project_id = intval( $project_id );

		if ( ! $post_id ) {
			return array( 'key' => 'json_post_invalid_id', 'message' => __( 'Invalid post ID.', 'cpm' ) );
		}

		if ( ! $project_id ) {
			return array( 'key' => 'json_post_invalid_id', 'message' => __( 'Invalid project ID.', 'cpm' ) );
		}

		$post      = get_post( $post_id );
		$post_type = $post->post_type;

		switch ( $post_type ) {
			case 'cpm_message':
				$manage_capability = cpm_can_manage_projects();

				if ( $manage_capability || cpm_is_single_project_manager( $project_id ) ) {
					return true;

				} else if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
					return array( 'key' => 'permission', 'message' => __( 'Sorry! You are not assigned to this project.', 'cpm' ) );

				} else if ( !cpm_user_can_access( $project_id, 'create_message' ) ) {
					return array( 'key' => 'permission', 'message' => __( 'Sorry! You do not have permission to view this comments.', 'cpm' ) );
				}
				break;

			case 'cpm_task':
				$manage_capability = cpm_can_manage_projects();

				if ( $manage_capability || cpm_is_single_project_manager( $project_id ) ) {
					$condition = true;
				} else if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
					return array( 'key' => 'permission', 'message' => __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );

				} else if ( !cpm_user_can_access( $project_id, 'tdolist_view_private' ) ) {
					return array( 'key' => 'permission', 'message' => __( 'Sorry! You do not have permission to view this comment.', 'cpm' ), array( 'status' => 404 ) );

				} else if ( !cpm_user_can_access( $project_id, 'create_todo' ) ) {
					return array( 'key' => 'permission', 'message' => __( 'Sorry! You do not have permission to view this comment.', 'cpm' ), array( 'status' => 404 ) );
				}
				break;
			case 'cpm_task_list':
				$manage_capability = cpm_can_manage_projects();

				if ( $manage_capability || cpm_is_single_project_manager( $project_id ) ) {
					return true;
				} else if ( ! cpm_project_user_role_pre_chache( $project_id ) ) {
					return array( 'key' => 'permission', 'message' => __( 'Sorry! You are not assigned to this project.', 'cpm' ), array( 'status' => 404 ) );

				} else if ( !cpm_user_can_access( $project_id, 'create_todolist' ) ) {
					return array( 'key' => 'permission', 'message' => __( 'Sorry! You do not have permission to view this comment.', 'cpm' ), array( 'status' => 404 ) );
				}
				break;
		}

		return true;
	}

	/**
	 * Get all comments for individual message, todo list, task
	 *
	 * @param int $project_id
	 * @param int $post_id
	 *
	 * @since 1.2
	 * @return array $response
	 */
	public function get_comments( $project_id, $post_id ) {

		$premission = $this->check_get_comment_permission( $project_id, $post_id );

		if ( $premission !== true  ) {
			return new WP_Error( $premission['key'], $premission['message'], array( 'status' => 404 ) );
		}

		remove_filter( 'comments_clauses', 'cpm_hide_comments', 99 );
		$comments = cpm()->comment->get_comments( $post_id );
		$response = new WP_JSON_Response();
		$response->set_data( $comments );
		return $response;
	}

}
