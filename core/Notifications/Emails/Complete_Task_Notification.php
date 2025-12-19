<?php

namespace WeDevs\PM\Core\Notifications\Emails;

/**
* Email Notification When a new project created
*/
use WeDevs\PM\Core\Notifications\Email;
use WeDevs\PM\Task\Models\Task;

class Complete_Task_Notification extends Email {

    function __construct() {

        add_action('pm_changed_task_status_notification', array($this, 'trigger'), 10, 2 );
    }

    public function trigger( $task, $old_value ) {

        $task_raw = wedevs_pm_get_tasks( [ 'id' => $task->id ] );
        $task_raw = $task_raw['data'];
        $task_raw['completed_by'] = wp_get_current_user(); 

        $task->load('assignees.assigned_user', 'projects.managers', 'creator', 'updater');
        $users = array();
        
        foreach ($task->assignees->toArray() as $assignee ) {
            if( $this->is_enable_user_notification( $assignee['assigned_to'] ) ){
                if( $this->is_enable_user_notification_for_notification_type( $assignee['assigned_to'], '_cpm_email_notification_complete_task' ) ){
                    $users[] = $assignee['assigned_user']['user_email'];
                }
            }
        }

        if ( $this->notify_manager() ) {
            foreach ( $task->projects->managers->toArray() as $u ) {
                if( !in_array($u['user_email'], $users )){
                    $users[] = $u['user_email'];
                }
            }
        }

        if ( !$users ) {
            return ;
        }

        $template_name = apply_filters( 'wedevs_pm_complete_task_email_template_path', $this->get_template_path( '/html/complete-task.php' ) );
        /* translators: 1: Blog name, 2: Task title, 3: Task status, 4: Project title */
        $subject = sprintf( __( '[%1$s] %2$s Task mark as %3$s in %4$s', 'wedevs-project-manager' ), $this->get_blogname(), $task->title, $task->status, $task->projects->title );
        $message = $this->get_content_html( $template_name, $task_raw );

        $this->send( $users, $subject, $message );

    }

}
