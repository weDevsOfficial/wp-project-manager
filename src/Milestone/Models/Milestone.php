<?php

namespace CPM\Milestone\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;
use CPM\Task_List\Models\Task_List;
use CPM\Task\Models\Task;
use CPM\Common\Models\Boardable;
use CPM\Common\Models\Meta;

class Milestone extends Eloquent {
    use Model_Events;

    protected $table = 'cpm_boards';

    protected $fillable = [
        'title',
        'description',
        'order',
        'project_id',
        'created_by',
        'updated_by',
    ];

    protected $attributes = ['type' => 'milestone'];

    public function newQuery( $except_deleted = true ) {
        return parent::newQuery( $except_deleted )->where( 'type', '=', 'milestone' );
    }

    public function metas() {
        return $this->hasMany( Meta::class, 'entity_id' )
            ->where( 'entity_type', 'milestone' );
    }

    public function task_lists() {
        return $this->belongsToMany( Task_List::class, 'cpm_boardables', 'board_id', 'boardable_id' )
            ->where( 'boardable_type', 'task-list' )
            ->where( 'board_type', 'milestone' );
    }

    public function tasks() {
        return $this->belongsToMany( Task::class, 'cpm_boardables', 'board_id', 'boardable_id' )
            ->where( 'boardable_type', 'task' )
            ->where( 'board_type', 'milestone' );
    }

    public function boardables() {
        return $this->hasMany( Boardable::class, 'board_id' )->where( 'board_type', 'milestone' );
    }
}
