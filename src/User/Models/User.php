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

    public function projects() {
        return $this->belongsToMany( 'WeDevs\PM\Project\Models\Project', pm_tb_prefix() . 'pm_role_user', 'user_id', 'project_id' );
    }

    public function tasks() {
        return $this->belongsToMany( 'WeDevs\PM\Task\Models\Task', pm_tb_prefix() . 'pm_assignees','assigned_to', 'task_id' );
    }

    public function activities () {
        return $this->hasMany( 'WeDevs\PM\Activity\Models\Activity', 'actor_id' );
    }

    public function assignees() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Assignee', 'assigned_to' );
    }

    public function scopeMultisite( $q ) {
        global $wpdb;

        if ( is_multisite() ) {
            $user_meta_key = pm_user_meta_key();
            $usermeta_tb   = $wpdb->base_prefix . 'usermeta';
            $users_tb      = $wpdb->base_prefix . 'users';
            
            $q->leftJoin( $usermeta_tb . ' as umeta', 'umeta.user_id', '=', $users_tb . '.ID')
                ->where( 'umeta.meta_key', $user_meta_key );
        }
    }
}
