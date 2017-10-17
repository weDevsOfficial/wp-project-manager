<?php

// use PM\Core\Router\Router;
// use PM\Core\Permissions\Administrator;
// use PM\Foo\Validators\Foo_Validator;
// use PM\Foo\Sanitizers\Foo_Sanitizer;

// $router = Router::singleton();

// $router->get( 'foo', 'PM/Foo/Controllers/Foo_Controller@index' );

// $router->post( 'foo', 'PM/Foo/Controllers/Foo_Controller@store' )
//     ->permission( [Administrator::class] )
//     ->validator( Foo_Validator::class );

// $router->get( 'foo/{id}', 'PM/Foo/Controllers/Foo_Controller@show' )
//     ->permission( [Administrator::class] )
//     ->sanitizer( Foo_Sanitizer::class );

// $router->put( 'foo/{id}', 'PM/Foo/Controllers/Foo_Controller@update' )
//     ->permission( [Administrator::class] )
//     ->validator( Foo_Validator::class )
//     ->sanitizer( Foo_Sanitizer::class );

// $router->delete( 'foo/{id}', 'PM/Foo/Controllers/Foo_Controller@destroy' )
//     ->permission( [Administrator::class] )
//     ->sanitizer( Foo_Sanitizer::class );