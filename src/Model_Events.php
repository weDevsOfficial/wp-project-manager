<?php

namespace CPM\Model_Events;

trait Model_Events {
    public static function boot() {
        parent::boot();

        static::saving( function ( $model ) {
            $model->created_by = 1;
            $model->updated_by = 1;
        } );

        static::updating( function ( $model ) {
            $model->updated_by = 1;
            $model->save();
        } );
    }
}