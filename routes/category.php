<?php

use WeDevs\PM\Core\Router\Router;

$wedevs_pm_router                    = Router::singleton();
$wedevs_pm_project_manage_capability = 'WeDevs\PM\Core\Permissions\Project_Manage_Capability';
$wedevs_pm_authentic                 = 'WeDevs\PM\Core\Permissions\Authentic';

$wedevs_pm_router->get( 'categories', 'WeDevs/PM/Category/Controllers/Category_Controller@index' )
    ->permission( [ $wedevs_pm_authentic ] );

$wedevs_pm_router->post( 'categories', 'WeDevs/PM/Category/Controllers/Category_Controller@store' )
    ->permission( ['WeDevs\PM\Core\Permissions\Categories_Page_Access'] )
    ->validator( 'WeDevs\PM\Category\Validators\Create_Category' )
    ->sanitizer( 'WeDevs\PM\Category\Sanitizers\Category_Sanitizer' );

$wedevs_pm_router->get( 'categories/{id}', 'WeDevs/PM/Category/Controllers/Category_Controller@show' )
    ->permission( [ $wedevs_pm_authentic ] );

$wedevs_pm_router->post( 'categories/{id}/update', 'WeDevs/PM/Category/Controllers/Category_Controller@update' )
    ->permission( ['WeDevs\PM\Core\Permissions\Categories_Page_Access'] )
    ->validator( 'WeDevs\PM\Category\Validators\Update_Category' )
    ->sanitizer( 'WeDevs\PM\Category\Sanitizers\Category_Sanitizer' );

$wedevs_pm_router->post( 'categories/{id}/delete', 'WeDevs/PM/Category/Controllers/Category_Controller@destroy' )
    ->permission( ['WeDevs\PM\Core\Permissions\Categories_Page_Access'] );

$wedevs_pm_router->post( 'categories/bulk-delete', 'WeDevs/PM/Category/Controllers/Category_Controller@bulk_destroy' )
    ->permission( ['WeDevs\PM\Core\Permissions\Categories_Page_Access'] );
