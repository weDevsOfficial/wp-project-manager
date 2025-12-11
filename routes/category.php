<?php

use WeDevs\PM\Core\Router\Router;

$wedevs_pm_router                    = Router::singleton();
$project_manage_capability = 'WeDevs\PM\Core\Permissions\Project_Manage_Capability';
$wedevs_pm_authentic                 = 'WeDevs\PM\Core\Permissions\Authentic';

$wedevs_pm_router->get( 'categories', [\WeDevs\PM\Category\Controllers\Category_Controller::class, 'index'] )
    ->permission( [WeDevs\PM\Core\Permissions\Authentic::class] );

$wedevs_pm_router->post( 'categories', [\WeDevs\PM\Category\Controllers\Category_Controller::class, 'store'] )
    ->permission( [WeDevs\PM\Core\Permissions\Authentic::class] )
    ->validator( WeDevs\PM\Category\Validators\Create_Category::class )
    ->sanitizer( WeDevs\PM\Category\Sanitizers\Category_Sanitizer::class );

$wedevs_pm_router->get( 'categories/{id}', [\WeDevs\PM\Category\Controllers\Category_Controller::class, 'show'] )
    ->permission( [WeDevs\PM\Core\Permissions\Authentic::class] );

$wedevs_pm_router->post( 'categories/{id}/update', [\WeDevs\PM\Category\Controllers\Category_Controller::class, 'update'] )
    ->permission( [WeDevs\PM\Core\Permissions\Categories_Page_Access::class] )
    ->validator( WeDevs\PM\Category\Validators\Update_Category::class )
    ->sanitizer( WeDevs\PM\Category\Sanitizers\Category_Sanitizer::class );

$wedevs_pm_router->post( 'categories/{id}/delete', [\WeDevs\PM\Category\Controllers\Category_Controller::class, 'destroy'] )
    ->permission( [WeDevs\PM\Core\Permissions\Categories_Page_Access::class] );

$wedevs_pm_router->post( 'categories/bulk-delete', [\WeDevs\PM\Category\Controllers\Category_Controller::class, 'bulk_destroy'] )
    ->permission( [WeDevs\PM\Core\Permissions\Categories_Page_Access::class] );
