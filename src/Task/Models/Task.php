<?php

namespace WeDevs\PM\Task\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\Task\Task_Model_Trait;
use WeDevs\PM\Task_List\Models\Task_List;
use WeDevs\PM\Common\Models\Board;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\File\Models\File;
use WeDevs\PM\Comment\Models\Comment;
use WeDevs\PM\Common\Models\Assignee;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Common\Models\Meta;
use Carbon\Carbon;


class Task extends Eloquent {
    use Model_Events, Task_Model_Trait;

    protected $table = 'pm_tasks';

    const INCOMPLETE = 0;
    const COMPLETE   = 1;
    const PENDING    = 2;

    protected $prefix;

    public function __construct() {
        global $wpdb;
        $this->prefix = $wpdb->prefix;
    }

    protected $fillable = [
        'title',
        'description',
        'estimation',
        'start_at',
        'due_date',
        'complexity',
        'priority',
        'payable',
        'recurrent',
        'status',
        'project_id',
        'parent_id',
        'created_by',
        'updated_by'
    ];

    protected $dates = ['start_at', 'due_date'];

    protected $attributes = [
        'priority' => 1,
    ];

    public function scopeCompleted($query) {
        return $query->where('status', Task::COMPLETE);
    }

    public function scopeIncomplete($query) {
        return $query->where('status', Task::INCOMPLETE);
    }

    public function scopeOverdue( $query ) {
        $today = Carbon::now();
        return $query->whereDate('due_date', '<', $today);
    }

    public function scopeParent( $query ){
        return $query->where('parent_id', 0);
    }

    public function task_lists() {
        return $this->belongsToMany( 'WeDevs\PM\Task_List\Models\Task_List', $this->prefix . 'pm_boardables', 'boardable_id', 'board_id' )
            ->where( pm_tb_prefix() . 'pm_boardables.board_type', 'task_list')
            ->where( pm_tb_prefix() . 'pm_boardables.boardable_type', 'task');
    }

    public function boards() {
        return $this->belongsToMany( 'WeDevs\PM\Common\Models\Board', $this->prefix . 'pm_boardables', 'boardable_id', 'board_id' )
            ->where( pm_tb_prefix() . 'pm_boardables.boardable_type', 'task');
    }

    public function boardables() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Boardable', 'boardable_id' )->where( 'boardable_type', 'task' );
    }

    public function files() {
        return $this->hasMany( 'WeDevs\PM\File\Models\File', 'fileable_id' )->where( 'fileable_type', 'task' );
    }

    public function comments() {
        return $this->hasMany( 'WeDevs\PM\Comment\Models\Comment', 'commentable_id' )->where( 'commentable_type', 'task' );
    }

    public function assignees() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Assignee', 'task_id' );
    }

    public function projects() {
        return $this->belongsTo( 'WeDevs\PM\Project\Models\Project', 'project_id');
    }

    public function task_model( $key = '' ) {
        return apply_filters( 'task_model', $this, $key );
    }

    public function metas() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Meta', 'entity_id' )
            ->where( 'entity_type', 'task' );
    }

}
