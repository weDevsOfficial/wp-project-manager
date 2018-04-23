<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;

$router = Router::singleton();

$router->get( 'users', 'WeDevs/PM/User/Controllers/User_Controller@index' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);
$router->post( 'users', 'WeDevs/PM/User/Controllers/User_Controller@store' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);
$router->get( 'users/{id}', 'WeDevs/PM/User/Controllers/User_Controller@show' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);

$router->get( 'users/search', 'WeDevs/PM/User/Controllers/User_Controller@search' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);
$router->put( 'users/{user_id}/roles', 'WeDevs/PM/User/Controllers/User_Controller@update_role' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);