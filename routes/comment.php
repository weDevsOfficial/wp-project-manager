<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Access_Project;

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Route file variable, not a global
$router  = Router::singleton();
// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Route file variable, not a global
$access  = 'WeDevs\PM\Core\Permissions\Access_Project';

$router->get( 'projects/{project_id}/comments', 'WeDevs/PM/Comment/Controllers/Comment_Controller@index' )
    ->permission([$access]);

$router->post( 'projects/{project_id}/comments', 'WeDevs/PM/Comment/Controllers/Comment_Controller@store' )
    ->permission([$access])
    ->validator( 'WeDevs\PM\Comment\Validators\Create_Comment' )
    ->sanitizer( 'WeDevs\PM\Comment\Validators\Comment_Sanitizer' );


$router->get( 'projects/{project_id}/comments/{comment_id}', 'WeDevs/PM/Comment/Controllers/Comment_Controller@show' )
    ->permission([$access]);

$router->post( 'projects/{project_id}/comments/{comment_id}', 'WeDevs/PM/Comment/Controllers/Comment_Controller@update' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Comment'])
    ->validator( 'WeDevs\PM\Comment\Validators\Create_Comment' )
    ->sanitizer( 'WeDevs\PM\Comment\Validators\Comment_Sanitizer' );


$router->post( 'projects/{project_id}/comments/{comment_id}/delete', 'WeDevs/PM/Comment/Controllers/Comment_Controller@destroy' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Comment']);
