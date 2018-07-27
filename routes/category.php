<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Project_Manage_Capability;

$router = Router::singleton();
$project_manage_capability = 'WeDevs\PM\Core\Permissions\Project_Manage_Capability';
$authentic = 'WeDevs\PM\Core\Permissions\Authentic';

$router->get( 'categories', 'WeDevs/PM/Category/Controllers/Category_Controller@index' )
    ->permission([$authentic]);

$router->post( 'categories', 'WeDevs/PM/Category/Controllers/Category_Controller@store' )
    ->permission([$project_manage_capability])
    ->validator( 'WeDevs\PM\Category\Validators\Create_Category' );


$router->get( 'categories/{id}', 'WeDevs/PM/Category/Controllers/Category_Controller@show' )
    ->permission([$authentic]);

$router->post( 'categories/{id}/update', 'WeDevs/PM/Category/Controllers/Category_Controller@update' )
    ->permission([$project_manage_capability])
    ->validator( 'WeDevs\PM\Category\Validators\Update_Category' );

    
$router->post( 'categories/{id}/delete', 'WeDevs/PM/Category/Controllers/Category_Controller@destroy' )
    ->permission([$project_manage_capability]);

$router->post( 'categories/bulk-delete', 'WeDevs/PM/Category/Controllers/Category_Controller@bulk_destroy' )
    ->permission([$project_manage_capability]);
