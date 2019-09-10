<?php

namespace WeDevs\PM\Discussion_Board\Controllers;

use WP_REST_Request;
use WeDevs\PM\Discussion_Board\Models\Discussion_Board;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Discussion_Board\Transformers\Discussion_Board_Transformer;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\Milestone\Models\Milestone;
use WeDevs\PM\File\Models\File;
use WeDevs\PM\Core\File_System\File_System;
use WeDevs\PM\Common\Traits\File_Attachment;
use Illuminate\Pagination\Paginator;

use WeDevs\PM\Task\Models\Task;

class Discussion_Board_Controller {

    use Transformer_Manager, Request_Filter, File_Attachment;

    public function index( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $per_page = $request->get_param( 'per_page' );
        $per_page = $per_page ? $per_page : 15;

        $page = $request->get_param( 'page' );
        $page = $page ? $page : 1;

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

        $discussion_boards = Discussion_Board::where( 'project_id', $project_id );
        $discussion_boards = apply_filters( 'pm_discuss_index_query', $discussion_boards, $project_id, $request );
        $discussion_boards = $discussion_boards->orderBy( 'created_at', 'DESC' )
                                ->paginate( $per_page );

        $discussion_board_collection = $discussion_boards->getCollection();

        $resource = new Collection( $discussion_board_collection, new Discussion_Board_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $discussion_boards ) );
        $resource = apply_filters( 'pm_get_messages',  $resource,  $request );
        return $this->get_response( $resource );
    }

    public function show( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $discussion_board_id = $request->get_param( 'discussion_board_id' );

        $discussion_board  = Discussion_Board::with('metas')->where( 'id', $discussion_board_id )->where( 'project_id', $project_id );
        $discussion_board = apply_filters( 'pm_discuss_show_query', $discussion_board, $project_id, $request );
        $discussion_board = $discussion_board->first();

        if ( $discussion_board == NULL ) {
            return $this->get_response( null,  [
                'message' => pm_get_text('success_messages.no_element')
            ] );
        }
        $resource = new Item( $discussion_board, new Discussion_Board_Transformer );
        $resource = apply_filters( 'pm_get_message',  $resource,  $request );
        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {

        $data = $this->extract_non_empty_values( $request );
        $media_data = $request->get_file_params();
        $milestone_id = $request->get_param( 'milestone' );
        $files = array_key_exists( 'files', $media_data ) ? $media_data['files'] : null;

        $is_private    = $request->get_param( 'privacy' );
        $data['is_private']    = $is_private == 'true' || $is_private === true ? 1 : 0;
        
        $milestone = Milestone::find( $milestone_id );
        $discussion_board = Discussion_Board::create( $data );

        if ( $milestone ) {
            $this->attach_milestone( $discussion_board, $milestone );
        }

        if ( $files ) {
            $this->attach_files( $discussion_board, $files );
        }
        do_action( 'pm_new_message_before_response', $discussion_board, $request->get_params() );
        $resource = new Item( $discussion_board, new Discussion_Board_Transformer );
        $message = [
            'message' => pm_get_text('success_messages.discuss_created')
        ];
        $resource = apply_filters( 'pm_ater_new_message',  $resource,  $request );
        $response = $this->get_response( $resource, $message );
        do_action( 'cpm_message_new', $discussion_board->id, $request->get_params( 'project_id' ), $request->get_params() );
        do_action( 'pm_after_new_message', $response, $request->get_params(), $discussion_board );
        return $response;
    }

    public function update( WP_REST_Request $request ) {
        $data                = $this->extract_non_empty_values( $request );
        $media_data          = $request->get_file_params();
        $project_id          = $request->get_param( 'project_id' );
        $discussion_board_id = $request->get_param( 'discussion_board_id' );
        $milestone_id        = $request->get_param( 'milestone' );
        $files               = array_key_exists( 'files', $media_data ) ? $media_data['files'] : null;
        $files_to_delete     = $request->get_param( 'files_to_delete' );

        $is_private    = $request->get_param( 'privacy' );
        $data['is_private']    = $is_private == 'true' || $is_private === true ? 1 : 0;

        $milestone = Milestone::find( $milestone_id );
        $discussion_board = Discussion_Board::with('metas')->where( 'id', $discussion_board_id )
            ->where( 'project_id', $project_id )
            ->first();

        $discussion_board->update_model( $data );

        if ( $milestone ) {
            $this->attach_milestone( $discussion_board, $milestone );
        }

        if ( $files ) {
            $this->attach_files( $discussion_board, $files );
        }

        if ( $files_to_delete ) {
            $this->detach_files( $discussion_board, $files_to_delete );
        }
        do_action( 'pm_update_message_before_response', $discussion_board, $request->get_params() );
        $resource = new Item( $discussion_board, new Discussion_Board_Transformer );

        $message = [
            'message' => pm_get_text('success_messages.discuss_updated')
        ];
        
        $resource = apply_filters( 'pm_ater_new_message',  $resource,  $request );
        $response = $this->get_response( $resource, $message );
        do_action( 'cpm_message_update', $discussion_board_id, $project_id, $request->get_params() );
        do_action( 'pm_after_update_message', $response, $request->get_params(), $discussion_board );
        return $response;
    }

    public function destroy( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $discussion_board_id = $request->get_param( 'discussion_board_id' );

        $discussion_board = Discussion_Board::where( 'id', $discussion_board_id )
            ->where( 'project_id', $project_id )
            ->first();
        do_action( 'pm_before_delete_message', $discussion_board, $request->get_params() );
        do_action( 'cpm_message_delete', $discussion_board_id, false );
        $comments = $discussion_board->comments;
        foreach ($comments as $comment) {
            $comment->replies()->delete();
            $this->detach_files( $comment );
        }
        $discussion_board->comments()->delete();
        $this->detach_files( $discussion_board );
        $discussion_board->users()->detach();

        $discussion_board->delete();

        $message = [
            'message' => pm_get_text('success_messages.discuss_deleted')
        ];
        do_action( 'pm_after_delete_message', $request->get_params() );
        return $this->get_response(false, $message);
    }

    private function attach_milestone( Discussion_Board $board, Milestone $milestone ) {
        $boardable = Boardable::where( 'boardable_id', $board->id )
            ->where( 'boardable_type', 'discussion_board' )
            ->where( 'board_type', 'milestone' )
            ->first();

        if ( !$boardable ) {
            $boardable = Boardable::firstOrCreate([
                'boardable_id'   => $board->id,
                'boardable_type' => 'discussion_board',
                'board_id'       => $milestone->id,
                'board_type'     => 'milestone'
            ]);
        } else {
            $boardable->update([
                'board_id'   => $milestone->id
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
                    'board_type' => 'discussion_board',
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

    public function privacy( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $discussion_board_id = $request->get_param( 'discussion_board_id' );
        $privacy = $request->get_param( 'is_private' );
        $discuss = Discussion_Board::find( $discussion_board_id );
        $discuss->update_model( [
            'is_private' => $privacy
        ] );
        pm_update_meta( $discussion_board_id, $project_id, 'discussion_board', 'privacy', $privacy );
        return $this->get_response( NULL);
    }
}



