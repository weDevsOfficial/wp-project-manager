<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;
use WeDevs\PM\Core\Permissions\Access_Project;

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Route file variable, not a global
$access_project = '\WeDevs\PM\Core\Permissions\Access_Project';
// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Route file variable, not a global
$authentic      = 'WeDevs\PM\Core\Permissions\Authentic';
// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Route file variable, not a global
$router         = Router::singleton();

$router->get( 'projects/{project_id}/activities', 'WeDevs/PM/Activity/Controllers/Activity_Controller@index' )
    ->permission( [ $access_project ] );

$router->get( 'activities', 'WeDevs/PM/Activity/Helper/Activity@get_activities' )
    ->permission( [ $authentic ] );
