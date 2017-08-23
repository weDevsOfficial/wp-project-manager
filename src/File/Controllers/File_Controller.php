<?php

namespace CPM\File\Controllers;

use WP_REST_Request;
use CPM\File\Models\File;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use CPM\Transformer_Manager;
use CPM\File\Transformer\File_Transformer;
use CPM\Core\File_System\File_System;

class File_Controller {
    use Transformer_Manager;

    public function index( WP_REST_Request $request ) {
        $files = File::paginate();

        $file_collection = $files->getCollection();

        $resource = new Collection( $file_collection, new File_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $files ) );

        return $this->get_response( $resource );
    }

    public function show( WP_REST_Request $request ) {
        $file_id = $request->get_param( 'file_id' );
        $file = File::find( $file_id );

        $resource = new Item( $file, new File_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        $attachment_id = File_System::upload( $request->get_file_params() );
        $request->set_param( 'attachment_id', $attachment_id );
        $data          = $request->get_params();

        $data = array_filter( $data );
        $file = File::create( array_filter( $data ) );

        $resource = new Item( $file, new File_Transformer );

        return $this->get_response( $resource );
    }

    public function update( WP_REST_Request $request ) {

        $file_id   = $request->get_param( 'file_id' );
        $file_name = $request->get_param( 'name' );
        $file      = File::find( $file_id );

        File_System::update( $file->attachment_id, array( 'name' => $file_name ) );

        $resource = new Item( $file, new File_Transformer );

        return $this->get_response( $resource );
    }

    public function destroy( WP_REST_Request $request ) {
        $file_id = $request->get_param( 'file_id' );
        
        $file = File::find( $file_id );
        File_System::delete( $file->attachment_id );
        $file->delete();
    }
}