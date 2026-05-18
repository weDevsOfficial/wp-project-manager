<?php

class PM_Activities_API_Test extends PM_API_Test_Case {
    
    protected $project_id;
    protected $task_id;
    protected $activity_id;

    public function setUp() {
        parent::setUp();
        
        global $wpdb;
        
        // Create a test project
        $wpdb->insert(
            $wpdb->prefix . 'pm_projects',
            [
                'title' => 'Test Project',
                'description' => 'Test project for activities',
                'status' => 0,
                'created_by' => $this->admin_user,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $this->project_id = $wpdb->insert_id;

        // Create a test task
        $wpdb->insert(
            $wpdb->prefix . 'pm_boards',
            [
                'title' => 'Test Task',
                'project_id' => $this->project_id,
                'type' => 'task',
                'status' => 0,
                'order' => 0,
                'created_by' => $this->admin_user,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $this->task_id = $wpdb->insert_id;

        // Create a test activity
        $wpdb->insert(
            $wpdb->prefix . 'pm_activities',
            [
                'actor_id' => $this->admin_user,
                'action' => 'created',
                'action_type' => 'task',
                'resource_id' => $this->task_id,
                'resource_type' => 'task',
                'project_id' => $this->project_id,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $this->activity_id = $wpdb->insert_id;
    }
    
    public function test_get_activities() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/activities');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertArrayHasKey('data', $data);
        $this->assertIsArray($data['data']);
    }

    public function test_get_activities_unauthorized() {
        wp_set_current_user(0);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/activities');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(401, $response->get_status());
    }
    
    /**
     * Test: Get activities with pagination
     */
    public function test_get_activities_with_pagination() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/activities');
        $request->set_query_params([
            'per_page' => 10,
            'page' => 1
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertArrayHasKey('data', $data);
    }

    /**
     * Test: Get activities by resource type
     */
    public function test_get_activities_by_resource_type() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/activities');
        $request->set_query_params([
            'resource_type' => 'task'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertIsArray($data['data']);
    }

    /**
     * Test: Get activities by resource ID
     */
    public function test_get_activities_by_resource_id() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/activities');
        $request->set_query_params([
            'resource_id' => $this->task_id,
            'resource_type' => 'task'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertNotEmpty($data['data']);
    }
    
    public function tearDown() {
        global $wpdb;
        $wpdb->delete($wpdb->prefix . 'pm_activities', ['id' => $this->activity_id]);
        $wpdb->delete($wpdb->prefix . 'pm_boards', ['id' => $this->task_id]);
        $wpdb->delete($wpdb->prefix . 'pm_projects', ['id' => $this->project_id]);
        parent::tearDown();
    }
}
