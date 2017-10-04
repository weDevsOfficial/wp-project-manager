<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/discussion-boards', 'CPM/Discussion_Board/Controllers/Discussion_Board_Controller@index' );
$router->post( 'projects/{project_id}/discussion-boards', 'CPM/Discussion_Board/Controllers/Discussion_Board_Controller@store' );
$router->get( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'CPM/Discussion_Board/Controllers/Discussion_Board_Controller@show' );
$router->post( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'CPM/Discussion_Board/Controllers/Discussion_Board_Controller@update' );
$router->delete( 'projects/{project_id}/discussion-boards/{discussion_board_id}', 'CPM/Discussion_Board/Controllers/Discussion_Board_Controller@destroy' );
$router->put( 'projects/{project_id}/discussion-boards/{discussion_board_id}/attach-users', 'CPM/Discussion_Board/Controllers/Discussion_Board_Controller@attach_users' );
$router->put( 'projects/{project_id}/discussion-boards/{discussion_board_id}/detach-users', 'CPM/Discussion_Board/Controllers/Discussion_Board_Controller@detach_users' );