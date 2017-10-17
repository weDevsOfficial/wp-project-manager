<?php

namespace PM\Discussion_Board\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use PM\Common\Traits\Model_Events;
use PM\Comment\Models\Comment;
use PM\File\Models\File;
use PM\Common\Models\Boardable;
use PM\User\Models\User;
use PM\Milestone\Models\Milestone;

class Discussion_Board extends Eloquent {
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

    protected $attributes = ['type' => 'discussion-board'];

    public function newQuery( $except_deleted = true ) {
        return parent::newQuery( $except_deleted )->where( 'type', '=', 'discussion-board' );
    }

    public function comments() {
        return $this->hasMany( Comment::class, 'commentable_id' )->where( 'commentable_type', 'discussion-board' );
    }

    public function files() {
        return $this->hasMany( File::class, 'fileable_id' )->where( 'fileable_type', 'discussion-board' );
    }

    public function users() {
        return $this->belongsToMany( User::class, 'cpm_boardables', 'board_id', 'boardable_id')
            ->where( 'board_type', 'discussion-board' )
            ->where( 'boardable_type', 'user' );
    }

    public function milestones() {
        return $this->belongsToMany( Milestone::class, 'cpm_boardables', 'boardable_id', 'board_id' )
            ->where( 'board_type', 'milestone' )
            ->where( 'boardable_type', 'discussion-board' );
    }

}
