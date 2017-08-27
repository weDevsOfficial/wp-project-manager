<?php

namespace CPM\Common\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;

class Boardable extends Eloquent {
    use Model_Events;

    protected $table = 'cpm_boardables';

    protected $fillable = [
        'board_id',
        'board_type',
        'boardable_id',
        'boardable_type',
        'created_by',
        'updated_by',
    ];
}
