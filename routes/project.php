<?php

use PM\Core\Router\Router;
use PM\Core\Permissions\Administrator;
use PM\Project\Sanitizers\Project_Sanitizer;
use PM\Project\Validators\Create_Project;
use PM\Project\Validators\Update_Project;
use PM\Project\Sanitizers\Delete_Sanitizer;

$router = Router::singleton();

// $router->get( 'projects', 'PM/Project/Controllers/Project_Controller@index' );
// $router->get( 'projects/{id}', 'PM/Project/Controllers/Project_Controller@show' );
// 	// ->validator( Create_Project::class );

// $router->post( 'projects', 'PM/Project/Controllers/Project_Controller@save' )
//     //->permission( [Administrator::class] )
// 	->sanitizer( Project_Sanitizer::class )
//     ->validator( Create_Project::class );

// $router->put( 'projects/{id}', 'PM/Project/Controllers/Project_Controller@update' )
// 	->sanitizer( Project_Sanitizer::class)
//     ->validator( Update_Project::class );

// $router->delete( 'projects/{id}', 'PM/Project/Controllers/Project_Controller@destroy' )
// 	->sanitizer( Delete_Sanitizer::class )
//     ->permission( [Administrator::class] );


$router->get( 'projects', 'PM/Project/Controllers/Project_Controller@index' );
$router->get( 'projects/{id}', 'PM/Project/Controllers/Project_Controller@show' );
$router->post( 'projects', 'PM/Project/Controllers/Project_Controller@store' );
$router->put( 'projects/{id}', 'PM/Project/Controllers/Project_Controller@update' );
$router->delete( 'projects/{id}', 'PM/Project/Controllers/Project_Controller@destroy' );