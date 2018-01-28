<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Create_Task;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/tasks', 'WeDevs/PM/Task/Controllers/Task_Controller@index' )
    ->permission([Authentic::class]);

$router->post( 'projects/{project_id}/tasks', 'WeDevs/PM/Task/Controllers/Task_Controller@store' )
    ->permission([Authentic::class, Create_Task::class]);

$router->get( 'projects/{project_id}/tasks/{task_id}', 'WeDevs/PM/Task/Controllers/Task_Controller@show' )
    ->permission([Authentic::class]);

$router->put( 'projects/{project_id}/tasks/{task_id}', 'WeDevs/PM/Task/Controllers/Task_Controller@update' )
    ->permission([Authentic::class, Create_Task::class]);

$router->delete( 'projects/{project_id}/tasks/{task_id}', 'WeDevs/PM/Task/Controllers/Task_Controller@destroy' )
    ->permission([Authentic::class, Create_Task::class]);

$router->put( 'projects/{project_id}/tasks/{task_id}/attach-users', 'WeDevs/PM/Task/Controllers/Task_Controller@attach_users' )
    ->permission([Authentic::class, Create_Task::class]);

$router->put( 'projects/{project_id}/tasks/{task_id}/detach-users', 'WeDevs/PM/Task/Controllers/Task_Controller@detach_users' )
    ->permission([Authentic::class, Create_Task::class]);

$router->put( 'projects/{project_id}/tasks/{task_id}/boards', 'WeDevs/PM/Task/Controllers/Task_Controller@attach_to_board' )
    ->permission([Authentic::class, Create_Task::class]);

$router->delete( 'projects/{project_id}/tasks/{task_id}/boards', 'WeDevs/PM/Task/Controllers/Task_Controller@detach_from_board' )
    ->permission([Authentic::class, Create_Task::class]);

$router->put( 'projects/{project_id}/tasks/reorder', 'WeDevs/PM/Task/Controllers/Task_Controller@reorder' )
    ->permission([Authentic::class, Create_Task::class]);