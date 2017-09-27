<?php

namespace CPM\Activity\Transformers;

use League\Fractal\TransformerAbstract;
use CPM\Activity\Models\Activity;
use CPM\User\Transformers\User_Transformer;

class Activity_Transformer extends TransformerAbstract {

    protected $defaultIncludes = [
        'actor'
    ];

    public function transform( Activity $item ) {
        return [
            'id'           => (int) $item->id,
            'action'       => $item->action,
            'action_type'  => $item->action_type,
            'meta'         => unserialize( $item->meta ),
            'committed_at' => format_date( $item->created_at ),
        ];
    }

    public function includeActor( Activity $item ) {
        $actor = $item->actor;

        return $this->item( $actor, new User_Transformer );
    }
}