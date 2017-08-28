<?php

namespace CPM\Comment\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;

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
}
