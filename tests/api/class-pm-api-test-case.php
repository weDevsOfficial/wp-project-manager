<?php

class PM_API_Test_Case extends WP_Test_REST_TestCase {
    protected $server;
    protected $namespaces = ['pm/v2'];
    protected $admin_user;
    protected $editor_user;
    protected $subscriber_user;

    public function setUp() {
        parent::setUp();
        
        global $wp_rest_server;
        $this->server = $wp_rest_server = new WP_REST_Server;
        do_action( 'rest_api_init' );

        // Create test users
        $this->admin_user = $this->factory->user->create([
            'role' => 'administrator'
        ]);

        $this->editor_user = $this->factory->user->create([
            'role' => 'editor'
        ]);

        $this->subscriber_user = $this->factory->user->create([
            'role' => 'subscriber'
        ]);
    }

    public function tearDown() {
        parent::tearDown();
        wp_delete_user($this->admin_user);
        wp_delete_user($this->editor_user);
        wp_delete_user($this->subscriber_user);
    }
}