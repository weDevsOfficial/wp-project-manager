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

    protected $project_id = null;

    public function __construct( $project_id = null )
    {

        if ( !$project_id ) {
            $request_uri = $_SERVER['REQUEST_URI'];
            $project_uri = preg_match_all('/projects\/[0-9]+/', $request_uri, $matches, PREG_SET_ORDER);
            
            if ( !empty( $matches ) ) {
                $this->project_id = (int) str_replace('projects/', '', $matches[0][0]);
            } else {
                $this->project_id = null;
            }
        
        } else {
            $this->project_id = $project_id;

        }
    }

    public function transform( $user ) {
        if (!$user) {
            return [];
        }

        $data = [
            'id'           => (int) $user->ID,
            'username'     => $user->user_login,
            'nicename'     => $user->user_nicename,
            'email'        => $user->user_email,
            'profile_url'  => $user->user_url,
            'display_name' => $user->display_name,
            'avatar_url'   => get_avatar_url( $user->user_email ),
        ];

        if ( $user->pivot && $user->pivot->assigned_at ) {
            $data['completed_at'] = format_date( $user->pivot->completed_at );
            $data['started_at'] = format_date( $user->pivot->started_at );
            $data['assigned_at'] = format_date( $user->pivot->assigned_at );
            $data['status'] = (int) $user->pivot->status;
        }

        return $data;
    }

        /**
     * Getter for defaultIncludes.
     *
     * @return array
     */
    public function getDefaultIncludes()
    {
        return apply_filters( "pm_user_transformer_default_includes", $this->defaultIncludes );
    }

    public function includeRoles( $user ) {
        if (!$user) {
            return null;
        }

        
        //pmpr( $request_uri ); die();
        $project_id = $this->project_id;
        if ( !$project_id ) {
            $roles = $user->roles->unique( 'id' )->all();
        } else {
            $roles = $user->roles->filter( function( $role ) use ( $project_id ) {
                return $role['pivot']['project_id'] == $project_id;
            });
        }

        return $this->collection( $roles, new Role_Transformer );
    }
}