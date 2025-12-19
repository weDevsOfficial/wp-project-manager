<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;
use WeDevs\PM\Core\Permissions\Access_Project;

$wedevs_pm_access_project = '\WeDevs\PM\Core\Permissions\Access_Project';
$wedevs_pm_authentic      = 'WeDevs\PM\Core\Permissions\Authentic';
$wedevs_pm_router         = Router::singleton();

$wedevs_pm_router->get( 'projects/{project_id}/activities', 'WeDevs/PM/Activity/Controllers/Activity_Controller@index' )
    ->permission( [ $wedevs_pm_access_project ] );

$wedevs_pm_router->get( 'activities', 'WeDevs/PM/Activity/Helper/Activity@get_activities' )
    ->permission( [ $wedevs_pm_authentic ] );
