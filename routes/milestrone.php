<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/milestones', 'CPM/Milestone/Controllers/Milestone_Controller@index' );
$router->post( 'projects/{project_id}/milestones', 'CPM/Milestone/Controllers/Milestone_Controller@store' );
$router->get( 'projects/{project_id}/milestones/{milestone_id}', 'CPM/Milestone/Controllers/Milestone_Controller@show' );
$router->put( 'projects/{project_id}/milestones/{milestone_id}', 'CPM/Milestone/Controllers/Milestone_Controller@update' );
$router->delete( 'projects/{project_id}/milestones/{milestone_id}', 'CPM/Milestone/Controllers/Milestone_Controller@destroy' );