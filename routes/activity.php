<?php

use PM\Core\Router\Router;
use PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/activities', 'PM/Activity/Controllers/Activity_Controller@index' );
