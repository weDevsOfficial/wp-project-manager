<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Create_Discuss;

$router = Router::singleton();
$access  = 'WeDevs\PM\Core\Permissions\Access_Project';
$create_discuss = 'WeDevs\PM\Core\Permissions\Create_Discuss';

$router->get( 'projects/{project_id}/discussion-boards', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@index' )
    ->permission([$access]);

$router->post( 'projects/{project_id}/discussion-boards', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@store' )
    ->permission([$create_discuss])
    ->validator( 'WeDevs\PM\Discussion_Board\Validators\Create_Discussion_Board' );


$router->get( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@show' )
    ->permission([$access]);

$router->post( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@update' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Discuss'])
    ->validator( 'WeDevs\PM\Discussion_Board\Validators\Create_Discussion_Board' );


$router->post( 'projects/{project_id}/discussion-boards/privacy/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@privacy' )
	->permission(['WeDevs\PM\Core\Permissions\Edit_Discuss']);

$router->post( 'projects/{project_id}/discussion-boards/{discussion_board_id}/delete', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@destroy' )
	->permission(['WeDevs\PM\Core\Permissions\Edit_Discuss']);

$router->put( 'projects/{project_id}/discussion-boards/{discussion_board_id}/attach-users', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@attach_users' )->permission(['WeDevs\PM\Core\Permissions\Edit_Discuss']);

$router->put( 'projects/{project_id}/discussion-boards/{discussion_board_id}/detach-users', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@detach_users' )->permission(['WeDevs\PM\Core\Permissions\Edit_Discuss']);
