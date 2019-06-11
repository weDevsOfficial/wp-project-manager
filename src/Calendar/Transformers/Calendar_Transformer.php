<?php

namespace WeDevs\PM\Calendar\Transformers;

use League\Fractal\TransformerAbstract;
use WeDevs\PM\User\Models\User;

class Calendar_Transformer extends TransformerAbstract {

    protected $defaultIncludes = [
        'assignees'
    ];

    /**
     * Turn  events object into a generic array
     *
     * @return array
     */
    public function transform( $event ) {
        if( isset($event['metas'] ) ) {
            $meta = wp_list_pluck($event['metas'], 'meta_value',  'meta_key');
        }

        return [
            'id'            => (int) $event['id'],
            'title'         =>  $event['title'],
            'start'         =>  $this->getStart( $event ),
            'end'           =>  $this->getend( $event ),
            'status'        =>  array_key_exists('status', $event) ? $event['status'] : $meta['status'],
            'type'          => (isset($event['type']) && $event['type'] == 'milestone') ? 'milestone': 'task',
            'project_id'    => $event ['project_id'],
            'created_at'    => format_date($event['created_at']),
            'updated_at'    => format_date($event['updated_at']),
        ];
    }

    public function getend( $event ) {
        if( isset($event['metas'] ) ) {
            $meta = wp_list_pluck( $event['metas'], 'meta_value',  'meta_key' );
        }

        if ( isset( $event['due_date'] ) ) {
            return format_date( $event['due_date'] );
        } else if (array_key_exists( 'start_at', $event ) && !empty( $event['start_at'] )) {
            return format_date( $event['start_at']);
        } else if ( !empty( $meta['achieve_date'] ) ){
            return format_date( $meta['achieve_date'] );
        }else {
            return format_date( $event['created_at'] );
        }

    }

    public function getStart( $event ) {
        if( isset($event['metas'] ) ) {
            $meta = wp_list_pluck( $event['metas'], 'meta_value',  'meta_key' );
        }

        if (array_key_exists( 'start_at', $event ) && !empty( $event['start_at'] )) {
            return format_date( $event['start_at']);
        }else if ( isset( $event['due_date'] ) ) {
            return format_date( $event['due_date'] );
        } else if ( !empty( $meta['achieve_date'] ) ){
            return format_date( $meta['achieve_date'] );
        }else {
            return format_date( $event['created_at'] );
        }

    }

    public function includeAssignees( $item ) {

        if( !isset( $item['assignees'] ) ) {
            return;
        }

        $user_ids = $item['assignees'];
        $user_ids = wp_list_pluck( $user_ids, 'assigned_to' );
        $users = User::whereIn( 'id', $user_ids )->get();

        return $this->collection( $users, function ( $user ) {
             return [
                'id'           => $user->ID,
                'username'     => $user->user_login,
                'nicename'     => $user->user_nicename,
                'email'        => $user->user_email,
                'profile_url'  => $user->user_url,
                'display_name' => $user->display_name,
                'avatar_url'   => get_avatar_url( $user->user_email ),
            ];
        } );

    }
}

