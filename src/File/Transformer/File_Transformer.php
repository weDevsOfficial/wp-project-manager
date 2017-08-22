<?php

namespace CPM\File\Transformer;

use CPM\File\Models\File;
use League\Fractal\TransformerAbstract;

class File_Transformer extends TransformerAbstract
{
    public function transform( File $item )
    {
        return [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => $item->description,
            'order'       => $item->order,
            'created_by'  => $item->created_by,
            'updated_by'  => $item->updated_by,
        ];
    }
}