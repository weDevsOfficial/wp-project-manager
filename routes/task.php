<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Create_Task;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/tasks', 'WeDevs/PM/Task/Controllers/Task_Controller@index' )
    ->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$router->post( 'projects/{project_id}/tasks', 'WeDevs/PM/Task/Controllers/Task_Controller@store' )
    ->permission(['WeDevs\PM\Core\Permissions\Create_Task'])
    ->validator( 'WeDevs\PM\Task\Validators\Create_Task' );

$router->post( 'projects/{project_id}/tasks/sorting', 'WeDevs/PM/Task/Controllers/Task_Controller@task_sorting' );

$router->get( 'projects/{project_id}/tasks/{task_id}', 'WeDevs/PM/Task/Controllers/Task_Controller@show' )
    ->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$router->post( 'projects/{project_id}/tasks/{task_id}/update', 'WeDevs/PM/Task/Controllers/Task_Controller@update' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Task'])
    ->validator( 'WeDevs\PM\Task\Validators\Create_Task' );

$router->post( 'projects/{project_id}/tasks/{task_id}/change-status', 'WeDevs/PM/Task/Controllers/Task_Controller@change_status' )
    ->permission(['WeDevs\PM\Core\Permissions\Complete_Task']);

$router->post( 'projects/{project_id}/tasks/{task_id}/delete', 'WeDevs/PM/Task/Controllers/Task_Controller@destroy' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Task']);

$router->put( 'projects/{project_id}/tasks/{task_id}/attach-users', 'WeDevs/PM/Task/Controllers/Task_Controller@attach_users' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Task']);

$router->put( 'projects/{project_id}/tasks/{task_id}/detach-users', 'WeDevs/PM/Task/Controllers/Task_Controller@detach_users' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Task']);

$router->put( 'projects/{project_id}/tasks/{task_id}/boards', 'WeDevs/PM/Task/Controllers/Task_Controller@attach_to_board' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Task']);

$router->delete( 'projects/{project_id}/tasks/{task_id}/boards', 'WeDevs/PM/Task/Controllers/Task_Controller@detach_from_board' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Task']);

$router->put( 'projects/{project_id}/tasks/reorder', 'WeDevs/PM/Task/Controllers/Task_Controller@reorder' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);

$router->post( 'projects/{project_id}/tasks/privacy/{task_id}', 'WeDevs/PM/Task/Controllers/Task_Controller@privacy' )
->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);

