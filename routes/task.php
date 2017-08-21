<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/task-lists/{task_list_id}/tasks', 'CPM/Task/Controllers/Task_Controller@index' );
$router->post( 'projects/{project_id}/task-lists/{task_list_id}/tasks', 'CPM/Task/Controllers/Task_Controller@store' );
$router->get( 'projects/{project_id}/task-lists/{task_list_id}/tasks/{task_id}', 'CPM/Task/Controllers/Task_Controller@show' );
$router->put( 'projects/{project_id}/task-lists/{task_list_id}/tasks/{task_id}', 'CPM/Task/Controllers/Task_Controller@update' );
$router->delete( 'projects/{project_id}/task-lists/{task_list_id}/tasks/{task_id}', 'CPM/Task/Controllers/Task_Controller@destroy' );