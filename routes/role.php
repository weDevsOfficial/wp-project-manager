<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Project_Manage_Capability;


$wedevs_pm_router = Router::singleton();

$wedevs_pm_router->get( 'roles', 'WeDevs/PM/Role/Controllers/Role_Controller@index' )
->permission(['WeDevs\PM\Core\Permissions\Authentic']);
$wedevs_pm_router->post( 'roles', 'WeDevs/PM/Role/Controllers/Role_Controller@store' )
->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability'])
->validator( 'WeDevs\PM\Role\Validators\Create_Role' );

$wedevs_pm_router->get( 'roles/{id}', 'WeDevs/PM/Role/Controllers/Role_Controller@show' )
->permission(['WeDevs\PM\Core\Permissions\Authentic']);
$wedevs_pm_router->put( 'roles/{id}', 'WeDevs/PM/Role/Controllers/Role_Controller@update' )
->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability'])
->validator( 'WeDevs\PM\Role\Validators\Update_Role' );

$wedevs_pm_router->delete( 'roles/{id}', 'WeDevs/PM/Role/Controllers/Role_Controller@destroy' )
->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);