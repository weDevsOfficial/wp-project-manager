<?php

namespace WeDevs\PM\Common\Traits;

use WeDevs\PM\User\Models\User;
use WeDevs\PM\Activity\Activity_Log;

trait Model_Events {

    public static function boot() {
        parent::boot();

        // add_action( 'pm_creating', function ( $model ) {
        //     $user = wp_get_current_user();
        //     $model->created_by = $user->ID;
        //     $model->updated_by = $user->ID;
        // } );

        // add_action( 'pm_created', function ( $model ) {
        //     Activity_Log::entry( $model, 'created' );
        // } );

        // add_action( 'pm_updating', function ( $model ) {
        //     $user = wp_get_current_user();
        //     $model->updated_by = $user->ID;
        //     Activity_Log::entry( $model, 'updated' );
        //     $model->save();
        // } );


        // static::creating( function ( $model ) {
        //     $user = wp_get_current_user();
        //     $model->created_by = $user->ID;
        //     $model->updated_by = $user->ID;
        // });

        // static::created( function ( $model ) {
        //     Activity_Log::entry( $model, 'created' );
        // });

        // static::updating( function ( $model ) {
        //     $user = wp_get_current_user();
        //     $model->updated_by = $user->ID;
        // });

        // static::updated( function ( $model ) {
        //     Activity_Log::entry( $model, 'updated' );
        // });
    }

    public function update_model( $attribute_values ) {
        $fillable = $this->getFillable();

        foreach ( $attribute_values as $key => $value ) {
            if ( in_array( $key, $fillable ) ) {
                $this->$key = $value;
            }
        }

        $this->save();
    }

    public function creator() {
        return $this->belongsTo( 'WeDevs\PM\User\Models\User', 'created_by' );
    }

    public function updater() {
        return $this->belongsTo( 'WeDevs\PM\User\Models\User', 'updated_by' );
    }
}