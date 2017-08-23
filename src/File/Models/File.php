<?php

namespace CPM\File\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;

class File extends Eloquent {
    use Model_Events;

    protected $table = 'cpm_files';

    protected $fillable = [
        'fileable_id',
        'fileable_type',
        'parent_id',
        'attachment_id',
        'created_by',
        'updated_by'
    ];

    protected $dates = ['attached_at'];
}
