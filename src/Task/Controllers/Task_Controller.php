<?php

namespace CPM\Task\Controllers;

use Reflection;
use WP_REST_Request;
use CPM\Task\Models\Task;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use CPM\Transformer_Manager;
use CPM\Task\Transformer\Task_Transformer;
use CPM\Task_List\Models\Task_List;
use CPM\Project\Models\Project;
use CPM\Common\Models\Boardable;
use CPM\Common\Models\Board;

class Task_Controller {
    use Transformer_Manager;

    public function index( WP_REST_Request $request ) {
        // $tasks = Task::paginate(3, ['*'], 'page', $request->get_param( 'page' ));
        $tasks = Task::paginate();

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
        $data = $request->get_params();
        $data = array_filter( $data );

        $project_id = $request->get_param( 'project_id' );
        $board_id   = $request->get_param( 'board_id' );

        $board = Board::find( $board_id );

        $task = Task::create( $data );

        if ( $board ) {
            $boardable = Boardable::create([
                'board_id'       => $board->id,
                'board_type'     => $board->type,
                'boardable_id'   => $task->id,
                'boardable_type' => 'task',
            ]);
        }

        $resource = new Item( $task, new Task_Transformer );

        return $this->get_response( $resource );
    }

    public function update( WP_REST_Request $request ) {
        $data = $request->get_params();
        $data = array_filter( $data );

        $task = Task::findOrFail( $data['task_id'] );
        $task->update( $data );

        $resource = new Item( $task, new Task_Transformer );

        return $this->get_response( $resource );
    }

    public function destroy( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $task_id    = $request->get_param( 'task_id' );

        $task = Task::where( 'id', $task_id )
            ->where( 'project_id', $project_id )
            ->first();

        $task->boardables()->delete();

        $task->delete();
    }

    public function attach_to_board( WP_REST_Request $request ) {
        $task_id  = $request->get_param( 'task_id' );
        $board_id = $request->get_param( 'board_id' );

        $task  = Task::findOrFail( $task_id );
        $board = Board::findOrFail( $board_id );

        $boardable = Boardable::create( [
            'board_id'       => $board->id,
            'board_type'     => $board->type,
            'boardable_id'   => $task->id,
            'boardable_type' => 'task',
        ] );
    }
}