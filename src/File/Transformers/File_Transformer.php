<?php

namespace PM\File\Transformers;

use PM\File\Models\File;
use League\Fractal\TransformerAbstract;
use PM\Core\File_System\File_System;
use PM\User\Transformers\User_Transformer;
use PM\Common\Traits\Resource_Editors;

class File_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        'creator', 'updater'
    ];

    public function transform( File $item ) {
        $file = File_System::get_file( $item->attachment_id );
        $model_data = [
            'id'            => (int) $item->id,
            'fileable_id'   => $item->fileable_id,
            'fileable_type' => $item->fileable_type,
            'directory'     => $item->directory,
            'attachment_id' => $item->attachment_id,
            'attached_at'   => format_date( $item->created_at ),
        ];

        return array_merge( $model_data, $file );
    }
}