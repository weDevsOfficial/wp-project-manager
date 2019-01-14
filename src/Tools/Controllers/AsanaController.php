<?php
/**
 * Created by PhpStorm.
 * User: faizuralmas
 * Date: 14/1/19
 * Time: 1:54 PM
 */

namespace WeDevs\PM\Tools\Controllers;

use WP_REST_Request;

class AsanaController
{


    public function import(WP_REST_Request $request){

        $projects = $request->get_param('projects');
//        $importTrello = new ImportTrello();
//        update_option('importing_from_asana', $boards);
//        foreach ( $boards as $board ) {
//            $importTrello->push_to_queue($board);
//        }
//        $importTrello->save()->dispatch();

        return  $projects;//array('msg' => 'Your asana items are under process to import ... ');


    }

    public function showSaved(){
        $saved = get_option('imported_from_asana');
        return $saved;
    }
    public function showInProcess(){
        $inProcess = get_option('importing_from_asana');
        return $inProcess;
    }

}
