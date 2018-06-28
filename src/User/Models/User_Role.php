<?php

namespace WeDevs\PM\User\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Role\Models\Role;

class User_Role extends Eloquent {
    protected $table = 'pm_role_user';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'role_id',
        'project_id',
        'assigned_by',
    ];

    public static function boot() {
        parent::boot();

        static::saving( function ( $model ) {
            $model->assigned_by = 1;
        } );

        static::updating( function ( $model ) {
            $model->assigned_by = 1;
        } );
    }

    function role() {
        return $this->hasOne( 'WeDevs\PM\Role\Models\Role', 'id', 'role_id' );
    }

}