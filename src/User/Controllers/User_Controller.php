<?php

namespace WeDevs\PM\User\Controllers;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\User\Models\User;
use WeDevs\PM\User\Transformers\User_Transformer;
use Illuminate\Support\Facades\Schema;
use Illuminate\Pagination\Paginator;
use WeDevs\PM\Calendar\Transformers\Calendar_Transformer;
use WeDevs\PM\User\Models\User_Role;
use WeDevs\PM\Activity\Transformers\Activity_Transformer;

class User_Controller {
    use Transformer_Manager, Request_Filter;

    public function index( WP_REST_Request $request ) {
        $id    = $request->get_param( 'id' );

        $per_page   = $request->get_param( 'per_page' );
        $per_page   = $per_page ? $per_page : 15;

        $page       = $request->get_param( 'page' );
        $page       = $page ? $page : 1;

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });
        if ( $id && is_array( $id ) ) {
            $users = User::find( $id );
            $resource = new Collection( $users, new User_Transformer );
        } else {
            $users = User::paginate( $per_page );
            $user_collection = $users->getCollection();
            $resource = new Collection( $user_collection, new User_Transformer );

            $resource->setPaginator( new IlluminatePaginatorAdapter( $users ) );
        }


        return $this->get_response( $resource );
    }

    public function show( WP_REST_Request $request ) {
        $id       = $request->get_param( 'id' );
        $user     = User::find( $id );
        $resource = new Item( $user, new User_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        // Extraction of user data from inputs
        $user_data = [
            'user_login'           => $request->get_param( 'username' ),
            'user_email'           => $request->get_param( 'email' ),
            'user_pass'            => $request->get_param( 'password' ),
            'user_nicename'        => $request->get_param( 'nicename' ),
            'display_name'         => $request->get_param( 'display_name' ),
            'first_name'           => $request->get_param( 'first_name' ),
            'last_name'            => $request->get_param( 'last_name' ),
            'nickname'             => $request->get_param( 'nickname' ),
            'user_url'             => $request->get_param( 'user_url' ),
            'description'          => $request->get_param( 'description' ),
            'locale'               => $request->get_param( 'locale' ),
            'rich_editing'         => $request->get_param( 'rich_editing' ),
            'comment_shortcuts'    => $request->get_param( 'comment_shortcuts' ),
            'admin_color'          => $request->get_param( 'admin_color' ),
            'show_admin_bar_front' => $request->get_param( 'show_admin_bar_front' ),
            'user_registered'      => $request->get_param( 'user_registered' ),
            'use_ssl'              => $request->get_param( 'use_ssl' ),
        ];
        $user_data = array_filter( $user_data );

        // User password insertion
        if ( !array_key_exists( 'user_pass', $user_data ) ) {
            $user_data['user_pass'] = wp_generate_password(
                $length = 12,
                $include_standard_special_chars = false
            );
        }

        // User creation
        $user_id = wp_insert_user( $user_data );

        if ( is_multisite() ) {
            $blog_id = get_current_blog_id();
            add_user_to_blog( $blog_id, $blog_id, 'subscriber' );
        }

        wp_send_new_user_notifications( $user_id );
        $user    = User::find( $user_id );

        // Transforming database model instance
        $resource = new Item( $user, new User_Transformer );

        return $this->get_response( $resource );
    }

    public function search( WP_REST_Request $request ) {
        $query_string = $request->get_param( 'query' );
        $limit        = $request->get_param( 'limit' );
        $term         = $request->get_param( 'term');
        
        $users = User::where( 'user_login', 'LIKE', '%' . $query_string . '%' )
            ->orWhere( 'user_nicename', 'LIKE', '%' . $query_string . '%' )
            ->orWhere( 'user_email', 'LIKE', '%' . $query_string . '%' )
            ->orWhere( 'user_url', 'LIKE', '%' . $query_string . '%')
            ->multisite();
        
        if ( $limit ) {
            $users =  $users->limit( intval( $limit ) )->get();
        } else {
            $users =  $users->get();
        }



//        $user_collection = $users->getCollection();
//        $resource = new Collection( $user_collection, new User_Transformer );
        $resource = new Collection( $users, new User_Transformer );

//        $resource->setPaginator( new IlluminatePaginatorAdapter( $users ) );

        return $this->get_response( $resource );
    }

    public function update_role( WP_REST_Request $request ) {
        // Extract user inputs
        $id         = $request->get_param( 'user_id' );
        $project_id = $request->get_param( 'project_id' );
        $role_ids   = $request->get_param( 'role_ids' );
        $role_ids   = explode( ',', $role_ids );

        // Associate roles and users
        if ( $project_id ) {
            foreach ( $role_ids as $role_id ) {
                $role_project_ids[$role_id] = ['project_id' => $project_id];
            }
            $role_ids = $role_project_ids;
        }

        $user = User::find( $id );
        $user->roles()->sync( $role_ids );

        // Transforming database model instance
        $resource = new Item( $user, new User_Transformer );

        return $this->get_response( $resource );
    }

    public function save_users_map_name(WP_REST_Request $request){
        $usernames = $request->get_params();
        foreach($usernames['usernames'] as $username_key => $username_value){
            $username_key_array = explode('_',$username_key);
            if(in_array('github',$username_key_array) || in_array('bitbucket',$username_key_array)){
                $user_meta_key = $username_key_array[0];
                $user_meta_id = $username_key_array[1];
                $user_meta_value = !empty($username_value) ? $username_value : '' ;
                update_user_meta($user_meta_id,$user_meta_key,$user_meta_value);
            }
        }
    }

    public function get_user_all_projects(WP_REST_Request $request) {
        global $wpdb;
        $type = $request->get_param('user_type');

        $role = '';

        if( $type == 'manager' ) {
            $role = ' AND rus.role_id=1';
        } else if ( $type == 'co_worker') {
            $role = ' AND rus.role_id=2';
        } else if ( $type == 'client' ) {
            $role = ' AND rus.role_id=3';
        }

        $tb_role_users = pm_tb_prefix() . 'pm_role_user';
        $tb_users       = $wpdb->base_prefix . 'users';
        $tb_user_meta   = $wpdb->base_prefix . 'usermeta';

        if ( is_multisite() ) {
            $meta_key = pm_user_meta_key();

            $sql = "SELECT DISTINCT us.ID as user_id, us.user_email as user_email, us.display_name as display_name
                FROM $tb_role_users as rus
                LEFT JOIN $tb_users as us ON us.ID=rus.user_id
                LEFT JOIN $tb_user_meta as umeta ON umeta.user_id = us.ID
                WHERE 1=1 
                AND umeta.meta_key='$meta_key'
                $role";
        } else {
             $sql = "SELECT DISTINCT us.ID as user_id, us.user_email as user_email, us.display_name as display_name
                FROM $tb_role_users as rus
                LEFT JOIN $tb_users as us ON us.ID=rus.user_id
                WHERE 1=1 $role";
        } 

        $users = $wpdb->get_results( $sql );

        foreach ( $users as $key => $user ) {
            $user->avatar_url = get_avatar_url( $user->user_email );
        }

        wp_send_json_success( $users );
    }
}
