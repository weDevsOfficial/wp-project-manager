<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Create_Task_List;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/task-lists', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@index' )
->permission([Access_Project::class]);

$router->post( 'projects/{project_id}/task-lists', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@store' )
->permission([Create_Task_List::class]);

$router->get( 'projects/{project_id}/task-lists/{task_list_id}', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@show' )
->permission([Access_Project::class]);

$router->put( 'projects/{project_id}/task-lists/{task_list_id}', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@update' )
->permission([Create_Task_List::class]);

$router->delete( 'projects/{project_id}/task-lists/{task_list_id}', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@destroy' )
->permission([Create_Task_List::class]);

$router->put( 'projects/{project_id}/task-lists/{task_list_id}/attach-users', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@attach_users' )
->permission([Create_Task_List::class]);

$router->put( 'projects/{project_id}/task-lists/{task_list_id}/detach-users', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@detach_users' )
->permission([Create_Task_List::class]);

$router->post( 'projects/{project_id}/task-lists/privacy/{task_list_id}', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@privacy' );