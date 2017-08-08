<?php

use CPM\Core\Router\Router;
// use CPM\Core\Permissions\Administrator;

//use CPM\Foo\Validators\Foo_Validator;
use CPM\Project\Sanitizers\Project_Sanitizer;

//use CPM\Project\Validators\Projecct_Validator;
use CPM\Project\Validators\Project_Validator;

$router = Router::singleton();

$router->get( 'projects', 'CPM/Project/Controllers/Project_Controller@index' );

$router->post( 'projects', 'CPM/Project/Controllers/Project_Controller@save' )
	->sanitizer( Project_Sanitizer::class )
    ->validator( Project_Validator::class );
    //->permission( [Administrator::class] )

$router->put( 'projects', 'CPM/Project/Controllers/Project_Controller@update' )
	->sanitizer( Project_Sanitizer::class )
    ->validator( Project_Validator::class );

// $router->get( 'foo/{id}', 'CPM/Foo/Controllers/Foo_Controller@show' );

// $router->put( 'foo/{id}', 'CPM/Foo/Controllers/Foo_Controller@update' )
//     ->permission( [Administrator::class] )
//     ->validator( Foo_Validator::class );

// $router->delete( 'foo/{id}', 'CPM/Foo/Controllers/Foo_Controller@destroy' )
//     ->permission( [Administrator::class] );