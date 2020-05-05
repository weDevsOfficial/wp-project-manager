<?php

namespace WeDevs\PM\Task_List\Transformers;

use League\Fractal\TransformerAbstract;
use WeDevs\PM\Task\Models\Task;

class List_Task_Transformer extends TransformerAbstract {
    public $list_task_transormer_filter = true;
    /**
     * Turn this item object into a generic array
     *
     * @return array
     */
    public function transform( Task $item ) {

        $task = [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => [ 'html' => pm_get_content( $item->description ), 'content' => $item->description ],
            'estimation'  => $item->estimation,
            'start_at'    => format_date( $item->start_at ),
            'due_date'    => format_date( $item->due_date ),
            'complexity'  => $item->complexity,
            'priority'    => $item->priority,
            'payable'     => $item->payable,
            'recurrent'   => $item->recurrent,
            'parent_id'   => $item->parent_id,     
            'status'      => $item->status,
            'project_id'  => $item->project_id,
            'category_id' => $item->category_id,
            'created_at'  => format_date( $item->created_at ),
            'completed_at' => format_date( $item->completed_at ),
            'updated_at'  => format_date( $item->updated_at ),
            'task_list_id' => $item->task_list,
            'meta'        => $this->meta( $item ),
            'assignees'   => $this->assignees( $item ),
            'creator'     => $this->get_creator( $item )
        ];
        
        if ( $this->list_task_transormer_filter ) {
            return apply_filters( 'pm_list_task_transormer', $task, $item );  
        }
        
        return $task;
    }

    public function get_creator( $item ) {
        if(empty($item->created_by)) {
            return [];
        } 
        $user = get_user_by( 'id', $item->created_by );
        if ( ! $user ) {
            return [];
        }

        $data = [
            'id'                => (int) $user->ID,
            'username'          => $user->user_login,
            'nicename'          => $user->user_nicename,
            'email'             => $user->user_email,
            'profile_url'       => $user->user_url,
            'display_name'      => $user->display_name,
            'manage_capability' => (int) pm_has_manage_capability($user->ID),
            'create_capability' => (int) pm_has_project_create_capability($user->ID),
            'avatar_url'        => get_avatar_url( $user->user_email ),
        ];

        return [ 'data' => $data ];
    }


    public function meta( Task $item ) {
        $metas = [
            'can_complete_task' => $this->pm_user_can_complete_task( $item ),
            'total_comment' => $item->total_comment,
        ];
        
	    return $metas;
    }

    function pm_user_can_complete_task( $task ) {
        
        if(!$task) {
            return false;
        }
        $user_id = get_current_user_id();

        if ( pm_has_manage_capability( $user_id ) ) {
            return true;
        }

        if ( pm_is_manager( $task->project_id, $user_id ) ) {
            return true;
        }

        if ( $task->created_by == $user_id ) {
            return true;
        }

        $assignees = $this->get_task_assignee_ids( $task ); //pluck( 'assigned_to' )->all();
        $in_array = in_array( $user_id, $assignees );

        if ( !empty( $in_array ) ) {
            return true;
        }

        return false;
    }

    public function get_task_assignee_ids( $item ) {
        $assigness = [];
        if( empty( $item->assignees ) ) {
            return [];
        }

        $users = explode( '|', $item->assignees );

        foreach ( $users as $key => $assign ) {
            $assign = str_replace('`', '"', $assign);
            $assign = json_decode( $assign );
            
            if ( !empty( $assign->assigned_to ) ) {
                $assigness[] = $assign->assigned_to;
            }
            
        }

        return $assigness;
    }

    public function assignees( $item ) {
        $assignees = ['data'=>[]];
        if( empty( $item->assignees ) ) {
            return $assignees;
        }

        $users = explode( '|', $item->assignees );
        
        foreach ( $users as $key => $assign ) {
            $assign = str_replace('`', '"', $assign);
            $assign = json_decode( $assign );
            
            if ( empty( $assign->assigned_to ) ) continue;
            $user = get_user_by( 'id', $assign->assigned_to );
            if ( empty( $user ) ) continue;
            
            $data = [
                'id'                => (int) $user->ID,
                'username'          => $user->user_login,
                'nicename'          => $user->user_nicename,
                'email'             => $user->user_email,
                'profile_url'       => $user->user_url,
                'display_name'      => $user->display_name,
                'manage_capability' => (int) pm_has_manage_capability($user->ID),
                'create_capability' => (int) pm_has_project_create_capability($user->ID),
                'avatar_url'        => get_avatar_url( $user->user_email ),
            ];

            
            $data['completed_at'] = empty( $assign->completed_at ) ? [] : format_date( $assign->completed_at );
            $data['started_at'] = empty( $assign->started_at ) ? [] : format_date( $assign->started_at );
            $data['assigned_at'] = empty( $assign->assigned_at ) ? [] : format_date( $assign->assigned_at );
            $data['status'] = empty( $assign->status ) ? 0 : (int) $assign->status;

            $assignees['data'][] = $data;
            
        }
        
        return $assignees;
    }


}
