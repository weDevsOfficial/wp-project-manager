<?php

namespace WeDevs\PM\Settings\Controllers;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use Illuminate\Pagination\Paginator;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Settings\Models\Task_Types;
use WeDevs\PM\Settings\Transformers\Task_Type_Transformer;
use WeDevs\PM\Settings\Models\Task_Type_Task;

class Task_Types_Controller {

    use Request_Filter, Transformer_Manager;

    public function index( WP_REST_Request $request ) {
        $per_page   = intval( $request->get_param( 'per_page' ) );
        $per_page   = $per_page ? $per_page : 500;
        $page       = intval( $request->get_param( 'page' ) );
        $page       = empty( $page ) ? 1 : $page;
        
        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

        $types = Task_Types::orderBy( 'id', 'DESC')
            ->paginate( $per_page );
        
        if ( $per_page == '-1' ) {
            $per_page = $types->count();
        }

        $type_collection = $types->getCollection();

        $resource = new Collection( $type_collection, new Task_Type_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $types ) );
        
        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        
        $title       = $request->get_param( 'title' );
        $description = $request->get_param( 'description' );
        $status      = $request->get_param( 'status' );
        $status      = $status != 0 ? 1 : 0;
        $type        = $request->get_param( 'type' );
        $type        = empty( $type ) ? 'task' : 'subtask';

        $task_type = Task_Types::create([
            'title'       => $title,
            'description' => $description,
            'type'        => $type,
            'status'      => $status,
            'created_by'  => get_current_user_id(),
            'updated_by'  => get_current_user_id()
        ]);

        $resource = new Item( $task_type, new Task_Type_Transformer );

        return $this->get_response( $resource );
    }

    public function update_task_type( WP_REST_Request $request ) {
        $id          = intval( $request->get_param( 'id' ) );
        $title       = $request->get_param( 'title' );
        $description = $request->get_param( 'description' );
        $type        = $request->get_param( 'type' );

        $type = [
            'title'       => $title,
            'description' => $description,
            'type'        => $type
        ];

        $stored_type = Task_Types::where( 'id', $id )
            ->first();

        $stored_type->update_model( $type );

        $resource = new Item( $stored_type, new Task_Type_Transformer );

        return $this->get_response( $resource );
    }

    public function destroy_task_type( WP_REST_Request $request ) {
        $id    = intval( $request->get_param( 'id' ) );

        $stored_type = Task_Types::where( 'id', $id )
            ->first();

        if ( $stored_type ) {
            $stored_type->delete();
            $this->destroy_task_type_task_relation_type( $id );
        }

        $resource = new Item( $stored_type, new Task_Type_Transformer );

        return $this->get_response( $resource );
    }

    public function destroy_task_type_task_relation_type( $id ) {
        if ( ! is_array( $id ) ) {
            $id = [$id];
        }

        Task_Type_Task::whereIn( 'type_id', $id )->delete();
    }

    public static function destroy_task_type_task_relation_task( $id ) {
        if ( ! is_array( $id ) ) {
            $id = [$id];
        }

        Task_Type_Task::whereIn( 'task_id', $id )->delete();
    }
}



