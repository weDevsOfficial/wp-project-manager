<?php
namespace WeDevs\PM\Google_Workspace\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;

class Google_Drive_File extends Eloquent {

    protected $table = 'pm_google_drive_files';

    protected $fillable = [
        'project_id',
        'task_id',
        'user_id',
        'file_id',
        'name',
        'mime_type',
        'icon_link',
        'thumbnail_link',
        'web_view_link',
        'modified_time',
    ];
}
