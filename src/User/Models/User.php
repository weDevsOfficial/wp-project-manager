<?php

namespace WeDevs\PM\User\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use WeDevs\PM\Role\Models\Role;

class User extends Eloquent {
    protected $primaryKey = 'ID';

    protected $table = 'users';

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

    public function roles() {
        return $this->belongsToMany( Role::class, 'pm_role_user', 'user_id', 'role_id' )
            ->withPivot('project_id', 'role_id');
    }
}