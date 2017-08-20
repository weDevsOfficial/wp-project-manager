<?php

namespace CPM\Category\Transformer;

use CPM\Category\Models\Category;
use League\Fractal\TransformerAbstract;

class Category_Transformer extends TransformerAbstract
{
    public function transform( Category $item )
    {
        return [
            'id' => (int) $item->id,
            'title' => $item->title,
            'description' => $item->description,
            'categorible_type' => $item->categorible_type,
            'created_by' => $item->created_by,
            'updated_by' => $item->updated_by,
        ];
    }
}