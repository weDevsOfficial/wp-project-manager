<?php

namespace CPM\Task\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;
use CPM\Task\Task_Model_Trait;
use CPM\Task_List\Models\Task_List;
use CPM\Common\Models\Board;
use CPM\Common\Models\Boardable;
use CPM\File\Models\File;
use CPM\Comment\Models\Comment;

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

    protected $attributes = ['priority' => 1];

    public function task_lists() {
        return $this->belongsToMany( Task_List::class, 'cpm_boardables', 'boardable_id', 'board_id' )
            ->where('cpm_boardables.board_type', 'task-list')
            ->where('cpm_boardables.boardable_type', 'task');
    }

    public function boards() {
        return $this->belongsToMany( Board::class, 'cpm_boardables', 'boardable_id', 'board_id' )
            ->where('cpm_boardables.boardable_type', 'task');
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
}
