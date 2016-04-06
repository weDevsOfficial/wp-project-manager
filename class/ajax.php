<?php

/**
 * Description of ajax
 *
 * @author tareq
 */
class CPM_Ajax {

	private $_task_obj;
	private $_milestone_obj;
	private static $_instance;

	public static function getInstance() {
		if (!self::$_instance) {
			self::$_instance = new CPM_Ajax();
		}

		return self::$_instance;
	}

	public function __construct() {
		$this->_task_obj      = CPM_Task::getInstance();
		$this->_milestone_obj = CPM_Milestone::getInstance();

		add_action('wp_ajax_cpm_user_create', array($this, 'create_user'));

		add_action('wp_ajax_cpm_project_new', array($this, 'project_new'));
		add_action('wp_ajax_cpm_project_update', array($this, 'project_edit'));
		add_action('wp_ajax_cpm_project_delete', array($this, 'project_delete'));

		add_action('wp_ajax_cpm_task_complete', array($this, 'mark_task_complete'));

		add_action('wp_ajax_cpm_task_open', array($this, 'mark_task_open'));

		add_action('wp_ajax_cpm_task_delete', array($this, 'delete_task'));
		add_action('wp_ajax_cpm_task_add', array($this, 'add_new_task'));
		add_action('wp_ajax_cpm_task_update', array($this, 'update_task'));
		add_action('wp_ajax_cpm_task_order', array($this, 'task_save_order'));
		add_action('wp_ajax_cpm_check_task_access', array($this, 'check_task_access'));

		add_action('wp_ajax_cpm_add_list', array($this, 'add_tasklist'));
		add_action('wp_ajax_cpm_update_list', array($this, 'update_tasklist'));
		add_action('wp_ajax_cpm_tasklist_delete', array($this, 'delete_tasklist'));
		add_action('wp_ajax_cpm_tasklist_pinstatus_update', array($this, 'update_tasklist_pinstatus'));

		add_action('wp_ajax_cpm_get_task_list', array($this, 'get_task_list'));
		add_action('wp_ajax_cpm_get_todo_list', array($this, 'get_todo_list'));

		add_action('wp_ajax_cpm_milestone_new', array($this, 'milestone_new'));
		add_action('wp_ajax_cpm_milestone_complete', array($this, 'milestone_complete'));
		add_action('wp_ajax_cpm_milestone_open', array($this, 'milestone_open'));
		add_action('wp_ajax_cpm_milestone_get', array($this, 'milestone_get'));
		add_action('wp_ajax_cpm_delete_milestone', array($this, 'milestone_delete'));
		add_action('wp_ajax_cpm_milestone_update', array($this, 'milestone_update'));

		add_action('wp_ajax_cpm_ajax_upload', array($this, 'ajax_upload'));
		add_action('wp_ajax_cpm_delete_file', array($this, 'delete_file'));

		add_action('wp_ajax_cpm_comment_new', array($this, 'new_comment'));
		add_action('wp_ajax_cpm_comment_get', array($this, 'get_comment'));
		add_action('wp_ajax_cpm_comment_update', array($this, 'update_comment'));
		add_action('wp_ajax_cpm_comment_delete', array($this, 'delete_comment'));

		add_action('wp_ajax_cpm_show_discussion', array($this, 'get_discussion'));
		add_action('wp_ajax_cpm_message_new', array($this, 'new_message'));
		add_action('wp_ajax_cpm_message_update', array($this, 'update_message'));
		add_action('wp_ajax_cpm_message_delete', array($this, 'delete_message'));
		add_action('wp_ajax_cpm_message_get', array($this, 'get_message'));

		add_action('wp_ajax_cpm_get_activity', array($this, 'get_activity'));

		add_action('wp_ajax_cpm_user_autocomplete', array($this, 'autocomplete_user_role'));

		add_action('wp_ajax_cpm_project_archive', array($this, 'archive'));

		add_action('wp_ajax_cpm_calender_update_duetime', array($this, 'update_task_time'));
		add_action('wp_ajax_all_search', array($this, 'all_search'));
		add_action('wp_ajax_search_client', array($this, 'search_client'));

		add_action('wp_ajax_cpm_project_reports', array($this, 'report'));
		add_action('wp_ajax_cpm_get_projects_activity', array($this, 'get_projects_activity'));
		// Mension
		add_action('wp_ajax_cpmm_user_mension', array($this, 'mension_user'));

		// Set Project View
		add_action('wp_ajax_cpm_project_view', array($this, 'set_project_view'));

	}

	/**
	 * Search report
	 *
	 * @return void
	 */
	function report() {
		//check_ajax_referer( 'cpm_nonce' );
		parse_str($_POST['data'], $data);
		$table = cpm()->report->report_generate($data);
		wp_send_json_success(array('table' => $table));
	}

	/**
	 * Search clients via ajax
	 *
	 * @return void
	 */
	function search_client() {
		$user = intval($_POST['user']);

		$args = array(
			'search'         => $user,
			'search_columns' => array('user_login', 'user_email', 'user_nicename'),
		);

		add_action('pre_user_query', array($this, 'pre_user_query'));

		$user_query = new WP_User_Query($args);

		$projects_id = array();
		foreach ($user_query->results as $user) {
			$projects_id[] = $user->project_id;
		}

		$items = array();

		if (!count($projects_id)) {
			$items[] = array(
				'label' => '<div class="cpm-all-search-item"><strong>'.__('No project found !', 'cpm').'</strong></div>',
			);

			$search_details = json_encode($items);
			wp_send_json_success($search_details);
		}

		$post_query = new WP_Query(array(
				'post_type'      => 'cpm_project',
				'post_status'    => 'publish',
				'post__in'       => $projects_id,
				'posts_per_page' => -1,
			));

		foreach ($post_query->posts as $post) {
			$url      = cpm_url_project_details($post->ID);
			$category = __('Project: ', 'cpm');
			$items[]  = array(
				'label' => '<div class="cpm-all-search-item"><a href="'.$url.'"><strong>'.$category.'</strong>'.$post->post_title.'</a></div>',
			);
		}

		$search_details = json_encode($items);
		wp_send_json_success($search_details);
	}

	function pre_user_query($self) {
		global $wpdb;

		$cpm_user = $wpdb->prefix.'cpm_user_role';
		$wp_user  = $wpdb->users;
		$self->query_fields .= ", cpu.project_id";
		$self->query_from .= " LEFT JOIN $cpm_user AS cpu ON $wp_user.ID = cpu.user_id";
		$query_where = " AND cpu.role='client'";

		$self->query_where .= apply_filters('cpm_pre_user_query_where', $query_where, $self);
	}

	function all_search() {
		$project_id = isset($_POST['project_id'])?sanitize_text_field($_POST['project_id']):false;
		$item       = trim($_POST['item']);

		if (!$project_id) {
			$args = array(
				'post_type'      => array('cpm_project', 'cpm_task_list', 'cpm_task', 'cpm_message', 'cpm_milestone'),
				'post_status'    => 'publish',
				'posts_per_page' => '-1',
				's'              => $item,
			);
			$args  = apply_filters('cpm_all_project_search_query_arg', $args, $item);
			$query = new WP_Query($args);
			$posts = $query->posts;
		}

		if ($project_id) {
			$args = array(
				'post_type'      => array('cpm_task_list', 'cpm_message', 'cpm_milestone'),
				'post_status'    => 'publish',
				'post_parent'    => $project_id,
				'posts_per_page' => '-1',
				's'              => $item,
			);
			$query = new WP_Query($args);

			global $wpdb;
			$sql = "SELECT * FROM $wpdb->posts AS p
                LEFT JOIN $wpdb->posts AS tl ON p.ID=tl.post_parent
                LEFT JOIN $wpdb->posts AS tk ON tl.ID=tk.post_parent
                WHERE
                p.post_type='cpm_project' AND p.post_status='publish' AND p.ID=$project_id
                AND  tl.post_type='cpm_task_list' AND tk.post_type='cpm_task'
                AND  tl.post_status='publish' AND tk.post_status='publish'
                AND ( tk.post_title like '%$item%' OR tk.post_content like '%$item%' )";

			$posts = $wpdb->get_results($sql);
			$posts = array_merge($query->posts, $posts);

		}

		$url   = array();
		$items = array();
		foreach ($posts as $key => $post) {
			switch ($post->post_type) {
				case 'cpm_project':
					$url      = cpm_url_project_details($post->ID);
					$category = __('Project: ', 'cpm');
					$items[]  = array(
						'label' => '<div class="cpm-all-search-item"><a href="'.$url.'"><strong>'.$category.'</strong>'.$post->post_title.'</a></div>',
					);
					break;

				case 'cpm_task_list':
					$url      = cpm_url_single_tasklist($post->post_parent, $post->ID);
					$category = __('Task List: ', 'cpm');
					$items[]  = array(
						'label' => '<div class="cpm-all-search-item"><a href="'.$url.'"><strong>'.$category.'</strong>'.$post->post_title.'</a></div>',
					);
					break;

				case 'cpm_task':
					$task_list = get_post($post->post_parent);
					$url       = cpm_url_single_task($task_list->post_parent, $post->post_parent, $post->ID);
					$category  = __('Task: ', 'cpm');
					$items[]   = array(
						'label' => '<div class="cpm-all-search-item"><a href="'.$url.'"><strong>'.$category.'</strong>'.$post->post_title.'</a></div>',
					);
					break;

				case 'cpm_message':
					$url      = cpm_url_single_message($post->post_parent, $post->ID);
					$category = __('Message: ', 'cpm');
					$items[]  = array(
						'label' => '<div class="cpm-all-search-item"><a href="'.$url.'"><strong>'.$category.'</strong>'.$post->post_title.'</a></div>',
					);
					break;

				case 'cpm_milestone':
					$url      = cpm_url_milestone_index($post->post_parent);
					$category = __('Milestone: ', 'cpm');
					$items[]  = array(
						'label' => '<div class="cpm-all-search-item"><a href="'.$url.'"><strong>'.$category.'</strong>'.$post->post_title.'</a></div>',
					);
					break;
			}
		}

		if (!count($items)) {
			$items[] = array(
				'label' => '<div class="cpm-all-search-item"><strong>'.__('No item found !', 'cpm').'</strong></div>',
			);
		}
		$search_details = json_encode($items);

		wp_send_json_success($search_details);
	}

	function where_project_search($where) {
		$item = $_POST['item'];
		$where .= " OR tk.post_title LIKE '%$item%'";
		return $where;
	}

	function join_project_search($join) {
		global $wpdb;
		$table = $wpdb->posts;
		$join  = "LEFT JOIN $table AS tl ON tl.ID=$table.ID
        LEFT JOIN $table AS tk ON tk.post_parent=tl.ID ";

		return $join;
	}

	function post_where($where, &$wp_query) {
		$where .= 'AND p.ID IN(4)';
		return $where;
	}

	function update_task_time() {

		check_ajax_referer('cpm_nonce');
		$respne['success'] = false;

		// cpm_user_can_delete_edit( $project_id, $list )
		$start_date = sanitize_text_field($_POST['start_date']);
		$end_date   = sanitize_text_field($_POST['end_date']);

		$start_date = !empty($start_date)?date('Y-m-d H:i:s', strtotime($start_date)):'';
		$end_date   = !empty($end_date)?date('Y-m-d H:i:s', strtotime($end_date)):'';
		$project_id = sanitize_text_field($_POST['project_id']);
		$task_id    = sanitize_text_field($_POST['task_id']);

		if (cpm_user_can_delete_edit($project_id, $task_id, true)) {

			if (cpm_get_option('task_start_field') == 'on') {
				update_post_meta($_POST['task_id'], '_start', $start_date);
			}

			update_post_meta($_POST['task_id'], '_due', $end_date);
			$respne['success'] = true;
		}

		echo json_encode($respne);
		exit();
	}

	function create_user() {
		check_ajax_referer('cpm_nonce');

		parse_str($_POST['data'], $postdata);
		$validate = $this->form_validate($postdata);

		if (is_wp_error($validate)) {
			wp_send_json_error($validate->errors['error'][0]);
		}

		if (cpm_can_create_project()) {
			$random_password = wp_generate_password($length = 12, $include_standard_special_chars = false);
			$first_name      = $postdata['first_name'] != ''?sanitize_text_field($postdata['first_name']):'';
			$last_name       = $postdata['last_name'] != ''?sanitize_text_field($postdata['last_name']):'';

			$userdata = array(
				'user_login'   => $postdata['user_name'] != ''?sanitize_text_field($postdata['user_name']):'',
				'user_pass'    => $random_password,
				'user_email'   => $postdata['user_email'] != ''?sanitize_email($postdata['user_email']):'',
				'display_name' => $first_name.' '.$last_name,
			);

			$user_id = wp_insert_user($userdata);

			if ($user_id) {
				update_user_meta($user_id, 'first_name', $first_name);
				update_user_meta($user_id, 'last_name', $last_name);

				wp_new_user_notification($user_id, $random_password);
				$user_meta = $this->create_user_meta(sanitize_text_field($postdata['user_name']), $user_id);
				wp_send_json_success($user_meta);
			}
		} else {
			wp_send_json_error(__('Access Denied', 'cpm'));
		}
	}

	function form_validate($postdata) {

		if (empty($postdata['user_name'])) {
			return new WP_Error('error', __('Username required ', 'cpm'));
		}

		if (empty($postdata['user_email'])) {
			return new WP_Error('error', __('Email required', 'cpm'));
		}

		if (!is_email($postdata['user_email'])) {
			return new WP_Error('error', __('Invalid email', 'cpm'));
		}

		if (username_exists($postdata['user_name'])) {
			return new WP_Error('error', __('Username already exist', 'cpm'));
		}

		if (email_exists($postdata['user_email'])) {
			return new WP_Error('error', __('Email already exist', 'cpm'));
		}

		return true;
	}

	function archive() {

		if (!wp_verify_nonce($_POST['_nonce'], 'cpm_nonce')) {
			wp_send_json_error(__('Are you cheating?', 'cpm'));
		}
		if (cpm_can_manage_projects()) {
			if (isset($_POST['project_id'])) {
				$project_id = sanitize_text_field($_POST['project_id']);
			} else {
				wp_send_json_error(__('Project ID required', 'cpm'));
			}
			if ($_POST['type'] == 'archive') {
				update_post_meta($project_id, '_project_active', 'no');
			} else {
				update_post_meta($project_id, '_project_active', 'yes');
			}
			wp_cache_delete('cpm_count');
			wp_send_json_success(array(
					'url'   => cpm_url_projects(),
					'count' => cpm_project_count(),
				));
		} else {
			wp_send_json_error(__('Access Denied', 'cpm'));
		}
	}

	/**
	 * Set Project View setting
	 *
	 * @since 1.3.8
	 */
	function set_project_view() {

		if (!wp_verify_nonce($_POST['_nonce'], 'cpm_nonce')) {
			wp_send_json_error(__('Are you cheating?', 'cpm'));
		}

		$view = in_array($_POST['change_view'], array('grid', 'list'))?$_POST['change_view']:'grid';
		update_user_meta(get_current_user_id(), '_cpm_project_view', $view);

		wp_send_json_success();
	}

	function project_new() {
		$posted  = $_POST;
		$pro_obj = CPM_Project::getInstance();

		//fail if current user is not editor or above
		if (!cpm_can_create_projects()) {
			echo json_encode(array('success' => false));
			exit;
		}

		$posted     = $_POST;
		$project_id = $pro_obj->create($project_id = 0, $posted);
		$project    = $pro_obj->get($project_id);

		echo json_encode(array(
				'success' => true,
				'url'     => cpm_url_project_details($project_id)
			));

		exit;
	}

	function project_edit() {

		$posted = $_POST;

		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;
		if (cpm_can_manage_projects()) {
			$pro_obj    = CPM_Project::getInstance();
			$project_id = $pro_obj->update($project_id, $posted);
			$project    = $pro_obj->get($project_id);

			echo json_encode(array(
					'success' => true,
					'title'   => $project->post_title,
					'content' => cpm_get_content($project->post_content),
					'users'   => $this->user_role_table_generator($project)
				));
		} else {
			echo json_encode(array(
					'success' => false,
				));
		}
		exit;
	}

	function user_role_table_generator($project) {
		ob_start();
		if (!is_null($project)) {
			$users_role = apply_filters('cpm_users_exclude_from_project', $project->users, $project);

			foreach ($users_role as $array) {
				$user_data = get_userdata($array['id']);

				if ($user_data === false) {
					continue;
				}

				if ($project->post_author == $user_data->ID) {
					continue;
				}

				$name = str_replace(' ', '_', $user_data->display_name);
				?>
																                    <tr>
																                        <td><?php printf('%s', ucfirst($user_data->display_name));?></td>
																                        <td>
																                            <input type="radio" <?php checked('manager', $array['role']);
				?> id="cpm-manager-<?php echo $name;?>"  name="role[<?php echo $array['id'];?>]" value="manager">
																                            <label for="cpm-manager-<?php echo $name;?>"><?php _e('Manager', 'cpm');
				?></label>
																                        </td>
																                        <td>
																                            <input type="radio" <?php checked('co_worker', $array['role']);
				?> id="cpm-co-worker-<?php echo $name;?>" name="role[<?php echo $array['id'];?>]" value="co_worker">
																                            <label for="cpm-co-worker-<?php echo $name;?>"><?php _e('Co-worker', 'cpm');
				?></label>
																                        </td>
				<?php do_action('cpm_update_project_client_field', $array, $name);?>

																                        <td><a hraf="#" class="cpm-del-proj-role cpm-assign-del-user"><span class="dashicons dashicons-trash"></span> <span class="title"><?php _e('Delete', 'cpm');?></span></a></td>
																                    </tr>

				<?php
			}
		}
		return ob_get_clean();
	}

	function project_delete() {
		$posted = $_POST;

		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;
		if (cpm_can_manage_projects()) {
			do_action('cpm_delete_project_prev', $project_id);

			CPM_Project::getInstance()->delete($project_id, true);

			do_action('cpm_delete_project_after', $project_id);
			echo json_encode(array(
					'success' => true,
					'url'     => $_POST['url'],
				));
		} else {
			echo json_encode(array(
					'success' => false
				));
		}
		exit;
	}

	function add_new_task() {
		$posted = $_POST;

		$list_id    = isset($posted['list_id'])?intval($posted['list_id']):0;
		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;
		$response   = array('success' => false);
		if (cpm_user_can_access($project_id, 'create_todo')) {
			$task_obj = CPM_Task::getInstance();
			$task_id  = $task_obj->add_task($list_id, $posted);
			$task     = $task_obj->get_task($task_id);
			$complete = $task_obj->get_completeness($list_id, $project_id);
			$single   = isset($_POST['single'])?$_POST['single']:false;

			if ($task_id) {
				$response = array(
					'success'  => true,
					'id'       => $task_id,
					'content'  => cpm_task_html($task, $project_id, $list_id, $single),
					'progress' => cpm_task_completeness($complete['total'], $complete['completed'])
				);
			}

			do_action('cpm_after_new_task', $task_id, $list_id, $project_id);
		}
		echo json_encode($response);
		exit;
	}

	function update_task() {
		$posted = $_POST;

		$list_id    = isset($posted['list_id'])?intval($posted['list_id']):0;
		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;
		$task_id    = isset($posted['task_id'])?intval($posted['task_id']):0;
		$single     = (int) $posted['single'];
		$response   = array('success' => false);
		if (cpm_user_can_delete_edit($project_id, $task_id, true)) {
			$task_obj = CPM_Task::getInstance();
			$task_id  = $task_obj->update_task($list_id, $posted, $task_id);
			$task     = $task_obj->get_task($task_id);

			if ($task_id) {
				$response = array(
					'success' => true,
					'content' => cpm_task_html($task, $project_id, $list_id, $single)
				);
			}

			do_action('cpm_after_update_task', $task_id, $list_id, $project_id);
		}
		echo json_encode($response);

		exit;
	}

	function check_task_access() {

		$project_id = isset($_POST['project_id'])?intval($_POST['project_id']):0;
		$task_id    = isset($_POST['task_id'])?intval($_POST['task_id']):0;

		if (cpm_user_can_delete_edit($project_id, $task_id, true)) {
			$response = true;
		} else {
			$response = false;
		}

		echo json_encode($response);
		exit;

	}

	function task_save_order() {

		if ($_POST['items']) {
			foreach ($_POST['items'] as $index => $task_id) {
				wp_update_post(array('ID'         => $task_id, 'menu_order'         => $index));
			}
		}

		exit;
	}

	function mark_task_complete() {
		check_ajax_referer('cpm_nonce');

		$posted     = $_POST;

		$task_id    = isset($posted['task_id'])?intval($posted['task_id']):0;
		$list_id    = isset($posted['list_id'])?intval($posted['list_id']):0;
		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;
		$single     = (int) $posted['single'];
		$response   = array('success' => false);

		if ( cpm_user_can_delete_edit( $project_id, $task_id, true ) ) {
			$task_obj = CPM_Task::getInstance();
			$task_obj->mark_complete($task_id);

			$complete = $task_obj->get_completeness($list_id, $project_id);
			$task     = $task_obj->get_task($task_id);
			$user_id  = wp_get_current_user()->ID;

			$response = array(
				'success'         => true,
				'content'         => cpm_task_html($task, $project_id, $list_id, $single),
				'progress'        => cpm_task_completeness($complete['total'], $complete['completed']),
				'task_complete'   => intval($complete['completed']),
				'percent'         => $complete['total'] == 0 ? 100 : round((100*$complete['completed'])/$complete['total'])." %",
				'task_uncomplete' => ceil( $complete['total'] - $complete['completed'])
			);

			$response = apply_filters( 'cpm_task_complete_response', $response, $task_id, $list_id, $project_id, $user_id );
			CPM_Notification::getInstance()->complete_task($list_id, $task_id, $task, $project_id);
		}

		echo json_encode( $response );
		exit;
	}

	function mark_task_open() {
		check_ajax_referer('cpm_nonce');

		$posted     = $_POST;
		$task_id    = isset($posted['task_id'])?intval($posted['task_id']):0;
		$list_id    = isset($posted['list_id'])?intval($posted['list_id']):0;
		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;
		$single     = isset( $posted['single'] ) ? $posted['single'] : false;
		$response   = array('success' => false);

		if ( cpm_user_can_delete_edit($project_id, $task_id, true ) ) {

			$task_obj = CPM_Task::getInstance();
			$task_obj->mark_open($task_id);

			$complete = $task_obj->get_completeness($list_id, $project_id);
			$user_id  = wp_get_current_user()->ID;
			$task     = $task_obj->get_task($task_id);
			$response = array(
				'success'         => true,
				'content'         => cpm_task_html($task, $project_id, $list_id, $single),
				'progress'        => cpm_task_completeness($complete['total'], $complete['completed']),
				'percent'         => $complete['total'] == 0 ? 0 : round((100 * $complete['completed'] ) / $complete['total'] ) . " %",
				'task_complete'   => intval( $complete['completed'] ),
				'task_uncomplete' => ceil( $complete['total'] - $complete['completed'] )
			);

			$response = apply_filters( 'cpm_task_open_response', $response, $task_id, $list_id, $project_id, $user_id);
		}

		echo json_encode( $response );
		exit;
	}

	function delete_task() {
		check_ajax_referer('cpm_nonce');
		$posted     = $_POST;
		$task_id    = isset($posted['task_id'])?intval($posted['task_id']):0;
		$list_id    = isset($posted['list_id'])?intval($posted['list_id']):0;
		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;
		$response   = array('success' => false);
		if (cpm_user_can_delete_edit($project_id, $task_id, true)) {
			$task_obj = CPM_Task::getInstance();

			do_action('cpm_delete_task_prev', $task_id, $list_id, $project_id, $task_obj);

			$task_obj->delete_task($task_id, true);
			$complete = $task_obj->get_completeness($list_id, $project_id);

			do_action('cpm_delete_task_after', $task_id, $list_id, $project_id, $task_obj);

			$response = array(
				'success'  => true,
				'list_url' => cpm_url_single_tasklist($project_id, $list_id),
				'progress' => cpm_task_completeness($complete['total'], $complete['completed'])
			);
		}
		echo json_encode($response);
		exit;
	}

	function add_tasklist() {
		check_ajax_referer('cpm_add_list');

		$posted     = $_POST;
		$project_id = $posted['project_id'];
		$response   = array('success' => false);
		if (cpm_user_can_access($project_id, 'create_todolist')) {
			$task_obj = CPM_Task::getInstance();
			$list_id  = $task_obj->add_list($project_id, $posted);

			if ($list_id) {
				$list = $task_obj->get_task_list($list_id);

				$response = (array(
						'success' => true,
						'id'      => $list_id,
						'content' => cpm_task_list_html($list, $project_id)
					));
			} else {
				$response = array(
					'success' => false
				);
			}
		} else {
			$response = array(
				'success' => false
			);
		}
		echo json_encode($response);
		exit;
	}

	function update_tasklist() {
		check_ajax_referer('cpm_update_list');

		$posted     = $_POST;
		$project_id = $posted['project_id'];
		$list_id    = $posted['list_id'];
		$response   = array('success' => false);
		if (cpm_user_can_delete_edit($project_id, $list_id, true)) {
			$task_obj = CPM_Task::getInstance();
			$list_id  = $task_obj->update_list($project_id, $posted, $list_id);

			if ($list_id) {
				$list = $task_obj->get_task_list($list_id);

				$response = array(
					'success' => true,
					'id'      => $list_id,
					'content' => cpm_task_list_html($list, $project_id)
				);
			}
		}
		echo json_encode($response);
		exit;
	}

	function delete_tasklist() {
		check_ajax_referer('cpm_nonce');
		$list_id  = $posted['list_id'];
		$response = array('success' => false);
		if (cpm_user_can_delete_edit($project_id, $list_id, true)) {
			do_action('cpm_delete_tasklist_prev', $_POST['list_id']);

			CPM_Task::getInstance()->delete_list($_POST['list_id'], true);

			do_action('cpm_delete_tasklist_after', $_POST['list_id']);

			$response = array(
				'success' => true
			);
		}
		echo json_encode($response);
		exit;
	}

	/**
	 * Pin a todo list at top
	 *
	 * @since 1.4.1
	 *
	 * @return void
	 */
	public function update_tasklist_pinstatus() {
		check_ajax_referer( 'cpm_nonce' );
        $posted = $_POST;

        $post_id = sanitize_text_field( $posted['list_id'] );
        /*$status = sanitize_text_field( $posted['pin_status'] );
        $update  = update_post_meta( $list_id, '_pin_list', $status );
        */
        $stickies = get_option('sticky_posts');

        if ( !is_array($stickies) ) {
            $stickies = array($post_id);
        }

        if ( ! in_array($post_id, $stickies) ) {
            $stickies[] = $post_id;
        } else {
            $offset = array_search($post_id, $stickies);

            if ( false === $offset ) {
                return;
            }

            array_splice($stickies, $offset, 1);
        }

        $update = update_option('sticky_posts', $stickies);
        if ( $update ) {
            echo json_encode( array(
                'success' => true,
            ) );
        } else {
            echo json_encode( array(
                'success' => false
            ) );
        }

        exit;
	}

	function milestone_new() {
		check_ajax_referer('cpm_milestone');
		$project_id = isset( $_POST['project_id'] ) ? intval( $_POST['project_id'] ) : 0;

		if ( cpm_user_can_access($project_id, 'create_milestone') ) {
			CPM_Milestone::getInstance()->create( $project_id )	;

			echo json_encode(array(
				'success' => true
			));
		} else {
			echo json_encode(array(
				'success' => true
			));
		}

		exit;
	}

	function milestone_update() {
		check_ajax_referer('cpm_milestone');
		$posted       = $_POST;
		$milestone_id = sanitize_text_field($posted['milestone_id']);
		$response     = array('success' => false);
		if (cpm_user_can_delete_edit($project_id, $milestone_id, true)) {
			$project_id   = isset($posted['project_id'])?intval($posted['project_id']):0;
			$milestone_id = isset($posted['milestone_id'])?intval($posted['milestone_id']):0;

			CPM_Milestone::getInstance()->update($project_id, $milestone_id);

			echo json_encode(array(
					'success' => true
				));
		} else {
			echo json_encode(array(
					'success' => false
				));
		}
		exit;
	}

	function milestone_get() {
		check_ajax_referer('cpm_nonce');

		$posted = $_POST;

		$project_id   = isset($posted['project_id'])?intval($posted['project_id']):0;
		$milestone_id = isset($posted['id'])?intval($posted['id']):0;
		$milestone    = CPM_Milestone::getInstance()->get($milestone_id);

		echo json_encode(array(
				'success' => true,
				'id'      => $milestone_id,
				'content' => cpm_milestone_form($project_id, $milestone)
			));

		exit;
	}

	function milestone_delete() {
		check_ajax_referer('cpm_nonce');

		$milestone_id = (int) $_POST['milestone_id'];

		if (cpm_user_can_delete_edit($project_id, $milestone_id, true)) {
			$this->_milestone_obj->delete($milestone_id, true);
			echo json_encode(array(
					'success' => true
				));
		} else {
			echo json_encode(array(
					'success' => false
				));
		}
		exit;
	}

	function milestone_complete() {
		check_ajax_referer('cpm_nonce');

		$milestone_id = (int) $_POST['milestone_id'];

		if (cpm_user_can_delete_edit($project_id, $milestone_id, true)) {
			$this->_milestone_obj->mark_complete($milestone_id);
			// print_r( $_POST );
			echo json_encode(array(
					'success' => true
				));
		} else {
			echo json_encode(array(
					'success' => false
				));
		}
		exit;
	}

	function milestone_open() {
		check_ajax_referer('cpm_nonce');

		$milestone_id = (int) $_POST['milestone_id'];

		if (cpm_user_can_delete_edit($project_id, $milestone_id, true)) {
			$this->_milestone_obj->mark_open($milestone_id);
			echo json_encode(array(
					'success' => true
				));
		} else {
			echo json_encode(array(
					'success' => false
				));
		}
		exit;
	}

	function ajax_upload() {
		check_ajax_referer('cpm_ajax_upload', 'nonce');

		$object_id   = isset($_REQUEST['object_id'])?intval($_REQUEST['object_id']):0;
		$comment_obj = CPM_Comment::getInstance();
		$response    = $comment_obj->upload_file($object_id);

		if ($response['success']) {
			$file = $comment_obj->get_file($response['file_id']);

			$delete   = sprintf('<a href="#" data-id="%d" class="cpm-delete-file button">%s</a>', $file['id'], __('Delete File', 'cpm'));
			$hidden   = sprintf('<input type="hidden" name="cpm_attachment[]" value="%d" />', $file['id']);
			$file_url = sprintf('<a href="%1$s" target="_blank"><img src="%2$s" alt="%3$s" /></a>', $file['url'], $file['thumb'], esc_attr($file['name']));

			$html = '<div class="cpm-uploaded-item">'.$file_url.' '.$delete.$hidden.'</div>';
			echo json_encode(array(
					'success' => true,
					'content' => $html,
				));

			exit;
		}

		echo json_encode(array(
				'success' => false,
				'error'   => $response['error'],
			));

		exit;
	}

	function delete_file() {
		check_ajax_referer('cpm_nonce');

		$file_id = (isset($_POST['file_id']))?intval($_POST['file_id']):0;

		$comment_obj = CPM_Comment::getInstance();
		$comment_obj->delete_file($file_id, true);

		echo 'success';
		exit;
	}

	function new_comment() {
		check_ajax_referer('cpm_new_message');

		$posted = $_POST;
		$files  = array();

		$text       = trim($posted['cpm_message']);
		$parent_id  = isset($posted['parent_id'])?intval($posted['parent_id']):0;
		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;

		if (isset($posted['cpm_attachment'])) {
			$files = $posted['cpm_attachment'];
		}

		$data = array(
			'comment_post_ID' => $parent_id,
			'comment_content' => $text,
			'user_id'         => get_current_user_id()
		);

		$comment_obj = CPM_Comment::getInstance();
		$comment_id  = $comment_obj->create($data, $files);

		if ($comment_id) {

			$comment = $comment_obj->get($comment_id);

			echo json_encode(array(
					'success'     => true,
					'placeholder' => __('Add a comment...', 'cpm'),
					'content'     => cpm_show_comment($comment, $project_id)
				));
		}

		exit;
	}

	function update_comment() {
		$posted = $_POST;
		//print_r( $posted );

		$comment_id = isset($posted['comment_id'])?intval($posted['comment_id']):0;
		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;

		$data = array(
			'text' => $posted['cpm_message'],
		);

		$comment_obj = CPM_Comment::getInstance();
		$comment_obj->update($data, $comment_id);

		$comment = $comment_obj->get($comment_id);
		$content = cpm_comment_text($comment_id);
		$content .= cpm_show_attachments($comment, $project_id);

		echo json_encode(array(
				'success' => true,
				'content' => $content,
			));

		exit;
	}

	function get_comment() {
		check_ajax_referer('cpm_nonce');
		$posted = $_POST;

		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;
		$object_id  = isset($posted['object_id'])?intval($posted['object_id']):0;
		$comment_id = isset($posted['comment_id'])?intval($posted['comment_id']):0;

		$comment = CPM_Comment::getInstance()->get($comment_id);

		echo json_encode(array(
				'success' => true,
				'id'      => $comment_id,
				'form'    => cpm_comment_form($project_id, $object_id, $comment)
			));

		exit;
	}

	function delete_comment() {
		check_ajax_referer('cpm_nonce');

		$comment_id = isset($_POST['comment_id'])?intval($_POST['comment_id']):0;
		CPM_Comment::getInstance()->delete($comment_id, true);

		echo json_encode(array(
				'success' => true
			));

		exit;
	}

	function new_message() {
		check_ajax_referer('cpm_message');
		$posted = $_POST;

		$files      = array();
		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;

		if (isset($posted['cpm_attachment'])) {
			$files = $posted['cpm_attachment'];
		}
		if (cpm_user_can_access($project_id, 'create_message')) {
			$message_obj = CPM_Message::getInstance();
			$message_id  = $message_obj->create($project_id, $posted, $files);
			if (!isset($posted['cpmf_url'])) {
				$url = sprintf('%s?page=cpm_projects&tab=message&action=single&pid=%d&mid=%d', admin_url('admin.php'), $project_id, $message_id);
			} else {
				$url = cpm_url_single_message($project_id, $message_id);
			}

			if ($message_id) {
				echo json_encode(array(
						'success' => true,
						'id'      => $message_id,
						'url'     => $url,
					));

				exit;
			}

			echo json_encode(array(
					'success' => false
				));
		} else {
			echo json_encode(array(
					'success' => false
				));
		}
		exit;
	}

	function update_message() {
		check_ajax_referer('cpm_message');
		$posted = $_POST;

		$files      = array();
		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;
		$message_id = isset($posted['message_id'])?intval($posted['message_id']):0;

		if (isset($posted['cpm_attachment'])) {
			$files = $posted['cpm_attachment'];
		}

		$message_obj = CPM_Message::getInstance();
		$message_id  = $message_obj->update($project_id, $posted, $files, $message_id);
		$message     = $message_obj->get($message_id);

		if ($message_id && !empty($message)) {
			echo json_encode(array(
					'success' => true,
					'id'      => $message_id,
					'content' => cpm_get_content($message->post_content).cpm_show_attachments($message, $project_id)
				));

			exit;
		}

		echo json_encode(array(
				'success' => false
			));

		exit;
	}

	function delete_message() {
		check_ajax_referer('cpm_nonce');

		$posted     = $_POST;
		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;
		$message_id = isset($posted['message_id'])?intval($posted['message_id']):0;

		CPM_Message::getInstance()->delete($message_id, true);

		echo json_encode(array(
				'success' => true,
				'url'     => cpm_url_message_index($project_id)
			));

		exit;
	}

	function get_message() {
		check_ajax_referer('cpm_nonce');
		$posted = $_POST;

		$message_id = isset($posted['message_id'])?intval($posted['message_id']):0;
		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;

		$message_obj = CPM_Message::getInstance();
		$message     = $message_obj->get($message_id);

		if ($message) {
			echo json_encode(array(
					'success'    => true,
					'id'         => $message_id,
					'project_id' => $project_id,
					'content'    => cpm_message_form($project_id, $message)
				));

			exit;
		}

		echo json_encode(array(
				'success' => false
			));

		exit;
	}
	function get_discussion() {
		check_ajax_referer('cpm_nonce');
		$posted = $_POST;

		$message_id = isset($posted['message_id'])?intval($posted['message_id']):0;
		$project_id = isset($posted['project_id'])?intval($posted['project_id']):0;

		// $message_obj = CPM_Message::getInstance();
		// $message = $message_obj->get( $message_id );
		$content = cpm_discussion_single($message_id, $project_id);
		// var_dump($content) ;
		if ($message_id) {
			echo json_encode(array(
					'success'    => true,
					'id'         => $message_id,
					'project_id' => $project_id,
					'content'    => $content,
				));

			exit;
		}

		echo json_encode(array(
				'success' => false
			));

		exit;
	}

	/**
	 * Get project activity
	 *
	 * @since 0.3.1
	 */
	function get_activity() {
		$project_id = isset($_GET['project_id'])?intval($_GET['project_id']):0;
		$offset     = isset($_GET['offset'])?intval($_GET['offset']):0;

		$activities = CPM_project::getInstance()->get_activity($project_id, array('offset' => $offset));
		if ($activities) {
			echo json_encode(array(
					'success' => true,
					'content' => cpm_activity_html($activities),
					'count'   => count($activities)
				));
		} else {
			echo json_encode(array(
					'success' => false
				));
		}
		exit;
	}

	/**
	 * Get projects activity
	 *
	 * @since 1.2
	 */
	function get_projects_activity() {
		$projects_id = isset($_GET['projects_id'])?$_GET['projects_id']:0;
		$offset      = isset($_GET['offset'])?intval($_GET['offset']):0;

		$activities = CPM_project::getInstance()->get_projects_activity($projects_id, array('offset' => $offset));

		if ($activities) {
			echo json_encode(array(
					'success' => true,
					'content' => cpm_projects_activity_html($activities),
					'count'   => count($activities)
				));
		} else {
			echo json_encode(array(
					'success' => false
				));
		}
		exit;
	}

	function autocomplete_user_role() {
		$users = get_users(array(
				'search'         => '*'.$_POST['term'].'*',
				'search_columns' => array('user_login', 'user_email', 'nicename'),
			));

		foreach ($users as $user) {
			$data[] = array(

				'label'      => $user->display_name,
				'_user_meta' => $this->create_user_meta($user->display_name, $user->ID),
			);
		}

		if (isset($data) && count($data)) {
			$user_info = json_encode($data);
		} else {
			$data[] = array(
				'label'      => '<div class="no-user-wrap"><p>'.__('No user found!', 'cpm').'</p> <span class="button-primary">'.__('Create a new user?', 'cpm').'</span></div>',
				'value'      => 'cpm_create_user',
				'_user_meta' => '',
			);
			$user_info = json_encode($data);
		}

		wp_send_json_success($user_info);
	}
	function mension_user() {

		$users = get_users(array(
				'search'         => '*'.$_POST['term'].'*',
				'search_columns' => array('user_login', 'user_email', 'nicename'),
			));

		foreach ($users as $user) {
			$data[] = array(
				'label' => $user->display_name
			);
		}

		if (isset($data) && count($data)) {
			$user_info = json_encode($data);
		} else {
			$data[] = array(
				'label' => '<p>'.__('No user found!', 'cpm').'</p>',
			);
			$user_info = json_encode($data);
		}

		wp_send_json_success($user_info);
	}

	function create_user_meta($display_name, $user_id) {
		$name = str_replace(' ', '_', $display_name);
		ob_start();
		?>
								            <tr>
								                <td><?php printf('%s', ucfirst($display_name));?></td>
								                <td>

								                    <input type="radio" id="cpm-manager-<?php echo $name;?>"  name="role[<?php echo $user_id;?>]" value="manager">
								                    <label for="cpm-manager-<?php echo $name;?>"><?php _e('Manager', 'cpm');
		?></label>

								                </td>
								                <td>

								                    <input type="radio" checked="checked" id="cpm-co-worker-<?php echo $name;?>" name="role[<?php echo $user_id;?>]" value="co_worker">
								                    <label for="cpm-co-worker-<?php echo $name;?>"><?php _e('Co-worker', 'cpm');
		?></label>
								                </td>
		<?php do_action('cpm_new_project_client_field', $user_id, $name);?>

								                <td><a hraf="#" class="cpm-del-proj-role cpm-assign-del-user"><span class="dashicons dashicons-trash"></span> <span class="title"><?php _e('Delete', 'cpm');?></span></a></td>
								            </tr>

		<?php
		return ob_get_clean();
	}

	function get_task_list() {
		$is_admin   = (isset($_POST['is_admin']))?sanitize_text_field($_POST['is_admin']):'yes';
		$project_id = (isset($_POST['project_id']))?sanitize_text_field($_POST['project_id']):0;
		$offset     = (isset($_POST['offset']))?sanitize_text_field($_POST['offset']):0;
		$privacy    = $_POST['privacy'] == 'yes'?true:false;
		$task_obj   = CPM_Task::getInstance();
		$lists      = $task_obj->get_task_lists($project_id, $offset, $privacy);
		$data       = '';

		if ('no' == $is_admin) {
			new CPM_Frontend_URLs();
		}

		//var_dump($list) ;
		if (empty($lists)) {
			echo json_encode(array(
					'success'  => false,
					'response' => '',
					'offset'   => intval($offset)
				));
		} else {
			foreach ($lists as $list) {
				$data .= cpm_task_list_html($list, $project_id);
			}

			echo json_encode(array(
					'success'  => true,
					'response' => $data,
					'offset'   => intval($offset+cpm_get_option('show_todo'))
				));
		}
		exit();

	}

	function get_todo_list() {
		$task_obj   = CPM_Task::getInstance();
		$is_admin   = isset($_POST['is_admin'])?sanitize_text_field($_POST['is_admin']):'yes';
		$list_id    = sanitize_text_field($_POST['list_id']);
		$project_id = sanitize_text_field($_POST['project_id']);
		$single     = sanitize_text_field($_POST['single']);
		$tasks      = $task_obj->get_tasks_by_access_role($list_id, $project_id);

		if ('no' == $is_admin) {
			new CPM_Frontend_URLs();
		}

		$tasks = cpm_tasks_filter($tasks);
		if (count($tasks['pending'])) {
			foreach ($tasks['pending'] as $task) {

				?>
				<li class="cpm-todo cpm-todo-openlist">
				<?php echo cpm_task_html($task, $project_id, $list_id);?>
				</li>
				<?php
			}
		}

		if ($single && count($tasks['completed'])) {
			foreach ($tasks['completed'] as $task) {
				?>
				<li class="cpm-todo cpm-todo-closelist">
				<?php echo cpm_task_html($task, $project_id, $list_id);?>
				</li>
				<?php
			}
		}

		exit();
	}

}