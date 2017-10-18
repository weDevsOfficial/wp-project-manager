<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'roles', 'WeDevs/PM/Role/Controllers/Role_Controller@index' );
$router->post( 'roles', 'WeDevs/PM/Role/Controllers/Role_Controller@store' );
$router->get( 'roles/{id}', 'WeDevs/PM/Role/Controllers/Role_Controller@show' );
$router->put( 'roles/{id}', 'WeDevs/PM/Role/Controllers/Role_Controller@update' );
$router->delete( 'roles/{id}', 'WeDevs/PM/Role/Controllers/Role_Controller@destroy' );