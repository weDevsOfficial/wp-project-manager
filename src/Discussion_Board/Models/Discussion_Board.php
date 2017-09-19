<?php

namespace CPM\Discussion_Board\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;
use CPM\Comment\Models\Comment;
use CPM\File\Models\File;
use CPM\Common\Models\Boardable;
use CPM\User\Models\User;

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
}
