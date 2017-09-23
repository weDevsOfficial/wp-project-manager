<?php

use CPM\Core\Router\Router;
use CPM\Core\Permissions\Administrator;

$router = Router::singleton();

$router->get( 'projects/{project_id}/files', 'CPM/File/Controllers/File_Controller@index' );
$router->post( 'projects/{project_id}/files', 'CPM/File/Controllers/File_Controller@store' );
$router->get( 'projects/{project_id}/files/{file_id}', 'CPM/File/Controllers/File_Controller@show' );
$router->put( 'projects/{project_id}/files/{file_id}', 'CPM/File/Controllers/File_Controller@rename' );
$router->delete( 'projects/{project_id}/files/{file_id}', 'CPM/File/Controllers/File_Controller@destroy' );