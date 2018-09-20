<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Create_Task_List;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/task-lists', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@index' )
	->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$router->post( 'projects/{project_id}/task-lists', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@store' )
	->permission(['WeDevs\PM\Core\Permissions\Create_Task_List'])
    ->validator( 'WeDevs\PM\Task_List\Validators\Create_Task_List' );


$router->get( 'projects/{project_id}/task-lists/{task_list_id}', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@show' )
	->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$router->post( 'projects/{project_id}/task-lists/{task_list_id}/update', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@update' )
	->permission(['WeDevs\PM\Core\Permissions\Edit_Task_List'])
    ->validator( 'WeDevs\PM\Task_List\Validators\Update_Task_List' );


$router->post( 'projects/{project_id}/task-lists/{task_list_id}/delete', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@destroy' )
	->permission(['WeDevs\PM\Core\Permissions\Edit_Task_List']);

$router->put( 'projects/{project_id}/task-lists/{task_list_id}/attach-users', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@attach_users' )
	->permission(['WeDevs\PM\Core\Permissions\Edit_Task_List']);

$router->put( 'projects/{project_id}/task-lists/{task_list_id}/detach-users', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@detach_users' )
	->permission(['WeDevs\PM\Core\Permissions\Edit_Task_List']);

$router->post( 'projects/{project_id}/task-lists/privacy/{task_list_id}', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@privacy' )
	->permission(['WeDevs\PM\Core\Permissions\Edit_Task_List']);

$router->post( 'projects/{project_id}/lists/sorting', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@list_sorting' )
	->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);

$router->get( 'projects/{project_id}/lists/search', 'WeDevs/PM/Task_List/Controllers/Task_List_Controller@list_search' )
	->permission(['WeDevs\PM\Core\Permissions\Access_Project']);


