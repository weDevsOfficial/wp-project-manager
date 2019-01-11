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

$router->post( 'tools/activeCollab-auth', 'WeDevs/PM/Tools/Controllers/ActiveCollabController@authenticateAc' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);
