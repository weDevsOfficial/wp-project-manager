<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Create_File;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/files', 'WeDevs/PM/File/Controllers/File_Controller@index' )
    ->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$router->post( 'projects/{project_id}/files', 'WeDevs/PM/File/Controllers/File_Controller@store' )
    ->permission(['WeDevs\PM\Core\Permissions\Create_File']);

$router->get( 'projects/{project_id}/files/{file_id}', 'WeDevs/PM/File/Controllers/File_Controller@show' )
    ->permission(['WeDevs\PM\Core\Permissions\Access_Project']);

$router->post( 'projects/{project_id}/files/{file_id}/update', 'WeDevs/PM/File/Controllers/File_Controller@rename' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_File']);

$router->post( 'projects/{project_id}/files/{file_id}/delete', 'WeDevs/PM/File/Controllers/File_Controller@destroy' )
    ->permission(['WeDevs\PM\Core\Permissions\Edit_File']);

$router->get( 'projects/{project_id}/files/{file_id}/users/{user_id}/download', 'WeDevs/PM/File/Controllers/File_Controller@download' )
->permission(['WeDevs\PM\Core\Permissions\Access_Project']);
