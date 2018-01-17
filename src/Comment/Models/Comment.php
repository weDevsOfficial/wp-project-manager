<?php

namespace WeDevs\PM\Comment\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\File\Models\File;
use WeDevs\PM\Discussion_Board\Models\Discussion_Board;
use WeDevs\PM\Task_List\Models\Task_List;
use WeDevs\PM\Task\Models\Task;

class Comment extends Eloquent {

    use Model_Events;

    protected $table = 'pm_comments';

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

    public function discussion_board() {
        return $this->belongsTo(Discussion_Board::class, 'commentable_id');
    }

    public function task_list() {
        return $this->belongsTo(Task_List::class, 'commentable_id');
    }

    public function task() {
        return $this->belongsTo(Task::class, 'commentable_id');
    }
}
