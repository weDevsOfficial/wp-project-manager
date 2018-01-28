<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Create_Milestone;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/milestones', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@index' )
    ->permission([Authentic::class]);

$router->post( 'projects/{project_id}/milestones', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@store' )
    ->permission([Authentic::class, Create_Milestone::class]);

$router->get( 'projects/{project_id}/milestones/{milestone_id}', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@show' )
    ->permission([Authentic::class]);

$router->put( 'projects/{project_id}/milestones/{milestone_id}', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@update' )
    ->permission([Authentic::class, Create_Milestone::class]);

$router->delete( 'projects/{project_id}/milestones/{milestone_id}', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@destroy' )
    ->permission([Authentic::class, Create_Milestone::class]);