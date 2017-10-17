<?php

use PM\Core\Router\Router;
use PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'settings', 'PM/Settings/Controllers/Settings_Controller@index' );
$router->post( 'settings', 'PM/Settings/Controllers/Settings_Controller@store' );

$router->get( 'projects/{project_id}/settings', 'PM/Settings/Controllers/Settings_Controller@index' );
$router->post( 'projects/{project_id}/settings', 'PM/Settings/Controllers/Settings_Controller@store' );