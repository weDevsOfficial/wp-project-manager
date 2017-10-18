<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/files', 'WeDevs/PM/File/Controllers/File_Controller@index' );
$router->post( 'projects/{project_id}/files', 'WeDevs/PM/File/Controllers/File_Controller@store' );
$router->get( 'projects/{project_id}/files/{file_id}', 'WeDevs/PM/File/Controllers/File_Controller@show' );
$router->put( 'projects/{project_id}/files/{file_id}', 'WeDevs/PM/File/Controllers/File_Controller@rename' );
$router->delete( 'projects/{project_id}/files/{file_id}', 'WeDevs/PM/File/Controllers/File_Controller@destroy' );