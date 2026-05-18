<?php

class PM_Milestones_API_Test extends PM_API_Test_Case {
    
    protected $project_id;
    protected $milestone_id;

    public function setUp() {
        parent::setUp();
        
        global $wpdb;
        
        // Create a test project
        $wpdb->insert(
            $wpdb->prefix . 'pm_projects',
            [
                'title' => 'Test Project',
                'description' => 'Test project for milestones',
                'status' => 0,
                'created_by' => $this->admin_user,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $this->project_id = $wpdb->insert_id;

        // Create a test milestone
        $wpdb->insert(
            $wpdb->prefix . 'pm_boards',
            [
                'title' => 'Test Milestone',
                'description' => 'Test milestone description',
                'project_id' => $this->project_id,
                'type' => 'milestone',
                'status' => 0,
                'order' => 0,
                'created_by' => $this->admin_user,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $this->milestone_id = $wpdb->insert_id;
    }

    /**
     * Test: Get all milestones in a project
     */
    public function test_get_milestones() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/milestones');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertArrayHasKey('data', $data);
        $this->assertIsArray($data['data']);
    }

    /**
     * Test: Get single milestone
     */
    public function test_get_single_milestone() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/milestones/' . $this->milestone_id);
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals($this->milestone_id, $data['data']['id']);
        $this->assertEquals('Test Milestone', $data['data']['title']);
    }

    /**
     * Test: Create a new milestone
     */
    public function test_create_milestone() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/milestones');
        $request->set_body_params([
            'title' => 'New Milestone',
            'description' => 'New milestone description',
            'start_date' => date('Y-m-d'),
            'end_date' => date('Y-m-d', strtotime('+30 days'))
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(201, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals('New Milestone', $data['data']['title']);
    }

    /**
     * Test: Update milestone
     */
    public function test_update_milestone() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/milestones/' . $this->milestone_id . '/update');
        $request->set_body_params([
            'title' => 'Updated Milestone',
            'description' => 'Updated milestone description'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals('Updated Milestone', $data['data']['title']);
    }

    /**
     * Test: Delete milestone
     */
    public function test_delete_milestone() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/milestones/' . $this->milestone_id . '/delete');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        
        // Verify it's deleted from database
        global $wpdb;
        $result = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$wpdb->prefix}pm_boards WHERE id = %d",
            $this->milestone_id
        ));
        $this->assertNull($result);
    }

    /**
     * Test: Set milestone privacy
     */
    public function test_milestone_privacy() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/milestones/privacy/' . $this->milestone_id);
        $request->set_body_params([
            'privacy' => 1
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    /**
     * Test: Create milestone without title (validation error)
     */
    public function test_create_milestone_without_title() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/milestones');
        $request->set_body_params([
            'description' => 'Milestone without title'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertNotEquals(201, $response->get_status());
    }

    /**
     * Test: Create milestone without permission
     */
    public function test_create_milestone_without_permission() {
        wp_set_current_user($this->subscriber_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/milestones');
        $request->set_body_params([
            'title' => 'Unauthorized Milestone'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertNotEquals(201, $response->get_status());
    }

    public function tearDown() {
        global $wpdb;
        $wpdb->delete($wpdb->prefix . 'pm_boards', ['id' => $this->milestone_id]);
        $wpdb->delete($wpdb->prefix . 'pm_projects', ['id' => $this->project_id]);
        parent::tearDown();
    }
}
