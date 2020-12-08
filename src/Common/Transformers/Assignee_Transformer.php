<?php

namespace WeDevs\PM\Common\Transformers;

use WeDevs\PM\Common\Models\Assignee;
use League\Fractal\TransformerAbstract;
use WeDevs\PM\User\Transformers\User_Transformer;
use WeDevs\PM\Common\Traits\Resource_Editors;

class Assignee_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [

    ];

    protected $availableIncludes = [
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

    /**
     * Getter for defaultIncludes.
     *
     * @return array
     */
    public function getDefaultIncludes()
    {
        return apply_filters( "pm_assignee_transformer_default_includes", $this->defaultIncludes );
    }

    public function includeUser( Assignee $item ) {
        $user = $item->assigned_user;

        return $this->item( $user, new User_Transformer );
    }
}