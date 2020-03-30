<?php

namespace WeDevs\PM\Settings\Transformers;

use WeDevs\PM\Settings\Models\Task_Types;
use League\Fractal\TransformerAbstract;
use WeDevs\PM\Common\Traits\Resource_Editors;

class Task_Type_Transformer extends TransformerAbstract {

    use Resource_Editors;

    public function transform( Task_Types $item ) {
        return [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => $item->description,
            'type'        => $item->type,
            'status'      => $item->status
        ];
    }

}
