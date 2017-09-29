<?php

namespace CPM\Milestone\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;
use CPM\Task_List\Models\Task_List;
use CPM\Task\Models\Task;
use CPM\Common\Models\Boardable;
use CPM\Common\Models\Meta;
use Carbon\Carbon;
use CPM\Discussion_Board\Models\Discussion_Board;

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

    public static $status = [
        'incomplete',
        'complete',
        'overdue'
    ];

    public function newQuery( $except_deleted = true ) {
        return parent::newQuery( $except_deleted )->where( 'type', '=', 'milestone' );
    }

    public function getAchieveDateAttribute() {
        $achieve_date = $this->metas->where( 'meta_key', 'achieve_date' )->first();

        if ( $achieve_date ) {
            $timezone = get_wp_timezone();
            $timezone = tzcode_to_tzstring( $timezone );

            return new Carbon( $achieve_date->meta_value, $timezone );
        }

        return $achieve_date;
    }

    public function getStatusAttribute() {
        $status_meta = $this->metas->where( 'meta_key', 'status' )->first();
        $status = 'incomplete';

        if ( $status_meta ) {
            $status = $status_meta->meta_value;
        }

        if ( $this->achieve_date && $this->achieve_date < Carbon::now() ) {
            $status = 'overdue';
        }

        return $status;
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

    public function discussion_boards() {
        return $this->belongsToMany( Discussion_Board::class, 'cpm_boardables', 'board_id', 'boardable_id' )
            ->where( 'board_type', 'milestone' )
            ->where( 'boardable_type', 'discussion-board' );
    }
}
