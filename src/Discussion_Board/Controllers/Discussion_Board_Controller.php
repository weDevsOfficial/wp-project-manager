<?php

namespace CPM\Discussion_Board\Controllers;

use WP_REST_Request;
use CPM\Discussion_Board\Models\Discussion_Board;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use CPM\Transformer_Manager;
use CPM\Discussion_Board\Transformer\Discussion_Board_Transformer;
use CPM\Common\Models\Boardable;
use CPM\Common\Traits\Request_Filter;
use CPM\Milestone\Models\Milestone;
use CPM\File\Models\File;

class Discussion_Board_Controller {

    use Transformer_Manager, Request_Filter;

    public function index( WP_REST_Request $request ) {
        $per_page = $request->get_param( 'per_page' );
        $per_page = $per_page ? $per_page : 15;

        $page = $request->get_param( 'page' );
        $page = $page ? $page : 1;

        $discussion_boards = Discussion_Board::orderBy( 'created_at', 'DESC' )
            ->paginate( $per_page, ['*'], 'page', $page );

        $discussion_board_collection = $discussion_boards->getCollection();

        $resource = new Collection( $discussion_board_collection, new Discussion_Board_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $discussion_boards ) );

        return $this->get_response( $resource );
    }

    public function show( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $discussion_board_id = $request->get_param( 'discussion_board_id' );

        $discussion_board = Discussion_Board::where( 'id', $discussion_board_id )
            ->where( 'project_id', $project_id )
            ->first();

        $resource = new Item( $discussion_board, new Discussion_Board_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        $data         = $this->extract_non_empty_values( $request );
        $milestone_id = $request->get_param( 'milestone' );
        $files        = $request->get_param( 'files' );

        $milestone = Milestone::find( $milestone_id );
        $discussion_board = Discussion_Board::create( $data );

        foreach ( $files as $file) {
             File::create([
                'fileable_id'   => $discussion_board->id,
                'fileable_type' => 'discussion-board',
                'attachment_id' => $file['id'],
            ]);
        }
       
        if ( $milestone ) {
            $this->attach_milestone( $discussion_board, $milestone );
        }

        $resource = new Item( $discussion_board, new Discussion_Board_Transformer );

        return $this->get_response( $resource );
    }

    public function update( WP_REST_Request $request ) {
        $data = $this->extract_non_empty_values( $request );

        $project_id = $request->get_param( 'project_id' );
        $discussion_board_id = $request->get_param( 'discussion_board_id' );
        $milestone_id = $request->get_param( 'milestone' );

        $milestone = Milestone::find( $milestone_id );
        $discussion_board = Discussion_Board::where( 'id', $discussion_board_id )
            ->where( 'project_id', $project_id )
            ->first();

        $discussion_board->update( $data );

        if ( $milestone ) {
            $this->attach_milestone( $discussion_board, $milestone );
        }

        $resource = new Item( $discussion_board, new Discussion_Board_Transformer );

        return $this->get_response( $resource );
    }

    public function destroy( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $discussion_board_id = $request->get_param( 'discussion_board_id' );

        $discussion_board = Discussion_Board::where( 'id', $discussion_board_id )
            ->where( 'project_id', $project_id )
            ->first();

        $comments = $discussion_board->comments;
        foreach ($comments as $comment) {
            $comment->replies()->delete();
            $comment->files()->delete();
        }
        $discussion_board->comments()->delete();
        $discussion_board->files()->delete();
        $discussion_board->users()->delete();

        $discussion_board->delete();
    }

    private function attach_milestone( Discussion_Board $board, Milestone $milestone ) {
        $boardable = Boardable::where( 'boardable_id', $board->id )
            ->where( 'boardable_type', 'discussion-board' )
            ->where( 'board_type', 'milestone' )
            ->first();

        if ( !$boardable ) {
            $boardable = Boardable::firstOrCreate([
                'boardable_id'   => $board->id,
                'boardable_type' => 'discussion-board',
                'board_id'       => $milestone->id,
                'board_type'     => 'milestone'
            ]);
        } else {
            $boardable->update([
                'board_id' => $milestone->id
            ]);
        }
    }

    public function attach_users( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $discussion_board_id = $request->get_param( 'discussion_board_id' );

        $discussion_board = Discussion_Board::where( 'id', $discussion_board_id )
            ->where( 'project_id', $project_id )
            ->first();

        $user_ids = explode( ',', $request->get_param( 'users' ) );

        if ( !empty( $user_ids ) ) {
            foreach ( $user_ids as $user_id ) {
                $data = [
                    'board_id' => $discussion_board->id,
                    'board_type' => 'discussion-board',
                    'boardable_id' => $user_id,
                    'boardable_type' => 'user'
                ];
                Boardable::firstOrCreate( $data );
            }
        }

        $resource = new Item( $discussion_board, new Discussion_Board_Transformer );

        return $this->get_response( $resource );
    }

    public function detach_users( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $discussion_board_id = $request->get_param( 'discussion_board_id' );

        $discussion_board = Discussion_Board::where( 'id', $discussion_board_id )
            ->where( 'project_id', $project_id )
            ->first();

        $user_ids = explode( ',', $request->get_param( 'users' ) );

        $discussion_board->users()->whereIn( 'boardable_id', $user_ids )->delete();

        $resource = new Item( $discussion_board, new Discussion_Board_Transformer );

        return $this->get_response( $resource );
    }
}