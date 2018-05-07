<?php

namespace WeDevs\PM\User\Transformers;

use League\Fractal\TransformerAbstract;
use WeDevs\PM\User\Models\User;
use WeDevs\PM\Role\Transformers\Role_Transformer;

class User_Transformer extends TransformerAbstract {
    /**
     * List of resources to automatically include
     *
     * @var array
     */
    protected $defaultIncludes = [
        'roles'
    ];

    public function transform( $user ) {
        if (!$user) {
            return [];
        }

        $data = [
            'id'           => $user->ID,
            'username'     => $user->user_login,
            'nicename'     => $user->user_nicename,
            'email'        => $user->user_email,
            'profile_url'  => $user->user_url,
            'display_name' => $user->display_name,
            'avatar_url'   => get_avatar_url( $user->user_email ),
        ];

        return $data;
    }

    public function includeRoles( $user ) {
        if (!$user) {
            return null;
        }

        $request_uri = $_SERVER['REQUEST_URI'];
        $project_uri = preg_match_all('/projects\/[0-9]+/', $request_uri, $matches, PREG_SET_ORDER);

        if ( empty( $matches ) ) {
            $roles = $user->roles->unique( 'id' )->all();
        } else {
            $project_id = (int) str_replace('projects/', '', $matches[0][0]);
            $roles = $user->roles->filter( function( $role ) use ( $project_id ) {
                return $role['pivot']['project_id'] == $project_id ;
            });
        }

        return $this->collection( $roles, new Role_Transformer );
    }
}