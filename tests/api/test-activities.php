<?php

class PM_Activities_API_Test extends PM_API_Test_Case {
    
    public function test_get_activities() {
        wp_set_current_user($this->admin_user);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/1/activities');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(200, $response->get_status());
    }

    public function test_get_activities_unauthorized() {
        wp_set_current_user(0);
        
        $request = new WP_REST_Request('GET', '/pm/v2/projects/1/activities');
        $response = $this->server->dispatch($request);
        
        $this->assertEquals(401, $response->get_status());
    }
}