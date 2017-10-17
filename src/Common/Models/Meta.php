<?php

namespace PM\Common\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use PM\Common\Traits\Model_Events;
use PM\Milestone\Models\Milestone;

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
        return $this->belongsTo( Milestone::class, 'entity_id' );
    }
}