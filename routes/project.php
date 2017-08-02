<?php

use CPM\Core\Router\Router;
// use CPM\Core\Permissions\Administrator;

//use CPM\Foo\Validators\Foo_Validator;
use CPM\Project\Sanitizers\Project_Sanitizer;

$router = Router::singleton();

$router->get( 'projects', 'CPM/Project/Controllers/Project_Controller@index' );

$router->post( 'projects', 'CPM/Project/Controllers/Project_Controller@save' )
	->sanitizer( Project_Sanitizer::class );
    //->permission( [Administrator::class] )
    //->validator( Foo_Validator::class );

// $router->get( 'foo/{id}', 'CPM/Foo/Controllers/Foo_Controller@show' );

// $router->put( 'foo/{id}', 'CPM/Foo/Controllers/Foo_Controller@update' )
//     ->permission( [Administrator::class] )
//     ->validator( Foo_Validator::class );

// $router->delete( 'foo/{id}', 'CPM/Foo/Controllers/Foo_Controller@destroy' )
//     ->permission( [Administrator::class] );