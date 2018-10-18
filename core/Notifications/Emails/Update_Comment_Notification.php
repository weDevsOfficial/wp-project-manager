<?php 

namespace WeDevs\PM\Core\Notifications\Emails;

/**
* Email Notification When a new project created
*/
use WeDevs\PM\Core\Notifications\Email;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Comment\Models\Comment;

class Update_Comment_Notification extends Email {
    
    function __construct() {

        add_action('pm_after_update_comment_notification', array($this, 'trigger'), 10, 2 );
    }

    public function trigger( $commentData, $request ) {
        
        if ( empty( $request['notify_users'] ) ){
            return ;
        }

        $project      = Project::with('assignees', 'managers')->find( $request['project_id'] );
        $comment      = Comment::with($request['commentable_type'])->find($commentData['data']['id']);
        $users        = array();
        $notify_users = explode( ',',  $request['notify_users'] );

        foreach ($notify_users as $u ) {
            if( $this->is_enable_user_notification( $u ) ){
                if( $this->is_enable_user_notification_for_notification_type( $u , '_cpm_email_notification_update_comment' ) ){
                    $users[] = $project->assignees->where('ID', $u)->first()->user_email;
                }
            }
        }

        if(  $this->notify_manager() ){
            foreach ($project->managers->toArray() as $u) {
                if(!in_array($u['user_email'], $users)){
                    $users[] = $u['user_email'];
                }
            }
        }

        if( !$users ){
            return ; 
        }
        $title         = $comment->{ $request['commentable_type'] }->title;
        $template_name = apply_filters( 'pm_update_comment_email_template_path', $this->get_template_path( '/html/update-comment.php' ) );
        $subject       = sprintf( __( '[%s][%s] Update Comment on: %s', 'wedevs-project-manager' ), $this->get_blogname(), $project->title , $title );
        
        if( $request['commentable_type'] == 'discussion_board' ){
            $type = __( 'Message', 'wedevs-project-manager' );
            $comment_link = $this->pm_link() . '#/projects/'.$project->id.'/discussions/'.$request['commentable_id'];
        }elseif ( $request['commentable_type'] == 'task_list' ) {
            $type = __( 'Task List', 'wedevs-project-manager' );
            $comment_link = $this->pm_link() . '#/projects/'.$project->id.'/task-lists/'.$request['commentable_id'];
        }else{
            $type        = __( 'Task', 'wedevs-project-manager' );
            $comment_link = $this->pm_link() . '#projects/'.$project->id. '/task-lists/tasks/' . $request['commentable_id'];
        }

       
        
        $message = $this->get_content_html( $template_name, [
            'id'                => $commentData['data']['id'],
            'content'           => $request['content'],
            'updater'           => $commentData['data']['updater']['data']['display_name'],
            'commnetable_title' => $title,
            'commnetable_type'  => $type,
            'comment_link'      => $comment_link
        ] );

        $this->send( $users, $subject, $message );

    }

}