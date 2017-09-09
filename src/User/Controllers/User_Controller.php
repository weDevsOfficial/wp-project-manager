<?php

namespace CPM\User\Controllers;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use CPM\Transformer_Manager;
use CPM\Common\Traits\Request_Filter;
use CPM\User\Models\User;
use CPM\User\Transformers\User_Transformer;

class User_Controller {
    use Transformer_Manager, Request_Filter;

    public function index( WP_REST_Request $request ) {
        $users = User::paginate();
        $user_collection = $users->getCollection();
        $resource = new Collection( $user_collection, new User_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $users ) );

        return $this->get_response( $resource );
    }

    public function show( WP_REST_Request $request ) {
        $id       = $request->get_param( 'id' );
        $user     = User::find( $id );
        $resource = new Item( $user, new User_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        // Extraction of no empty inputs
        $data = $this->extract_non_empty_values( $request );

        $user_name = $request->get_param( 'user_login' );
        $email = $request->get_param( 'user_email' );

        $random_password = wp_generate_password( $length = 12, $include_standard_special_chars = false );
        $user_id = wp_create_user( $user_name, $random_password, $email );
        $user = User::find( $user_id );

        $user->update( $data );

        // Transforming database model instance
        $resource = new Item( $user, new User_Transformer );

        return $this->get_response( $resource );
    }

    public function search( WP_REST_Request $request ) {
        $query_string = $request->get_param( 'q' );
        $users = User::where( 'user_login', 'LIKE', '%' . $query_string . '%' )
            ->orWhere( 'user_nicename', 'LIKE', '%' . $query_string . '%' )
            ->orWhere( 'user_email', 'LIKE', '%' . $query_string . '%' )
            ->orWhere( 'user_url', 'LIKE', '%' . $query_string . '%')
            ->paginate();

        $user_collection = $users->getCollection();
        $resource = new Collection( $user_collection, new User_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $users ) );

        return $this->get_response( $resource );
    }
}