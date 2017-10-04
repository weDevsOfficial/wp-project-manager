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
use CPM\Core\File_System\File_System;
use CPM\Common\Traits\File_Attachment;

class Discussion_Board_Controller {

    use Transformer_Manager, Request_Filter, File_Attachment;

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
        $data = $this->extract_non_empty_values( $request );
        $media_data = $request->get_file_params();
        $milestone_id = $request->get_param( 'milestone' );
        $files = array_key_exists( 'files', $media_data ) ? $media_data['files'] : null;

        $milestone = Milestone::find( $milestone_id );
        $discussion_board = Discussion_Board::create( $data );

        if ( $milestone ) {
            $this->attach_milestone( $discussion_board, $milestone );
        }

        if ( $files ) {
            $this->attach_files( $discussion_board, $files );
        }

        $resource = new Item( $discussion_board, new Discussion_Board_Transformer );

        return $this->get_response( $resource );
    }

    public function update( WP_REST_Request $request ) {
        $data = $this->extract_non_empty_values( $request );
        $media_data = $request->get_file_params();
        $project_id = $request->get_param( 'project_id' );
        $discussion_board_id = $request->get_param( 'discussion_board_id' );
        $milestone_id = $request->get_param( 'milestone' );
        $files = array_key_exists( 'files', $media_data ) ? $media_data['files'] : null;
        $files_to_delete = $request->get_param( 'files_to_delete' );

        $milestone = Milestone::find( $milestone_id );
        $discussion_board = Discussion_Board::where( 'id', $discussion_board_id )
            ->where( 'project_id', $project_id )
            ->first();

        $discussion_board->update( $data );

        if ( $milestone ) {
            $this->attach_milestone( $discussion_board, $milestone );
        }

        if ( $files ) {
            $this->attach_files( $discussion_board, $files );
        }

        if ( $files_to_delete ) {
            $this->detach_files( $discussion_board, $files_to_delete );
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
            $this->detach_files( $comment );
        }
        $discussion_board->comments()->delete();
        $this->detach_files( $discussion_board );
        $discussion_board->users()->detach();

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

        $user_ids = $request->get_param( 'users' );

        if ( is_array( $user_ids ) ) {
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

        $user_ids = $request->get_param( 'users' );

        if ( is_array( $user_ids ) ) {
            $discussion_board->users()->detach( $user_ids );
        }

        $resource = new Item( $discussion_board, new Discussion_Board_Transformer );

        return $this->get_response( $resource );
    }
}