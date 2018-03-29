<?php

namespace WeDevs\PM\Role\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;

class Role extends Eloquent {

    use Model_Events;

    protected $table = 'pm_roles';

    protected $fillable = [
        'title',
        'description',
        'created_by',
        'updated_by',
    ];
}