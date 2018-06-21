<?php

namespace WeDevs\PM\Milestone\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\Task_List\Models\Task_List;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Common\Models\Meta;
use Carbon\Carbon;
use WeDevs\PM\Discussion_Board\Models\Discussion_Board;

class Milestone extends Eloquent {

    use Model_Events;

    protected $table = 'pm_boards';

    const OVERDUE    = 0;
    const INCOMPLETE = 1;
    const COMPLETE   = 2;

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
        0 => 'overdue',
        1 => 'incomplete',
        2 => 'complete',
    ];

    public function newQuery( $except_deleted = true ) {
        return parent::newQuery( $except_deleted )->where( 'type', '=', 'milestone' );
    }

    public function getAchieveDateAttribute() {
    	if( $this->achieve_date_field ) {
    		return make_carbon_date( $this->achieve_date_field->meta_value );
    	}
    }

    public function getAchievedAtAttribute() {
        return $this->status_field->meta_value == self::COMPLETE ? $this->status_field->updated_at : null;
    }

    public function getStatusAttribute() {
        $status       = self::INCOMPLETE;
        $today        = Carbon::today();
        $achieved_at  = $this->achieved_at;
        $achieve_date = $this->achieve_date;

        if ( $achieved_at ) {
            $status = self::COMPLETE;
        } elseif ( $achieve_date && $achieve_date->diffInDays( $today, false ) > 0 ) {
            $status = self::OVERDUE;
        }

        $meta = Meta::firstOrCreate([
            'entity_id'   => $this->id,
            'entity_type' => 'milestone',
            'meta_key'    => 'status',
            'project_id'  => $this->project_id,
        ]);

        $meta->meta_value = $status;
        $meta->save();

        return self::$status[$status];
    }

    public function metas() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Meta', 'entity_id' )
            ->where( 'entity_type', 'milestone' );
    }

    public function achieve_date_field() {
        return $this->belongsTo( 'WeDevs\PM\Common\Models\Meta', 'id', 'entity_id' )
            ->where( 'entity_type', 'milestone' )
            ->where( 'meta_key', 'achieve_date' );
    }

    public function status_field() {
        return $this->belongsTo( 'WeDevs\PM\Common\Models\Meta', 'id', 'entity_id' )
            ->where( 'entity_type', 'milestone' )
            ->where( 'meta_key', 'status' );
    }

    public function task_lists() {
        return $this->belongsToMany( 'WeDevs\PM\Task_List\Models\Task_List', pm_tb_prefix() . 'pm_boardables', 'board_id', 'boardable_id' )
            ->where( 'boardable_type', 'task_list' )
            ->where( 'board_type', 'milestone' );
    }

    public function tasks() {
        return $this->belongsToMany( 'WeDevs\PM\Task\Models\Task', pm_tb_prefix() . 'pm_boardables', 'board_id', 'boardable_id' )
            ->where( 'boardable_type', 'task' )
            ->where( 'board_type', 'milestone' );
    }

    public function boardables() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Boardable', 'board_id' )->where( 'board_type', 'milestone' );
    }

    public function discussion_boards() {
        return $this->belongsToMany( 'WeDevs\PM\Discussion_Board\Models\Discussion_Board', pm_tb_prefix() . 'pm_boardables', 'board_id', 'boardable_id' )
            ->where( 'board_type', 'milestone' )
            ->where( 'boardable_type', 'discussion_board' );
    }

    public function project() {
        return $this->belongsTo( 'WeDevs\PM\Project\Models\Project', 'project_id' );
    }
}
