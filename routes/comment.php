<?php

use WeDevs\PM\Core\Router\Router;

$router = Router::singleton();

$router->get( 'projects/{project_id}/comments', 'WeDevs/PM/Comment/Controllers/Comment_Controller@index' );
$router->post( 'projects/{project_id}/comments', 'WeDevs/PM/Comment/Controllers/Comment_Controller@store' );
$router->get( 'projects/{project_id}/comments/{comment_id}', 'WeDevs/PM/Comment/Controllers/Comment_Controller@show' );
$router->post( 'projects/{project_id}/comments/{comment_id}', 'WeDevs/PM/Comment/Controllers/Comment_Controller@update' );
$router->delete( 'projects/{project_id}/comments/{comment_id}', 'WeDevs/PM/Comment/Controllers/Comment_Controller@destroy' );