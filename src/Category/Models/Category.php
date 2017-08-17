<?php

namespace CPM\Category\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;

class Category extends Eloquent {
    use Model_Events;

    protected $table = 'cpm_categories';

    protected $fillable = [
        'title',
        'description',
        'categorible_type',
        'created_by',
        'updated_by',
    ];
}
