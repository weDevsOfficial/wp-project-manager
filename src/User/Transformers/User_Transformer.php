<?php

namespace CPM\User\Transformers;

use League\Fractal\TransformerAbstract;
use CPM\User\Models\User;

class User_Transformer extends TransformerAbstract {
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
}