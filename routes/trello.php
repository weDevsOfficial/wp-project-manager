<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;
$wedevs_pm_router = Router::singleton();

$wedevs_pm_router->get( 'trello', 'WeDevs/PM/Imports/Controllers/Trello_Controller@index' );
$wedevs_pm_router->post( 'trello', 'WeDevs/PM/Imports/Controllers/Trello_Controller@index' );

$wedevs_pm_router->get( 'trello/test', 'WeDevs/PM/Imports/Controllers/Trello_Controller@test' );
$wedevs_pm_router->post( 'trello/test', 'WeDevs/PM/Imports/Controllers/Trello_Controller@test' );


$wedevs_pm_router->get( 'trello/get_user', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_user' );
$wedevs_pm_router->post( 'trello/get_user', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_user' );


$wedevs_pm_router->get( 'trello/get_boards', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_boards' );
$wedevs_pm_router->post( 'trello/get_boards', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_boards' );

$wedevs_pm_router->get( 'trello/get_lists', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_lists' );
$wedevs_pm_router->post( 'trello/get_lists', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_lists' );

$wedevs_pm_router->get( 'trello/get_cards', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_cards' );
$wedevs_pm_router->post( 'trello/get_cards', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_cards' );

$wedevs_pm_router->get( 'trello/get_subcards', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_subcards' );
$wedevs_pm_router->post( 'trello/get_subcards', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_subcards' );

$wedevs_pm_router->get( 'trello/get_users', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_users' );
$wedevs_pm_router->post( 'trello/get_users', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_users' );