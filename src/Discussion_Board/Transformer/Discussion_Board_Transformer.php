<?php

namespace CPM\Discussion_Board\Transformer;

use CPM\Discussion_Board\Models\Discussion_Board;
use League\Fractal\TransformerAbstract;

class Discussion_Board_Transformer extends TransformerAbstract
{
    public function transform( Milestone $item )
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