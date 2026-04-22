<?php

use WeDevs\PM\Core\Router\Router;

$wedevs_pm_router    = Router::singleton();
$wedevs_pm_authentic = 'WeDevs\PM\Core\Permissions\Authentic';

// Single GitHub URL preview
$wedevs_pm_router->post( 'github/preview', 'WeDevs/PM/GitHub/Controllers/GitHub_Preview_Controller@preview' )
    ->permission( [ $wedevs_pm_authentic ] );

// Batch GitHub URLs preview
$wedevs_pm_router->post( 'github/batch-preview', 'WeDevs/PM/GitHub/Controllers/GitHub_Preview_Controller@batch_preview' )
    ->permission( [ $wedevs_pm_authentic ] );

// Test GitHub connection
$wedevs_pm_router->post( 'github/test-connection', 'WeDevs/PM/GitHub/Controllers/GitHub_Preview_Controller@test_connection' )
    ->permission( [ 'WeDevs\PM\Core\Permissions\Settings_Page_Access' ] );
