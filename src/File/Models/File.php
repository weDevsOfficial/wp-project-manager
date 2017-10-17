<?php

namespace PM\File\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use PM\Common\Traits\Model_Events;
use PM\User\Models\User;

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
