<?php

class PM_Files_API_Test extends PM_API_Test_Case {
    
    protected $project_id;
    protected $file_id;
    protected $attachment_id;

    public function setUp() {
        parent::setUp();
        
        global $wpdb;
        
        // Create a test project
        $wpdb->insert(
            $wpdb->prefix . 'pm_projects',
            [
                'title' => 'Test Project',
                'description' => 'Test project for files',
                'status' => 0,
                'created_by' => $this->admin_user,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $this->project_id = $wpdb->insert_id;

        // Create a test attachment (WordPress media)
        $this->attachment_id = $this->factory->attachment->create_upload_object(
            ABSPATH . 'wp-content/plugins/wp-project-manager/tests/_data/.gitkeep'
        );

        // Create a test file record
        $wpdb->insert(
            $wpdb->prefix . 'pm_files',
            [
                'fileable_id' => $this->project_id,
                'fileable_type' => 'project',
                'attachment_id' => $this->attachment_id,
                'type' => 'file',
                'created_by' => $this->admin_user,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]
        );
        $this->file_id = $wpdb->insert_id;
    }

    /**
     * Test: Get all files in a project
     */
    public function test_get_files() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/files');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertArrayHasKey('data', $data);
        $this->assertIsArray($data['data']);
    }

    /**
     * Test: Get single file
     */
    public function test_get_single_file() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/files/' . $this->file_id);
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        $data = $response->get_data();
        $this->assertEquals($this->file_id, $data['data']['id']);
    }

    /**
     * Test: Upload a new file
     */
    public function test_upload_file() {
        wp_set_current_user($this->admin_user);
        
        // Create a new attachment for testing
        $test_attachment_id = $this->factory->attachment->create_upload_object(
            ABSPATH . 'wp-content/plugins/wp-project-manager/tests/_data/.gitkeep'
        );
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/files');
        $request->set_body_params([
            'attachment_id' => $test_attachment_id,
            'fileable_id' => $this->project_id,
            'fileable_type' => 'project',
            'type' => 'file'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(201, $response->get_status());
    }

    /**
     * Test: Rename file
     */
    public function test_rename_file() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/files/' . $this->file_id . '/update');
        $request->set_body_params([
            'title' => 'Renamed File'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    /**
     * Test: Delete file
     */
    public function test_delete_file() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('POST', '/pm/v2/projects/' . $this->project_id . '/files/' . $this->file_id . '/delete');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
        
        // Verify it's deleted from database
        global $wpdb;
        $result = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$wpdb->prefix}pm_files WHERE id = %d",
            $this->file_id
        ));
        $this->assertNull($result);
    }

    /**
     * Test: Get files without permission
     */
    public function test_get_files_without_permission() {
        wp_set_current_user($this->subscriber_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/' . $this->project_id . '/files');
        $response = $this->server->dispatch($request);
        
        $this->assertNotEquals(200, $response->get_status());
    }

    /**
     * Test: Get MIME type icon
     */
    public function test_get_mime_type_icon() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/get-mime-type-icon');
        $request->set_query_params([
            'mime_type' => 'image/png'
        ]);
        
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    public function tearDown() {
        global $wpdb;
        $wpdb->delete($wpdb->prefix . 'pm_files', ['id' => $this->file_id]);
        $wpdb->delete($wpdb->prefix . 'pm_projects', ['id' => $this->project_id]);
        wp_delete_attachment($this->attachment_id, true);
        parent::tearDown();
    }
}
