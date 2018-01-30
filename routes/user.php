<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;

$router = Router::singleton();

$router->get( 'users', 'WeDevs/PM/User/Controllers/User_Controller@index' )
    ->permission([Authentic::class]);
$router->post( 'users', 'WeDevs/PM/User/Controllers/User_Controller@store' )
    ->permission([Authentic::class]);
$router->get( 'users/{id}', 'WeDevs/PM/User/Controllers/User_Controller@show' )
    ->permission([Authentic::class]);

$router->get( 'users/search', 'WeDevs/PM/User/Controllers/User_Controller@search' )
    ->permission([Authentic::class]);
$router->put( 'users/{user_id}/roles', 'WeDevs/PM/User/Controllers/User_Controller@update_role' )
    ->permission([Authentic::class]);