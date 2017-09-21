<?php

namespace CPM\Common\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;

class Assignee extends Eloquent {

    protected $table = 'cpm_meta';

    protected $fillable = [
        'entity_id',
        'entity_type',
        'key',
        'value'
    ];
}