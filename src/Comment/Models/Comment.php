<?php

namespace WeDevs\PM\Comment\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
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

    /**
     * Relations a comment list renders, replies included, for eager loading
     * so a thread costs a fixed number of queries instead of several per comment.
     *
     * @return array
     */
    public static function thread_relations() {
        return [
            'files',
            'creator',
            'updater',
            'replies' => function ( $query ) {
                $query->orderBy( 'created_at', 'ASC' )->orderBy( 'id', 'ASC' );
            },
            'replies.files',
            'replies.creator',
            'replies.updater',
        ];
    }

    public function replies() {
        return $this->hasMany( $this, 'commentable_id' )->where( 'commentable_type', 'comment' );
    }

    public function files() {
        return $this->hasMany( 'WeDevs\PM\File\Models\File', 'fileable_id' )->where( 'fileable_type', 'comment' );
    }

    public static function parent_comment( $comment_id ) {
        $comment = self::find( $comment_id );

        if ( $comment && $comment->commentable_type == 'comment' ) {
            $comment = self::parent_comment( $comment->commentable_id );
        }

        return $comment;
    }

    public function discussion_board() {
        return $this->belongsTo('WeDevs\PM\Discussion_Board\Models\Discussion_Board', 'commentable_id');
    }

    public function task_list() {
        return $this->belongsTo( 'WeDevs\PM\Task_List\Models\Task_List', 'commentable_id');
    }

    public function task() {
        return $this->belongsTo( 'WeDevs\PM\Task\Models\Task', 'commentable_id');
    }

    public function setMentionedUsersAttribute( $value ) {
        $this->attributes['mentioned_users'] = serialize( $value );
    }

    public function getMentionedUsersAttribute( $value ) {
        return wedevs_pm_safe_unserialize( $value );
    }
}
