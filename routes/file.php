<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Create_File;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/files', 'WeDevs/PM/File/Controllers/File_Controller@index' )
->permission([Authentic::class]);

$router->post( 'projects/{project_id}/files', 'WeDevs/PM/File/Controllers/File_Controller@store' )
->permission([Authentic::class, Create_File::class]);

$router->get( 'projects/{project_id}/files/{file_id}', 'WeDevs/PM/File/Controllers/File_Controller@show' )
->permission([Authentic::class]);

$router->put( 'projects/{project_id}/files/{file_id}', 'WeDevs/PM/File/Controllers/File_Controller@rename' )
->permission([Authentic::class, Create_File::class]);

$router->delete( 'projects/{project_id}/files/{file_id}', 'WeDevs/PM/File/Controllers/File_Controller@destroy' )
->permission([Authentic::class, Create_File::class]);