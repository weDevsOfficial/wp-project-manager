<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Project_Manage_Capability;

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Route file variable, not a global
$router    = Router::singleton();
// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Route file variable, not a global
$authentic = 'WeDevs\PM\Core\Permissions\Authentic';

$router->get( 'search', 'WeDevs\PM\Search\Controllers\Search_Controller@search' )
    ->permission( [ $authentic ] );

$router->get( 'admin-topbar-search', 'WeDevs\PM\Search\Controllers\Search_Controller@searchTopBar' )
    ->permission( [ $authentic ] );
