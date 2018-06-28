<?php

namespace WeDevs\PM\Role\Controllers;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Role\Models\Role;
use WeDevs\PM\Role\Transformers\Role_Transformer;
use WeDevs\PM\Common\Traits\Request_Filter;

class Role_Controller {
    use Transformer_Manager, Request_Filter;

    public function index( WP_REST_Request $request ) {
        $roles = Role::where('status', 1)->paginate();
        $role_collection = $roles->getCollection();
        $resource = new Collection( $role_collection, new Role_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $roles ) );

        return $this->get_response( $resource );
    }

    public function show( WP_REST_Request $request ) {
        $id       = $request->get_param('id');
        $role     = Role::where('status', 1)->find( $id );
        $resource = new Item( $role, new Role_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        // Extraction of no empty inputs and create a role
        $data = $this->extract_non_empty_values( $request );
        $role = Role::create( $data );

        // Transforming database model instance
        $resource = new Item( $role, new Role_Transformer );

        return $this->get_response( $resource );
    }

    public function update( WP_REST_Request $request ) {
        $data = $this->extract_non_empty_values( $request );
        $role = Role::find( $request->get_param( 'id' ) );

        $role->update( $data );

        $resource = new Item( $role, new Role_Transformer );

        return $this->get_response( $resource );
    }

    public function destroy( WP_REST_Request $request ) {
        $id = $request->get_param( 'id' );
        $role = Role::find( $id );

        $role->delete();
    }
}