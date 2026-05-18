<?php

class PM_Tasks_API_Test extends PM_API_Test_Case {
    
    protected $project_id;
    protected $task_list_id;
    protected $task_id;

    public function setUp() {
        parent::setUp();
        
        global $wpdb;
        
        // Create a test project
        $wpdb->insert(
            $wpdb->prefix . 'pm_projects',
            [
                'title' => 'Test Project',
                'description' => 'Test project for tasks',
                'status' => 0,
                'created_by' => $this->admin_user,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $this->project_id = $wpdb->insert_id;

        // Create a test task list
        $wpdb->insert(
            $wpdb->prefix . 'pm_boards',
            [
                'title' => 'Test Task List',
                'description' => 'Test task list',
                'project_id' => $this->project_id,
                'type' => 'task_list',
                'status' => 0,
                'order' => 0,
                'created_by' => $this->admin_user,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $this->task_list_id = $wpdb->insert_id;

        // Create a test task
        $wpdb->insert(
            $wpdb->prefix . 'pm_boards',
            [
                'title' => 'Test Task',
                'description' => 'Test task description',
                'project_id' => $this->project_id,
                'type' => 'task',
                'status' => 0,
                'order' => 0,
                'parent_id' => $this->task_list_id,
                'created_by' => $this->admin_user,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $this->task_id = $wpdb->insert_id;
    }

    /**
     * Test: Get all tasks in a project
     */
    public function test_get_tasks() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/tasks');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertArrayHasKey('data', $data);
    }

    /**
     * Test: Get single task
     */
    public function test_get_single_task() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/tasks/' . $this->task_id);
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals($this->task_id, $data['data']['id']);
        $this->assertEquals('Test Task', $data['data']['title']);
    }

    /**
     * Test: Create a new task
     */
    public function test_create_task() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/tasks');
        $request->set_body_params([
            'title' => 'New Test Task',
            'description' => 'New task description',
            'task_list_id' => $this->task_list_id,
            'status' => 0
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(201, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals('New Test Task', $data['data']['title']);
    }

    /**
     * Test: Create task without title (validation error)
     */
    public function test_create_task_without_title() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/tasks');
        $request->set_body_params([
            'description' => 'Task without title',
            'task_list_id' => $this->task_list_id
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(422, $response->get_status());
    }

    /**
     * Test: Update task
     */
    public function test_update_task() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/tasks/' . $this->task_id . '/update');
        $request->set_body_params([
            'title' => 'Updated Task Title',
            'description' => 'Updated description',
            'status' => 1
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals('Updated Task Title', $data['data']['title']);
    }

    /**
     * Test: Change task status
     */
    public function test_change_task_status() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/tasks/' . $this->task_id . '/change-status');
        $request->set_body_params([
            'status' => 1
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    /**
     * Test: Delete task
     */
    public function test_delete_task() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/tasks/' . $this->task_id . '/delete');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    /**
     * Test: Attach users to task
     */
    public function test_attach_users_to_task() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('PUT', '/pm/v2/projects/' . $this->project_id . '/tasks/' . $this->task_id . '/attach-users');
        $request->set_body_params([
            'users' => [$this->editor_user]
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    /**
     * Test: Detach users from task
     */
    public function test_detach_users_from_task() {
        wp_set_current_user($this->admin_user);
        
        // First attach user
        global $wpdb;
        $wpdb->insert(
            $wpdb->prefix . 'pm_assignees',
            [
                'assigned_to' => $this->editor_user,
                'assignable_id' => $this->task_id,
                'assignable_type' => 'task',
                'project_id' => $this->project_id
            ]
        );
        
        $request = new WP_REST_Request('PUT', '/pm/v2/projects/' . $this->project_id . '/tasks/' . $this->task_id . '/detach-users');
        $request->set_body_params([
            'users' => [$this->editor_user]
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    /**
     * Test: Filter tasks
     */
    public function test_filter_tasks() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/tasks/filter');
        $request->set_body_params([
            'status' => 0,
            'assigned_to' => $this->admin_user
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    /**
     * Test: Unauthorized user cannot access tasks
     */
    public function test_unauthorized_access_to_tasks() {
        wp_set_current_user(0);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/tasks');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(401, $response->get_status());
    }

    public function tearDown() {
        global $wpdb;
        $wpdb->delete($wpdb->prefix . 'pm_boards', ['id' => $this->task_id]);
        $wpdb->delete($wpdb->prefix . 'pm_boards', ['id' => $this->task_list_id]);
        $wpdb->delete($wpdb->prefix . 'pm_projects', ['id' => $this->project_id]);
        parent::tearDown();
    }
}
