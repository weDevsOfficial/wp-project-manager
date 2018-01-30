<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Access_Project;
$router = Router::singleton();

$router->get( 'projects/{project_id}/comments', 'WeDevs/PM/Comment/Controllers/Comment_Controller@index' )
    ->permission([Access_Project::class]);

$router->post( 'projects/{project_id}/comments', 'WeDevs/PM/Comment/Controllers/Comment_Controller@store' )
    ->permission([Access_Project::class]);

$router->get( 'projects/{project_id}/comments/{comment_id}', 'WeDevs/PM/Comment/Controllers/Comment_Controller@show' )
    ->permission([Access_Project::class]);

$router->post( 'projects/{project_id}/comments/{comment_id}', 'WeDevs/PM/Comment/Controllers/Comment_Controller@update' )
    ->permission([Access_Project::class]);

$router->delete( 'projects/{project_id}/comments/{comment_id}', 'WeDevs/PM/Comment/Controllers/Comment_Controller@destroy' )
    ->permission([Access_Project::class]);