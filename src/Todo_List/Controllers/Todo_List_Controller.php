<?php

namespace CPM\Todo_List\Controllers;

use WP_REST_Request;
use CPM\Todo_List\Models\Todo_List;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use CPM\Transformer_Manager;
use CPM\Todo_List\Transformer\Todo_List_Transformer;

class Todo_List_Controller {
    use Transformer_Manager;

    public function index( WP_REST_Request $request ) {
        $todo_lists = Todo_List::paginate();

        $todo_list_collection = $todo_lists->getCollection();

        $resource = new Collection( $todo_list_collection, new Todo_List_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $todo_lists ) );

        return $this->get_response( $resource );
    }
}