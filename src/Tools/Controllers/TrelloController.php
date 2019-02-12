<?php
/**
 * Created by PhpStorm.
 * User: wedevs-macbook-2
 * Date: 18/12/18
 * Time: 10:17 AM
 */
// namespace WeDevs\PM\Tools\Controllers;

// use WP_REST_Request;

// use WeDevs\PM\Tools\Helpers\ImportTrello;

// class TrelloController
// {
//     public $saved;
//     public function __construct()
//     {
//         $this->saved = get_option('imported_from_trello');
//     }

//     public function import(WP_REST_Request $request){

//         $boards = $request->get_param('boards');
//         $importTrello = new ImportTrello();
//         update_option('importing_from_trello', $boards);
//         foreach ( $boards as $board ) {
//             $importTrello->push_to_queue($board);
//         }
//         $importTrello->save()->dispatch();

//         return array('msg' => 'Your trello items are under process to import ... ');

//     }

//     public function showSaved(){
//         return $this->saved;
//     }
//     public function showInProcess(){
//         $inProcess = get_option('importing_from_trello');
//         return $inProcess;
//     }

// }


