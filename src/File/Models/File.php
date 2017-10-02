<?php

namespace CPM\File\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;
use CPM\User\Models\User;

class File extends Eloquent {
    use Model_Events;

    protected $table = 'cpm_files';

    protected $fillable = [
        'fileable_id',
        'fileable_type',
        'directory',
        'attachment_id',
        'project_id',
        'created_by',
        'updated_by'
    ];
}
