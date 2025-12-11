<?php
use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Project_Manage_Capability;
use WeDevs\PM\Core\Permissions\Authentic;


$wedevs_pm_router = Router::singleton();


$wedevs_pm_router->post( 'user/{user_id}/pusher/auth', 'WeDevs\PM\Pusher\Src\Controllers\Pusher_Controller@authentication' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);



