<?php

namespace WeDevs\PM_Pro\Imports\Helpers;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Task_List\Models\Task_List;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM_Pro\Imports\Models\Import ;


class Import_helper {

    public static function check_if_exsit($id,$source,$type){
        $total=  Import::where('remote_id',$id)
            ->where('type',$type)
            ->where('source',$source)
            ->count();
        if($total > 0){
            return true ;
        }else{
            return false ;
        }

    }

    public static function save_imported_boards($boards){
        if(!empty($boards)){
            foreach($boards as $brds){
                $if_exist = self::check_if_exsit($brds->id,'trello','boards');
                if(!$if_exist){
                    $data = [
                        'title' => $brds->name,
                        'description' => $brds->desc,
                        'notify_users' => false,
                        'status' => (!$brds->closed) ? 'incomplete' : 'completed',
                    ];
                    $response = Project::create($data);
                    $response_data = [
                        'type' => 'boards',
                        'remote_id' => $brds->id,
                        'local_id' => $response->id ,
                        'creator_id' => get_current_user_id(),
                        'source' => 'trello'
                    ];
                    Import::create($response_data);
                }
            }
        }
        return $boards ;
    }

    public static function save_imported_lists($lists){
        if(!empty($lists)){
            foreach($lists as $list){
                foreach($list as $lst){
                    $remote_id = $lst->idBoard . '_' . $lst->id ;
                    $if_exist = self::check_if_exsit($remote_id,'trello','boards_lists');
                    if(!$if_exist){
                        $project = Import::where('remote_id',$lst->idBoard)
                            ->where('type','boards')
                            ->where('source','trello')
                            ->first();
                        $data = [
                            'project_id' => $project->local_id,
                            'title' => $lst->name,
                            'description' => '',
                            'milestone' => -1,
                            'privacy' => false
                        ];
                        $response     = Task_List::create( $data );
                        $response_data = [
                            'type' => 'boards_lists',
                            'remote_id' => $remote_id,
                            'local_id' => $response->id ,
                            'creator_id' => get_current_user_id(),
                            'source' => 'trello'
                        ];
                        Import::create($response_data);
                    }
                }
            }
        }
        return $lists ;
    }

    public static function save_imported_cards($cards){
        if(!empty($cards)){
            foreach($cards as $card){
                foreach($card as $crd){
                    $remote_id = $crd->idBoard . '_' . $crd->idList . '_' . $crd->id;
                    $if_exist = self::check_if_exsit($remote_id,'trello','boards_lists_cards');
                    if(!$if_exist){
                        $project = Import::where('remote_id',$crd->idBoard)
                            ->where('type','boards')
                            ->where('source','trello')
                            ->first();
                        $task_list = Import::where('remote_id',$crd->idBoard.'_'.$crd->idList)
                            ->where('type','boards_lists')
                            ->where('source','trello')
                            ->first();
                        $data = [
                            'project_id' => $project->local_id,
                            'board_id' => $task_list->local_id,
                            'assignees' => [0],
                            'title' => $crd->name,
                            'description' => $crd->desc,
                            'list_id' => $task_list->local_id,
                            '' => '',
                        ];
                        $response = Task::create( $data );
                        $boardables = [
                                'board_id'=>$task_list->local_id,
                                'board_type'=>'task_list',
                                'boardable_id'=>$response->id,
                                'boardable_type'=>'task'
                            ];
                        Boardable::create($boardables);
                        $response_data = [
                            'type' => 'boards_lists_cards',
                            'remote_id' => $remote_id,
                            'local_id' => $response->id ,
                            'creator_id' => get_current_user_id(),
                            'source' => 'trello'
                        ];
                        Import::create($response_data);
                    }

                }
            }
        }
        return $cards ;
    }

    public static function save_imported_checklists($checklists){
        if(!empty($checklists)){
            foreach($checklists as $checklist){
                foreach($checklist as $chklst){
                    $remote_id = $chklst->idBoard . '_' . $chklst->idCard . '_' . $chklst->id;
                    $if_exist = self::check_if_exsit($remote_id,'trello','boards_lists_cards_checklist');
                    if(!$if_exist){
                        $project = Import::where('remote_id',$chklst->idBoard)
                            ->where('type','boards')
                            ->where('source','trello')
                            ->first();
                        $cards = Import::where('remote_id',$chklst->idBoard)
                            ->where('type','boards')
                            ->where('source','trello')
                            ->first();
                    }
                    /*Array
                    (
                        [task_id] => 160
                        [project_id] => 40
                        [board_id] => 53
                        [title] => sdasdas
                        [parent_id] => 160
                        [is_admin] => 1
                    )*/


                }
            }
        }
    }


}