<?php

namespace CPM\Comment\Controllers;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use CPM\Transformer_Manager;
use CPM\Comment\Transformers\Comment_Transformer;
use CPM\Common\Traits\Request_Filter;
use CPM\Comment\Models\Comment;
use CPM\Core\File_System\File_System;
use CPM\File\Models\File;
use CPM\Common\Traits\File_Attachment;

class Comment_Controller {

    use Transformer_Manager, Request_Filter, File_Attachment;

    public function index( WP_REST_Request $request ) {
        $on = $request->get_param( 'on' );
        $id = $request->get_param( 'id' );
        $by = $request->get_param( 'by' );

        if ( $on ) {
            $query = Comment::where('commentable_type', $on);
        }

        if ( $id ) {
            $query = $query->where('commentable_id', $id);
        }

        if ( $by ) {
            $query = $query->where('created_by', $by);
        }

        if ( $query ) {
            $comments = $query->paginate();
        } else {
            $comments = Comment::paginate();
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
        
        $files      = array_key_exists( 'files', $media_data ) ? $media_data['files'] : null;
echo '<pre>'; print_r( $files ); echo '</pre>'; die();
        $comment = Comment::create( $data );

        if ( $files ) {
            $this->attach_files( $comment, $files );
        }

        $resource = new Item( $comment, new Comment_Transformer );

        return $this->get_response( $resource );
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

        return $this->get_response( $resource );
    }

    public function destroy( WP_REST_Request $request ) {
        $comment_id = $request->get_param( 'comment_id' );
        $comment    = Comment::find( $comment_id );

        $this->detach_files( $comment );
        $comment->replies()->delete();
        $comment->files()->delete();
        $comment->delete();
    }
}