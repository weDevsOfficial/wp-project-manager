<?php

namespace WeDevs\PM\Task_List\Transformers;

use WeDevs\PM\Task_List\Models\Task_List;
use League\Fractal\TransformerAbstract;
use WeDevs\PM\User\Transformers\User_Transformer;
use WeDevs\PM\Task\Transformers\Task_Transformer;
use WeDevs\PM\Comment\Transformers\Comment_Transformer;
use WeDevs\PM\File\Transformers\File_Transformer;
use WeDevs\PM\Milestone\Transformers\Milestone_Transformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Resource_Editors;
use WeDevs\PM\Task\Models\Task;
use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Pagination\Paginator;
use League\Fractal\Resource\Collection as Collection;


class New_Task_List_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        //'creator', 'updater', 'milestone'
    ];

    public function transform( Task_List $item ) {
        
        $data = [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => pm_filter_content_url( $item->description ),
            'order'       => (int) $item->order,
            'status'      => $item->status,
            'created_at'  => format_date( $item->created_at ),
            'meta'        => $this->meta( $item ),
            'extra'       => true,
            'milestone'   => $item->milestone,
            'incomplete_tasks' => ['data' => []],
            'complete_tasks' => ['data' => []],
            'creator' => $this->get_creator( $item ),
            'project_id' => $item->project_id
        ];

        return apply_filters( 'pm_task_list_transform', $data, $item );
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

        return $user;
    }

    public function meta( $item ) {
        $meta = [];

        $meta['total_tasks'] = $this->get_total_tasks( $item );
        $meta['total_complete_tasks'] = $this->get_total_complete_tasks( $item );
        $meta['total_incomplete_tasks'] = $this->get_total_incomplete_tasks( $item );
        $meta['total_comments'] = 0;
        $meta['total_assignees'] = 0;
        $meta['totla_files'] = 0;

        return $meta;
    }

    public function get_total_tasks( $item ) {
        
        $c_tasks = $this->get_total_complete_tasks( $item );
        $ic_tasks = $this->get_total_incomplete_tasks( $item );

        return $c_tasks + $ic_tasks;
    }

    public function get_total_complete_tasks( $item ) { 
        if ( empty( $item->lists_tasks_count ) ) return 0;
        if ( empty( $item->lists_tasks_count->completed_task_ids ) ) return 0;

        if ( is_array( $item->lists_tasks_count->completed_task_ids ) ) {
            return count( $item->lists_tasks_count->completed_task_ids );
        }

        return 0;    
    }

    public function get_total_incomplete_tasks( $item ) {
        if ( empty( $item->lists_tasks_count ) ) return 0;
        if ( empty( $item->lists_tasks_count->incompleted_task_ids ) ) return 0;

        if ( is_array( $item->lists_tasks_count->incompleted_task_ids ) ) {
            return count( $item->lists_tasks_count->incompleted_task_ids );
        }

        return 0; 
    }
}
