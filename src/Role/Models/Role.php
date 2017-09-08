<?php

namespace CPM\Role\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;

class Role extends Eloquent {
    use Model_Events;

    protected $table = 'cpm_roles';

    protected $fillable = [
        'title',
        'description',
        'created_by',
        'updated_by',
    ];
}