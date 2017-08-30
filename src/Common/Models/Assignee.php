<?php

namespace CPM\Common\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;

class Assignee extends Eloquent {
    use Model_Events;

    protected $table = 'cpm_assignees';

    protected $fillable = [
        'task_id',
        'assigned_to',
        'status',
        'assigned_at',
        'started_at',
        'completed_at',
        'created_by',
        'updated_by',
        'project_id'
    ];

    protected $dates = [
        'assigned_at', 'started_at', 'completed_at'
    ];
}
