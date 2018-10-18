<?php 

namespace WeDevs\PM\Core\Notifications\Emails;

/**
* Email Notification When a new project created
*/
use WeDevs\PM\Core\Notifications\Email;

class Update_Project_Notification extends Email {
    
    function __construct() {

        add_action('pm_after_update_project_notification', array($this, 'trigger'), 10, 2 );
    }

    public function trigger( $project, $data ) {

        if ( isset( $data['notify_users'] ) && 'false' === $data['notify_users'] ){
            return ;
        }

        $template_name = apply_filters( 'pm_new_porject_email_template_path', $this->get_template_path( '/html/update-project.php' ) );
        $subject       = sprintf( __( '[%s] Updated Project: %s', 'wedevs-project-manager' ), $this->get_blogname(), $project['data']['title'] );
        $assignees     = $project['data']['assignees']['data'];
        $users         = array();


        foreach ($assignees as $assignee ) {
            if( $this->is_enable_user_notification( $assignee['id'] ) ) {
                if (  !$this->notify_manager()  && $assignee['roles']['data'][0]['slug'] == 'manager' ) {
                    if( $this->is_enable_user_notification_for_notification_type( $assignee['id'] , '_cpm_email_notification_update_project' ) ){
                        continue;
                    }
                }

                $users[] = $assignee['email'];
            }
        }

        if( !$users ){
            return ; 
        }
        
        $message = $this->get_content_html( $template_name, $project );

        $this->send( $users, $subject, $message );

    }

}