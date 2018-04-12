<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Create_Milestone;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/milestones', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@index' )
    ->permission([Access_Project::class]);

$router->post( 'projects/{project_id}/milestones', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@store' )
    ->permission([ Create_Milestone::class]);

$router->get( 'projects/{project_id}/milestones/{milestone_id}', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@show' )
    ->permission([Access_Project::class]);

$router->put( 'projects/{project_id}/milestones/{milestone_id}', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@update' )
    ->permission([ Create_Milestone::class]);

$router->delete( 'projects/{project_id}/milestones/{milestone_id}', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@destroy' )
    ->permission([Create_Milestone::class]);
$router->post( 'projects/{project_id}/milestones/privacy/{milestone_id}', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@privacy' )
->permission([Create_Milestone::class]);