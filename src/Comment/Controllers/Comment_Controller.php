<?php

namespace WeDevs\PM\Comment\Controllers;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Common\Traits\Last_Activity;
use WeDevs\PM\Comment\Transformers\Comment_Transformer;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\Comment\Models\Comment;
use WeDevs\PM\Core\File_System\File_System;
use WeDevs\PM\File\Models\File;
use WeDevs\PM\Common\Traits\File_Attachment;
use WeDevs\PM\File\Helper\File as HelperFile;

class Comment_Controller {

    use Transformer_Manager, Request_Filter, File_Attachment, Last_Activity;

    public function index( WP_REST_Request $request ) {
        $project_id = intval( $request->get_param( 'project_id' ) );
        $per_page = intval( $request->get_param( 'per_page' ) );
        $page     = intval( $request->get_param( 'page' ) );

        $per_page = $per_page ? $per_page : wedevs_pm_config('app.comment_per_page');
        $page     = $page ? $page : 1;

        $on = $request->get_param( 'on' );
        $id = intval( $request->get_param( 'id' ) );
        $by = $request->get_param( 'by' );

        if ( $on ) {
            $query = Comment::where( 'commentable_type', $on );
        }

        if ( $id ) {
            $query = $query->where( 'commentable_id', $id );
        }

        if ( $by ) {
            $query = $query->where( 'created_by', $by );
        }

        if ( $query ) {
            $comments = $query->where( 'project_id', $project_id )
                ->orderBy( 'created_at', 'ASC' )
                ->paginate( $per_page, ['*'], 'page', $page );
        } else {
            $comments = Comment::where( 'project_id', $project_id )
                ->orderBy( 'created_at', 'ASC' )
                ->paginate( $per_page, ['*'], 'page', $page );
        }

        $comment_collection = $comments->getCollection();

        $resource = new Collection( $comment_collection, new Comment_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $comments ) );

        return $this->get_response( $resource );
    }

    public function show( WP_REST_Request $request ) {
        $comment_id = intval( $request->get_param( 'comment_id' ) );
        $project_id = intval( $request->get_param( 'project_id' ) );

        // Bind the comment to the gated project (IDOR guard).
        $comment = Comment::where( 'id', $comment_id )->where( 'project_id', $project_id )->first();

        if ( ! $comment ) {
            return new \WP_Error( 'pm_comment', __( 'Comment not found in this project.', 'wedevs-project-manager' ), [ 'status' => 404 ] );
        }
        $resource   = new Item( $comment, new Comment_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        $data       = $this->extract_non_empty_values( $request );
        $media_data = $request->get_file_params();
        $type       = $request->get_param('type');

        $commentable_type = $request->get_param( 'commentable_type' );
        $commentable_id = $request->get_param('commentable_id');
    
        $files      = array_key_exists( 'files', $media_data ) ? $media_data['files'] : null;

        $size_error = $files ? \WeDevs\PM\Core\File_System\File_System::size_limit_error( $files ) : '';

        if ( $size_error ) {
            return new \WP_Error( 'pm_file_too_large', $size_error, [ 'status' => 400 ] );
        }

        $comment = Comment::create( $data );

        if ( $type ) {
            $comment->type = $type;
        }

        if ( $files ) {
            $this->attach_files( $comment, $files );
        }

        $resource = new Item( $comment, new Comment_Transformer );

        $message = [
            'message' => __( 'Successfully commented.', 'wedevs-project-manager' ),
            'activity' => $this->last_activity( $commentable_type, $commentable_id ),
        ];

        do_action( 'wedevs_cpm_comment_new', $comment->id , $request->get_param('project_id'), $request->get_params() );
        
        $response = $this->get_response( $resource, $message );
        
        do_action( 'wedevs_pm_after_new_comment', $response, $request->get_params());
        
        return $response;
    }

    public function update( WP_REST_Request $request ) {
        // Grab non-empty inputs
        $data = $this->extract_non_empty_values( $request );

        // Grab file data inputs
        $media_data = $request->get_file_params();

        // An array of files
        $files = array_key_exists( 'files', $media_data ) ? $media_data['files'] : null;

        // An array of file ids that needs to be deleted
        $files_to_delete = $request->get_param( 'files_to_delete' );

        $project_id = intval( $request->get_param( 'project_id' ) );

        // Bind the comment to the gated project (IDOR guard).
        $comment = Comment::with('files')->where( 'id', intval( $data['comment_id'] ) )->where( 'project_id', $project_id )->first();

        if ( ! $comment ) {
            return new \WP_Error( 'pm_comment', __( 'Comment not found in this project.', 'wedevs-project-manager' ), [ 'status' => 404 ] );
        }

        $size_error = $files ? \WeDevs\PM\Core\File_System\File_System::size_limit_error( $files ) : '';

        if ( $size_error ) {
            return new \WP_Error( 'pm_file_too_large', $size_error, [ 'status' => 400 ] );
        }

        $comment->update( $data );

        if ( $files ) {
            $this->attach_files( $comment, $files );
        }

        if ( $files_to_delete ) {
            $this->detach_files( $comment, $files_to_delete );
        }

        $resource = new Item( $comment, new Comment_Transformer );

        $message = [
            'message' => __( 'A comment has been updated successfully.', 'wedevs-project-manager' ),
            'activity' => $this->last_activity( $comment->commentable_type, $comment->commentable_id  ),
        ];

        $response = $this->get_response( $resource, $message );
        do_action( 'wedevs_cpm_comment_update', $comment->id, $request->get_param('project_id'), $response );
        do_action( 'wedevs_pm_after_update_comment', $response, $request->get_params());
        return $response;
    }

    public function destroy( WP_REST_Request $request ) {
        $comment_id = intval( $request->get_param( 'comment_id' ) );
        $project_id = intval( $request->get_param( 'project_id' ) );

        // Bind the comment to the gated project (IDOR guard).
        $comment = Comment::where( 'id', $comment_id )->where( 'project_id', $project_id )->first();

        if ( ! $comment ) {
            wp_send_json_error( [ 'message' => __( 'Comment not found in this project.', 'wedevs-project-manager' ) ], 404 );
        }
        
        $resource_type = $comment->commentable_type;
        $resource_id = $comment->commentable_id;

        do_action( 'wedevs_cpm_comment_delete', $comment, false );
        $this->detach_files( $comment );
        $comment->replies()->delete();
        $comment->files()->delete();
        $comment->delete();

        $message = [
            'message' => __( 'A comment has been deleted successfully.', 'wedevs-project-manager' ),
            'activity' => $this->last_activity( $resource_type, $resource_id ),
        ];

        return $this->get_response(false, $message);
    }

}
