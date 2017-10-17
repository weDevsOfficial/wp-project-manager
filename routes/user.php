<?php

use PM\Core\Router\Router;
use PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'users', 'PM/User/Controllers/User_Controller@index' );
$router->post( 'users', 'PM/User/Controllers/User_Controller@store' );
$router->get( 'users/{id}', 'PM/User/Controllers/User_Controller@show' );

$router->get( 'users/search', 'PM/User/Controllers/User_Controller@search' );
$router->put( 'users/{user_id}/roles', 'PM/User/Controllers/User_Controller@update_role' );