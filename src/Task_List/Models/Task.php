<?php

namespace CPM\Task\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;

class Task extends Eloquent {
    use Model_Events;

    protected $table = 'cpm_tasks';

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
}
