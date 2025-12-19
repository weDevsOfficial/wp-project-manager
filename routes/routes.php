<?php

// use WeDevs\PM\Core\Router\Router;
// use WeDevs\PM\Core\Permissions\Administrator;
// use WeDevs\PM\Foo\Validators\Foo_Validator;
// use WeDevs\PM\Foo\Sanitizers\Foo_Sanitizer;

// $wedevs_pm_router = Router::singleton();

// $wedevs_pm_router->get( 'foo', 'WeDevs/PM/Foo/Controllers/Foo_Controller@index' );

// $wedevs_pm_router->post( 'foo', 'WeDevs/PM/Foo/Controllers/Foo_Controller@store' )
//     ->permission( [Administrator::class] )
//     ->validator( Foo_Validator::class );

// $wedevs_pm_router->get( 'foo/{id}', 'WeDevs/PM/Foo/Controllers/Foo_Controller@show' )
//     ->permission( [Administrator::class] )
//     ->sanitizer( Foo_Sanitizer::class );

// $wedevs_pm_router->put( 'foo/{id}', 'WeDevs/PM/Foo/Controllers/Foo_Controller@update' )
//     ->permission( [Administrator::class] )
//     ->validator( Foo_Validator::class )
//     ->sanitizer( Foo_Sanitizer::class );

// $wedevs_pm_router->delete( 'foo/{id}', 'WeDevs/PM/Foo/Controllers/Foo_Controller@destroy' )
//     ->permission( [Administrator::class] )
//     ->sanitizer( Foo_Sanitizer::class );