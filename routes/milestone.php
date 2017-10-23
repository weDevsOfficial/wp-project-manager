<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/milestones', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@index' );
$router->post( 'projects/{project_id}/milestones', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@store' );
$router->get( 'projects/{project_id}/milestones/{milestone_id}', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@show' );
$router->post( 'projects/{project_id}/milestones/{milestone_id}', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@update' );
$router->delete( 'projects/{project_id}/milestones/{milestone_id}', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@destroy' );