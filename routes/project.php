<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;
use CPM\Project\Sanitizers\Project_Sanitizer;
use CPM\Project\Validators\Create_Project;
use CPM\Project\Validators\Update_Project;
use CPM\Project\Sanitizers\Delete_Sanitizer;

$router = Router::singleton();

$router->get( 'projects', 'CPM/Project/Controllers/Project_Controller@index' );
$router->get( 'projects/{id}', 'CPM/Project/Controllers/Project_Controller@show' );
	// ->validator( Create_Project::class );

$router->post( 'projects', 'CPM/Project/Controllers/Project_Controller@save' )
    //->permission( [Administrator::class] )
	->sanitizer( Project_Sanitizer::class )
    ->validator( Create_Project::class );

$router->put( 'projects', 'CPM/Project/Controllers/Project_Controller@update' )
	->sanitizer( Project_Sanitizer::class)
    ->validator( Update_Project::class );

$router->delete( 'projects/{id}', 'CPM/Project/Controllers/Project_Controller@destroy' )
	->sanitizer( Delete_Sanitizer::class )
    ->permission( [Administrator::class] );