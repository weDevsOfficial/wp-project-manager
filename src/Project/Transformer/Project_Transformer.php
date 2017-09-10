<?php

namespace CPM\Project\Transformer;

use CPM\Project\Models\Project;
use League\Fractal\TransformerAbstract;
use CPM\Category\Transformer\Category_Transformer;
use CPM\User\Transformers\User_Transformer;

class Project_Transformer extends TransformerAbstract {
    protected $defaultIncludes = [
        'categories', 'assignees'
    ];

    public function transform( Project $item ) {
        return [
            'id'                  => (int) $item->id,
            'title'               => $item->title,
            'description'         => $item->description,
            'status'              => $item->status,
            'budget'              => $item->budget,
            'pay_rate'            => $item->pay_rate,
            'est_completion_date' => $item->est_completion_date,
            'color_code'          => $item->color_code,
            'order'               => $item->order,
            'projectable_type'    => $item->projectable_type,
            'created_by'          => $item->created_by,
            'updated_by'          => $item->updated_by,
            'meta'                => [
                'total_task_lists'         => $item->task_lists->count(),
                'total_tasks'              => $item->tasks->count(),
                'total_discussion_threads' => $item->discussion_threads->count(),
                'total_milestones'         => $item->milestones->count(),
            ],
        ];
    }

    public function includeCategories( Project $item ) {
        $categories = $item->categories;

        return $this->collection( $categories, new Category_Transformer );
    }

    public function includeAssignees( Project $item ) {
        $assignees = $item->assignees;

        return $this->collection( $assignees, new User_Transformer );
    }
}