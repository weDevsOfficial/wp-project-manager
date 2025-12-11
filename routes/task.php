<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Create_Task;
use WeDevs\PM\Core\Permissions\Administrator;

$wedevs_pm_router    = Router::singleton();
$authentic = 'WeDevs\PM\Core\Permissions\Authentic';

$wedevs_pm_router->get( 'projects/{project_id}/tasks', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'index'] )
    ->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$wedevs_pm_router->get( 'tasks', [\WeDevs\PM\Task\Helper\Task::class, 'get_tasks'] )
    ->permission( [ $wedevs_pm_authentic ] );

$wedevs_pm_router->get( 'advanced/tasks', [\WeDevs\PM\Task\Helper\Task::class, 'get_tasks'] )
    ->permission( [ $wedevs_pm_authentic ] );

$wedevs_pm_router->get( 'advanced/taskscsv', [\WeDevs\PM\Task\Helper\Task::class, 'get_taskscsv'] )
    ->permission( [ $wedevs_pm_authentic ] );

$wedevs_pm_router->post( 'projects/{project_id}/tasks', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'store'] )
    ->permission(['WeDevs\PM\Core\Permissions\Create_Task'])
    ->validator( 'WeDevs\PM\Task\Validators\Create_Task' )
    ->sanitizer( 'WeDevs\PM\Task\Sanitizers\Task_Sanitizer' );

$wedevs_pm_router->post( 'projects/{project_id}/tasks/sorting', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'task_sorting'] )
    ->permission( [ $wedevs_pm_authentic ] );

$wedevs_pm_router->get( 'projects/{project_id}/tasks/{task_id}', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'show'] )
    ->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$wedevs_pm_router->post( 'projects/{project_id}/tasks/{task_id}/update', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'update'] )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Task'])
    ->validator( 'WeDevs\PM\Task\Validators\Create_Task' )
    ->sanitizer( 'WeDevs\PM\Task\Sanitizers\Task_Sanitizer' );

$wedevs_pm_router->post( 'projects/{project_id}/tasks/{task_id}/change-status', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'change_status'] )
    ->permission(['WeDevs\PM\Core\Permissions\Complete_Task']);

$wedevs_pm_router->post( 'projects/{project_id}/tasks/{task_id}/delete', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'destroy'] )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Task']);

$wedevs_pm_router->put( 'projects/{project_id}/tasks/{task_id}/attach-users', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'attach_users'] )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Task']);

$wedevs_pm_router->put( 'projects/{project_id}/tasks/{task_id}/detach-users', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'detach_users'] )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Task']);

$wedevs_pm_router->put( 'projects/{project_id}/tasks/{task_id}/boards', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'attach_to_board'] )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Task']);

$wedevs_pm_router->delete( 'projects/{project_id}/tasks/{task_id}/boards', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'detach_from_board'] )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Task']);

$wedevs_pm_router->put( 'projects/{project_id}/tasks/reorder', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'reorder'] )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);

$wedevs_pm_router->post( 'projects/{project_id}/tasks/privacy/{task_id}', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'privacy'] )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Task']);

$wedevs_pm_router->post( 'projects/{project_id}/tasks/filter', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'filter'] )
    ->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$wedevs_pm_router->post( 'projects/{project_id}/tasks/{task_id}/activity', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'activities'] )
    ->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$wedevs_pm_router->post( 'tasks/{task_id}/duplicate', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'duplicate'] )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Task']);

$wedevs_pm_router->get( 'projects/{project_id}/task-lists/{list_id}/more/tasks', [\WeDevs\PM\Task\Controllers\Task_Controller::class, 'load_more_tasks'] )
    ->permission(['WeDevs\PM\Core\Permissions\Access_Project']);





