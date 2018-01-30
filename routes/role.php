<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Project_Manage_Capability;


$router = Router::singleton();

$router->get( 'roles', 'WeDevs/PM/Role/Controllers/Role_Controller@index' )
->permission([Authentic::class]);
$router->post( 'roles', 'WeDevs/PM/Role/Controllers/Role_Controller@store' )
->permission([Project_Manage_Capability::class]);
$router->get( 'roles/{id}', 'WeDevs/PM/Role/Controllers/Role_Controller@show' )
->permission([Authentic::class]);
$router->put( 'roles/{id}', 'WeDevs/PM/Role/Controllers/Role_Controller@update' )
->permission([Project_Manage_Capability::class]);
$router->delete( 'roles/{id}', 'WeDevs/PM/Role/Controllers/Role_Controller@destroy' )
->permission([Project_Manage_Capability::class]);