<?php

use WeDevs\PM\Core\Router\Router;

$wedevs_pm_router = Router::singleton();

// GET /wp-json/pm/v2/dashboard — aggregated, role-scoped dashboard data.
$wedevs_pm_router->get( 'dashboard', 'WeDevs/PM/Dashboard/Controllers/Dashboard_Controller@index' )
    ->permission( ['WeDevs\PM\Core\Permissions\Authentic'] );

// GET /wp-json/pm/v2/dashboard/heatmap?year=YYYY — productivity heatmap (self-fetched by the card).
$wedevs_pm_router->get( 'dashboard/heatmap', 'WeDevs/PM/Dashboard/Controllers/Dashboard_Controller@heatmap_data' )
    ->permission( ['WeDevs\PM\Core\Permissions\Authentic'] );
