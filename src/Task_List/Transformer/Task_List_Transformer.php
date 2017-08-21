<?php

namespace CPM\Task_List\Transformer;

use CPM\Task_List\Models\Task_List;
use League\Fractal\TransformerAbstract;

class Task_List_Transformer extends TransformerAbstract
{
    public function transform( Task_List $item )
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