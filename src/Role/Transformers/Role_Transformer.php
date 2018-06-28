<?php

namespace WeDevs\PM\Role\Transformers;

use WeDevs\PM\Role\Models\Role;
use League\Fractal\TransformerAbstract;

class Role_Transformer extends TransformerAbstract {

    public function transform( Role $item ) {
        return [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => $item->description,
            'created_at'  => format_date( $item->created_at ),
            'slug'        => $item->slug
        ];
    }
}