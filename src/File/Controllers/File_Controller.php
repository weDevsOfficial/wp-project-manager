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
use CPM\Common\Traits\Request_Filter;

class File_Controller {

    use Transformer_Manager, Request_Filter;

    public function index( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $per_page = $request->get_param( 'per_page' );
        $per_page = $per_page ? $per_page : 15;

        $page = $request->get_param( 'page' );
        $page = $page ? $page : 1;

        $files = File::where( 'project_id', $project_id)
            ->paginate( $per_page, ['*'], 'page', $page );

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
        $files = $request->get_file_params();

        $attachment_id = File_System::upload( $files );
        $request->set_param( 'attachment_id', $attachment_id );

        $data = $this->extract_non_empty_values( $request );

        $file     = File::create( $data );
        $resource = new Item( $file, new File_Transformer );

        return $this->get_response( $resource );
    }

    public function rename( WP_REST_Request $request ) {
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