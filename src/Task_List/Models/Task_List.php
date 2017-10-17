<?php

namespace PM\Task_List\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use PM\Common\Traits\Model_Events;
use PM\Task\Models\Task;
use PM\Common\Models\Boardable;
use PM\Comment\Models\Comment;
use PM\File\Models\File;
use PM\User\Models\User;
use PM\Milestone\Models\Milestone;

class Task_List extends Eloquent {
    use Model_Events;

    protected $table = 'pm_boards';

    protected $fillable = [
        'title',
        'description',
        'order',
        'project_id',
        'created_by',
        'updated_by',
    ];

    protected $attributes = ['type' => 'task-list'];

    public function newQuery( $except_deleted = true ) {
        return parent::newQuery( $except_deleted )->where( 'type', '=', 'task-list' );
    }

    public function boardables() {
        return $this->hasMany( Boardable::class, 'board_id' )->where( 'board_type', 'task-list' );
    }

    public function tasks() {
        return $this->belongsToMany( Task::class, 'pm_boardables', 'board_id', 'boardable_id' )
            ->where( 'boardable_type', 'task' )
            ->where( 'board_type', 'task-list' )
            ->withPivot( 'order' );
    }

    public function comments() {
        return $this->hasMany( Comment::class, 'commentable_id' )->where( 'commentable_type', 'task-list' );
    }

    public function assignees() {
        return $this->belongsToMany( User::class, 'pm_boardables', 'board_id', 'boardable_id')
            ->where( 'board_type', 'task-list' )
            ->where( 'boardable_type', 'user' );
    }

    public function files() {
        return $this->hasMany( File::class, 'fileable_id' )->where( 'fileable_type', 'task-list' );
    }

    public function milestones() {
        return $this->belongsToMany( Milestone::class, 'pm_boardables', 'boardable_id', 'board_id' )
            ->where( 'board_type', 'milestone' )
            ->where( 'boardable_type', 'task-list' );
    }

}
