<?php

namespace CPM\Common\Transformers;

use CPM\Common\Models\Assignee;
use League\Fractal\TransformerAbstract;
use CPM\User\Transformers\User_Transformer;
use CPM\Common\Traits\Resource_Editors;

class Assignee_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        'user', 'creator', 'updater'
    ];

    public function transform( Assignee $item ) {
        return [
            'id'           => (int) $item->id,
            'status'       => $item->status,
            'assigned_at'  => format_date( $item->assigned_at ),
            'started_at'   => format_date( $item->started_at ),
            'completed_at' => format_date( $item->completed_at ),
        ];
    }

    public function includeUser( Assignee $item ) {
        $user = $item->assigned_user;

        return $this->item( $user, new User_Transformer );
    }
}