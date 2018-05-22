<?php

namespace WeDevs\PM\Activity\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
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
        return $this->belongsTo( 'WeDevs\PM\User\Models\User', 'actor_id' );
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

    public function metas() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Meta', 'entity_type', 'resource_type' );
    }
}