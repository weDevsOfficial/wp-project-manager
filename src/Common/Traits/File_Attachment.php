<?php

namespace CPM\Common\Traits;

use ReflectionClass;
use CPM\Core\File_System\File_System;
use CPM\File\Models\File;

trait File_Attachment {

    private function attach_files( $entity, $files ) {
        $reflector   = new ReflectionClass( $entity );
        $entity_type = $reflector->getShortName();
        $entity_type = str_replace( '_', '-', $entity_type );
        $entity_type = strtolower( $entity_type );

        $attachment_ids = File_System::multiple_upload( $files );

        foreach ( $attachment_ids as $attachment_id ) {
            File::create([
                'fileable_id'   => $entity->id,
                'fileable_type' => $entity_type,
                'attachment_id' => $attachment_id,
            ]);
        }
    }

    private function detach_files( $entity, $file_ids = [] ) {
        if ( empty( $file_ids ) ) {
            $attachment_ids = $entity->files->pluck('attachment_id');
        } else {
            $attachment_ids = $entity->files->whereIn( 'id', $file_ids )->pluck( 'attachment_id' );
        }

        foreach ($attachment_ids as $attachment_id) {
            File_System::delete( $attachment_id );
        }

        $entity->files()->delete();
    }
}