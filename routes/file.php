<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Create_File;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/files', 'WeDevs/PM/File/Controllers/File_Controller@index' )
    ->permission([Access_Project::class]);

$router->post( 'projects/{project_id}/files', 'WeDevs/PM/File/Controllers/File_Controller@store' )
    ->permission([Create_File::class]);

$router->get( 'projects/{project_id}/files/{file_id}', 'WeDevs/PM/File/Controllers/File_Controller@show' )
    ->permission([Access_Project::class]);

$router->put( 'projects/{project_id}/files/{file_id}', 'WeDevs/PM/File/Controllers/File_Controller@rename' )
    ->permission([Create_File::class]);

$router->delete( 'projects/{project_id}/files/{file_id}', 'WeDevs/PM/File/Controllers/File_Controller@destroy' )
    ->permission([Create_File::class]);

$router->get( 'projects/{project_id}/files/{file_id}/download', 'WeDevs/PM/File/Controllers/File_Controller@download' );
