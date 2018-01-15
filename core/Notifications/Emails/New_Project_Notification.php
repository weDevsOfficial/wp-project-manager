<?php 

namespace WeDevs\PM\Core\Notifications\Emails;

/**
* Email Notification When a new project created
*/
use WeDevs\PM\Core\Notifications\Email;

class New_Project_Notification extends Email {
    
    function __construct() {
        add_action('pm_after_new_project_notification', array($this, 'trigger'), 10, 2 );
    }

    public function trigger( $project, $data ) {
        error_log("project has created");
        error_log(json_encode($project));
    }

}