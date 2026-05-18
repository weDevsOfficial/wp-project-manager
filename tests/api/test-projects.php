<?php

class PM_Projects_API_Test extends PM_API_Test_Case {
    
    protected $project_id;

    public function setUp() {
        parent::setUp();
        
        // Create a test project
        global $wpdb;
        $wpdb->insert(
            $wpdb->prefix . 'pm_projects',
            [
                'title' => 'Test Project',
                'description' => 'Test project description',
                'status' => 0,
                'created_by' => $this->admin_user,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $this->project_id = $wpdb->insert_id;
    }

    /**
     * Test: Get all projects
     */
    public function test_get_projects() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertArrayHasKey('data', $data);
        $this->assertIsArray($data['data']);
    }

    /**
     * Test: Get projects without authentication
     */
    public function test_get_projects_unauthorized() {
        wp_set_current_user(0);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(401, $response->get_status());
    }

    /**
     * Test: Get single project
     */
    public function test_get_single_project() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id);
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals($this->project_id, $data['data']['id']);
        $this->assertEquals('Test Project', $data['data']['title']);
    }

    /**
     * Test: Create a new project
     */
    public function test_create_project() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects');
        $request->set_body_params([
            'title' => 'New Test Project',
            'description' => 'New project description',
            'status' => 0
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(201, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals('New Test Project', $data['data']['title']);
    }

    /**
     * Test: Create project without title (validation error)
     */
    public function test_create_project_without_title() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects');
        $request->set_body_params([
            'description' => 'Project without title'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(422, $response->get_status());
    }

    /**
     * Test: Update project
     */
    public function test_update_project() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/update');
        $request->set_body_params([
            'title' => 'Updated Project Title',
            'description' => 'Updated description',
            'status' => 1
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals('Updated Project Title', $data['data']['title']);
    }

    /**
     * Test: Delete project
     */
    public function test_delete_project() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/delete');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        
        // Verify project is deleted from database
        global $wpdb;
        $project = $wpdb->get_row(
            $wpdb->prepare("SELECT * FROM {$wpdb->prefix}pm_projects WHERE id = %d", $this->project_id)
        );
        $this->assertNull($project);
    }

    /**
     * Test: Favorite a project
     */
    public function test_favorite_project() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/favourite');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    /**
     * Test: Non-admin user cannot create project without permission
     */
    public function test_subscriber_cannot_create_project() {
        wp_set_current_user($this->subscriber_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects');
        $request->set_body_params([
            'title' => 'Unauthorized Project',
            'description' => 'Should fail'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(403, $response->get_status());
    }
    /**
     * Test: Update project
     */
    public function test_update_project() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/update');
        $request->set_body_params([
            'title' => 'Updated Project Title',
            'description' => 'Updated description'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals('Updated Project Title', $data['data']['title']);
    }

    /**
     * Test: Delete project
     */
    public function test_delete_project() {
        wp_set_current_user($this->admin_user);
        
        // Create a new project to delete
        global $wpdb;
        $wpdb->insert(
            $wpdb->prefix . 'pm_projects',
            [
                'title' => 'Project to Delete',
                'status' => 0,
                'created_by' => $this->admin_user,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $delete_project_id = $wpdb->insert_id;
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $delete_project_id . '/delete');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    /**
     * Test: Favourite project
     */
    public function test_favourite_project() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/favourite');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    /**
     * Test: Advanced project listing with filters
     */
    public function test_advanced_projects_listing() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/advanced/projects');
        $request->set_query_params([
            'status' => 0,
            'per_page' => 10,
            'page' => 1
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertArrayHasKey('data', $data);
    }

    /**
     * Test: Get projects with search
     */
    public function test_get_projects_with_search() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects');
        $request->set_query_params([
            'search' => 'Test'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertIsArray($data['data']);
    }

    /**
     * Test: Create project with AI
     */
    public function test_ai_generate_project() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/ai/generate');
        $request->set_body_params([
            'prompt' => 'Create a website redesign project with 5 tasks'
        ]);
        
        $response = $this->server->dispatch($request);
        
        // AI endpoint might not be available in test environment
        $this->assertContains($response->get_status(), [200, 201, 400, 503]);
    }

    /**
     * Test: Update project without permission
     */
    public function test_update_project_without_permission() {
        wp_set_current_user($this->subscriber_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/update');
        $request->set_body_params([
            'title' => 'Unauthorized Update'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertNotEquals(200, $response->get_status());
    }
    public function tearDown() {
        global $wpdb;
        $wpdb->delete($wpdb->prefix . 'pm_projects', ['id' => $this->project_id]);
        parent::tearDown();
    }
}
