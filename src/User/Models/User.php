<?php

namespace WeDevs\PM\User\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Role\Models\Role;

class User extends Eloquent {
    protected $primaryKey = 'ID';

    protected $table = 'users';
    protected $hidden = ['user_pass', 'user_activation_key'];

    public $timestamps = false;

    protected $fillable = [
        'user_login',
        'user_nicename',
        'user_email',
        'user_url',
        'user_registered',
        'user_activation_key',
        'user_status',
        'display_name'
    ];

    protected $dates = ['user_registered'];

    public function getTable() {
        return $this->getConnection()->db->users;
    }

    public function roles() {
        return $this->belongsToMany( 'WeDevs\PM\Role\Models\Role', pm_tb_prefix() . 'pm_role_user', 'user_id', 'role_id' )
            ->withPivot('project_id', 'role_id');
    }
}