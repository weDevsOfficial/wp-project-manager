<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;
use CPM\Project\Sanitizers\Project_Sanitizer;
use CPM\Project\Validators\Create_Project;

$router = Router::singleton();

//$router->get( 'projects', 'CPM/Project/Controllers/Project_Controller@index' );
$router->get( 'projects/{id}', 'CPM/Project/Controllers/Project_Controller@show' );
	// ->validator( Create_Project::class );

$router->post( 'projects', 'CPM/Project/Controllers/Project_Controller@save' )
    //->permission( [Administrator::class] )
	->sanitizer( Project_Sanitizer::class )
    ->validator( Create_Project::class );

$router->put( 'projects', 'CPM/Project/Controllers/Project_Controller@update' )
	->sanitizer( Project_Sanitizer::class)
    ->validator( Create_Project::class );

$router->delete( 'foo/{id}', 'CPM/Foo/Controllers/Foo_Controller@destroy' )
    ->permission( [Administrator::class] );