<?php

use WeDevs\PM\Core\Router\Router;

$wedevs_pm_router = Router::singleton();

// User listing endpoints - require list_users capability or PM manager role
$wedevs_pm_router->get( 'users', 'WeDevs/PM/User/Controllers/User_Controller@index' )
    ->permission(['WeDevs\PM\Core\Permissions\List_Users']);
$wedevs_pm_router->get( 'users/{id}', 'WeDevs/PM/User/Controllers/User_Controller@show' )
    ->permission(['WeDevs\PM\Core\Permissions\List_Users']);
$wedevs_pm_router->get( 'users/search', 'WeDevs/PM/User/Controllers/User_Controller@search' )
    ->permission(['WeDevs\PM\Core\Permissions\List_Users']);
$wedevs_pm_router->get( 'user-all-projects', 'WeDevs/PM/User/Controllers/User_Controller@get_user_all_projects' )
    ->permission(['WeDevs\PM\Core\Permissions\List_Users']);

// User creation - require create_users capability
$wedevs_pm_router->post( 'users', 'WeDevs/PM/User/Controllers/User_Controller@store' )
    ->permission(['WeDevs\PM\Core\Permissions\Create_Users']);

//$wedevs_pm_router->put( 'users/{user_id}/roles', 'WeDevs/PM/User/Controllers/User_Controller@update_role' )
//    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);

// User meta update - already checks manage_options in controller
$wedevs_pm_router->post( 'save_users_map_name', 'WeDevs/PM/User/Controllers/User_Controller@save_users_map_name' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);
