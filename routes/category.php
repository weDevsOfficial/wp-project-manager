<?php

use WeDevs\PM\Core\Router\Router;

$router                    = Router::singleton();
$project_manage_capability = 'WeDevs\PM\Core\Permissions\Project_Manage_Capability';
$authentic                 = 'WeDevs\PM\Core\Permissions\Authentic';

$router->get( 'categories', 'WeDevs/PM/Category/Controllers/Category_Controller@index' )
    ->permission( [ $authentic ] );

$router->post( 'categories', 'WeDevs/PM/Category/Controllers/Category_Controller@store' )
    ->permission( ['WeDevs\PM\Core\Permissions\Categories_Page_Access'] )
    ->validator( 'WeDevs\PM\Category\Validators\Create_Category' )
    ->sanitizer( 'WeDevs\PM\Category\Sanitizers\Category_Sanitizer' );

$router->get( 'categories/{id}', 'WeDevs/PM/Category/Controllers/Category_Controller@show' )
    ->permission( [ $authentic ] );

$router->post( 'categories/{id}/update', 'WeDevs/PM/Category/Controllers/Category_Controller@update' )
    ->permission( ['WeDevs\PM\Core\Permissions\Categories_Page_Access'] )
    ->validator( 'WeDevs\PM\Category\Validators\Update_Category' )
    ->sanitizer( 'WeDevs\PM\Category\Sanitizers\Category_Sanitizer' );

$router->post( 'categories/{id}/delete', 'WeDevs/PM/Category/Controllers/Category_Controller@destroy' )
    ->permission( ['WeDevs\PM\Core\Permissions\Categories_Page_Access'] );

$router->post( 'categories/bulk-delete', 'WeDevs/PM/Category/Controllers/Category_Controller@bulk_destroy' )
    ->permission( ['WeDevs\PM\Core\Permissions\Categories_Page_Access'] );
