<?php

use WeDevs\PM\Core\Router\Router;

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Route file variable, not a global
$router    = Router::singleton();
// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Route file variable, not a global
$authentic = 'WeDevs\PM\Core\Permissions\Authentic';

$router->get( 'settings', 'WeDevs/PM/Settings/Controllers/Settings_Controller@index' )
    ->permission( [ $authentic ] );

$router->post( 'settings', 'WeDevs/PM/Settings/Controllers/Settings_Controller@store' )
    ->permission( ['WeDevs\PM\Core\Permissions\Settings_Page_Access'] );

$router->post( 'settings/notice', 'WeDevs/PM/Settings/Controllers/Settings_Controller@notice' )
    ->permission( [ $authentic, 'WeDevs\PM\Core\Permissions\Settings_Page_Access' ] );
//$router->get( 'projects/settings/{key}/key', 'WeDevs/PM/Settings/Controllers/Settings_Controller@pluck_without_project' );;

//$router->get( 'projects/{project_id}/settings/{key}/key', 'WeDevs/PM/Settings/Controllers/Settings_Controller@pluck_with_project' );;
$router->get( 'projects/{project_id}/settings', 'WeDevs/PM/Settings/Controllers/Settings_Controller@index' )
    ->permission( [ $authentic ] );

$router->post( 'projects/{project_id}/settings', 'WeDevs/PM/Settings/Controllers/Settings_Controller@store' )
    ->permission( ['WeDevs\PM\Core\Permissions\Project_Settings_Page_Access'] );

$router->post( 'projects/{project_id}/delete/{id}/settings', 'WeDevs/PM/Settings/Controllers/Settings_Controller@destroy' )
    ->permission( ['WeDevs\PM\Core\Permissions\Project_Settings_Page_Access'] );

$router->post( 'settings/task-types', 'WeDevs/PM/Settings/Controllers/Task_Types_Controller@store' )
    ->permission( ['WeDevs\PM\Core\Permissions\Settings_Page_Access'] )
    ->sanitizer( 'WeDevs\PM\Settings\Sanitizers\Task_Type_Sanitizer' );

$router->get( 'settings/task-types', 'WeDevs/PM/Settings/Controllers/Task_Types_Controller@index' )
    ->permission( [ $authentic ] );

$router->post( 'settings/task-types/{id}', 'WeDevs/PM/Settings/Controllers/Task_Types_Controller@update_task_type' )
    ->permission( ['WeDevs\PM\Core\Permissions\Settings_Page_Access'] )
    ->sanitizer( 'WeDevs\PM\Settings\Sanitizers\Task_Type_Sanitizer' );

$router->post( 'settings/task-types/{id}/delete', 'WeDevs/PM/Settings/Controllers/Task_Types_Controller@destroy_task_type' )
    ->permission( ['WeDevs\PM\Core\Permissions\Settings_Page_Access'] );

$router->get( 'settings/ai', 'WeDevs/PM/Settings/Controllers/AI_Settings_Controller@index' )
    ->permission( [ $authentic ] );

$router->post( 'settings/ai', 'WeDevs/PM/Settings/Controllers/AI_Settings_Controller@store' )
    ->permission( ['WeDevs\PM\Core\Permissions\Settings_Page_Access'] );

$router->post( 'settings/ai/test-connection', 'WeDevs/PM/Settings/Controllers/AI_Settings_Controller@test_connection' )
    ->permission( ['WeDevs\PM\Core\Permissions\Settings_Page_Access'] );

