<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'users', 'WeDevs/PM/User/Controllers/User_Controller@index' );
$router->post( 'users', 'WeDevs/PM/User/Controllers/User_Controller@store' );
$router->get( 'users/{id}', 'WeDevs/PM/User/Controllers/User_Controller@show' );

$router->get( 'users/search', 'WeDevs/PM/User/Controllers/User_Controller@search' );
$router->put( 'users/{user_id}/roles', 'WeDevs/PM/User/Controllers/User_Controller@update_role' );