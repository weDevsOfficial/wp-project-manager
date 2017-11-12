<?php

namespace WeDevs\PM\File\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\User\Models\User;

class File extends Eloquent {
    use Model_Events;

    protected $table = 'pm_files';

    protected $fillable = [
        'fileable_id',
        'fileable_type',
        'directory',
        'attachment_id',
        'parent',
        'project_id',
        'created_by',
        'updated_by'
    ];
}
