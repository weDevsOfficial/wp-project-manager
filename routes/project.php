<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;
use CPM\Project\Sanitizers\Project_Sanitizer;
use CPM\Project\Validators\Project_Validator;

$router = Router::singleton();

$router->get( 'projects', 'CPM/Project/Controllers/Project_Controller@index' );

$router->post( 'projects', 'CPM/Project/Controllers/Project_Controller@save' )
    //->permission( [Administrator::class] )
	->sanitizer( Project_Sanitizer::class )
    ->validator( Project_Validator::class );

$router->put( 'projects', 'CPM/Project/Controllers/Project_Controller@update' )
	->sanitizer( Project_Sanitizer::class )
    ->validator( Project_Validator::class );

$router->delete( 'foo/{id}', 'CPM/Foo/Controllers/Foo_Controller@destroy' )
    ->permission( [Administrator::class] );