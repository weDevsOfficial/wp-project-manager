<?php

namespace CPM\Foo\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class CPM_Project extends Eloquent {
    protected $table = 'cpm_projects';

    protected $fillable = [
        'title',
        'description',
        'category_id',
    ];
}