<?php
/**
 * Created by PhpStorm.
 * User: wedevs-macbook-2
 * Date: 18/12/18
 * Time: 2:21 AM
 */

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;
use WeDevs\PM\Core\Permissions\Project_Manage_Capability;
$router = Router::singleton();


$router->post( 'tools/trello-import', 'WeDevs/PM/Tools/Controllers/TrelloController@import' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);

$router->get( 'tools/trello-imported', 'WeDevs/PM/Tools/Controllers/TrelloController@showSaved' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);

$router->get( 'tools/trello-in-process', 'WeDevs/PM/Tools/Controllers/TrelloController@showInProcess' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);


$router->post( 'tools/asana-import', 'WeDevs/PM/Tools/Controllers/AsanaController@import' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);

$router->get( 'tools/asana-imported', 'WeDevs/PM/Tools/Controllers/AsanaController@showSaved' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);

$router->get( 'tools/asana-in-process', 'WeDevs/PM/Tools/Controllers/AsanaController@showInProcess' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);
