<?php

namespace WeDevs\PM\Common\Traits;

use ReflectionClass;
use WeDevs\PM\Core\File_System\File_System;
use WeDevs\PM\File\Models\File;

trait File_Attachment {

    private function attach_files( $entity, $files ) {
        $reflector   = new ReflectionClass( $entity );
        $entity_type = $reflector->getShortName();
        $entity_type = strtolower( $entity_type );
        
        $attachment_ids = File_System::multiple_upload( $files );

        foreach ( $attachment_ids as $attachment_id ) {
            File::create([
                'fileable_id'   => $entity->id,
                'fileable_type' => $entity_type,
                'attachment_id' => $attachment_id,
                'project_id'    => $entity->project_id,
                'parent'        => $entity->id,
                'type'          =>  NULL
            ]);
        }
    }

    private function detach_files( $entity, $file_ids = [] ) {
        if ( empty( $file_ids ) ) {
            $attachment_ids = empty($entity->files) ? [] : $entity->files->pluck('attachment_id')->all();
        } else {
            $attachment_ids = $entity->files->whereIn( 'id', $file_ids )->pluck( 'attachment_id' )->all();
        }

        foreach ($attachment_ids as $attachment_id) {
            File_System::delete( $attachment_id );
        }

        if ( empty( $file_ids ) ) {
            $entity->files()->delete();
        } else {
            $entity->files()->whereIn( 'id', $file_ids )->delete();
        }
    }
}