<?php

namespace CPM\Common\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;
use CPM\Milestone\Models\Milestone;

class Meta extends Eloquent {

    use Model_Events;

    protected $table = 'cpm_meta';

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