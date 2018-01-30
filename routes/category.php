<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Project_Manage_Capability;
$router = Router::singleton();

$router->get( 'categories', 'WeDevs/PM/Category/Controllers/Category_Controller@index' )
    ->permission([Authentic::class]);

$router->post( 'categories', 'WeDevs/PM/Category/Controllers/Category_Controller@store' )
    ->permission([Project_Manage_Capability::class]);

$router->get( 'categories/{id}', 'WeDevs/PM/Category/Controllers/Category_Controller@show' )
    ->permission([Authentic::class]);

$router->put( 'categories/{id}', 'WeDevs/PM/Category/Controllers/Category_Controller@update' )
    ->permission([Project_Manage_Capability::class]);
    
$router->delete( 'categories/{id}', 'WeDevs/PM/Category/Controllers/Category_Controller@destroy' )
    ->permission([Project_Manage_Capability::class]);

$router->delete( 'categories/bulk-delete', 'WeDevs/PM/Category/Controllers/Category_Controller@bulk_destroy' )
    ->permission([Project_Manage_Capability::class]);