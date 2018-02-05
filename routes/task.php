<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Create_Task;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/tasks', 'WeDevs/PM/Task/Controllers/Task_Controller@index' )
    ->permission([Access_Project::class]);

$router->post( 'projects/{project_id}/tasks', 'WeDevs/PM/Task/Controllers/Task_Controller@store' )
    ->permission([Create_Task::class]);

$router->get( 'projects/{project_id}/tasks/{task_id}', 'WeDevs/PM/Task/Controllers/Task_Controller@show' )
    ->permission([Access_Project::class]);

$router->put( 'projects/{project_id}/tasks/{task_id}', 'WeDevs/PM/Task/Controllers/Task_Controller@update' )
    ->permission([Access_Project::class]);

$router->delete( 'projects/{project_id}/tasks/{task_id}', 'WeDevs/PM/Task/Controllers/Task_Controller@destroy' )
    ->permission([Create_Task::class]);

$router->put( 'projects/{project_id}/tasks/{task_id}/attach-users', 'WeDevs/PM/Task/Controllers/Task_Controller@attach_users' )
    ->permission([Create_Task::class]);

$router->put( 'projects/{project_id}/tasks/{task_id}/detach-users', 'WeDevs/PM/Task/Controllers/Task_Controller@detach_users' )
    ->permission([Create_Task::class]);

$router->put( 'projects/{project_id}/tasks/{task_id}/boards', 'WeDevs/PM/Task/Controllers/Task_Controller@attach_to_board' )
    ->permission([Create_Task::class]);

$router->delete( 'projects/{project_id}/tasks/{task_id}/boards', 'WeDevs/PM/Task/Controllers/Task_Controller@detach_from_board' )
    ->permission([Create_Task::class]);

$router->put( 'projects/{project_id}/tasks/reorder', 'WeDevs/PM/Task/Controllers/Task_Controller@reorder' )
    ->permission([Create_Task::class]);