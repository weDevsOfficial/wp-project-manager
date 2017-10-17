<?php

use PM\Core\Router\Router;
use PM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/files', 'PM/File/Controllers/File_Controller@index' );
$router->post( 'projects/{project_id}/files', 'PM/File/Controllers/File_Controller@store' );
$router->get( 'projects/{project_id}/files/{file_id}', 'PM/File/Controllers/File_Controller@show' );
$router->put( 'projects/{project_id}/files/{file_id}', 'PM/File/Controllers/File_Controller@rename' );
$router->delete( 'projects/{project_id}/files/{file_id}', 'PM/File/Controllers/File_Controller@destroy' );