<?php

namespace CPM\Task\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;
use CPM\Task\Task_Model_Trait;

class Task extends Eloquent {
    use Model_Events, Task_Model_Trait;

    protected $table = 'cpm_tasks';

    protected $fillable = [
        'title',
        'description',
        'estimation',
        'start_at',
        'due_date',
        'complexity',
        'priority',
        'order',
        'payable',
        'recurrent',
        'status',
        'project_id',
        'category_id',
        'parent_id',
        'created_by',
        'updated_by'
    ];

    protected $dates = ['start_at', 'due_date'];
}
