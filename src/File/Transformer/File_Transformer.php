<?php

namespace CPM\File\Transformer;

use CPM\File\Models\File;
use League\Fractal\TransformerAbstract;
use CPM\Core\File_System\File_System;
use CPM\User\Transformers\User_Transformer;
use CPM\Common\Traits\Resource_Editors;

class File_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        'creator', 'updater'
    ];

    public function transform( File $item ) {
        return [
            'id'            => (int) $item->id,
            'fileable_id'   => $item->fileable_id,
            'fileable_type' => $item->fileable_type,
            'directory'     => $item->directory,
            'attachment_id' => $item->attachment_id,
            'attached_at'   => format_date( $item->created_at ),
            'file'          => File_System::get_file( $item->attachment_id ),
        ];
    }
}