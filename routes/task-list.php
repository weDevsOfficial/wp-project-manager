<?php

use PM\Core\Router\Router;
use PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/task-lists', 'PM/Task_List/Controllers/Task_List_Controller@index' );
$router->post( 'projects/{project_id}/task-lists', 'PM/Task_List/Controllers/Task_List_Controller@store' );
$router->get( 'projects/{project_id}/task-lists/{task_list_id}', 'PM/Task_List/Controllers/Task_List_Controller@show' );
$router->put( 'projects/{project_id}/task-lists/{task_list_id}', 'PM/Task_List/Controllers/Task_List_Controller@update' );
$router->delete( 'projects/{project_id}/task-lists/{task_list_id}', 'PM/Task_List/Controllers/Task_List_Controller@destroy' );
$router->put( 'projects/{project_id}/task-lists/{task_list_id}/attach-users', 'PM/Task_List/Controllers/Task_List_Controller@attach_users' );
$router->put( 'projects/{project_id}/task-lists/{task_list_id}/detach-users', 'PM/Task_List/Controllers/Task_List_Controller@detach_users' );