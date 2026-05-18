<?php

class PM_Task_Lists_API_Test extends PM_API_Test_Case {
    
    protected $project_id;
    protected $task_list_id;

    public function setUp() {
        parent::setUp();
        
        global $wpdb;
        
        // Create a test project
        $wpdb->insert(
            $wpdb->prefix . 'pm_projects',
            [
                'title' => 'Test Project',
                'description' => 'Test project for task lists',
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
                'description' => 'Test task list description',
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
    }

    /**
     * Test: Get all task lists in a project
     */
    public function test_get_task_lists() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/task-lists');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertArrayHasKey('data', $data);
        $this->assertIsArray($data['data']);
    }

    /**
     * Test: Get single task list
     */
    public function test_get_single_task_list() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/task-lists/' . $this->task_list_id);
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals($this->task_list_id, $data['data']['id']);
        $this->assertEquals('Test Task List', $data['data']['title']);
    }

    /**
     * Test: Create a new task list
     */
    public function test_create_task_list() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/task-lists');
        $request->set_body_params([
            'title' => 'New Task List',
            'description' => 'New task list description',
            'status' => 0
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(201, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals('New Task List', $data['data']['title']);
    }

    /**
     * Test: Update task list
     */
    public function test_update_task_list() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/task-lists/' . $this->task_list_id . '/update');
        $request->set_body_params([
            'title' => 'Updated Task List',
            'description' => 'Updated description'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals('Updated Task List', $data['data']['title']);
    }

    /**
     * Test: Delete task list
     */
    public function test_delete_task_list() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/task-lists/' . $this->task_list_id . '/delete');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        
        // Verify it's deleted from database
        global $wpdb;
        $result = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$wpdb->prefix}pm_boards WHERE id = %d",
            $this->task_list_id
        ));
        $this->assertNull($result);
    }

    /**
     * Test: Task list sorting
     */
    public function test_task_list_sorting() {
        wp_set_current_user($this->admin_user);
        
        // Create another task list
        global $wpdb;
        $wpdb->insert(
            $wpdb->prefix . 'pm_boards',
            [
                'title' => 'Second Task List',
                'project_id' => $this->project_id,
                'type' => 'task_list',
                'status' => 0,
                'order' => 1,
                'created_by' => $this->admin_user,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $second_list_id = $wpdb->insert_id;
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/lists/sorting');
        $request->set_body_params([
            'lists' => [
                ['id' => $second_list_id, 'order' => 0],
                ['id' => $this->task_list_id, 'order' => 1]
            ]
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    /**
     * Test: Search task lists
     */
    public function test_search_task_lists() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/lists/search');
        $request->set_query_params(['search' => 'Test']);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertIsArray($data['data']);
    }

    /**
     * Test: Create task list without permission
     */
    public function test_create_task_list_without_permission() {
        wp_set_current_user($this->subscriber_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/task-lists');
        $request->set_body_params([
            'title' => 'Unauthorized Task List'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertNotEquals(201, $response->get_status());
    }

    public function tearDown() {
        global $wpdb;
        $wpdb->delete($wpdb->prefix . 'pm_boards', ['id' => $this->task_list_id]);
        $wpdb->delete($wpdb->prefix . 'pm_projects', ['id' => $this->project_id]);
        parent::tearDown();
    }
}
