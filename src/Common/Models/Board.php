<?php

namespace PM\Common\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use PM\Common\Traits\Model_Events;

class Board extends Eloquent {

    use Model_Events;

    protected $table = 'pm_boards';

    protected $fillable = [
        'title',
        'description',
        'order',
        'project_id',
        'created_by',
        'updated_by',
    ];
}
