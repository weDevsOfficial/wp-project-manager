<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Project_Manage_Capability;

$wedevs_pm_router    = Router::singleton();
$authentic = 'WeDevs\PM\Core\Permissions\Authentic';

$wedevs_pm_router->get( 'search', [\WeDevs\PM\Search\Controllers\Search_Controller::class, 'search'] )
    ->permission( [ $wedevs_pm_authentic ] );

$wedevs_pm_router->get( 'admin-topbar-search', [\WeDevs\PM\Search\Controllers\Search_Controller::class, 'searchTopBar'] )
    ->permission( [ $wedevs_pm_authentic ] );
