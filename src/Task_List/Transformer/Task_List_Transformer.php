<?php

namespace CPM\Task_List\Transformer;

use CPM\Task_List\Models\Task_List;
use League\Fractal\TransformerAbstract;
use CPM\User\Transformers\User_Transformer;
use CPM\Task\Transformer\Task_Transformer;
use CPM\Comment\Transformers\Comment_Transformer;
use CPM\File\Transformer\File_Transformer;
use CPM\Milestone\Transformer\Milestone_Transformer;

class Task_List_Transformer extends TransformerAbstract {

    protected $defaultIncludes = [
        'milestone'
    ];

    protected $availableIncludes = [
        'assignees', 'tasks', 'comments', 'files',
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
                'total_tasks'     => $item->tasks->count(),
                'total_comments'  => $item->comments->count(),
                'totla_files'     => $item->files->count(),
                'total_assignees' => $item->assignees->count(),
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
        $comments = $item->comments;

        return $this->collection( $comments, new Comment_Transformer );
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
}