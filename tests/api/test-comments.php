<?php

class PM_Comments_API_Test extends PM_API_Test_Case {
    
    protected $project_id;
    protected $task_id;
    protected $comment_id;

    public function setUp() {
        parent::setUp();
        
        global $wpdb;
        
        // Create a test project
        $wpdb->insert(
            $wpdb->prefix . 'pm_projects',
            [
                'title' => 'Test Project',
                'description' => 'Test project for comments',
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
                'description' => 'Test task',
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

        // Create a test comment
        $wpdb->insert(
            $wpdb->prefix . 'pm_comments',
            [
                'content' => 'Test comment',
                'commentable_id' => $this->task_id,
                'commentable_type' => 'task',
                'project_id' => $this->project_id,
                'created_by' => $this->admin_user,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $this->comment_id = $wpdb->insert_id;
    }

    /**
     * Test: Get all comments in a project
     */
    public function test_get_comments() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/comments');
        $request->set_query_params([
            'commentable_id' => $this->task_id,
            'commentable_type' => 'task'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertArrayHasKey('data', $data);
        $this->assertIsArray($data['data']);
    }

    /**
     * Test: Get single comment
     */
    public function test_get_single_comment() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/comments/' . $this->comment_id);
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals($this->comment_id, $data['data']['id']);
    }

    /**
     * Test: Create a new comment
     */
    public function test_create_comment() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/comments');
        $request->set_body_params([
            'content' => 'New test comment',
            'commentable_id' => $this->task_id,
            'commentable_type' => 'task'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(201, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals('New test comment', $data['data']['content']['content']);
    }

    /**
     * Test: Update comment
     */
    public function test_update_comment() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/comments/' . $this->comment_id);
        $request->set_body_params([
            'content' => 'Updated comment content',
            'commentable_id' => $this->task_id,
            'commentable_type' => 'task'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals('Updated comment content', $data['data']['content']['content']);
    }

    /**
     * Test: Delete comment
     */
    public function test_delete_comment() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/comments/' . $this->comment_id . '/delete');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        
        // Verify it's deleted from database
        global $wpdb;
        $result = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$wpdb->prefix}pm_comments WHERE id = %d",
            $this->comment_id
        ));
        $this->assertNull($result);
    }

    /**
     * Test: Create comment without content (validation error)
     */
    public function test_create_comment_without_content() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/comments');
        $request->set_body_params([
            'commentable_id' => $this->task_id,
            'commentable_type' => 'task'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertNotEquals(201, $response->get_status());
    }

    /**
     * Test: Update comment by different user (permission error)
     */
    public function test_update_comment_different_user() {
        wp_set_current_user($this->editor_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/comments/' . $this->comment_id);
        $request->set_body_params([
            'content' => 'Unauthorized update',
            'commentable_id' => $this->task_id,
            'commentable_type' => 'task'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertNotEquals(200, $response->get_status());
    }

    public function tearDown() {
        global $wpdb;
        $wpdb->delete($wpdb->prefix . 'pm_comments', ['id' => $this->comment_id]);
        $wpdb->delete($wpdb->prefix . 'pm_boards', ['id' => $this->task_id]);
        $wpdb->delete($wpdb->prefix . 'pm_projects', ['id' => $this->project_id]);
        parent::tearDown();
    }
}
