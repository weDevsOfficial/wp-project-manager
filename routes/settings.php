<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'settings', 'CPM/Settings/Controllers/Settings_Controller@index' );
$router->post( 'settings', 'CPM/Settings/Controllers/Settings_Controller@store' );

// $router->post( 'projects/{project_id}/settings', 'CPM/Category/Controllers/Category_Controller@store' );
// $router->get( 'categories/{id}', 'CPM/Category/Controllers/Category_Controller@show' );
// $router->put( 'categories/{id}', 'CPM/Category/Controllers/Category_Controller@update' );
// $router->delete( 'categories/{id}', 'CPM/Category/Controllers/Category_Controller@destroy' );