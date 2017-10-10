<?php

namespace CPM\Task_List\Transformer;

use CPM\Task_List\Models\Task_List;
use League\Fractal\TransformerAbstract;
use CPM\User\Transformers\User_Transformer;
use CPM\Task\Transformer\Task_Transformer;
use CPM\Comment\Transformers\Comment_Transformer;
use CPM\File\Transformer\File_Transformer;
use CPM\Milestone\Transformer\Milestone_Transformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use CPM\Common\Traits\Resource_Editors;
use CPM\Task\Models\Task;

class Task_List_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        'creator', 'updater', 'milestone'
    ];

    protected $availableIncludes = [
        'assignees',
        'tasks',
        'complete_tasks',
        'incomplete_tasks',
        'comments',
        'files',
    ];

    public function transform( Task_List $item ) {
        return [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => $item->description,
            'order'       => (int) $item->order,
            'created_at'  => format_date( $item->created_at ),
            'meta'        => [
                'total_tasks'            => $item->tasks()->count(),
                'total_complete_tasks'   => $item->tasks()->where( 'status', Task::COMPLETE )->count(),
                'total_incomplete_tasks' => $item->tasks()->where( 'status', Task::INCOMPLETE )->count(),
                'total_comments'         => $item->comments()->count(),
                'totla_files'            => $item->files()->count(),
                'total_assignees'        => $item->assignees()->count(),
            ]
        ];
    }

    public function includeAssignees( Task_List $item ) {
        $assignees = $item->assignees;

        return $this->collection( $assignees, new User_Transformer );
    }

    public function includeComments( Task_List $item ) {
        $page = isset( $_GET['comment_page'] ) ? $_GET['comment_page'] : 1;

        $comments = $item->comments()
            ->orderBy( 'created_at', 'DESC' )
            ->paginate( 10, ['*'], 'comment_page', $page );

        $comment_collection = $comments->getCollection();
        $resource = $this->collection( $comment_collection, new Comment_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $comments ) );

        return $resource;
    }

    public function includeFiles( Task_List $item ) {
        $page = isset( $_GET['file_page'] ) ? $_GET['file_page'] : 1;

        $files = $item->files()->paginate( 10, ['*'], 'file_page', $page );

        $file_collection = $files->getCollection();
        $resource = $this->collection( $file_collection, new File_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $files ) );

        return $resource;
    }

    public function includeMilestone( Task_List $item ) {
        $milestone = $item->milestones->first();

        if ( $milestone ) {
            return $this->item( $milestone, new Milestone_Transformer );
        }

        return null;
    }

    public function includeTasks( Task_List $item ) {
        $page = isset( $_GET['task_page'] ) ? $_GET['task_page'] : 1;

        $tasks = $item->tasks()
            ->orderBy( 'cpm_boardables.order', 'DESC' )
            ->paginate( 15, ['*'], 'page', $page );

        return $this->make_paginated_tasks( $tasks );
    }


    public function includeCompleteTasks( Task_List $item ) {
        $page = isset( $_GET['complete_task_page'] ) ? $_GET['complete_task_page'] : 1;

        $tasks = $item->tasks()
            ->where( 'status', 1 )
            ->orderBy( 'cpm_boardables.order', 'DESC' )
            ->paginate( 2, ['*'], 'page', $page );

        return $this->make_paginated_tasks( $tasks );
    }

    public function includeIncompleteTasks( Task_List $item ) {
        $page = isset( $_GET['incomplete_task_page'] ) ? $_GET['incomplete_task_page'] : 1;

        $tasks = $item->tasks()
            ->where( 'status', 0 )
            ->orderBy( 'cpm_boardables.order', 'DESC' )
            ->paginate( 2, ['*'], 'page', $page );

        return $this->make_paginated_tasks( $tasks );
    }

    private function make_paginated_tasks( $tasks ) {
        $task_collection = $tasks->getCollection();
        $resource = $this->collection( $task_collection, new Task_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $tasks ) );

        return $resource;
    }
}