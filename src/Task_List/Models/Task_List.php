<?php

namespace WeDevs\PM\Task_List\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Comment\Models\Comment;
use WeDevs\PM\File\Models\File;
use WeDevs\PM\User\Models\User;
use WeDevs\PM\Milestone\Models\Milestone;
use WeDevs\PM\Common\Models\Meta;
use WeDevs\PM\Common\Traits\Board_Status;

class Task_List extends Eloquent {
    use Model_Events, Board_Status;

    protected $table = 'pm_boards';

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

    protected $attributes = ['type' => 'task_list'];



    public function newQuery( $except_deleted = true ) {
        return parent::newQuery( $except_deleted )->where( 'type', '=', 'task_list' );
    }

    public function board() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Boardable', 'boardable_id' )->where( 'boardable_type', 'task_list' );
    }

    public function boardables() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Boardable', 'board_id' )->where( 'board_type', 'task_list' );
    }

    public function tasks( $project_id = false ) {
        $tasks = $this->belongsToMany( 'WeDevs\PM\Task\Models\Task', pm_tb_prefix() . 'pm_boardables', 'board_id', 'boardable_id' )
            ->where( pm_tb_prefix() . 'pm_boardables.boardable_type', 'task' )
            ->where( pm_tb_prefix() . 'pm_boardables.board_type', 'task_list' )
            ->withPivot( 'order' );

        if ( $project_id ) {
            $tasks = apply_filters( 'pm_filter_task_permission', $tasks,  $project_id );
        }

        return $tasks;
    }

    public function comments() {
        return $this->hasMany( 'WeDevs\PM\Comment\Models\Comment', 'commentable_id' )->where( 'commentable_type', 'task_list' );
    }

    public function assignees() {
        return $this->belongsToMany( 'WeDevs\PM\User\Models\User', pm_tb_prefix() . 'pm_boardables', 'board_id', 'boardable_id')
            ->where( 'board_type', 'task_list' )
            ->where( 'boardable_type', 'user' );
    }

    public function files() {
        return $this->hasMany( 'WeDevs\PM\File\Models\File', 'fileable_id' )->where( 'fileable_type', 'task_list' );
    }

    public function milestones() {
        return $this->belongsToMany( 'WeDevs\PM\Milestone\Models\Milestone', pm_tb_prefix() . 'pm_boardables', 'boardable_id', 'board_id' )
            ->where( 'board_type', 'milestone' )
            ->where( 'boardable_type', 'task_list' );
    }

    public function metas() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Meta', 'entity_id' )
            ->where( 'entity_type', 'task_list' );
    }

    public function filter_privacy( $status ) {
        return $this->hasOne( 'WeDevs\PM\Common\Models\Meta', 'entity_id' )
            ->where( 'entity_type', 'task_list' )
            ->where( 'meta_key', 'privary' )
            ->where( 'meta_value', '!=', $status );
    }

    public static function latest_order($project_id) {
        return  self::where( 'type', 'task_list' )
            ->where('project_id', $project_id)
            ->whereNotIn('order', array('99999999', '999999'))
            ->max('order');
    }

}
