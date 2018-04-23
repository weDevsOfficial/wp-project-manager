<?php

namespace WeDevs\PM\Activity\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use WeDevs\PM\User\Models\User;
use WeDevs\PM\Project\Models\Project;

class Activity extends Eloquent {

    protected $table = 'pm_activities';

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
        return $this->belongsTo( 'WeDevs\PM\User\Models\Use', 'actor_id' );
    }

    public function setMetaAttribute( $value ) {
        if ( ! empty($value) ) {
            $this->attributes['meta'] = serialize( $value );
        }
    }

    public function getMetaAttribute( $value ) {
        return unserialize( $value );
    }

    public function project() {
        return $this->belongsTo( 'WeDevs\PM\Project\Models\Project', 'project_id' );
    }
}