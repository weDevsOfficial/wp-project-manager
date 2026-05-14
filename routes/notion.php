<?php

use WeDevs\PM\Core\Router\Router;

$wedevs_pm_router         = Router::singleton();
$wedevs_pm_settings_access = 'WeDevs\PM\Core\Permissions\Settings_Page_Access';

// Single Notion URL preview
$wedevs_pm_router->post( 'notion/preview', 'WeDevs/PM/Notion/Controllers/Notion_Preview_Controller@preview' )
    ->permission( [ $wedevs_pm_settings_access ] );

// Batch Notion URLs preview
$wedevs_pm_router->post( 'notion/batch-preview', 'WeDevs/PM/Notion/Controllers/Notion_Preview_Controller@batch_preview' )
    ->permission( [ $wedevs_pm_settings_access ] );

// Test Notion connection
$wedevs_pm_router->post( 'notion/test-connection', 'WeDevs/PM/Notion/Controllers/Notion_Preview_Controller@test_connection' )
    ->permission( [ 'WeDevs\PM\Core\Permissions\Settings_Page_Access' ] );
