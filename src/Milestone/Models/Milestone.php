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
        'status',
        'is_private',
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

    public function setStatusAttribute( $value ) {

        $value = strtolower( $value );
        $key   = array_search( $value, self::$status );

        if ( array_key_exists( $value, self::$status ) ) {
            $this->attributes['status'] = $value;
        } else {
            $this->attributes['status'] = $key;
        }
    }

    public function getStatusAttribute( $value ) {
        $value = (int) $value;

        if ( array_key_exists( $value, self::$status ) ) {
            return self::$status[(int) $value];
        }

        return self::$status[0];
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
