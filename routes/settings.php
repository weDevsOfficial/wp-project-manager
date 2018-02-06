<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Project_Manage_Capability;
$router = Router::singleton();

$router->get( 'settings', 'WeDevs/PM/Settings/Controllers/Settings_Controller@index' )
    ->permission([Authentic::class]);
$router->post( 'settings', 'WeDevs/PM/Settings/Controllers/Settings_Controller@store' )
    ->permission([Project_Manage_Capability::class]);
//$router->get( 'projects/settings/{key}/key', 'WeDevs/PM/Settings/Controllers/Settings_Controller@pluck_without_project' );;

//$router->get( 'projects/{project_id}/settings/{key}/key', 'WeDevs/PM/Settings/Controllers/Settings_Controller@pluck_with_project' );;
$router->get( 'projects/{project_id}/settings', 'WeDevs/PM/Settings/Controllers/Settings_Controller@index' )
    ->permission([Authentic::class]);

$router->post( 'projects/{project_id}/settings', 'WeDevs/PM/Settings/Controllers/Settings_Controller@store' )
    ->permission([Project_Manage_Capability::class]);