<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Create_Discuss;
$router = Router::singleton();

$router->get( 'projects/{project_id}/discussion-boards', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@index' )
    ->permission([Authentic::class]);

$router->post( 'projects/{project_id}/discussion-boards', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@store' )
    ->permission([Authentic::class, Create_Discuss::class]);

$router->get( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@show' )
    ->permission([Authentic::class]);
$router->post( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@update' )
    ->permission([Authentic::class, Create_Discuss::class]);

$router->delete( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@destroy' )->permission([Authentic::class, Create_Discuss::class]);

$router->put( 'projects/{project_id}/discussion-boards/{discussion_board_id}/attach-users', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@attach_users' )->permission([Authentic::class, Create_Discuss::class]);

$router->put( 'projects/{project_id}/discussion-boards/{discussion_board_id}/detach-users', 'WeDevs/PM/Discussion_Board/Controllers/Discussion_Board_Controller@detach_users' )->permission([Authentic::class, Create_Discuss::class]);