<?php

namespace CPM\Milestone\Transformer;

use CPM\Milestone\Models\Milestone;
use League\Fractal\TransformerAbstract;

class Milestone_Transformer extends TransformerAbstract
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