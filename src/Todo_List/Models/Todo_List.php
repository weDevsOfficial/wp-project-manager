<?php

namespace CPM\Todo_List\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;

class Todo_List extends Eloquent {
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

    protected $attributes = ['type' => 'todo-list'];
}
