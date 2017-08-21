<?php

namespace CPM\Task_List\Controllers;

use WP_REST_Request;
use CPM\Task_List\Models\Task_List;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use CPM\Transformer_Manager;
use CPM\Task_List\Transformer\Task_List_Transformer;

class Task_List_Controller {
    use Transformer_Manager;

    public function index( WP_REST_Request $request ) {
        $task_lists = Task_List::paginate();

        $task_list_collection = $task_lists->getCollection();

        $resource = new Collection( $task_list_collection, new Task_List_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $task_lists ) );

        return $this->get_response( $resource );
    }

    public function show( WP_REST_Request $request ) {
        $project_id   = $request->get_param( 'project_id' );
        $task_list_id = $request->get_param( 'task_list_id' );

        $task_list = Task_List::where( 'id', $task_list_id )
            ->where( 'project_id', $project_id )
            ->first();

        $resource = new Item( $task_list, new Task_List_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        $data = [
            'title'       => $request->get_param( 'title' ),
            'description' => $request->get_param( 'description' ),
            'order'       => $request->get_param( 'order' ),
            'project_id'  => $request->get_param( 'project_id' )
        ];
        $data = array_filter( $data );

        $task_list = Task_List::create( $data );

        $resource = new Item( $task_list, new Task_List_Transformer );

        return $this->get_response( $resource );
    }

    public function update( WP_REST_Request $request ) {
        $project_id   = $request->get_param( 'project_id' );
        $task_list_id = $request->get_param( 'task_list_id' );

        $task_list = Task_List::where( 'id', $task_list_id )
            ->where( 'project_id', $project_id )
            ->first();

        $data = [
            'title'       => $request->get_param( 'title' ),
            'description' => $request->get_param( 'description' ),
            'order'       => $request->get_param( 'order' ),
        ];
        $data = array_filter( $data );

        $task_list->update( $data );

        $resource = new Item( $task_list, new Task_List_Transformer );

        return $this->get_response( $resource );
    }

    public function destroy( WP_REST_Request $request ) {
        $project_id   = $request->get_param( 'project_id' );
        $task_list_id = $request->get_param( 'task_list_id' );

        $task_list = Task_List::where( 'id', $task_list_id )
            ->where( 'project_id', $project_id )
            ->first();

        $task_list->delete();
    }
}