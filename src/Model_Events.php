<?php

namespace CPM;

use CPM\User\Models\User;
use CPM\Activity\Activity_Log;

trait Model_Events {

    public static function boot() {
        parent::boot();

        static::creating( function ( $model ) {
            $model->created_by = 1;
            $model->updated_by = 1;
        });

        static::created( function ( $model ) {
            Activity_Log::entry( $model, 'created' );
        });

        static::updating( function ( $model ) {
            $model->updated_by = 1;
        });

        static::updated( function ( $model ) {
            Activity_Log::entry( $model, 'updated' );
        });
    }

    public function set_fillable_attributes( $attribute_values ) {
        foreach ( $attribute_values as $key => $value ) {
            if ( in_array( $key, $this->getFillable() ) ) {
                $this->$key = $value;
            }
        }
    }

    public function creator() {
        return $this->belongsTo( User::class, 'created_by' );
    }

    public function updater() {
        return $this->belongsTo( User::class, 'updated_by' );
    }
}