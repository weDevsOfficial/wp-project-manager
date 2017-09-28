<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'activities', 'CPM/Activity/Controllers/Activity_Controller@index' );
