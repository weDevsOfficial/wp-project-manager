<?php

namespace WeDevs\PM\Task\Controllers;

use Reflection;
use WP_REST_Request;
use WeDevs\PM\Task\Models\Task;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Task\Transformers\Task_Transformer;
use WeDevs\PM\Task_List\Models\Task_List;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Common\Models\Board;
use WeDevs\PM\Common\Traits\Request_Filter;
use Carbon\Carbon;
use WeDevs\PM\Common\Models\Assignee;

class Task_Controller {

    use Transformer_Manager, Request_Filter;

    public function index( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $per_page = $request->get_param( 'per_page' );
        $per_page = $per_page ? $per_page : 5;
        $page = $request->get_param( 'page' );

        $tasks = Task::where( 'project_id', $project_id )
            ->orderBy( 'created_at', 'DESC')
            ->paginate( $per_page, ['*'], 'page', $page );

        $task_collection = $tasks->getCollection();

        $resource = new Collection( $task_collection, new Task_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $tasks ) );

        return $this->get_response( $resource );
    }

    public function show( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $task_id    = $request->get_param( 'task_id' );

        $task = Task::with('task_lists')->where( 'id', $task_id )
            ->where( 'project_id', $project_id )
            ->first();

        $resource = new Item( $task, new Task_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        $data          = $this->extract_non_empty_values( $request );
        $project_id    = $request->get_param( 'project_id' );
        $board_id      = $request->get_param( 'board_id' );
        $assignees     = $request->get_param( 'assignees' );

        $project       = Project::find( $project_id );
        $board         = Board::find( $board_id );

        if ( $project ) {
            $task = Task::create( $data );
        }

        if ( $task && $board ) {
            $latest_order = Boardable::latest_order( $board->id, $board->type, 'task' );
            $boardable    = Boardable::create([
                'board_id'       => $board->id,
                'board_type'     => $board->type,
                'boardable_id'   => $task->id,
                'boardable_type' => 'task',
                'order'          => $latest_order + 1,
            ]);
        }

        if ( is_array( $assignees ) && $task ) {
            $this->attach_assignees( $task, $assignees );
        }

        $resource = new Item( $task, new Task_Transformer );

        return $this->get_response( $resource );
    }

    private function attach_assignees( Task $task, $assignees = [] ) {
        foreach ( $assignees as $user_id ) {
            $data = [
                'task_id'     => $task->id,
                'assigned_to' => $user_id,
                'project_id'  => $task->project_id,
            ];

            $assignee = Assignee::firstOrCreate( $data );

            if ( !$assignee->assigned_at ) {
                $assignee->assigned_at = Carbon::now();
                $assignee->save();
            }
        }
    }

    private function update_task_status( Task $task ){
        $user = wp_get_current_user();
        $data = [
            'task_id'     => $task->id,
            'assigned_to' => $user->ID,
            'project_id'  => $task->project_id,
        ];

        $assignee = Assignee::firstOrCreate( $data );


        if(  $task->status == 'complete' && !$assignee->completed_at ){
            $assignee->completed_at = Carbon::now();
            $assignee->status = 2;
            $assignee->save();
        }

        if(  $task->status == 'incomplete' && $assignee->completed_at ){
            $assignee->completed_at = null;
            $assignee->status = 0;
            $assignee->save();
        }
    }

    public function update( WP_REST_Request $request ) {
        $data       = $this->extract_non_empty_values( $request );
        $project_id = $request->get_param( 'project_id' );
        $task_id    = $request->get_param( 'task_id' );
        $assignees  = $request->get_param( 'assignees' );

        $task = Task::where( 'project_id', $project_id )
            ->where( 'id', $task_id )
            ->first();

        if ( $task ) {
            $task->update_model( $data );
        }

        if ( is_array( $assignees ) && $task ) {
            $task->assignees()->whereNotIn( 'assigned_to', $assignees )->delete();
            $this->attach_assignees( $task, $assignees );
        }

        $this->update_task_status( $task );
        
        $resource = new Item( $task, new Task_Transformer );

        return $this->get_response( $resource );
    }

    public function destroy( WP_REST_Request $request ) {
        // Grab user inputs
        $project_id = $request->get_param( 'project_id' );
        $task_id    = $request->get_param( 'task_id' );

        // Select the task
        $task = Task::where( 'id', $task_id )
            ->where( 'project_id', $project_id )
            ->first();

        // Delete relations assoicated with the task
        $task->boardables()->delete();
        $task->files()->delete();
        $comments = $task->comments;
        foreach ($comments as $comment) {
            $comment->replies()->delete();
            $comment->files()->delete();
        }
        $task->comments()->delete();
        $task->assignees()->delete();

        // Delete the task
        $task->delete();
    }

    public function attach_to_board( WP_REST_Request $request ) {
        $task_id  = $request->get_param( 'task_id' );
        $board_id = $request->get_param( 'board_id' );

        $task  = Task::find( $task_id );
        $board = Board::find( $board_id );

        $latest_order = Boardable::latest_order( $board->id, $board->type, 'task' );
        $boardable    = Boardable::firstOrCreate([
            'board_id'       => $board->id,
            'board_type'     => $board->type,
            'boardable_id'   => $task->id,
            'boardable_type' => 'task',
            'order'          => $latest_order + 1,
        ]);

        $resource = new Item( $task, new Task_Transformer );

        return $this->get_response( $resource );
    }

    public function detach_from_board( WP_REST_Request $request ) {
        $task_id  = $request->get_param( 'task_id' );
        $board_id = $request->get_param( 'board_id' );

        $task  = Task::find( $task_id );
        $board = Board::find( $board_id );

        $boardable = Boardable::where( 'board_id', $board->id )
            ->where( 'board_type', $board->type )
            ->where( 'boardable_id', $task->id )
            ->where( 'boardable_type', 'task' )
            ->first();

        $boardable->delete();
    }

    public function attach_users( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $task_id    = $request->get_param( 'task_id' );
        $user_ids   = $request->get_param( 'users' );

        $project    = Project::find( $project_id );
        $task       = Task::where( 'id', $task_id )->where( 'project_id', $project_id )->first();

        if ( $project && $task && is_array( $user_ids ) ) {
            foreach ( $user_ids as $user_id ) {
                $data = [
                    'task_id'     => $task->id,
                    'assigned_to' => $user_id,
                    'assigned_at' => Carbon::now(),
                    'project_id'  => $project->id,
                ];
                Assignee::create( $data );
            }
        }

        $resource = new Item( $task, new Task_Transformer );

        return $this->get_response( $resource );
    }

    public function detach_users( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $task_id    = $request->get_param( 'task_id' );
        $user_ids   = $request->get_param( 'users' );

        $project    = Project::find( $project_id );
        $task       = Task::where( 'id', $task_id )
            ->where( 'project_id', $project_id )
            ->first();

        if ( $task && is_array( $user_ids ) ) {
            $task->assignees()->whereIn( 'assigned_to', $user_ids )->delete();
        }

        $resource = new Item( $task, new Task_Transformer );

        return $this->get_response( $resource );
    }

    public function reorder( WP_REST_Request $request ) {
        $board_id = $request->get_param( 'board_id' );
        $board_type = $request->get_param( 'board_type' );
        $task_orders = $request->get_param( 'task_orders' );

        if ( is_array( $task_orders ) ) {
            foreach ( $task_orders as $task_order ) {
                $boardable = Boardable::where( 'board_id', $board_id )
                    ->where( 'board_type', $board_type )
                    ->where( 'boardable_id', $task_order['id'] )
                    ->where( 'boardable_type', 'task' )
                    ->first();

                if ( $boardable ) {
                    $boardable->order = (int) $task_order['order'];
                    $boardable->save();
                }
            }
        }
    }

}