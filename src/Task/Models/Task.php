<?php

namespace CPM\Task\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;
use CPM\Task\Task_Status;

class Task extends Eloquent {
    use Model_Events, Task_Status;

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

    protected $dates = ['start_at', 'due_date'];
}
