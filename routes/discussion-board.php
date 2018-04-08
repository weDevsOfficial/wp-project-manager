<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Create_Discuss;
$router = Router::singleton();

$router->get( 'projects/{project_id}/discussion-boards', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@index' )
    ->permission([Access_Project::class]);

$router->post( 'projects/{project_id}/discussion-boards', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@store' )
    ->permission([Create_Discuss::class]);

$router->get( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@show' )
    ->permission([Access_Project::class]);
$router->post( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@update' )
    ->permission([Create_Discuss::class]);

$router->post( 'projects/{project_id}/discussion-boards/privacy/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@privacy' );

$router->delete( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@destroy' )->permission([Create_Discuss::class]);

$router->put( 'projects/{project_id}/discussion-boards/{discussion_board_id}/attach-users', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@attach_users' )->permission([ Create_Discuss::class]);

$router->put( 'projects/{project_id}/discussion-boards/{discussion_board_id}/detach-users', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@detach_users' )->permission([Create_Discuss::class]);