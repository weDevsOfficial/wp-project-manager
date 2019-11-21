<?php
use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Project_Manage_Capability;
use WeDevs\PM\Core\Permissions\Authentic;


$router = Router::singleton();


// $router->get( 'projects/{project_id}/kanboard', 'WeDevs\PM\kanboard\src\Controllers\Kanboard_Controller@index' )
//     ->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );

$router->post( 'user/{user_id}/pusher/auth', 'WeDevs\PM\Pusher\src\Controllers\Pusher_Controller@authentication' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);



