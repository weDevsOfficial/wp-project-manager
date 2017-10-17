<?php

namespace WeDevs\PM\Task\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\Task\Task_Model_Trait;
use WeDevs\PM\Task_List\Models\Task_List;
use WeDevs\PM\Common\Models\Board;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\File\Models\File;
use WeDevs\PM\Comment\Models\Comment;
use WeDevs\PM\Common\Models\Assignee;

class Task extends Eloquent {
    use Model_Events, Task_Model_Trait;

    protected $table = 'pm_tasks';

    const INCOMPLETE = 0;
    const COMPLETE   = 1;
    const PENDING    = 2;

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

    public function task_lists() {
        return $this->belongsToMany( Task_List::class, 'pm_boardables', 'boardable_id', 'board_id' )
            ->where('pm_boardables.board_type', 'task_list')
            ->where('pm_boardables.boardable_type', 'task');
    }

    public function boards() {
        return $this->belongsToMany( Board::class, 'pm_boardables', 'boardable_id', 'board_id' )
            ->where('pm_boardables.boardable_type', 'task');
    }

    public function boardables() {
        return $this->hasMany( Boardable::class, 'boardable_id' )->where( 'boardable_type', 'task' );
    }

    public function files() {
        return $this->hasMany( File::class, 'fileable_id' )->where( 'fileable_type', 'task' );
    }

    public function comments() {
        return $this->hasMany( Comment::class, 'commentable_id' )->where( 'commentable_type', 'task' );
    }

    public function assignees() {
        return $this->hasMany( Assignee::class, 'task_id' );
    }
}
