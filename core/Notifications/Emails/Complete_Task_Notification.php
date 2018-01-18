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


        $task->load('assignees.assigned_user', 'projects.managers', 'creator', 'updater');
        $users = array();
        foreach ($task->assignees as $assignee ) {
            if( $this->is_enable_user_notification( $assignee->assignee_to ) ){
                $users[] = $assignee->assigned_user->user_email;
            }
        }

        if( apply_filters( 'notify_project_managers', true ) ){
            foreach ( $task->projects->managers as $u ) {
                if( !in_array($u->user_email, $users )){
                    $users[] = $u->user_email;
                }
            }
        }

        if( !$users ){
            return ; 
        }

        $template_name = apply_filters( 'pm_complete_task_email_template_path', $this->get_template_path( '/html/complete-task.php' ) );
        $subject = sprintf( __( '[%s] %s Task status has changed in %s', 'pm' ), $this->get_blogname(), $task->title, $task->projects->title );


        $message = $this->get_content_html( $template_name, [
            'id'         => $task->id,
            'title'      => $task->title,
            'project_id' => $task->project_id,
            'creator'    => $task->creator->display_name,
            'due_date'   => $task->due_date,
            'old_value'  => Task::$status[$old_value],
            'changed_by' => $task->updater->display_name
        ] );

        $this->send( $users, $subject, $message );

    }

}