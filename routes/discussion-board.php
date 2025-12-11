<?php

use WeDevs\PM\Core\Router\Router;

$wedevs_pm_router         = Router::singleton();
$wedevs_pm_access_project = 'WeDevs\PM\Core\Permissions\Access_Project';
$wedevs_pm_create_discuss = 'WeDevs\PM\Core\Permissions\Create_Discuss';

$wedevs_pm_router->get( 'projects/{project_id}/discussion-boards', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@index' )
    ->permission( [ $wedevs_pm_access_project ] );

$wedevs_pm_router->post( 'projects/{project_id}/discussion-boards', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@store' )
    ->permission( [ $wedevs_pm_create_discuss ] )
    ->validator( 'WeDevs\PM\Discussion_Board\Validators\Create_Discussion_Board' )
    ->sanitizer( 'WeDevs\PM\Discussion_Board\Validators\Discussion_Board_Sanitizer' );

$wedevs_pm_router->get( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@show' )
    ->permission( [ $wedevs_pm_access_project ] );

$wedevs_pm_router->post( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@update' )
    ->permission( ['WeDevs\PM\Core\Permissions\Edit_Discuss'] )
    ->validator( 'WeDevs\PM\Discussion_Board\Validators\Create_Discussion_Board' )
    ->sanitizer( 'WeDevs\PM\Discussion_Board\Validators\Discussion_Board_Sanitizer' );

$wedevs_pm_router->post( 'projects/{project_id}/discussion-boards/privacy/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@privacy' )
	->permission( ['WeDevs\PM\Core\Permissions\Edit_Discuss'] );

$wedevs_pm_router->post( 'projects/{project_id}/discussion-boards/{discussion_board_id}/delete', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@destroy' )
	->permission( ['WeDevs\PM\Core\Permissions\Edit_Discuss'] );

$wedevs_pm_router->put( 'projects/{project_id}/discussion-boards/{discussion_board_id}/attach-users', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@attach_users' )->permission( ['WeDevs\PM\Core\Permissions\Edit_Discuss'] );

$wedevs_pm_router->put( 'projects/{project_id}/discussion-boards/{discussion_board_id}/detach-users', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@detach_users' )->permission( ['WeDevs\PM\Core\Permissions\Edit_Discuss'] );
