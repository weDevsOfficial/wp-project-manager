<?php

namespace WeDevs\PM\Common\Traits;

use WeDevs\PM\User\Models\User;
use WeDevs\PM\Activity\Activity_Log;

trait Model_Events {


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