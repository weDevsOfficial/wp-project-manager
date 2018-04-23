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
    ->permission([$create_discuss]);

$router->get( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@show' )
    ->permission([$access]);
$router->post( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@update' )
    ->permission([$create_discuss]);

$router->post( 'projects/{project_id}/discussion-boards/privacy/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@privacy' );

$router->delete( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@destroy' )->permission([$create_discuss]);

$router->put( 'projects/{project_id}/discussion-boards/{discussion_board_id}/attach-users', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@attach_users' )->permission([ $create_discuss]);

$router->put( 'projects/{project_id}/discussion-boards/{discussion_board_id}/detach-users', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@detach_users' )->permission([$create_discuss]);