<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'categories', 'CPM/Category/Controllers/Category_Controller@index' );
$router->post( 'categories', 'CPM/Category/Controllers/Category_Controller@store' );
$router->get( 'categories/{id}', 'CPM/Category/Controllers/Category_Controller@show' );
$router->put( 'categories/{id}', 'CPM/Category/Controllers/Category_Controller@update' );
$router->delete( 'categories/{id}', 'CPM/Category/Controllers/Category_Controller@destroy' );

$router->delete( 'categories/bulk-delete', 'CPM/Category/Controllers/Category_Controller@bulk_destroy' );