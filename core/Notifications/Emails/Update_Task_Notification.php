<?php 

namespace WeDevs\PM\Core\Notifications\Emails;

/**
* Email Notification When a new project created
*/
use WeDevs\PM\Core\Notifications\Email;

class Update_Task_Notification extends Email {
    
    function __construct() {

        add_action('pm_after_update_task_notification', array($this, 'trigger'), 10, 2 );
    }

    public function trigger( $task, $data ) {

        $task->load('assignees.assigned_user', 'projects', 'creator');
        $users = array();
        foreach ($task->assignees as $assignee ) {
            if( $this->is_enable_user_notification( $assignee->assignee_to ) ){
                $users[] = $assignee->assigned_user->user_email;
            }
        }

        if( !$users ){
            return ; 
        }

        $template_name = apply_filters( 'pm_new_task_email_template_path', $this->get_template_path( '/html/new-task.php' ) );
        $subject = sprintf( __( '[%s][%s] Update Task Assigned: %s', 'pm' ), $this->get_blogname(), $task->projects->title, $task->title );


        $message = $this->get_content_html( $template_name, [
            'id'          => $task->id,
            'title'       => $task->title,
            'description' => $task->description,
            'project_id'  => $task->project_id,
            'creator'     => $task->creator->display_name,
            'due_date'    => format_date( $task->due_date ),
            'start_at'    => empty( $task->start_at ) ? null: format_date( $task->start ),
        ] );

        $this->send( $users, $subject, $message );

    }

}