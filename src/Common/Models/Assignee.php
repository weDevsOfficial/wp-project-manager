<?php

namespace WeDevs\PM\Common\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\User\Models\User;

class Assignee extends Eloquent {

    use Model_Events;

    protected $table = 'pm_assignees';

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

    public function assigned_user() {
        return $this->belongsTo( 'WeDevs\PM\User\Models\User', 'assigned_to' );
    }
}
