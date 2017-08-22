<?php

namespace CPM\File\Transformer;

use CPM\File\Models\File;
use League\Fractal\TransformerAbstract;
use CPM\Core\File_System\File_System;

class File_Transformer extends TransformerAbstract
{
    public function transform( File $item )
    {
        return [
            'id'            => (int) $item->id,
            'fileable_id'   => $item->fileable_id,
            'fileable_type' => $item->fileable_type,
            'parent_id'     => $item->parent_id,
            'attachment_id' => $item->attachment_id,
            'attached_at'   => $item->attached_at,
            'created_by'    => $item->created_by,
            'updated_by'    => $item->updated_by,
            'file'          => File_System::get_file( $item->attachment_id ),
        ];
    }
}