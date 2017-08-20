<?php

namespace CPM\Todo_List\Transformer;

use CPM\Todo_List\Models\Todo_List;
use League\Fractal\TransformerAbstract;

class Todo_List_Transformer extends TransformerAbstract
{
    public function transform( Todo_List $item )
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