<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Create_Milestone;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/milestones', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@index' )
    ->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$router->post( 'projects/{project_id}/milestones', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@store' )
    ->permission(['WeDevs\PM\Core\Permissions\Create_Milestone'])
    ->validator( 'WeDevs\PM\Milestone\Validators\Create_Milestone' );


$router->get( 'projects/{project_id}/milestones/{milestone_id}', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@show' )
    ->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$router->post( 'projects/{project_id}/milestones/{milestone_id}/update', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@update' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Milestone'])
    ->validator( 'WeDevs\PM\Milestone\Validators\Create_Milestone' );


$router->post( 'projects/{project_id}/milestones/{milestone_id}/delete', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@destroy' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_Milestone']);

$router->post( 'projects/{project_id}/milestones/privacy/{milestone_id}', 'WeDevs/PM/Milestone/Controllers/Milestone_Controller@privacy' )
	->permission(['WeDevs\PM\Core\Permissions\Edit_Milestone']);
