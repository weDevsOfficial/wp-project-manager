<?php

use PM\Core\Router\Router;
use PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'categories', 'PM/Category/Controllers/Category_Controller@index' );
$router->post( 'categories', 'PM/Category/Controllers/Category_Controller@store' );
$router->get( 'categories/{id}', 'PM/Category/Controllers/Category_Controller@show' );
$router->put( 'categories/{id}', 'PM/Category/Controllers/Category_Controller@update' );
$router->delete( 'categories/{id}', 'PM/Category/Controllers/Category_Controller@destroy' );

$router->delete( 'categories/bulk-delete', 'PM/Category/Controllers/Category_Controller@bulk_destroy' );