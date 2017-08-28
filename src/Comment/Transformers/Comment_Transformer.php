<?php

namespace CPM\Comment\Transformers;

use CPM\Comment\Models\Comment;
use League\Fractal\TransformerAbstract;

class Comment_Transformer extends TransformerAbstract
{
    public function transform( Comment $item )
    {
        return [
            'id'         => (int) $item->id,
            'content'    => $item->content,
            'created_by' => $item->created_by,
        ];
    }
}