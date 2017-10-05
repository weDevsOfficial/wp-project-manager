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

    const INCOMPLETE = 0;
    const COMPLETE   = 1;
    const OVERDUE    = 2;

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
        0 => 'incomplete',
        1 => 'complete',
        2 => 'overdue'
    ];

    public function newQuery( $except_deleted = true ) {
        return parent::newQuery( $except_deleted )->where( 'type', '=', 'milestone' );
    }

    public function getAchieveDateAttribute() {
        $meta = $this->metas->where( 'meta_key', 'achieve_date' )->first();

        if ( $meta && $meta->meta_value ) {
            $timezone = get_wp_timezone();
            $timezone = tzcode_to_tzstring( $timezone );

            return new Carbon( $meta->meta_value, $timezone );
        }

        return null;
    }

    public function getAchievedAtAttribute() {
        $meta  = $this->metas->where( 'meta_key', 'achieved_at' )->first();

        if ( $meta && $meta->meta_value ) {
            $timezone = get_wp_timezone();
            $timezone = tzcode_to_tzstring( $timezone );

            return new Carbon( $meta->meta_value, $timezone );
        }

        return null;
    }

    public function getStatusAttribute() {
        $achieved_at  = $this->achieved_at;
        $achieve_date = $this->achieve_date;
        $today        = Carbon::today();
        $status       = self::INCOMPLETE;

        if ( $achieved_at ) {
            $status = self::COMPLETE;
        } elseif ( $achieve_date && $achieve_date->diffInDays( $today, false ) > 0 ) {
            $status = self::OVERDUE;
        }

        return self::$status[$status];
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
