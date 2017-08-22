<?php

namespace CPM\Task\Transformer;

use CPM\Task\Models\Task;
use League\Fractal\TransformerAbstract;

class Task_Transformer extends TransformerAbstract
{
    public function transform( Task $item )
    {
        return [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => $item->description,
            'estimation'  => $item->estimation,
            'start_at'    => $item->started_at,
            'due_date'    => $item->due_date,
            'complexity'  => $item->complexity,
            'priority'    => $item->priority,
            'order'       => $item->order,
            'payable'     => $item->payable,
            'recurrent'   => $item->recurrent,
            'status'      => $item->status,
            'project_id'  => $item->project_id,
            'category_id' => $item->category_id,
            'parent_id'   => $item->category_id,
            'created_by'  => $item->created_by,
            'updated_by'  => $item->updated_by
        ];
    }
}