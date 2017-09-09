<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'users', 'CPM/User/Controllers/User_Controller@index' );
$router->post( 'users', 'CPM/User/Controllers/User_Controller@store' );
$router->get( 'users/{id}', 'CPM/User/Controllers/User_Controller@show' );

$router->get( 'users/search', 'CPM/User/Controllers/User_Controller@search' );