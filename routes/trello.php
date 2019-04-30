<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;
$router = Router::singleton();

$router->get( 'trello', 'WeDevs/PM/Imports/Controllers/Trello_Controller@index' );
$router->post( 'trello', 'WeDevs/PM/Imports/Controllers/Trello_Controller@index' );

$router->get( 'trello/test', 'WeDevs/PM/Imports/Controllers/Trello_Controller@test' );
$router->post( 'trello/test', 'WeDevs/PM/Imports/Controllers/Trello_Controller@test' );


$router->get( 'trello/get_user', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_user' );
$router->post( 'trello/get_user', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_user' );


$router->get( 'trello/get_boards', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_boards' );
$router->post( 'trello/get_boards', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_boards' );

$router->get( 'trello/get_lists', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_lists' );
$router->post( 'trello/get_lists', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_lists' );

$router->get( 'trello/get_cards', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_cards' );
$router->post( 'trello/get_cards', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_cards' );

$router->get( 'trello/get_subcards', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_subcards' );
$router->post( 'trello/get_subcards', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_subcards' );

$router->get( 'trello/get_users', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_users' );
$router->post( 'trello/get_users', 'WeDevs/PM/Imports/Controllers/Trello_Controller@get_users' );