<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'categories', 'WeDevs/PM/Category/Controllers/Category_Controller@index' );
$router->post( 'categories', 'WeDevs/PM/Category/Controllers/Category_Controller@store' );
$router->get( 'categories/{id}', 'WeDevs/PM/Category/Controllers/Category_Controller@show' );
$router->put( 'categories/{id}', 'WeDevs/PM/Category/Controllers/Category_Controller@update' );
$router->delete( 'categories/{id}', 'WeDevs/PM/Category/Controllers/Category_Controller@destroy' );

$router->delete( 'categories/bulk-delete', 'WeDevs/PM/Category/Controllers/Category_Controller@bulk_destroy' );