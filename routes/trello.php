<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;
$wedevs_pm_router = Router::singleton();

$wedevs_pm_router->get( 'trello', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'index'] );
$wedevs_pm_router->post( 'trello', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'index'] );

$wedevs_pm_router->get( 'trello/test', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'test'] );
$wedevs_pm_router->post( 'trello/test', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'test'] );


$wedevs_pm_router->get( 'trello/get_user', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'get_user'] );
$wedevs_pm_router->post( 'trello/get_user', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'get_user'] );


$wedevs_pm_router->get( 'trello/get_boards', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'get_boards'] );
$wedevs_pm_router->post( 'trello/get_boards', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'get_boards'] );

$wedevs_pm_router->get( 'trello/get_lists', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'get_lists'] );
$wedevs_pm_router->post( 'trello/get_lists', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'get_lists'] );

$wedevs_pm_router->get( 'trello/get_cards', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'get_cards'] );
$wedevs_pm_router->post( 'trello/get_cards', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'get_cards'] );

$wedevs_pm_router->get( 'trello/get_subcards', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'get_subcards'] );
$wedevs_pm_router->post( 'trello/get_subcards', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'get_subcards'] );

$wedevs_pm_router->get( 'trello/get_users', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'get_users'] );
$wedevs_pm_router->post( 'trello/get_users', [\WeDevs\PM\Imports\Controllers\Trello_Controller::class, 'get_users'] );
