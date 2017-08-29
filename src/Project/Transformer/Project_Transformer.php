<?php

namespace CPM\Project\Transformer;

use CPM\Project\Models\Project;
use League\Fractal\TransformerAbstract;

class Project_Transformer extends TransformerAbstract {
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
            'extra'               => [
                'task-lists'         => $item->task_lists->count(),
                'tasks'              => $item->tasks->count(),
                'discussion-threads' => $item->discussion_threads->count(),
                'milestones'         => $item->milestones->count(),
            ],
        ];
    }
}