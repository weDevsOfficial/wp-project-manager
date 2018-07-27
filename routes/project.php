<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Project_Create_Capability;
use WeDevs\PM\Project\Sanitizers\Project_Sanitizer;
use WeDevs\PM\Project\Validators\Create_Project;
use WeDevs\PM\Project\Validators\Update_Project;
use WeDevs\PM\Project\Sanitizers\Delete_Sanitizer;

$router = Router::singleton();

$router->get( 'projects', 'WeDevs/PM/Project/Controllers/Project_Controller@index' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);

$router->get( 'projects/{id}', 'WeDevs/PM/Project/Controllers/Project_Controller@show' )
    ->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$router->post( 'projects', 'WeDevs/PM/Project/Controllers/Project_Controller@store' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Create_Capability'])
    ->validator( 'WeDevs\PM\Project\Validators\Create_Project' )
    ->sanitizer( 'WeDevs\PM\Project\Sanitizers\Project_Sanitizer' );

$router->post( 'projects/{id}/update', 'WeDevs/PM/Project/Controllers/Project_Controller@update' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability'])
    ->sanitizer( 'WeDevs\PM\Project\Sanitizers\Project_Sanitizer' )
    ->validator( 'WeDevs\PM\Project\Validators\Update_Project' );

$router->post( 'projects/{id}/delete', 'WeDevs/PM/Project/Controllers/Project_Controller@destroy' )
    ->sanitizer( 'WeDevs\PM\Project\Sanitizers\Delete_Sanitizer' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);
