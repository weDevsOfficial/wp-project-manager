<?php
/**
 * Created by PhpStorm.
 * User: faizuralmas
 * Date: 14/1/19
 * Time: 1:54 PM
 */

// namespace WeDevs\PM\Tools\Controllers;

// use WeDevs\PM\Tools\Helpers\ImportAsana;
// use WP_REST_Request;

// class AsanaController
// {


//     public function import(WP_REST_Request $request){

//         $projects = $request->get_param('projects');
//         $importAsana = new ImportAsana();
//         update_option('importing_from_asana', $projects);
//         foreach ( $projects as $project ) {
//             $importAsana->push_to_queue($project);
//         }
//         $importAsana->save()->dispatch();
//         return array('msg' => 'Your Asana Projects are under process to import ... ');

// //        $project = $importAsana->asana->getAsana('projects/962565882603724');
// //        return $project->data->members[0]->id;

//     }

//     public function showSaved(){
//         $saved = get_option('imported_from_asana');
//         return $saved;
//     }
//     public function showInProcess(){
//         $inProcess = get_option('importing_from_asana');
//         return $inProcess;
//     }

// }
