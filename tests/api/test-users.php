<?php

class PM_User_API_Test extends PM_API_Test_Case {
    
    protected $project_id;

    public function setUp() {
        parent::setUp();
        
        global $wpdb;
        
        // Create a test project
        $wpdb->insert(
            $wpdb->prefix . 'pm_projects',
            [
                'title' => 'Test Project',
                'description' => 'Test project for user management',
                'status' => 0,
                'created_by' => $this->admin_user,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $this->project_id = $wpdb->insert_id;

        // Add editor user to the project
        $wpdb->insert(
            $wpdb->prefix . 'pm_assignees',
            [
                'assigned_to' => $this->editor_user,
                'assignable_id' => $this->project_id,
                'assignable_type' => 'project',
                'project_id' => $this->project_id,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
    }

    /**
     * Test: Get all users in a project
     */
    public function test_get_project_users() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/users');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertArrayHasKey('data', $data);
        $this->assertIsArray($data['data']);
    }

    /**
     * Test: Add users to project
     */
    public function test_add_users_to_project() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/users');
        $request->set_body_params([
            'users' => [$this->subscriber_user],
            'role_id' => 1
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(201, $response->get_status());
    }

    /**
     * Test: Remove user from project
     */
    public function test_remove_user_from_project() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/users/' . $this->editor_user . '/delete');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    /**
     * Test: Update user role in project
     */
    public function test_update_user_role() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/users/' . $this->editor_user . '/update-role');
        $request->set_body_params([
            'role_id' => 2
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    /**
     * Test: Get user profile
     */
    public function test_get_user_profile() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/users/' . $this->admin_user);
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals($this->admin_user, $data['data']['id']);
    }

    /**
     * Test: Get current user info
     */
    public function test_get_current_user() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/users/me');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals($this->admin_user, $data['data']['id']);
    }

    /**
     * Test: Search users
     */
    public function test_search_users() {
        wp_set_current_user($this->admin_user);
        
        $admin_data = get_userdata($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/users/search');
        $request->set_query_params([
            'search' => $admin_data->user_login
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertIsArray($data['data']);
    }

    /**
     * Test: Get users by role
     */
    public function test_get_users_by_role() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/users');
        $request->set_query_params([
            'role' => 'administrator'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertIsArray($data['data']);
    }

    /**
     * Test: Non-admin cannot add users to project
     */
    public function test_non_admin_cannot_add_users() {
        wp_set_current_user($this->subscriber_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/users');
        $request->set_body_params([
            'users' => [$this->editor_user]
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertNotEquals(201, $response->get_status());
    }

    public function tearDown() {
        global $wpdb;
        $wpdb->delete($wpdb->prefix . 'pm_assignees', [
            'assignable_id' => $this->project_id,
            'assignable_type' => 'project'
        ]);
        $wpdb->delete($wpdb->prefix . 'pm_projects', ['id' => $this->project_id]);
        parent::tearDown();
    }
}
