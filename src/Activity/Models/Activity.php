<?php

namespace CPM\Activity\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\User\Models\User;

class Activity extends Eloquent {

    protected $table = 'cpm_activities';

    protected $fillable = [
        'actor_id',
        'action',
        'action_type',
        'resource_id',
        'resource_type',
        'meta',
        'project_id'
    ];

    public function actor() {
        return $this->belongsTo( User::class, 'actor_id' );
    }

    public function setMetaAttribute( $value ) {
        if ( ! empty($value) ) {
            $this->attributes['meta'] = serialize( $value );
        }
    }

    public function getMetaAttribute( $value ) {
        return unserialize( $value );
    }
}