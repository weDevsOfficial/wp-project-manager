<?php

use WeDevs\PM\Core\Router\Router;

$wedevs_pm_router    = Router::singleton();
$authentic = 'WeDevs\PM\Core\Permissions\Authentic';

$wedevs_pm_router->get( 'settings', [\WeDevs\PM\Settings\Controllers\Settings_Controller::class, 'index'] )
    ->permission( [ $wedevs_pm_authentic ] );

$wedevs_pm_router->post( 'settings', [\WeDevs\PM\Settings\Controllers\Settings_Controller::class, 'store'] )
    ->permission( ['WeDevs\PM\Core\Permissions\Settings_Page_Access'] );

$wedevs_pm_router->post( 'settings/notice', [\WeDevs\PM\Settings\Controllers\Settings_Controller::class, 'notice'] )
    ->permission( [ $wedevs_pm_authentic, 'WeDevs\PM\Core\Permissions\Settings_Page_Access' ] );
//$wedevs_pm_router->get( 'projects/settings/{key}/key', 'WeDevs/PM/Settings/Controllers/Settings_Controller@pluck_without_project' );;

//$wedevs_pm_router->get( 'projects/{project_id}/settings/{key}/key', 'WeDevs/PM/Settings/Controllers/Settings_Controller@pluck_with_project' );;
$wedevs_pm_router->get( 'projects/{project_id}/settings', [\WeDevs\PM\Settings\Controllers\Settings_Controller::class, 'index'] )
    ->permission( [ $wedevs_pm_authentic ] );

$wedevs_pm_router->post( 'projects/{project_id}/settings', [\WeDevs\PM\Settings\Controllers\Settings_Controller::class, 'store'] )
    ->permission( ['WeDevs\PM\Core\Permissions\Project_Settings_Page_Access'] );

$wedevs_pm_router->post( 'projects/{project_id}/delete/{id}/settings', [\WeDevs\PM\Settings\Controllers\Settings_Controller::class, 'destroy'] )
    ->permission( ['WeDevs\PM\Core\Permissions\Project_Settings_Page_Access'] );

$wedevs_pm_router->post( 'settings/task-types', [\WeDevs\PM\Settings\Controllers\Task_Types_Controller::class, 'store'] )
    ->permission( ['WeDevs\PM\Core\Permissions\Settings_Page_Access'] )
    ->sanitizer( 'WeDevs\PM\Settings\Sanitizers\Task_Type_Sanitizer' );

$wedevs_pm_router->get( 'settings/task-types', [\WeDevs\PM\Settings\Controllers\Task_Types_Controller::class, 'index'] )
    ->permission( [ $wedevs_pm_authentic ] );

$wedevs_pm_router->post( 'settings/task-types/{id}', [\WeDevs\PM\Settings\Controllers\Task_Types_Controller::class, 'update_task_type'] )
    ->permission( ['WeDevs\PM\Core\Permissions\Settings_Page_Access'] )
    ->sanitizer( 'WeDevs\PM\Settings\Sanitizers\Task_Type_Sanitizer' );

$wedevs_pm_router->post( 'settings/task-types/{id}/delete', [\WeDevs\PM\Settings\Controllers\Task_Types_Controller::class, 'destroy_task_type'] )
    ->permission( ['WeDevs\PM\Core\Permissions\Settings_Page_Access'] );

$wedevs_pm_router->get( 'settings/ai', [\WeDevs\PM\Settings\Controllers\AI_Settings_Controller::class, 'index'] )
    ->permission( [ $wedevs_pm_authentic ] );

$wedevs_pm_router->post( 'settings/ai', [\WeDevs\PM\Settings\Controllers\AI_Settings_Controller::class, 'store'] )
    ->permission( ['WeDevs\PM\Core\Permissions\Settings_Page_Access'] );

$wedevs_pm_router->post( 'settings/ai/test-connection', [\WeDevs\PM\Settings\Controllers\AI_Settings_Controller::class, 'test_connection'] )
    ->permission( ['WeDevs\PM\Core\Permissions\Settings_Page_Access'] );

