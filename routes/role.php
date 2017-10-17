<?php

use PM\Core\Router\Router;
use PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'roles', 'PM/Role/Controllers/Role_Controller@index' );
$router->post( 'roles', 'PM/Role/Controllers/Role_Controller@store' );
$router->get( 'roles/{id}', 'PM/Role/Controllers/Role_Controller@show' );
$router->put( 'roles/{id}', 'PM/Role/Controllers/Role_Controller@update' );
$router->delete( 'roles/{id}', 'PM/Role/Controllers/Role_Controller@destroy' );