<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'settings', 'WeDevs/PM/Settings/Controllers/Settings_Controller@index' );
$router->post( 'settings', 'WeDevs/PM/Settings/Controllers/Settings_Controller@store' );

$router->get( 'projects/{project_id}/settings', 'WeDevs/PM/Settings/Controllers/Settings_Controller@index' );
$router->post( 'projects/{project_id}/settings', 'WeDevs/PM/Settings/Controllers/Settings_Controller@store' );