<?php

use WeDevs\PM\Core\Router\Router;

$wedevs_pm_router    = Router::singleton();
$wedevs_pm_authentic = 'WeDevs\PM\Core\Permissions\Authentic';

// Single Loom URL preview
$wedevs_pm_router->post( 'loom/preview', 'WeDevs/PM/Loom/Controllers/Loom_Preview_Controller@preview' )
    ->permission( [ $wedevs_pm_authentic ] );

// Batch Loom URLs preview
$wedevs_pm_router->post( 'loom/batch-preview', 'WeDevs/PM/Loom/Controllers/Loom_Preview_Controller@batch_preview' )
    ->permission( [ $wedevs_pm_authentic ] );

// Test Loom connection
$wedevs_pm_router->post( 'loom/test-connection', 'WeDevs/PM/Loom/Controllers/Loom_Preview_Controller@test_connection' )
    ->permission( [ 'WeDevs\PM\Core\Permissions\Settings_Page_Access' ] );
