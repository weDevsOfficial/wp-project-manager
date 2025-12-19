<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Project_Create_Capability;
use WeDevs\PM\Project\Sanitizers\Project_Sanitizer;
use WeDevs\PM\Project\Validators\Create_Project;
use WeDevs\PM\Project\Validators\Update_Project;
use WeDevs\PM\Project\Sanitizers\Delete_Sanitizer;
use WeDevs\PM\Helper\Project;

$wedevs_pm_router = Router::singleton();

$wedevs_pm_router->get( 'advanced/projects', 'WeDevs/PM/Project/Controllers/Project_Controller@index' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);

$wedevs_pm_router->get( 'projects', 'WeDevs/PM/Project/Helper/Project@get_projects' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);

$wedevs_pm_router->get( 'projects/{id}', 'WeDevs/PM/Project/Controllers/Project_Controller@show' )
    ->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$wedevs_pm_router->post( 'projects', 'WeDevs/PM/Project/Controllers/Project_Controller@store' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Create_Capability'])
    ->validator( 'WeDevs\PM\Project\Validators\Create_Project' )
    ->sanitizer( 'WeDevs\PM\Project\Sanitizers\Project_Sanitizer' );

$wedevs_pm_router->post( 'projects/{id}/update', 'WeDevs/PM/Project/Controllers/Project_Controller@update' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability'])
    ->sanitizer( 'WeDevs\PM\Project\Sanitizers\Project_Sanitizer' )
    ->validator( 'WeDevs\PM\Project\Validators\Update_Project' );

$wedevs_pm_router->post( 'projects/{id}/favourite', 'WeDevs/PM/Project/Controllers/Project_Controller@favourite_project' )
    ->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$wedevs_pm_router->post( 'projects/{id}/delete', 'WeDevs/PM/Project/Controllers/Project_Controller@destroy' )
    ->sanitizer( 'WeDevs\PM\Project\Sanitizers\Delete_Sanitizer' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Manage_Capability']);

$wedevs_pm_router->post( 'projects/ai/generate', 'WeDevs/PM/Project/Controllers/Project_Controller@ai_generate' )
    ->permission(['WeDevs\PM\Core\Permissions\Project_Create_Capability']);

// $wedevs_pm_router->get( 'projects/search', 'WeDevs/PM/Project/Controllers/Project_Controller@project_search' )
//     ->permission(['WeDevs\PM\Core\Permissions\Authentic']);

