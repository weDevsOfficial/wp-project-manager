<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/task-lists', 'CPM/Task_List/Controllers/Task_List_Controller@index' );
$router->post( 'projects/{project_id}/task-lists', 'CPM/Task_List/Controllers/Task_List_Controller@store' );
$router->get( 'projects/{project_id}/task-lists/{task_list_id}', 'CPM/Task_List/Controllers/Task_List_Controller@show' );
$router->put( 'projects/{project_id}/task-lists/{task_list_id}', 'CPM/Task_List/Controllers/Task_List_Controller@update' );
$router->delete( 'projects/{project_id}/task-lists/{task_list_id}', 'CPM/Task_List/Controllers/Task_List_Controller@destroy' );