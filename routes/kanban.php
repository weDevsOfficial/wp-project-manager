<?php

use WeDevs\PM\Core\Router\Router;

$wedevs_pm_router = Router::singleton();

$wedevs_pm_router->get( 'projects/{project_id}/kanboard', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@index' )
    ->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );

$wedevs_pm_router->post( 'projects/{project_id}/kanboard', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@store' )
    ->permission( ['WeDevs\PM\Core\Permissions\Project_Manage_Capability'] );

$wedevs_pm_router->post( 'projects/{project_id}/kanboard/{board_id}/task/{task_id}', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@store_searchable_task' )
    ->permission( [
        'WeDevs\PM\Core\Permissions\Access_Project',
        'WeDevs\PM\Kanban\Permissions\Kanboard_Permission'
    ] );

$wedevs_pm_router->get( 'projects/{project_id}/kanboard/{board_id}', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@show' )
    ->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );

$wedevs_pm_router->post( 'projects/{project_id}/kanboard/{board_id}/update', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@update' )
    ->permission( ['WeDevs\PM\Core\Permissions\Project_Manage_Capability'] );

$wedevs_pm_router->post( 'projects/{project_id}/kanboard/board-order', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@board_order' )
    ->permission( ['WeDevs\PM\Core\Permissions\Project_Manage_Capability'] );

$wedevs_pm_router->post( 'projects/{project_id}/kanboard/task-order', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@task_order' )
    ->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );

$wedevs_pm_router->post( 'projects/{project_id}/kanboard/{board_id}/delete', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@destroy' )
    ->permission( ['WeDevs\PM\Core\Permissions\Project_Manage_Capability'] );

$wedevs_pm_router->post( 'projects/{project_id}/kanboard/{board_id}/tasks/{task_id}/delete', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@delte_task' )
    ->permission( ['WeDevs\PM\Core\Permissions\Delete_Task'] );

$wedevs_pm_router->post( 'projects/{project_id}/list-view-type', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@list_view_type' )
    ->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );

$wedevs_pm_router->post( 'projects/{project_id}/boards/{board_id}/automation', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@automation' )
    ->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );

$wedevs_pm_router->post( 'projects/{project_id}/kanboard/{board_id}/header_background', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@header_background' )
    ->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );

$wedevs_pm_router->post( 'projects/{project_id}/kanboard/filter', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@search_tasks' )
    ->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );

$wedevs_pm_router->post( 'projects/{project_id}/kanboard/import-tasks', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@import_bulk_task' )
    ->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );

$wedevs_pm_router->get( 'projects/{project_id}/kanboard/tasks', 'WeDevs/PM/Kanban/Controllers/Kanboard_Controller@get_tasks' )
    ->permission( [
        'WeDevs\PM\Core\Permissions\Access_Project',
        'WeDevs\PM\Kanban\Permissions\Kanboard_Permission'
    ] );
