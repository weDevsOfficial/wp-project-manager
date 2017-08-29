<?php

namespace CPM\Common\Transformers;

use CPM\Common\Models\Boardable;
use League\Fractal\TransformerAbstract;

class Boardable_User_Transformer extends TransformerAbstract {
    public function transform( Boardable $item ) {
        return [
            'id' => (int) $item->boardable_id,
        ];
    }
}