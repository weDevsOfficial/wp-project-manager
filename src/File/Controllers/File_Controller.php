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
use WeDevs\PM\Common\Models\Meta;

class File_Controller {

    use Transformer_Manager, Request_Filter;

    public function index( WP_REST_Request $request ) {
        $project_id = intval( $request->get_param( 'project_id' ) );
        $per_page = intval( $request->get_param( 'per_page' ) );
        $per_page = $per_page ? $per_page : 200;

        $page = intval( $request->get_param( 'page' ) );
        $page = $page ? $page : 1;

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        }); 

        $files = File::with(['meta'])->where( 'project_id', $project_id );

        // Files flagged private are only visible to roles holding
        // view_private_file. This listing previously returned every file in the
        // project, so a client saw private uploads.
        $private_ids = self::private_file_ids( $project_id );

        if ( ! empty( $private_ids ) ) {
            $files = $files->whereNotIn( 'id', $private_ids );
        }

        $files = $files->paginate( $per_page );


        $file_collection = $files->getCollection();

        $resource = new Collection( $file_collection, new File_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $files ) );

        $response = $this->get_response( $resource );

        return apply_filters( 'wedevs_pm_after_get_files', $response, $files, $resource, $request->get_params() );
    }

    /**
     * Ids of files the current user may not see. Empty when the user holds
     * view_private_file, so managers and co-workers are unaffected.
     *
     * @param int $project_id
     * @return array
     */
    private static function private_file_ids( $project_id ) {
        if ( wedevs_pm_user_can( 'view_private_file', $project_id ) ) {
            return [];
        }

        // array_map, not Collection::map: the latter passes (value, key), and
        // intval()'s second argument is the numeric base, so every element after
        // the first would be reparsed in a bogus base and come back 0.
        return array_map( 'intval', Meta::where( 'project_id', $project_id )
            ->where( 'entity_type', 'file' )
            ->where( 'meta_key', 'private' )
            ->where( 'meta_value', 1 )
            ->pluck( 'entity_id' )
            ->all() );
    }

    public function show( WP_REST_Request $request ) {
        $file_id    = intval( $request->get_param( 'file_id' ) );
        $project_id = intval( $request->get_param( 'project_id' ) );

        // Bind the file to the gated project (IDOR guard).
        $file = File::where( 'id', $file_id )->where( 'project_id', $project_id )->first();

        if ( ! $file ) {
            return new \WP_Error( 'pm_file', __( 'File not found in this project.', 'wedevs-project-manager' ), [ 'status' => 404 ] );
        }

        if ( in_array( intval( $file->id ), self::private_file_ids( $project_id ), true ) ) {
            return new \WP_Error( 'pm_file', __( 'File not found in this project.', 'wedevs-project-manager' ), [ 'status' => 404 ] );
        }

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
        $file_id    = intval( $request->get_param( 'file_id' ) );
        $project_id = intval( $request->get_param( 'project_id' ) );
        $file_name  = sanitize_file_name( $request->get_param( 'name' ) );

        // Bind the file to the gated project (IDOR guard).
        $file = File::where( 'id', $file_id )->where( 'project_id', $project_id )->first();

        if ( ! $file ) {
            return new \WP_Error( 'pm_file', __( 'File not found in this project.', 'wedevs-project-manager' ), [ 'status' => 404 ] );
        }

        File_System::update( $file->attachment_id, array( 'name' => $file_name ) );

        $resource = new Item( $file, new File_Transformer );

        return $this->get_response( $resource );
    }

    public function destroy( WP_REST_Request $request ) {
        $file_id    = intval( $request->get_param( 'file_id' ) );
        $project_id = intval( $request->get_param( 'project_id' ) );

        // Bind the file to the gated project (IDOR guard).
        $file = File::where( 'id', $file_id )->where( 'project_id', $project_id )->first();

        if ( ! $file ) {
            wp_send_json_error( [ 'message' => __( 'File not found in this project.', 'wedevs-project-manager' ) ], 404 );
        }

        // A folder's children pointed at a row that no longer exists, so every
        // file inside a deleted folder became unreachable in the UI while its
        // blob and rows stayed behind. Move them up to the folder's own parent.
        File::where( 'parent', $file->id )
            ->where( 'project_id', $project_id )
            ->update( [ 'parent' => intval( $file->parent ) ] );

        // Privacy/title/description rows outlived the file they described.
        Meta::where( 'entity_id', $file->id )
            ->where( 'project_id', $project_id )
            ->where( 'entity_type', 'file' )
            ->delete();

        File_System::delete( $file->attachment_id );
        $file->delete();

        wp_send_json_success();
    }

    public function download( WP_REST_Request $request ) {
        $file_id    = intval( $request->get_param('file_id') );
        $project_id = intval( $request->get_param( 'project_id' ) );

        // Bind the requested id to a file in the gated project. The param may be
        // the pm_files id or the WP attachment id; either way it must resolve to a
        // row in THIS project (prevents streaming any attachment on the site).
        $file_row = File::where( 'project_id', $project_id )
            ->where( function( $query ) use ( $file_id ) {
                $query->where( 'id', $file_id )->orWhere( 'attachment_id', $file_id );
            } )->first();

        if ( ! $file_row ) {
            status_header( 404 );
            die( esc_html__( 'file not found', 'wedevs-project-manager' ) );
        }

        $attachment_id = intval( $file_row->attachment_id );

        //get file path
        $file = File_System::get_file( $attachment_id );
        $path = get_attached_file( $attachment_id );

        // Initialize WP_Filesystem
        global $wp_filesystem;
        if ( empty( $wp_filesystem ) ) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            WP_Filesystem();
        }

        if ( ! $wp_filesystem->exists( $path ) ) {
            header( "Status: 404 Not Found" );
            die( esc_html__( 'file not found', 'wedevs-project-manager' ) );
        }

        $file_name = basename( $path );

        $mime_type = empty( $file['mime_type'] ) ? 'application/force-download' : $file['mime_type'];

        // serve the file with right header
        if ( $wp_filesystem->is_readable( $path ) ) {
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

            // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Binary file content for download must not be escaped
            echo $wp_filesystem->get_contents( $path );
        }

        exit;
    }

    function get_mime_type_icon( WP_REST_Request $request ) {
        $type = $request->get_param( 'type' );

        wp_send_json_success([
            'icon' => wp_mime_type_icon( $type )
        ]);
    }
}




