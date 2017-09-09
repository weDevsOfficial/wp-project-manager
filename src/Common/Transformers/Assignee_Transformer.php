<?php

namespace CPM\Common\Transformers;

use CPM\Common\Models\Assignee;
use League\Fractal\TransformerAbstract;
use CPM\Common\Transformers\User_Transformer;

class Assignee_Transformer extends TransformerAbstract {
    protected $defaultIncludes = [
        'user',
    ];

    public function transform( Assignee $item ) {
        return [
            'id'           => (int) $item->id,
            'status'       => $item->status,
            'assigned_at'  => $item->assigned_at,
            'started_at'   => $item->started_at,
            'completed_at' => $item->completed_at,
        ];
    }

    public function includeUser( Assignee $item ) {
        $user = [
            'id' => $item->assigned_to,
        ];

        return $this->item( $user, new User_Transformer );
    }
}