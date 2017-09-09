<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'roles', 'CPM/Role/Controllers/Role_Controller@index' );
$router->post( 'roles', 'CPM/Role/Controllers/Role_Controller@store' );
$router->get( 'roles/{id}', 'CPM/Role/Controllers/Role_Controller@show' );
$router->put( 'roles/{id}', 'CPM/Role/Controllers/Role_Controller@update' );
$router->delete( 'roles/{id}', 'CPM/Role/Controllers/Role_Controller@destroy' );