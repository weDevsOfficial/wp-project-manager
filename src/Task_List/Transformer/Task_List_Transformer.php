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
use League\Fractal\Resource\Collection as Collection;
use CPM\Transformer_Manager;

class Task_List_Transformer extends TransformerAbstract {

    use Transformer_Manager;

    protected $defaultIncludes = [
        'milestone'
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
            'order'       => $item->order,
            'created_by'  => $item->created_by,
            'updated_by'  => $item->updated_by,
            'meta'        => [
                'total_tasks'            => $item->tasks->count(),
                'total_complete_tasks'   => $item->tasks->where( 'status', 1)->count(),
                'total_incomplete_tasks' => $item->tasks->where( 'status', 0)->count(),
                'total_comments'         => $item->comments->count(),
                'totla_files'            => $item->files->count(),
                'total_assignees'        => $item->assignees->count(),
            ]
        ];
    }

    public function includeAssignees( Task_List $item ) {
        $assignees = $item->assignees;

        return $this->collection( $assignees, new User_Transformer );
    }

    public function includeTasks( Task_List $item ) {
        $tasks = $item->tasks;

        return $this->collection( $tasks, new Task_Transformer );
    }

    public function includeComments( Task_List $item ) {
        $page = $_GET['comment_page'];

        $comments = $item->comments()->paginate( 10, ['*'], 'comment_page', $page );

        $comment_collection = $comments->getCollection();
        $resource = $this->collection( $comment_collection, new Comment_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $comments ) );

        return $resource;
    }

    public function includeFiles( Task_List $item ) {
        $files = $item->files;

        return $this->collection( $files, new File_Transformer );
    }

    public function includeMilestone( Task_List $item ) {
        $milestone = $item->milestones->first();

        if ( $milestone ) {
            return $this->item( $milestone, new Milestone_Transformer );
        }

        return null;
    }

    public function includeCompleteTasks( Task_List $item ) {
        $page = $_GET['complete_task_page'];

        $tasks = $item->tasks()
            ->where( 'status', 1 )
            ->paginate( 2, ['*'], 'page', $page );

        return $this->make_paginated_tasks( $tasks );
    }

    public function includeIncompleteTasks( Task_List $item ) {
        $page = $_GET['incomplete_task_page'];

        $tasks = $item->tasks()
            ->where( 'status', 0 )
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