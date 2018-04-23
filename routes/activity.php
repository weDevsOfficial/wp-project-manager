<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;
use WeDevs\PM\Core\Permissions\Access_Project;

$access_project =  '\WeDevs\PM\Core\Permissions\Access_Project';
$router         = Router::singleton();

$router->get( 'projects/{project_id}/activities', 'WeDevs/PM/Activity/Controllers/Activity_Controller@index' )
    ->permission([$access_project]);
