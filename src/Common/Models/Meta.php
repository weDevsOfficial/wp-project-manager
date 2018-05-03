<?php

namespace WeDevs\PM\Common\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\Milestone\Models\Milestone;

class Meta extends Eloquent {

    use Model_Events;

    protected $table = 'pm_meta';

    protected $fillable = [
        'entity_id',
        'entity_type',
        'meta_key',
        'meta_value',
        'project_id',
        'created_by',
        'updated_by',
    ];

    public function milestone() {
        return $this->belongsTo( 'WeDevs\PM\Milestone\Models\Milestone', 'entity_id' );
    }
}