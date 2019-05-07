<?php

namespace WeDevs\PM\Imports\Helpers;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Task_List\Models\Task_List;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Imports\Models\Import ;
use WeDevs\PM\User\Models\User_Role;
use WeDevs\PM\Common\Models\Assignee;


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
                        'status' => ($brds->closed) ? 1 : 0,
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
                            'local_id' => $project->local_id .'_'.$response->id ,
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
                        $task_list = Import::where('remote_id',$crd->idBoard.'_'.$crd->idList)
                            ->where('type','boards_lists')
                            ->where('source','trello')
                            ->first();
                        $task_list_local_id_array = explode('_',$task_list->local_id);
                        $data = [
                            'project_id' => $task_list_local_id_array[0],
                            'board_id' => $task_list_local_id_array[1],
                            'assignees' => [0],
                            'title' => $crd->name,
                            'description' => $crd->desc,
                            'list_id' => $task_list_local_id_array[1],
                            'status' => ($crd->closed) ? 1 : 0,
                        ];
                        $response = Task::create( $data );
                        $boardables = [
                                'board_id'=>$task_list_local_id_array[1],
                                'board_type'=>'task_list',
                                'boardable_id'=>$response->id,
                                'boardable_type'=>'task'
                            ];
                        Boardable::create($boardables);
                        $response_data = [
                            'type' => 'boards_lists_cards',
                            'remote_id' => $remote_id,
                            'local_id' => $task_list->local_id .'_'.$response->id ,
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
                        $project = Import::where('remote_id','LIKE' ,$chklst->idBoard.'%')
                            ->where('remote_id','LIKE' ,'%'.$chklst->idCard)
                            ->where('type','boards_lists_cards')
                            ->where('source','trello')
                            ->first();
                        $project_checklist_array = explode('_',$project->local_id);
                        $data = [
                            'task_id' => $project_checklist_array[2],
                            'project_id' => $project_checklist_array[0],
                            'board_id' => $project_checklist_array[1],
                            'title' => $chklst->name,
                            'parent_id' => $project_checklist_array[2]
                        ];
                        $response = Task::create( $data );
                        $boardables = [
                            'board_id'=>$project_checklist_array[1],
                            'board_type'=>'task_list',
                            'boardable_id'=>$response->id,
                            'boardable_type'=>'sub_task'
                        ];
                        Boardable::create($boardables);
                        $response_data = [
                            'type' => 'boards_lists_cards_checklist',
                            'remote_id' => $remote_id,
                            'local_id' => $project->local_id .'_'.$response->id ,
                            'creator_id' => get_current_user_id(),
                            'source' => 'trello'
                        ];
                        Import::create($response_data);
                    }
                }
            }
        }
        return $checklists ;
    }

    public static function save_imported_user($users){
        if(!empty($users)){
            foreach($users as $user){
                $local_data = $user['project_id'] . '_' . $user['list_id'] . '_' . $user['task_id'];
                $project = Import::where('remote_id',$local_data)
                    ->where('type','boards_lists_cards')
                    ->where('source','trello')
                    ->first();
                $project_arr = explode('_',$project->local_id);
                foreach($user['user_res'] as $ind_user){
                    $user_id = username_exists($ind_user->username);
                    if(!$user_id){
                        $userdata = [
                            'user_login' => $ind_user->username,
                            'user_nicename' => $ind_user->username,
                            'first_name' => $ind_user->fullName,
                            'role' => 'subscriber',
                            'user_pass' => md5('123456#')
                        ];
                        $user_id = wp_insert_user( $userdata ) ;
                    }
                    $local_project_id = $project_arr[0];
                    $local_task_id = $project_arr[2];
                    User_Role::firstOrCreate([
                        'user_id'    => $user_id,
                        'role_id'    => 2 , // co-worker ;
                        'project_id' => $local_project_id ,
                    ]);
                    Assignee::firstOrCreate( [
                        'task_id'     => $local_task_id,
                        'assigned_to' => $user_id,
                        'project_id'  => $local_project_id,
                    ] );
                }
            }
        }
        return $users ;
    }

}