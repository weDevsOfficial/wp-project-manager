<?php

namespace CPM\Comment\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Common\Traits\Model_Events;
use CPM\File\Models\File;

class Comment extends Eloquent {

    use Model_Events;

    protected $table = 'cpm_comments';

    protected $fillable = [
        'content',
        'mentioned_users',
        'commentable_id',
        'commentable_type',
        'project_id',
        'created_by',
        'updated_by',
    ];

    public function replies() {
        return $this->hasMany( Comment::class, 'commentable_id' )->where( 'commentable_type', 'comment' );
    }

    public function files() {
        return $this->hasMany( File::class, 'fileable_id' )->where( 'fileable_type', 'comment' );
    }

    public static function parent_comment( $comment_id ) {
        $comment = self::find( $comment_id );

        if ( $comment && $comment->commentable_type == 'comment' ) {
            $comment = self::parent_comment( $comment->commentable_id );
        }

        return $comment;
    }
}
