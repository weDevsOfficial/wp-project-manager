<?php

namespace WeDevs\PM\Task_List\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Comment\Models\Comment;
use WeDevs\PM\File\Models\File;
use WeDevs\PM\User\Models\User;
use WeDevs\PM\Milestone\Models\Milestone;

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

    protected $attributes = ['type' => 'task_list'];

    public function newQuery( $except_deleted = true ) {
        return parent::newQuery( $except_deleted )->where( 'type', '=', 'task_list' );
    }

    public function boardables() {
        return $this->hasMany( Boardable::class, 'board_id' )->where( 'board_type', 'task_list' );
    }

    public function tasks() {
        return $this->belongsToMany( Task::class, 'pm_boardables', 'board_id', 'boardable_id' )
            ->where( 'boardable_type', 'task' )
            ->where( 'board_type', 'task_list' )
            ->withPivot( 'order' );
    }

    public function comments() {
        return $this->hasMany( Comment::class, 'commentable_id' )->where( 'commentable_type', 'task_list' );
    }

    public function assignees() {
        return $this->belongsToMany( User::class, 'pm_boardables', 'board_id', 'boardable_id')
            ->where( 'board_type', 'task_list' )
            ->where( 'boardable_type', 'user' );
    }

    public function files() {
        return $this->hasMany( File::class, 'fileable_id' )->where( 'fileable_type', 'task_list' );
    }

    public function milestones() {
        return $this->belongsToMany( Milestone::class, 'pm_boardables', 'boardable_id', 'board_id' )
            ->where( 'board_type', 'milestone' )
            ->where( 'boardable_type', 'task_list' );
    }

}
