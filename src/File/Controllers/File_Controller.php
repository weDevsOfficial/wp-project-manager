<?php

namespace WeDevs\PM\File\Controllers;

use WP_REST_Request;
use WeDevs\PM\File\Models\File;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\File\Transformers\File_Transformer;
use WeDevs\PM\Core\File_System\File_System;
use WeDevs\PM\Common\Traits\Request_Filter;
use Illuminate\Pagination\Paginator;

class File_Controller {

    use Transformer_Manager, Request_Filter;

    public function index( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $per_page = $request->get_param( 'per_page' );
        $per_page = $per_page ? $per_page : 200;

        $page = $request->get_param( 'page' );
        $page = $page ? $page : 1;

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        }); 

        $files = File::with(['meta'])->where( 'project_id', $project_id )
            ->paginate( $per_page );


        $file_collection = $files->getCollection();

        $resource = new Collection( $file_collection, new File_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $files ) );

        $response = $this->get_response( $resource );

        return apply_filters( 'pm_after_get_files', $response, $files, $resource, $request->get_params() );
    }

    public function show( WP_REST_Request $request ) {
        $file_id = $request->get_param( 'file_id' );
        $file = File::find( $file_id );

        $resource = new Item( $file, new File_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        $media_data = $request->get_file_params();
        $file = $media_data['file'];

        $attachment_id = File_System::upload( $file );
        $request->set_param( 'attachment_id', $attachment_id );

        $data = $this->extract_non_empty_values( $request );
        $file = File::create( $data );

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

    public function download( WP_REST_Request $request ) {
        $file_id = $request->get_param('file_id');

        //get file path
        $file = File_System::get_file( $file_id );
        $path = get_attached_file( $file_id );

        if ( ! file_exists( $path ) ) {
            header( "Status: 404 Not Found" );
            die( esc_html__( 'file not found', 'wedevs-project-manager' ) );
        }

        $file_name = basename( $path );
        
        $mime_type = empty( $file['mime_type'] ) ? 'application/force-download' : $file['mime_type'];

        // serve the file with right header
        if ( is_readable( $path ) ) {
            // header("Pragma: public");
            // header("Expires: 0");
            // header("Cache-Control: must-revalidate, post-check=0, pre-check=0"); 
            // header("Content-Type: application/force-download");
            // header("Content-Type: application/octet-stream");
            // header("Content-Type: application/download");
            // header("Content-Disposition: attachment; filename=$file_name");
            // header("Content-Transfer-Encoding: binary ");
            // readfile( $path );

            header( 'Content-Type: ' . $mime_type );
            header( 'Content-Transfer-Encoding: binary' );
            header( 'Content-Disposition: inline; filename=' . basename( $path ) );
            readfile( $path );
        }

        exit;
    }
}




