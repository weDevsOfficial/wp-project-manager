<?php

use PM\Core\Router\Router;
use PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/milestones', 'PM/Milestone/Controllers/Milestone_Controller@index' );
$router->post( 'projects/{project_id}/milestones', 'PM/Milestone/Controllers/Milestone_Controller@store' );
$router->get( 'projects/{project_id}/milestones/{milestone_id}', 'PM/Milestone/Controllers/Milestone_Controller@show' );
$router->put( 'projects/{project_id}/milestones/{milestone_id}', 'PM/Milestone/Controllers/Milestone_Controller@update' );
$router->delete( 'projects/{project_id}/milestones/{milestone_id}', 'PM/Milestone/Controllers/Milestone_Controller@destroy' );