<?php

use WeDevs\PM\Core\Router\Router;

$wedevs_pm_router = Router::singleton();

$wedevs_pm_router->get( 'projects/{project_id}/task-lists', [\WeDevs\PM\Task_List\Controllers\Task_List_Controller::class, 'index'] )
	->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );

$wedevs_pm_router->get( 'advanced/{project_id}/task-lists', [\WeDevs\PM\Task_List\Helper\Task_List::class, 'get_task_lists'] )
    ->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );

$wedevs_pm_router->post( 'projects/{project_id}/task-lists', [\WeDevs\PM\Task_List\Controllers\Task_List_Controller::class, 'store'] )
	->permission( ['WeDevs\PM\Core\Permissions\Create_Task_List'] )
	->validator( 'WeDevs\PM\Task_List\Validators\Create_Task_List' )
	->sanitizer( 'WeDevs\PM\Task_List\Validators\Task_List_Sanitizer' );

$wedevs_pm_router->get( 'projects/{project_id}/task-lists/{task_list_id}', [\WeDevs\PM\Task_List\Controllers\Task_List_Controller::class, 'show'] )
	->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );

$wedevs_pm_router->post( 'projects/{project_id}/task-lists/{task_list_id}/update', [\WeDevs\PM\Task_List\Controllers\Task_List_Controller::class, 'update'] )
	->permission( ['WeDevs\PM\Core\Permissions\Edit_Task_List'] )
	->validator( 'WeDevs\PM\Task_List\Validators\Update_Task_List' )
	->sanitizer( 'WeDevs\PM\Task_List\Validators\Task_List_Sanitizer' );

$wedevs_pm_router->post( 'projects/{project_id}/task-lists/{task_list_id}/delete', [\WeDevs\PM\Task_List\Controllers\Task_List_Controller::class, 'destroy'] )
	->permission( ['WeDevs\PM\Core\Permissions\Edit_Task_List'] );

$wedevs_pm_router->put( 'projects/{project_id}/task-lists/{task_list_id}/attach-users', [\WeDevs\PM\Task_List\Controllers\Task_List_Controller::class, 'attach_users'] )
	->permission( ['WeDevs\PM\Core\Permissions\Edit_Task_List'] );

$wedevs_pm_router->put( 'projects/{project_id}/task-lists/{task_list_id}/detach-users', [\WeDevs\PM\Task_List\Controllers\Task_List_Controller::class, 'detach_users'] )
	->permission( ['WeDevs\PM\Core\Permissions\Edit_Task_List'] );

$wedevs_pm_router->post( 'projects/{project_id}/task-lists/privacy/{task_list_id}', [\WeDevs\PM\Task_List\Controllers\Task_List_Controller::class, 'privacy'] )
	->permission( ['WeDevs\PM\Core\Permissions\Edit_Task_List'] );

$wedevs_pm_router->post( 'projects/{project_id}/lists/sorting', [\WeDevs\PM\Task_List\Controllers\Task_List_Controller::class, 'list_sorting'] )
	->permission( ['WeDevs\PM\Core\Permissions\Project_Manage_Capability'] );

$wedevs_pm_router->get( 'projects/{project_id}/lists/search', [\WeDevs\PM\Task_List\Controllers\Task_List_Controller::class, 'list_search'] )
	->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );
