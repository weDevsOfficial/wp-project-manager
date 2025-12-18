<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Access_Project;

$wedevs_pm_router  = Router::singleton();
$wedevs_pm_access  = 'WeDevs\PM\Core\Permissions\Access_Project';

$wedevs_pm_router->get( 'projects/{project_id}/comments', 'WeDevs/PM/Comment/Controllers/Comment_Controller@index' )
    ->permission([$wedevs_pm_access]);

$wedevs_pm_router->post( 'projects/{project_id}/comments', 'WeDevs/PM/Comment/Controllers/Comment_Controller@store' )
    ->permission([$wedevs_pm_access])
    ->validator( 'WeDevs\PM\Comment\Validators\Create_Comment' )
    ->sanitizer( 'WeDevs\PM\Comment\Validators\Comment_Sanitizer' );


$wedevs_pm_router->get( 'projects/{project_id}/comments/{comment_id}', 'WeDevs/PM/Comment/Controllers/Comment_Controller@show' )
    ->permission([$wedevs_pm_access]);

$wedevs_pm_router->post( 'projects/{project_id}/comments/{comment_id}', 'WeDevs/PM/Comment/Controllers/Comment_Controller@update' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Comment'])
    ->validator( 'WeDevs\PM\Comment\Validators\Create_Comment' )
    ->sanitizer( 'WeDevs\PM\Comment\Validators\Comment_Sanitizer' );


$wedevs_pm_router->post( 'projects/{project_id}/comments/{comment_id}/delete', 'WeDevs/PM/Comment/Controllers/Comment_Controller@destroy' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Comment']);
