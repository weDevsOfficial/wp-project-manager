<?php

namespace CPM;

use CPM\User\Models\User;

trait Model_Events {

    public static function boot() {
        parent::boot();

        static::saving( function ( $model ) {
            $model->created_by = 1;
            $model->updated_by = 1;
        } );

        static::updating( function ( $model ) {
            $model->updated_by = 1;
        } );
    }

    public function creator() {
        return $this->belongsTo( User::class, 'created_by' );
    }

    public function updater() {
        return $this->belongsTo( User::class, 'updated_by' );
    }
}