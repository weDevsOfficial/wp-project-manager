<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;

$wedevs_pm_router = Router::singleton();

$wedevs_pm_router->get( 'users', [\WeDevs\PM\User\Controllers\User_Controller::class, 'index'] )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);
$wedevs_pm_router->post( 'users', [\WeDevs\PM\User\Controllers\User_Controller::class, 'store'] )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);
$wedevs_pm_router->get( 'users/{id}', [\WeDevs\PM\User\Controllers\User_Controller::class, 'show'] )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);

$wedevs_pm_router->get( 'users/search', [\WeDevs\PM\User\Controllers\User_Controller::class, 'search'] )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);
//$router->put( 'users/{user_id}/roles', 'WeDevs/PM/User/Controllers/User_Controller@update_role' )
//    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);

$wedevs_pm_router->post( 'save_users_map_name', [\WeDevs\PM\User\Controllers\User_Controller::class, 'save_users_map_name'] )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);

$wedevs_pm_router->get( 'user-all-projects', [\WeDevs\PM\User\Controllers\User_Controller::class, 'get_user_all_projects'] )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);
