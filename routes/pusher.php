<?php
use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Project_Manage_Capability;
use WeDevs\PM\Core\Permissions\Authentic;


// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Route file variable, not a global
$router = Router::singleton();


$router->post( 'user/{user_id}/pusher/auth', 'WeDevs\PM\Pusher\Src\Controllers\Pusher_Controller@authentication' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);



