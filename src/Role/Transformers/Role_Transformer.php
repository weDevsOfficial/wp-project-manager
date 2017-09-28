<?php

namespace CPM\Role\Transformers;

use CPM\Role\Models\Role;
use League\Fractal\TransformerAbstract;

class Role_Transformer extends TransformerAbstract {

    public function transform( Role $item ) {
        return [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => $item->description,
        ];
    }
}