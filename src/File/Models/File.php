<?php

namespace CPM\File\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;

class File extends Eloquent {
    use Model_Events;

    protected $table = 'cpm_files';

    protected $fillable = [
        'title',
        'description',
        'estimation',
        'start_at',
        'due_date',
        'complexity',
        'payable',
        'recurrent',
        'priority',
        'order',
        'status',
        'project_id',
        'category_id',
        'parent_id',
        'updated_by'
    ];

    protected $dates = ['start_at', 'due_date'];
}
