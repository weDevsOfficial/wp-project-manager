<?php

namespace CPM\Common\Transformers;

use CPM\Common\Models\Board;
use League\Fractal\TransformerAbstract;

class Board_Transformer extends TransformerAbstract
{
    public function transform( Board $item )
    {
        return [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => $item->description,
            'board_type'  => $item->type,
            'created_by'  => $item->created_by,
            'updated_by'  => $item->updated_by,
        ];
    }
}