<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Project_Craete_Capability;
use WeDevs\PM\Project\Sanitizers\Project_Sanitizer;
use WeDevs\PM\Project\Validators\Create_Project;
use WeDevs\PM\Project\Validators\Update_Project;
use WeDevs\PM\Project\Sanitizers\Delete_Sanitizer;

$router = Router::singleton();

$router->get( 'projects', 'WeDevs/PM/Project/Controllers/Project_Controller@index' )
    ->permission([Authentic::class]);

$router->get( 'projects/{id}', 'WeDevs/PM/Project/Controllers/Project_Controller@show' )
    ->permission([Authentic::class]);

$router->post( 'projects', 'WeDevs/PM/Project/Controllers/Project_Controller@store' )
    ->permission([Authentic::class, Project_Craete_Capability::class])
    ->validator( Create_Project::class )
    ->sanitizer( Project_Sanitizer::class );

$router->put( 'projects/{id}', 'WeDevs/PM/Project/Controllers/Project_Controller@update' )
    ->permission([Authentic::class, Project_Craete_Capability::class])
    ->sanitizer( Project_Sanitizer::class )
    ->validator( Create_Project::class );

$router->delete( 'projects/{id}', 'WeDevs/PM/Project/Controllers/Project_Controller@destroy' )
    ->sanitizer( Delete_Sanitizer::class )
    ->permission([Authentic::class, Project_Craete_Capability::class]);
