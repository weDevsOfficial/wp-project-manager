<?php
/**
 * Created by PhpStorm.
 * User: wedevs-macbook-2
 * Date: 18/12/18
 * Time: 10:17 AM
 */
namespace WeDevs\PM\Tools\Controllers;

use WP_REST_Request;

use WeDevs\PM\Tools\Helpers\ImportTrello;

class TrelloController
{
    public $saved;
    public function __construct()
    {
        $this->saved = get_option('imported_from_trello');
    }

    public function import(WP_REST_Request $request){

        $boards = $request->get_param('boards');
        $importTrello = new ImportTrello();
        update_option('importing_from_trello', $boards);
        foreach ( $boards as $board ) {
            $importTrello->push_to_queue($board);
        }
        $importTrello->save()->dispatch();

        return array('msg' => 'Your trello items are under process to import ... ');

//        return $importTrello->trello->getCardMembers('56c56ae0abd3ab8cd1b7d953');
//        return $importTrello->trello->getBoard('5bacac2dd2938a4ba1b9efb8');
//        return $importTrello->trello->getLists('5bacac2dd2938a4ba1b9efb8');
//        return $importTrello->trello->getCards('5bacac2dd2938a4ba1b9efb9');
//        return $importTrello->getOrCreateUserId('dash','shamssadek@gmail.com');
//        return $importTrello->trello->getMemberInfo('56c2c790e640640ecdbb7a92');
//        return $importTrello->trello->getMemberInfo('56c2c7ecb0965c311015ea73');
//        return $importTrello->trello->getCardActions('5c2da9fd1215b37bb747b95a')['1'];
//        //['memberCreator']['username'];

//        return $importTrello->trello->getCardChecklists('5c2da9fd1215b37bb747b95a')[0]['checkItems'];
//        $tt = $importTrello->trello->getLists('5c1bd10b46c4c60fa2fe623a');
//
//
//
//        if(!empty($tt)){
//             foreach ($tt as $t){
//                 echo $t;
//             }
//         } else {
//            error_log( 'no' );
//             return 'no';
//         }
    }

    public function showSaved(){
        return $this->saved;
    }
    public function showInProcess(){
        $inProcess = get_option('importing_from_trello');
        return $inProcess;
    }

}

//https://stackoverflow.com/questions/42247377/trello-api-e-mail-address-of-my-card-returns-null
