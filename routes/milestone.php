<?php

use WeDevs\PM\Core\Router\Router;

$wedevs_pm_router = Router::singleton();

$wedevs_pm_router->get( 'projects/{project_id}/milestones', [\WeDevs\PM\Milestone\Controllers\Milestone_Controller::class, 'index'] )
    ->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );

$wedevs_pm_router->post( 'projects/{project_id}/milestones', [\WeDevs\PM\Milestone\Controllers\Milestone_Controller::class, 'store'] )
    ->permission( ['WeDevs\PM\Core\Permissions\Create_Milestone'] )
    ->validator( 'WeDevs\PM\Milestone\Validators\Create_Milestone' )
    ->sanitizer( 'WeDevs\PM\Milestone\Sanitizers\Milestone_Sanitizer' );

$wedevs_pm_router->get( 'projects/{project_id}/milestones/{milestone_id}', [\WeDevs\PM\Milestone\Controllers\Milestone_Controller::class, 'show'] )
    ->permission( ['WeDevs\PM\Core\Permissions\Access_Project'] );

$wedevs_pm_router->post( 'projects/{project_id}/milestones/{milestone_id}/update', [\WeDevs\PM\Milestone\Controllers\Milestone_Controller::class, 'update'] )
    ->permission( ['WeDevs\PM\Core\Permissions\Edit_Milestone'] )
    ->validator( 'WeDevs\PM\Milestone\Validators\Create_Milestone' )
    ->sanitizer( 'WeDevs\PM\Milestone\Sanitizers\Milestone_Sanitizer' );

$wedevs_pm_router->post( 'projects/{project_id}/milestones/{milestone_id}/delete', [\WeDevs\PM\Milestone\Controllers\Milestone_Controller::class, 'destroy'] )
    ->permission( ['WeDevs\PM\Core\Permissions\Edit_Milestone'] );

$wedevs_pm_router->post( 'projects/{project_id}/milestones/privacy/{milestone_id}', [\WeDevs\PM\Milestone\Controllers\Milestone_Controller::class, 'privacy'] )
	->permission( ['WeDevs\PM\Core\Permissions\Edit_Milestone'] );
