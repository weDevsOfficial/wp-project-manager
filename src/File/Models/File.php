<?php

namespace WeDevs\PM\File\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\User\Models\User;
use WeDevs\PM\Comment\Models\Comment;
use WeDevs\PM\Common\Models\Board;

class File extends Eloquent {
    use Model_Events;

    protected $table = 'pm_files';

    protected $fillable = [
        'fileable_id',
        'fileable_type',
        'parent',
        'type',
        'attachment_id',
        'parent',
        'project_id',
        'created_by',
        'updated_by'
    ];

    public function comment() {
        return $this->hasOne( 'WeDevs\PM\Comment\Models\Comment', 'id', 'fileable_id');
        return $this->belongsToMany( 'WeDevs\PM\Common\Models\Board', pm_tb_prefix() . 'pm_comments', 'id', 'commentable_id', 'fileable_id');
    }

    public function meta() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Meta', 'entity_id' )->where('entity_type', 'file');
    }

    public function children() {
        return $this->hasMany( $this, 'parent' );
    }





}
