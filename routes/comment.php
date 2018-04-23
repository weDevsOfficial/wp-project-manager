<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Access_Project;

$router     = Router::singleton();
$access  = 'WeDevs\PM\Core\Permissions\Access_Project';

$router->get( 'projects/{project_id}/comments', 'WeDevs/PM/Comment/Controllers/Comment_Controller@index' )
    ->permission([$access]);

$router->post( 'projects/{project_id}/comments', 'WeDevs/PM/Comment/Controllers/Comment_Controller@store' )
    ->permission([$access]);

$router->get( 'projects/{project_id}/comments/{comment_id}', 'WeDevs/PM/Comment/Controllers/Comment_Controller@show' )
    ->permission([$access]);

$router->post( 'projects/{project_id}/comments/{comment_id}', 'WeDevs/PM/Comment/Controllers/Comment_Controller@update' )
    ->permission([$access]);

$router->delete( 'projects/{project_id}/comments/{comment_id}', 'WeDevs/PM/Comment/Controllers/Comment_Controller@destroy' )
    ->permission([$access]);