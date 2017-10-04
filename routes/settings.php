<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'settings', 'CPM/Settings/Controllers/Settings_Controller@index' );
$router->post( 'settings', 'CPM/Settings/Controllers/Settings_Controller@store' );

$router->get( 'projects/{project_id}/settings', 'CPM/Settings/Controllers/Settings_Controller@index' );
$router->post( 'projects/{project_id}/settings', 'CPM/Settings/Controllers/Settings_Controller@store' );