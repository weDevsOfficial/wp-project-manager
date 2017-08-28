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

class Comment_Controller {
    use Transformer_Manager, Request_Filter;

    public function index( WP_REST_Request $request ) {
        $comments = Comment::paginate();
        $comment_collection = $comments->getCollection();

        $resource = new Collection( $comment_collection, new Comment_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $comments ) );

        return $this->get_response( $resource );
    }

    public function show( WP_REST_Request $request ) {
        $comment_id = $request->get_param( 'comment_id' );
        $comment    = Comment::with('replies')->find( $comment_id );
        $resource   = new Item( $comment, new Comment_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        $data     = $this->extract_non_empty_values( $request );
        $comment  = Comment::create( $data );
        $resource = new Item( $comment, new Comment_Transformer );

        return $this->get_response( $resource );
    }

    public function update( WP_REST_Request $request ) {
        $data       = $this->extract_non_empty_values( $request );
        $comment_id = $request->get_param( 'comment_id' );
        $comment    = Comment::find( $comment_id );
        $comment->update( $data );

        $resource = new Item( $comment, new Comment_Transformer );

        return $this->get_response( $resource );
    }

    public function destroy( WP_REST_Request $request ) {
        $comment_id = $request->get_param( 'comment_id' );
        $comment    = Comment::find( $comment_id );

        $comment->delete();
    }
}