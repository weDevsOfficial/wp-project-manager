<?php
namespace WeDevs\PM_Pro\Imports\Controllers;

use WP_REST_Request;
use WeDevs\PM_Pro\Imports\Helpers\Trello_helper ;


class Trello_Controller {


    public function __construct(){
        set_time_limit(0);
    }

    public function index( WP_REST_Request $request ) {

    }

    public function test( WP_REST_Request $request ) {

        $app_key = trim($request->get_param('app_key'));
        $app_token = trim($request->get_param('app_token'));
        $trello_helper = new Trello_helper($app_key,$app_token,'dev');

        $trello_tree = [];
        $trello_user = $trello_helper->get_trello_user();
        $trello_tree['user_id'] = $trello_user->idMember ;

        $trello_boards = $trello_helper->get_trello_boards($trello_user);
        $trello_tree['user_boards'] = $trello_boards;

        $trello_lists = $trello_helper->get_trello_lists($trello_boards);
        $trello_tree['user_boards_lists'] = $trello_lists;

        $trello_cards = $trello_helper->get_trello_cards($trello_lists);
        $trello_tree['user_boards_lists_cards'] = $trello_cards;

        return $trello_tree ;

    }
}