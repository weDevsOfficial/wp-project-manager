<?php

namespace CPM\Milestone\Transformer;

use CPM\Milestone\Models\Milestone;
use League\Fractal\TransformerAbstract;
use CPM\Task_List\Transformer\Task_List_Transformer;
use CPM\Task\Transformer\Task_Transformer;

class Milestone_Transformer extends TransformerAbstract {
    protected $availableIncludes = [
        'task_lists', 'tasks'
    ];

    public function transform( Milestone $item ) {
        $task_lists = $item->task_lists;
        $total_task_list = $task_lists->count();
        $tasks = $item->tasks;

        foreach ( $task_lists as $task_list ) {
            $tasks = $tasks->merge( $task_list->tasks );
        }

        if ( $tasks->count() ) {
            $tasks = $tasks->unique( 'id' )->values();
        }

        $total_task = $tasks->count();

        return [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => $item->description,
            'order'       => $item->order,
            'created_by'  => $item->created_by,
            'updated_by'  => $item->updated_by,
            'meta' => [
                'total_task_list' => $total_task_list,
                'total_task'      => $total_task,
            ],
        ];
    }

    public function includeTaskLists( Milestone $item ) {
        $task_lists = $item->task_lists;

        return $this->collection( $task_lists, new Task_List_Transformer );
    }

    public function includeTasks( Milestone $item ) {
        $task_lists = $item->task_lists;
        $tasks = $item->tasks;

        foreach ( $task_lists as $task_list ) {
            $tasks = $tasks->merge( $task_list->tasks );
        }

        if ( $tasks->count() ) {
            $tasks = $tasks->unique( 'id' )->values();
        }

        return $this->collection( $tasks, new Task_Transformer );
    }
}