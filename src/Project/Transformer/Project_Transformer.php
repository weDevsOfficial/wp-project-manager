<?php

namespace CPM\Project\Transformer;

use CPM\Project\Models\Project;
use League\Fractal\TransformerAbstract;

class Project_Transformer extends TransformerAbstract
{
    public function transform( Project $item )
    {
        return [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => $item->des,
            'status'      => $item->status,
            'created_by'  => $item->created_by,
            'updated_by'  => $item->updated_by,
        ];
    }
}