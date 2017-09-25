<?php

namespace CPM\Activity\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Activity extends Eloquent {

    protected $table = 'cpm_activities';

    protected $fillable = [
        'act',
        'actor',
        'resource_id',
        'resource_type',
    ];
}