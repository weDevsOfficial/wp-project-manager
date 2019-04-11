<?php

namespace WeDevs\PM\Comment\Controllers;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Common\Traits\Last_activity;
use WeDevs\PM\Comment\Transformers\Comment_Transformer;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\Comment\Models\Comment;
use WeDevs\PM\Core\File_System\File_System;
use WeDevs\PM\File\Models\File;
use WeDevs\PM\Common\Traits\File_Attachment;

class Comment_Controller {

    use Transformer_Manager, Request_Filter, File_Attachment, Last_activity;

    public function index( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $per_page = $request->get_param( 'per_page' );
        $page     = $request->get_param( 'page' );

        $per_page = $per_page ? $per_page : pm_config('app.comment_per_page');
        $page     = $page ? $page : 1;

        $on = $request->get_param( 'on' );
        $id = $request->get_param( 'id' );
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
        $comment_id = $request->get_param( 'comment_id' );
        $comment    = Comment::find( $comment_id );
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
        
        $comment = Comment::create( $data );

        if ( $type ) {
            $comment->type = $type;
        }

        if ( $files ) {
            $this->attach_files( $comment, $files );
        }

        $resource = new Item( $comment, new Comment_Transformer );

        $message = [
            'message' => pm_get_text('success_messages.comment_created'),
            'activity' => $this->last_activity( $commentable_type, $commentable_id ),
        ];

        do_action( 'cpm_comment_new', $comment->id , $request->get_param('project_id'), $request->get_params() );
        
        $response = $this->get_response( $resource, $message );
        
        do_action( 'pm_after_new_comment', $response, $request->get_params());
        
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

        $comment = Comment::with('files')->find( $data['comment_id'] );

        $comment->update( $data );

        if ( $files ) {
            $this->attach_files( $comment, $files );
        }

        if ( $files_to_delete ) {
            $this->detach_files( $comment, $files_to_delete );
        }

        $resource = new Item( $comment, new Comment_Transformer );

        $message = [
            'message' => pm_get_text('success_messages.comment_updated'),
            'activity' => $this->last_activity( $comment->commentable_type, $comment->commentable_id  ),
        ];

        $response = $this->get_response( $resource, $message );
        do_action( 'cpm_comment_update', $comment->id, $request->get_param('project_id'), $response );
        do_action( 'pm_after_update_comment', $response, $request->get_params());
        return $response;
    }

    public function destroy( WP_REST_Request $request ) {
        $comment_id = $request->get_param( 'comment_id' );
        $comment    = Comment::find( $comment_id );
        
        $resource_type = $comment->commentable_type;
        $resource_id = $comment->commentable_id;

        do_action( 'cpm_comment_delete', $comment, false );
        $this->detach_files( $comment );
        $comment->replies()->delete();
        $comment->files()->delete();
        $comment->delete();

        $message = [
            'message' => pm_get_text('success_messages.comment_deleted'),
            'activity' => $this->last_activity( $resource_type, $resource_id ),
        ];

        return $this->get_response(false, $message);
    }
}
