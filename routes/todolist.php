<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/todo-lists', 'CPM/Todo_List/Controllers/Todo_List_Controller@index' );
$router->post( 'projects/{project_id}/todo-lists', 'CPM/Todo_List/Controllers/Todo_List_Controller@store' );
$router->get( 'projects/{project_id}/todo-lists/{todo_list_id}', 'CPM/Todo_List/Controllers/Todo_List_Controller@show' );
$router->put( 'projects/{project_id}/todolists/{milestone_id}', 'CPM/Milestone/Controllers/Milestone_Controller@update' );
$router->delete( 'projects/{project_id}/todolists/{milestone_id}', 'CPM/Milestone/Controllers/Milestone_Controller@destroy' );