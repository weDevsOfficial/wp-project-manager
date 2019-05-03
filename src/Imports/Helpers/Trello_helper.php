<?php

namespace WeDevs\PM\Imports\Helpers;


class Trello_helper {

        private $api_key ;
        private $token ;
        private $api ;
        private $key_bind ;


        public function __construct($api_key,$token,$mode){
            $this->setup_trello($api_key,$token,$mode);
        }

        private function setup_trello($api_key,$token,$mode){
            if($mode == 'test'){
                $this->api_key = '1156d2bb824b52972adb358326a75061';
                $this->token = '2c9c552cb5568f896b3e3acae25f5fecda06b09ade5101fe68182a2c4b0ea015';
            }else{
                $this->api_key = $api_key ;
                $this->token = $token ;
            }
            $this->api= 'https://api.trello.com/1/';
            $this->key_bind = 'key='. $this->api_key .'&token='. $this->token ;
        }

        public function remote_addr($source,$querystring){
            $url_string = '';
            if(is_array($querystring) && !empty($querystring)){
                foreach($querystring as $qs_key => $qs_val){
                    $url_string .= $qs_key . '=' . $qs_val . '&' ;
                }
            }
            $url = $this->api . $source . '?' . $url_string . $this->key_bind ;
            return $url ;
        }

        public function make_request($source,$querystring,$calback){
        // Get cURL resource
        $curl = curl_init();
        // Set some options - we are passing in a useragent too here
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $this->remote_addr($source,$querystring)
        ]);
        // Send the request & save response to $resp
        $resp = curl_exec($curl);
        // Close request to clear up some resources
        curl_close($curl);
        return $calback($resp);
    }

        public function get_trello_user(){
            return $this->make_request('token/'.$this->token ,[],function($data){
                return json_decode($data) ;
            });
        }

        public function get_trello_boards($trello_user){
            return $this->make_request(
                'members/' . $trello_user->idMember . '/boards',
                [
                    'fields' => 'id,name,desc,closed,dateLastActivity,memberships'
                ],
                function($data){
                    return json_decode($data) ;
                }) ;
        }

        public function get_trello_lists($trello_boards){
            $trello_lists = [];
            if(!empty($trello_boards)){
                foreach($trello_boards as $tb){
                    $trello_lists[$tb->id] =$this->make_request(
                        'boards/' . $tb->id . '/lists',
                        [],
                        function($data){
                            return json_decode($data) ;
                        }) ;
                }
            }
            return $trello_lists;
        }

        public function get_trello_cards($trello_lists){
            $trello_cards = [];
            if(!empty($trello_lists)){
                foreach($trello_lists as $trlst){
                    foreach ($trlst as $tl) {
                         $card_res = $this->make_request(
                                'lists/' . $tl->id . '/cards',
                                [
                                    /*'fields' => 'name,desc,closed,id,dateLastActivity,idBoard,idList'*/
                                ],
                                function ($data) {
                                    return json_decode($data);
                                });
                         if(!empty($card_res)){
                             $trello_cards[$tl->id] = $card_res ;
                         }
                    }
                }
            }
            return $trello_cards;
        }

        public function get_trello_checklist($trello_cards){
        $trello_checklists_arr = [];
        foreach($trello_cards as $tcs){
            if(!empty($tcs)){
                foreach($tcs as $tc){
                    $checklists_res = $this->make_request(
                        'cards/' . $tc->id . '/checklists',
                        [
                            'fields' => 'all'
                        ],
                        function ($data) {
                            return json_decode($data);
                        });
                    if(!empty($checklists_res)){
                        $checkItem = [];
                        foreach($checklists_res as $checklists_re){
                            foreach($checklists_re->checkItems as $checkItems){
                                $curcheckItems = new \stdClass();
                                $curcheckItems->id = $checkItems->id ;
                                $curcheckItems->idBoard = $checklists_re->idBoard ;
                                $curcheckItems->idCard = $checklists_re->idCard ;
                                $curcheckItems->name = $checkItems->name ;
                                $checkItem[] = $curcheckItems ;
                            }
                        }
                        //$trello_checklists_arr[$tc->id] = $checklists_res ;
                        $trello_checklists_arr[$tc->id] = array_merge($checklists_res,$checkItem) ;
                    }
                }
            }
        }
        return $trello_checklists_arr ;
    }

        public function get_trello_users($trello_cards){
            $trello_users_arr = [];
            foreach($trello_cards as $tcs){
                if(!empty($tcs)){
                    foreach($tcs as $tc){
                        $user_res = $this->make_request(
                            'cards/' . $tc->id . '/members',
                            [
                                'fields' => 'all'
                            ],
                            function ($data) {
                                return json_decode($data);
                            });
                        if(!empty($user_res)){
                            $trello_users_arr[$tc->id] = [
                                'user_res' => $user_res,
                                'project_id' => $tc->idBoard,
                                'list_id' => $tc->idList,
                                'task_id' => $tc->id
                            ] ;
                        }
                    }
                }
            }
            return $trello_users_arr ;
        }

}