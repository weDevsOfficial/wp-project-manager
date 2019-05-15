<?php
namespace WeDevs\PM\Imports\Controllers;

use WeDevs\PM\Imports\Models\Import;
use WP_REST_Request;
use WeDevs\PM\Imports\Helpers\Trello_helper ;
use WeDevs\PM\Imports\Helpers\Import_helper as Import_helper ;


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

        $trello_tree['user_boards'] = array_chunk($trello_boards,5);

        $trello_lists = $trello_helper->get_trello_lists($trello_boards);
        $trello_tree['user_boards_lists'] = $trello_lists;

        $trello_cards = $trello_helper->get_trello_cards($trello_lists);
        $trello_tree['user_boards_lists_cards'] = $trello_cards;

        $trello_users = $trello_helper->get_trello_users($trello_cards);
        $trello_tree['user_boards_lists_cards_users'] = $trello_users;

        $trello_users = $trello_helper->get_trello_checklist($trello_cards);
        $trello_tree['user_boards_lists_cards_checklists'] = $trello_users;

        return $trello_tree ;
    }

    public function get_user(WP_REST_Request $request){
        $app_key = trim($request->get_param('app_key'));
        $app_token = trim($request->get_param('app_token'));
        $trello_helper = new Trello_helper($app_key,$app_token,'dev');
        $trello_user = $trello_helper->get_trello_user();
        return $trello_user ;
    }

    public function get_boards(WP_REST_Request $request){
        $trello_user = json_decode(json_encode($request->get_params()));
        $app_key = trim($trello_user->formData->app_key);
        $app_token = trim($trello_user->formData->app_token);
        $trello_helper = new Trello_helper($app_key,$app_token,'dev');
        $trello_boards = $trello_helper->get_trello_boards($trello_user);
        $trello_boards = Import_helper::save_imported_boards($trello_boards);
        return $trello_boards ;
    }

    public function get_lists(WP_REST_Request $request){
        $trello_boards = json_decode(json_encode($request->get_params()));
        $app_key = trim($trello_boards->formData->app_key);
        $app_token = trim($trello_boards->formData->app_token);
        $trello_boards_data = $trello_boards->boards_data ;
        $trello_helper = new Trello_helper($app_key,$app_token,'dev');
        $trello_lists = $trello_helper->get_trello_lists($trello_boards_data);
        $trello_lists = Import_helper::save_imported_lists($trello_lists);
        return $trello_lists ;
    }

    public function get_cards(WP_REST_Request $request){
        $trello_lists = json_decode(json_encode($request->get_params()));
        $app_key = trim($trello_lists->formData->app_key);
        $app_token = trim($trello_lists->formData->app_token);
        $trello_lists_data = $trello_lists->lists_data ;
        $trello_helper = new Trello_helper($app_key,$app_token,'dev');
        $trello_cards = $trello_helper->get_trello_cards($trello_lists_data);
        $trello_cards = Import_helper::save_imported_cards($trello_cards);
        return $trello_cards ;
    }

    public function get_users(WP_REST_Request $request){

        $trello_cards = json_decode(json_encode($request->get_params()));
        $app_key = trim($trello_cards->formData->app_key);
        $app_token = trim($trello_cards->formData->app_token);
        $trello_helper = new Trello_helper($app_key,$app_token,'dev');
        $trello_cards_data = $trello_cards->cards_data ;
        $trello_users = $trello_helper->get_trello_users($trello_cards_data);
        $trello_users = Import_helper::save_imported_user($trello_users);
        return $trello_users ;
    }

    public function get_subcards(WP_REST_Request $request){
        $trello_cards = json_decode(json_encode($request->get_params()));
        $app_key = trim($trello_cards->formData->app_key);
        $app_token = trim($trello_cards->formData->app_token);
        $trello_helper = new Trello_helper($app_key,$app_token,'dev');
        $trello_cards_data = $trello_cards->cards_data ;
        $trello_checklists = $trello_helper->get_trello_checklist($trello_cards_data);
        $trello_checklists = Import_helper::save_imported_checklists($trello_checklists);
        return $trello_checklists;
    }


}