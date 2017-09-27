<?php

namespace CPM\Activity\Transformers;

use League\Fractal\TransformerAbstract;
use CPM\Activity\Models\Activity;

class Activity_Transformer extends TransformerAbstract {

    public function transform( Activity $item ) {
        return [
            'id' => (int) $item->id,
            'action' => $item->action,
            'meta' => unserialize( $item->meta ),
            'done_at' => format_date( $item->created_at ),
        ];
    }
}