<?php

namespace CPM\Task\Transformer;

use CPM\Task\Models\Task;
use League\Fractal\TransformerAbstract;

class Task_Transformer extends TransformerAbstract
{
    public function transform( Task $item )
    {
        return [
            'id' => (int) $item->id,
            'title' => $item->title,
            'description' => $item->description,
            'order' => $item->order,
            'created_by' => $item->created_by,
            'updated_by' => $item->updated_by,
        ];
    }
}