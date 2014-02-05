<?php

/**
 * Calendar
 *
 * @author Tareq Hasan (http://tareq.weDevs.com)
 */
class CPM_Calendar {

    private static $_instance;

    public function __construct() {
        
    }

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new CPM_Calendar();
        }

        return self::$_instance;
    }
    
    function get_events() {
        $projects = CPM_Project::getInstance()->get_projects();
        
        //filter only assigned projects        
        $assigned_projects = array();
        foreach($projects as $project){
            if(CPM_Project::getInstance()->has_permission($project))
                $assigned_projects[] = $project->ID;
        }
        
        $events = array();
        if($assigned_projects){
            foreach($assigned_projects as $project_id){
                //Get Milestones
                $milestones = CPM_Milestone::getInstance()->get_by_project( $project_id );
                if($milestones){
                    foreach($milestones as $milestone){
                        //Milestone Event
                        $events[] = array(
                            'id' => $milestone->ID,
                            'title' => $milestone->post_title,
                            'start' => $milestone->due_date,
                            'url' => cpm_url_milestone_index( $project_id ),
                            'color' => '#32b1c8',
                            'className' => ($milestone->completed == 1)? 'milestone competed':'milestone'
                        );   
                    }
                }
                //Get Tasks
                $task_lists = CPM_Task::getInstance()->get_task_lists( $project_id );
                if($task_lists){
                    foreach($task_lists as $task_list){
                        $tasks = CPM_Task::getInstance()->get_tasks($task_list->ID);
                        foreach($tasks as $task){
                            //Tasks Event
                            #print_r($task);
                            if(($task->assigned_to != -1 && $task->assigned_to != get_current_user_id())) break;
                            $events[] = array(
                                'id' => $task->ID,
                                'title' => __("To-Do: ","cpm") . $task->post_title,
                                'start' => $task->due_date,
                                'url' => cpm_url_tasklist_index( $project_id ),
                                'color' => 'transparent',
                                'textColor' => '#c86432',
                                'className' => ($task->completed == 1)? 'todo competed':'todo'
                            );  
                        }
                    }
                    
                }
            }
        }
        return $events;
    }

}
