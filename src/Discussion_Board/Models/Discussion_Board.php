<?php

namespace WeDevs\PM\Discussion_Board\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\Comment\Models\Comment;
use WeDevs\PM\File\Models\File;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\User\Models\User;
use WeDevs\PM\Milestone\Models\Milestone;
use WeDevs\PM\Common\Models\Meta;

class Discussion_Board extends Eloquent {
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

    protected $attributes = ['type' => 'discussion_board'];

    public function newQuery( $except_deleted = true ) {
        return parent::newQuery( $except_deleted )->where( 'type', '=', 'discussion_board' );
    }

    public function comments() {
        return $this->hasMany( 'WeDevs\PM\Comment\Models\Comment', 'commentable_id' )->where( 'commentable_type', 'discussion_board' );
    }

    public function files() {
        return $this->hasMany( 'WeDevs\PM\File\Models\File', 'fileable_id' )->where( 'fileable_type', 'discussion_board' );
    }

    public function users() {
        return $this->belongsToMany( 'WeDevs\PM\User\Models\User', pm_tb_prefix() . 'pm_boardables', 'board_id', 'boardable_id')
            ->where( 'board_type', 'discussion_board' )
            ->where( 'boardable_type', 'user' );
    }

    public function milestones() {
        return $this->belongsToMany( 'WeDevs\PM\Milestone\Models\Milestone', pm_tb_prefix() . 'pm_boardables', 'boardable_id', 'board_id' )
            ->where( 'board_type', 'milestone' )
            ->where( 'boardable_type', 'discussion_board' );
    }

    public function boardables() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Boardable', 'boardable_id' )->where( 'boardable_type', 'discussion_board' );
    }

    public function metas() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Meta', 'entity_id' )
            ->where( 'entity_type', 'discussion_board' );
    }

}
