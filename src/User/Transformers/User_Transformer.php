<?php

namespace CPM\User\Transformers;

use League\Fractal\TransformerAbstract;
use CPM\User\Models\User;
use CPM\Role\Transformers\Role_Transformer;

class User_Transformer extends TransformerAbstract {
    /**
     * List of resources to automatically include
     *
     * @var array
     */
    protected $defaultIncludes = [
        'roles'
    ];

    public function transform( User $user ) {
        $data = [
            'id'           => $user->ID,
            'login_name'   => $user->user_login,
            'nicename'     => $user->user_nicename,
            'email'        => $user->user_email,
            'profile_url'  => $user->user_url,
            'display_name' => $user->display_name,
            'avatar_url'   => get_avatar_url( $user->user_email ),
        ];

        return $data;
    }

    public function includeRoles( User $user ) {
        $roles = $user->roles;

        return $this->collection( $roles, new Role_Transformer );
    }
}