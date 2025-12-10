<?php

namespace WeDevs\PM\Activity\Transformers;

use League\Fractal\TransformerAbstract;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\User\Transformers\User_Transformer;
use WeDevs\PM\Project\Transformers\Project_Transformer;

class Activity_Transformer extends TransformerAbstract {

    protected $defaultIncludes = [
        'actor', 'project'
    ];

    public function transform( Activity $item ) {
        if ( $item->action == 'cpm_migration' ){
            $message = $item->meta['text'];
        }else {
            $message = $this->get_activity_message_by_action( $item->action );
        }

        return [
            'id'            => (int) $item->id,
            'message'       => $message,
            'action'        => $item->action,
            'action_type'   => $item->action_type,
            'meta'          => $this->parse_meta( $item ),
            'committed_at'  => wedevs_pm_format_date( $item->created_at ),
            'resource_id'   => $item->resource_id,
            'resource_type' => $item->resource_type,
        ];
    }

    public function includeActor( Activity $item ) {
        $actor = $item->actor;

        return $this->item( $actor, new User_Transformer );
    }

    public function includeProject( Activity $item ) {
        $project = $item->project;
        $project_transformer = new Project_Transformer;
        $project_transformer = $project_transformer->setDefaultIncludes([]);
        return $this->item ( $project, $project_transformer);
    }

    private function parse_meta( Activity $activity ) {
        $parsed_meta = [];

        switch ( $activity->resource_type ) {
            case 'task':
                $parsed_meta = $this->parse_meta_for_task( $activity );
                break;

            case 'task_list':
                $parsed_meta = $this->parse_meta_for_task_list( $activity );
                break;

            case 'discussion_board':
                $parsed_meta = $this->parse_meta_for_discussion_board( $activity );
                break;

            case 'milestone':
                $parsed_meta = $this->parse_meta_for_milestone( $activity );
                break;

            case 'project':
                $parsed_meta = $this->parse_meta_for_project( $activity );
                break;

            case 'comment':
                $parsed_meta = $this->parse_meta_for_comment( $activity );
                break;

            case 'file':
                $parsed_meta = $this->parse_meta_for_file( $activity );
                break;
        }

        return $parsed_meta;
    }

    private function parse_meta_for_task( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_task_list( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_discussion_board( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_milestone( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_project( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_file( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_comment( Activity $activity ) {
        $meta = [];

        if ( ! is_array( $activity ) ) {
            return $meta;
        }

        foreach ($activity->meta as $key => $value) {
            if ( $key == 'commentable_type' && $value == 'file' ) {
                $trans_commentable_type = $this->get_resource_type_translation( $value );
                $meta['commentable_id'] = $activity->meta['commentable_id'];
                $meta['commentable_type'] = $activity->meta['commentable_type'];
                $meta['trans_commentable_type'] = $trans_commentable_type;
                $meta['commentable_title'] = $trans_commentable_type;
            } elseif ( $key == 'commentable_type' ) {
                $trans_commentable_type = $this->get_resource_type_translation( $value );
                $meta['commentable_id'] = $activity->meta['commentable_id'];
                $meta['commentable_type'] = $activity->meta['commentable_type'];
                $meta['trans_commentable_type'] = $trans_commentable_type;
                $meta['commentable_title'] = $activity->meta['commentable_title'];
            }
        }

        return $meta;
    }

    /**
     * Format activity message by replacing placeholders with actual values
     * 
     * @param array|string $message_data Array containing [message_template, placeholder_paths] or empty string
     * @param Activity $item Activity item with actor, meta, etc.
     * @param array $parsed_meta Parsed meta data array
     * @return string Formatted message with placeholders replaced
     */
    private function format_activity_message( $message_data, $item, $parsed_meta = array() ) {
        // Handle empty or invalid message data
        if ( empty( $message_data ) || ! is_array( $message_data ) ) {
            return '';
        }

        list( $message_template, $placeholder_paths ) = $message_data;

        // If no placeholders, return the template as-is
        if ( empty( $placeholder_paths ) || ! is_array( $placeholder_paths ) ) {
            return $message_template;
        }

        // Prepare the data structure for accessing nested values
        $actor_data = array( 'display_name' => '', 'user_nicename' => '' );
        if ( isset( $item->actor ) && is_object( $item->actor ) ) {
            $actor_data['display_name'] = isset( $item->actor->display_name ) ? $item->actor->display_name : '';
            $actor_data['user_nicename'] = isset( $item->actor->user_nicename ) ? $item->actor->user_nicename : '';
        }

        $data = array(
            'actor' => array( 'data' => $actor_data ),
            'meta' => ! empty( $parsed_meta ) ? $parsed_meta : ( is_array( $item->meta ) ? $item->meta : array() ),
        );

        // Extract values for each placeholder path
        $values = array();
        foreach ( $placeholder_paths as $path ) {
            $values[] = $this->get_nested_value( $data, $path );
        }

        // Format the message using sprintf
        return vsprintf( $message_template, $values );
    }

    /**
     * Get nested value from array using dot notation path
     * 
     * @param array $data Data array
     * @param string $path Dot-separated path (e.g., 'actor.data.display_name')
     * @return string Value at the path or empty string if not found
     */
    private function get_nested_value( $data, $path ) {
        $keys = explode( '.', $path );
        $value = $data;

        foreach ( $keys as $key ) {
            if ( is_array( $value ) && isset( $value[$key] ) ) {
                $value = $value[$key];
            } else {
                return '';
            }
        }

        return is_scalar( $value ) ? (string) $value : '';
    }

    /**
     * Get activity message by action
     *
     * @param string $action Activity action name
     * @return array|string Message template with placeholders or empty string if not found
     */
    private function get_activity_message_by_action( $action ) {
        switch ( $action ) {
            // Project activities
            case 'create_project':
                /* translators: 1: User display name, 2: Project title */
                return __( '{{actor.data.display_name}} has created a project titled as {{meta.project_title}}.', 'wedevs-project-manager' );
            
            case 'update_project_title':
                /* translators: 1: User display name, 2: Old project title, 3: New project title */
                return __( '{{actor.data.display_name}} has updated project title from "{{meta.project_title_old}}" to "{{meta.project_title_new}}".', 'wedevs-project-manager' );
            
            case 'update_project_description':
                /* translators: 1: User display name, 2: Project title */
                return __( '{{actor.data.display_name}} has updated {{meta.project_title}} project description.', 'wedevs-project-manager' );
            
            case 'update_project_status':
                /* translators: 1: User display name, 2: Old project status, 3: New project status */
                return __( '{{actor.data.display_name}} has updated project status from "{{meta.project_status_old}}" to "{{meta.project_status_new}}".', 'wedevs-project-manager' );
            
            case 'update_project_budget':
                /* translators: 1: User display name, 2: Old project budget, 3: New project budget */
                return __( '{{actor.data.display_name}} has updated project budget from "{{meta.project_budget_old}}" to "{{meta.project_budget_new}}".', 'wedevs-project-manager' );
            
            case 'update_project_pay_rate':
                /* translators: 1: User display name, 2: Old project pay rate, 3: New project pay rate */
                return __( '{{actor.data.display_name}} has updated project pay rate from "{{meta.project_pay_rate_old}}" to "{{meta.project_pay_rate_new}}".', 'wedevs-project-manager' );
            
            case 'update_project_est_completion_date':
                /* translators: 1: User display name, 2: Old project estimated completion date, 3: New project estimated completion date */
                return __( '{{actor.data.display_name}} has updated project est completion date from "{{meta.project_est_completion_date_old}}" to "{{meta.project_est_completion_date_new}}".', 'wedevs-project-manager' );
            
            case 'update_project_color_code':
                /* translators: 1: User display name, 2: Old project color code, 3: New project color code */
                return __( '{{actor.data.display_name}} has updated project color code from "{{meta.project_color_code_old}}" to "{{meta.project_color_code_new}}".', 'wedevs-project-manager' );
            
            case 'create_discussion_board':
                /* translators: 1: User display name, 2: Discussion board title */
                return __( '{{actor.data.display_name}} has created a discussion board titled as {{meta.discussion_board_title}}.', 'wedevs-project-manager' );
            
            case 'delete_discussion_board':
                /* translators: 1: User display name, 2: Deleted discussion board title */
                return __( '{{actor.data.display_name}} has deleted a discussion board titled as {{meta.deleted_discussion_board_title}}.', 'wedevs-project-manager' );
            
            case 'update_discussion_board_title':
                /* translators: 1: User display name, 2: Old discussion board title, 3: New discussion board title */
                return __( '{{actor.data.display_name}} has updated the title of a discussion board from "{{meta.discussion_board_title_old}}" to "{{meta.discussion_board_title_new}}".', 'wedevs-project-manager' );
            
            case 'update_discussion_board_description':
                /* translators: 1: User display name, 2: Discussion board title */
                return __( '{{actor.data.display_name}} has updated the description of a discussion board, {{meta.discussion_board_title}}.', 'wedevs-project-manager' );
            
            case 'update_discussion_board_order':
                /* translators: 1: User display name, 2: Discussion board title */
                return __( '{{actor.data.display_name}} has updated the order of a discussion board, {{meta.discussion_board_title}}.', 'wedevs-project-manager' );
            
            case 'update_discussion_board_status':
                /* translators: 1: User display name, 2: Discussion board title */
                return __( '{{actor.data.display_name}} has updated the status of a discussion board, {{meta.discussion_board_title}}.', 'wedevs-project-manager' );
            
            // Task list activities
            case 'create_task_list':
                /* translators: 1: User display name, 2: Task list title */
                return __( '{{actor.data.display_name}} has created a task list titled as {{meta.task_list_title}}.', 'wedevs-project-manager' );
            
            case 'delete_task_list':
                /* translators: 1: User display name, 2: Deleted task list title */
                return __( '{{actor.data.display_name}} has deleted a task list titled as {{meta.deleted_task_list_title}}.', 'wedevs-project-manager' );
            
            case 'update_task_list_title':
                /* translators: 1: User display name, 2: Old task list title, 3: New task list title */
                return __( '{{actor.data.display_name}} has updated the title of a task list from "{{meta.task_list_title_old}}" to "{{meta.task_list_title_new}}".', 'wedevs-project-manager' );
            
            case 'update_task_list_description':
                /* translators: 1: User display name, 2: Task list title */
                return __( '{{actor.data.display_name}} has updated the description of a task list, {{meta.task_list_title}}.', 'wedevs-project-manager' );
            
            case 'update_task_list_order':
                /* translators: 1: User display name, 2: Task list title */
                return __( '{{actor.data.display_name}} has updated the order of a task list, {{meta.task_list_title}}.', 'wedevs-project-manager' );
            
            case 'update_task_list_milestone_id':
                /* translators: 1: User display name, 2: Task list title */
                return __( '{{actor.data.display_name}} has updated the milestone of a task list, {{meta.task_list_title}}.', 'wedevs-project-manager' );
            
            // Milestone activities
            case 'create_milestone':
                /* translators: 1: User display name, 2: Milestone title */
                return __( '{{actor.data.display_name}} has created a milestone titled as {{meta.milestone_title}}.', 'wedevs-project-manager' );
            
            case 'delete_milestone':
                /* translators: 1: User display name, 2: Deleted milestone title */
                return __( '{{actor.data.display_name}} has deleted a milestone titled as {{meta.deleted_milestone_title}}.', 'wedevs-project-manager' );
            
            case 'update_milestone_title':
                /* translators: 1: User display name, 2: Old milestone title, 3: New milestone title */
                return __( '{{actor.data.display_name}} has updated the title of a milestone from "{{meta.milestone_title_old}}" to "{{meta.milestone_title_new}}".', 'wedevs-project-manager' );
            
            case 'update_milestone_description':
                /* translators: 1: User display name, 2: Milestone title */
                return __( '{{actor.data.display_name}} has updated the description of a milestone, {{meta.milestone_title}}.', 'wedevs-project-manager' );
            
            case 'update_milestone_start_at':
                /* translators: 1: User display name, 2: Milestone title, 3: Old start date, 4: New start date */
                return __( '{{actor.data.display_name}} has updated the start date of a milestone, {{meta.milestone_title}}, from {{meta.milestone_start_at_old}} to {{meta.milestone_start_at_new}}.', 'wedevs-project-manager' );
            
            case 'update_milestone_end_at':
                /* translators: 1: User display name, 2: Milestone title, 3: Old end date, 4: New end date */
                return __( '{{actor.data.display_name}} has updated the end date of a milestone, {{meta.milestone_title}}, from {{meta.milestone_end_at_old}} to {{meta.milestone_end_at_new}}.', 'wedevs-project-manager' );
            
            case 'update_milestone_order':
                /* translators: 1: User display name, 2: Milestone title */
                return __( '{{actor.data.display_name}} has updated the order of a milestone, {{meta.milestone_title}}.', 'wedevs-project-manager' );
            
            case 'update_milestone_achive_date':
                /* translators: 1: User display name, 2: Milestone title, 3: Old achieve date, 4: New achieve date */
                return __( '{{actor.data.display_name}} has updated the achieve date of a milestone, {{meta.milestone_title}}, from {{meta.milestone_achive_date_old}} to {{meta.milestone_achive_date_new}}.', 'wedevs-project-manager' );
            
            // Task activities
            case 'create_task':
                /* translators: 1: User display name, 2: Task title */
                return __( '{{actor.data.display_name}} has created a task titled as {{meta.task_title}}.', 'wedevs-project-manager' );
            
            case 'delete_task':
                /* translators: 1: User display name, 2: Deleted task title */
                return __( '{{actor.data.display_name}} has deleted a task titled as {{meta.deleted_task_title}}.', 'wedevs-project-manager' );
            
            case 'update_task_title':
                /* translators: 1: User display name, 2: Old task title, 3: New task title */
                return __( '{{actor.data.display_name}} has updated the title of a task from "{{meta.task_title_old}}" to "{{meta.task_title_new}}".', 'wedevs-project-manager' );
            
            case 'update_task_description':
                /* translators: 1: User display name, 2: Task title */
                return __( '{{actor.data.display_name}} has updated the description of a task, {{meta.task_title}}.', 'wedevs-project-manager' );
            
            case 'update_task_start_at':
                /* translators: 1: User display name, 2: Task title, 3: Old start date, 4: New start date */
                return __( '{{actor.data.display_name}} has updated the start date of a task, {{meta.task_title}}, from {{meta.task_start_at_old}} to {{meta.task_start_at_new}}.', 'wedevs-project-manager' );
            
            case 'update_task_due_date':
                /* translators: 1: User display name, 2: Task title, 3: Old due date, 4: New due date */
                return __( '{{actor.data.display_name}} has updated the due date of a task, {{meta.task_title}}, from {{meta.task_due_date_old}} to {{meta.task_due_date_new}}.', 'wedevs-project-manager' );
            
            case 'update_task_estimation':
                /* translators: 1: User display name, 2: Task title, 3: Old estimation, 4: New estimation */
                return __( '{{actor.data.display_name}} has updated the estimation of a task, {{meta.task_title}}, from {{meta.task_estimation_old}} to {{meta.task_estimation_new}}.', 'wedevs-project-manager' );
            
            case 'update_task_complexity':
                /* translators: 1: User display name, 2: Task title, 3: Old complexity, 4: New complexity */
                return __( '{{actor.data.display_name}} has updated the complexity of a task, {{meta.task_title}}, from {{meta.task_complexity_old}} to {{meta.task_complexity_new}}.', 'wedevs-project-manager' );
            
            case 'update_task_priority':
                /* translators: 1: User display name, 2: Task title, 3: Old priority, 4: New priority */
                return __( '{{actor.data.display_name}} has updated the priority of a task, {{meta.task_title}}, from {{meta.task_priority_old}} to {{meta.task_priority_new}}.', 'wedevs-project-manager' );
            
            case 'update_task_payable':
                /* translators: 1: User display name, 2: Task title, 3: Old payable status, 4: New payable status */
                return __( '{{actor.data.display_name}} has updated the payable status of a task, {{meta.task_title}}, from {{meta.task_payable_old}} to {{meta.task_payable_new}}.', 'wedevs-project-manager' );
            
            case 'update_task_recurrent':
                /* translators: 1: User display name, 2: Task title, 3: Old recurrency, 4: New recurrency */
                return __( '{{actor.data.display_name}} has updated the recurrency of a task, {{meta.task_title}}, from {{meta.task_recurrent_old}} to {{meta.task_recurrent_new}}.', 'wedevs-project-manager' );
            
            case 'update_task_status':
                /* translators: 1: User display name, 2: Task title, 3: Old task status, 4: New task status */
                return __( '{{actor.data.display_name}} has updated the status of a task, {{meta.task_title}}, from {{meta.task_status_old}} to {{meta.task_status_new}}.', 'wedevs-project-manager' );
            
            // Comment activities
            case 'comment_on_task':
            case 'update_comment_on_task':
            case 'delete_comment_on_task':
            case 'reply_comment_on_task':
            case 'update_reply_comment_on_task':
            case 'delete_reply_comment_on_task':
            case 'comment_on_task_list':
            case 'update_comment_on_task_list':
            case 'delete_comment_on_task_list':
            case 'reply_comment_on_task_list':
            case 'update_reply_comment_on_task_list':
            case 'delete_reply_comment_on_task_list':
            case 'comment_on_discussion_board':
            case 'update_comment_on_discussion_board':
            case 'delete_comment_on_discussion_board':
            case 'reply_comment_on_discussion_board':
            case 'update_reply_comment_on_discussion_board':
            case 'delete_reply_comment_on_discussion_board':
            case 'comment_on_milestone':
            case 'update_comment_on_milestone':
            case 'delete_comment_on_milestone':
            case 'reply_comment_on_milestone':
            case 'update_reply_comment_on_milestone':
            case 'delete_reply_comment_on_milestone':
            case 'comment_on_project':
            case 'update_comment_on_project':
            case 'delete_comment_on_project':
            case 'reply_comment_on_project':
            case 'update_reply_comment_on_project':
            case 'delete_reply_comment_on_project':
            case 'comment_on_file':
            case 'update_comment_on_file':
            case 'delete_comment_on_file':
            case 'reply_comment_on_file':
            case 'update_reply_comment_on_file':
            case 'delete_reply_comment_on_file':
                // Comment activities use simple format - can be handled by a helper
                return $this->get_comment_activity_message( $action );
            
            case 'duplicate_project':
                /* translators: 1: User display name, 2: Old project title */
                return __( '{{actor.data.display_name}} has duplicated project from, {{meta.old_project_title}}.', 'wedevs-project-manager' );
            
            case 'duplicate_list':
                /* translators: 1: User display name, 2: Old task list title */
                return __( '{{actor.data.display_name}} has duplicated list from, {{meta.old_task_list_title}}.', 'wedevs-project-manager' );
            
            default:
                return '';
        }
    }

    /**
     * Get all activity messages (Deprecated - no longer needed)
     *
     * @deprecated Use get_activity_message_by_action() directly
     * @return array All activity message templates
     */
    private function get_all_activity_messages() {
        // No longer needed - keeping for backward compatibility
        return array();
    }

    /**
     * Get comment activity message by action key
     * 
     * @param string $action Activity action key
     * @return string Translated message with {{placeholder}} syntax
     */
    private function get_comment_activity_message( $action ) {
        // Parse action to determine operation and resource type
        $parts = explode( '_on_', $action );
        
        if ( count( $parts ) !== 2 ) {
            return '';
        }
        
        $operation = $parts[0];
        $resource_type = $parts[1];
        
        // Get resource type translation
        $resource_type_text = $this->get_resource_type_translation( $resource_type );
        
        // Get operation-specific message
        switch ( $operation ) {
            case 'comment':
                /* translators: 1: Resource type (task, project, etc.), 2: Resource type for meta path */
                return sprintf( __( '{{actor.data.display_name}} has commented on a %1$s, {{meta.%2$s_title}}.', 'wedevs-project-manager' ), $resource_type_text, $resource_type );
            
            case 'update_comment':
                /* translators: 1: Resource type (task, project, etc.), 2: Resource type for meta path */
                return sprintf( __( '{{actor.data.display_name}} has updated a comment on a %1$s, {{meta.%2$s_title}}.', 'wedevs-project-manager' ), $resource_type_text, $resource_type );
            
            case 'delete_comment':
                /* translators: 1: Resource type (task, project, etc.), 2: Resource type for meta path */
                return sprintf( __( '{{actor.data.display_name}} has deleted a comment from a %1$s, {{meta.%2$s_title}}.', 'wedevs-project-manager' ), $resource_type_text, $resource_type );
            
            case 'reply_comment':
                /* translators: 1: Resource type (task, project, etc.), 2: Resource type for meta path */
                return sprintf( __( '{{actor.data.display_name}} has replied to a comment on a %1$s, {{meta.%2$s_title}}.', 'wedevs-project-manager' ), $resource_type_text, $resource_type );
            
            case 'update_reply_comment':
                /* translators: 1: Resource type (task, project, etc.), 2: Resource type for meta path */
                return sprintf( __( '{{actor.data.display_name}} has updated a reply to a comment on a %1$s, {{meta.%2$s_title}}.', 'wedevs-project-manager' ), $resource_type_text, $resource_type );
            
            case 'delete_reply_comment':
                /* translators: 1: Resource type (task, project, etc.), 2: Resource type for meta path */
                return sprintf( __( '{{actor.data.display_name}} has deleted a reply to a comment on a %1$s, {{meta.%2$s_title}}.', 'wedevs-project-manager' ), $resource_type_text, $resource_type );
            
            default:
                return '';
        }
    }

    /**
     * Get resource type translation
     *
     * @param string $resource_type Resource type name
     * @return string Translated resource type name
     */
    private function get_resource_type_translation( $resource_type ) {
        switch ( $resource_type ) {
            case 'project':
                return __( 'project', 'wedevs-project-manager' );
            
            case 'discussion_board':
                return __( 'discussion board', 'wedevs-project-manager' );
            
            case 'task_list':
                return __( 'task list', 'wedevs-project-manager' );
            
            case 'task':
                return __( 'task', 'wedevs-project-manager' );
            
            case 'milestone':
                return __( 'milestone', 'wedevs-project-manager' );
            
            case 'comment':
                return __( 'comment', 'wedevs-project-manager' );
            
            case 'file':
                return __( 'file', 'wedevs-project-manager' );
            
            default:
                return $resource_type;
        }
    }
}