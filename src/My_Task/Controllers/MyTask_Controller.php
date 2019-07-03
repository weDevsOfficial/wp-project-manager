<?php

namespace WeDevs\PM\My_Task\Controllers;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\User\Models\User;
use WeDevs\PM\User\Transformers\User_Transformer;
use Illuminate\Support\Facades\Schema;
use Illuminate\Pagination\Paginator;
use WeDevs\PM\Calendar\Transformers\Calendar_Transformer;
use WeDevs\PM\User\Models\User_Role;
use WeDevs\PM\Activity\Transformers\Activity_Transformer;

class MyTask_Controller {
    use Transformer_Manager, Request_Filter;

    public function user_tasks_by_type ( WP_REST_Request $request ) {
        $id       = $request->get_param( 'id' );
        $taskType = $request->get_param( 'task_type' );
        $today = date( 'Y-m-d', strtotime( current_time( 'mysql' ) ) );

        $user     = User::with( [
            'projects' => function ( $query ) use ( $id, $taskType, $today ) {
                $query->with( [
                    'tasks' => function ( $task )  use ( $id, $taskType, $today ) {
                        $task = $task->with( ['assignees', 'metas'] )
                        ->parent()
                        ->whereHas( 'assignees', function ( $assignees )  use ( $id ) {
                            $assignees->where( 'assigned_to', $id );
                        } );

                        $task->whereHas('boards',function( $query ) {
                            $query->where('status', '1');
                        });

                        /* get current task */
                        if ( $taskType == 'current' ) {
                            $task = $task->where( function( $q ) use ( $today ) {
                                $q->where( 'due_date', '>=', $today )
                                    ->orWhereNull( 'due_date' );
                            });
                        }
                         /* get complete task*/
                        if ( $taskType == 'complete' ) {
                            $task = $task->where( 'status', 1);
                        } else {
                            $task = $task->where( 'status', '!=', 1);
                        }

                        /* get outstanding task */
                        if ( $taskType == 'outstanding' ) {
                            $task = $task->where( 'due_date', '<', $today );
                        }

                        if ( ! pm_has_manage_capability() ) {
                            /*exclude private tasks*/
                            $task = $task->doesntHave( 'metas', 'and', function ($query) {
                                    $query->where( 'meta_key', '=', 'privacy' )
                                        ->where( 'meta_value', '!=', '0' );
                                });
                            /*exclude task private list*/
                            $task = $task->doesntHave( 'task_lists.metas', 'and', function ($query) {
                                $query->where( 'meta_key', '=', 'privacy' )
                                        ->where( 'meta_value', '!=', '0' );
                                });
                        }
                    }
                ])
                ->whereHas('tasks', function ( $task )  use ( $id, $taskType, $today ) {
                    $task = $task->parent()
                    ->whereHas( 'assignees', function ( $assignees )  use ( $id ) {
                        $assignees->where( 'assigned_to', $id );
                    } );
                    $task->whereHas('boards',function( $query ) {
                        $query->where('status', '1');
                    });

                    /* get current task */
                    if ( $taskType == 'current' ) {
                        $task = $task->where( function( $q ) use ( $today ) {
                            $q->where( 'due_date', '>=', $today )
                                ->orWhereNull( 'due_date' );
                        });
                    }
                     /* get complete task*/
                    if ( $taskType == 'complete' ) {
                        $task = $task->where( 'status', 1);
                    } else {
                        $task = $task->where( 'status', '!=', 1);
                    }
                    /* get outstanding task */
                    if ( $taskType == 'outstanding' ) {
                        $task = $task->where( 'due_date', '<', $today );
                    }
                    if ( ! pm_has_manage_capability() ) {
                        /*exclude private tasks*/
                        $task = $task->doesntHave( 'metas', 'and', function ($query) {
                                $query->where( 'meta_key', '=', 'privacy' )
                                    ->where( 'meta_value', '!=', '0' );
                            });
                        /*exclude task private list*/
                        $task = $task->doesntHave( 'task_lists.metas', 'and', function ($query) {
                            $query->where( 'meta_key', '=', 'privacy' )
                                    ->where( 'meta_value', '!=', '0' );
                            });
                    }
                } );
            }
        ] )->find( $id );

        $resource = new Item( $user, new User_Transformer );
        $resource = $this->get_response( $resource );

        return $resource;
    }

    public function user_calender_tasks ( WP_REST_Request $request ) {
        $id = $request->get_param( 'id' );
        $start      = $request->get_param( 'start' );
        $end        = $request->get_param( 'end' );

        $tasks = User::find( $id )->tasks()
                ->whereHas('boards',function( $query ) {
                    $query->where( pm_tb_prefix() . 'pm_boards.status', '1');
                })
                ->with('assignees')
                ->parent()
                ->where( function( $query ) use ($start, $end) {

                    $query->where( function ( $q2 ) use ($start, $end) {
                        $q2->where( 'start_at', '>=', $start)
                            ->where( 'due_date', '<=', $end );
                    })

                    ->orWhere( function ( $q3 ) use ($start, $end) {
                        $q3->whereNull( 'due_date' )
                            ->where( function ( $qsub ) use ($start, $end) {
                                $qsub->where( 'start_at', '>=', $start )
                                    ->where(  pm_tb_prefix() . 'pm_tasks.created_at', '<=', $end );
                            });
                    } )

                    ->orWhere( function ($q4) use ($start, $end) {
                        $q4->whereNull( 'start_at' )
                            ->where( function ( $qsub ) use ($start, $end) {
                                $qsub->where( 'due_date', '>=', $start )
                                    ->where(  pm_tb_prefix() . 'pm_tasks.created_at', '<=', $end );
                            });
                    } )

                    ->orWhere( function( $q5 ) use ($start, $end) {
                        $q5->whereNull( 'start_at' )
                            ->orWhereNull( 'due_date' )
                            ->whereBetween( pm_tb_prefix() . 'pm_tasks.created_at', array($start, $end) );
                    } );
                } );

        if ( !pm_has_manage_capability() ){
            $tasks = $tasks->doesntHave( 'metas', 'and', function ($query) {
                        $query->where( 'meta_key', '=', 'privacy' )
                            ->where( 'meta_value', '!=', '0' );
                    });

            $tasks = $tasks->doesntHave( 'task_lists.metas', 'and', function ($query) {
                $query->where( 'meta_key', '=', 'privacy' )
                    ->where( 'meta_value', '!=', '0' );
                });
        }
        $tasks = $tasks->get()->toArray();
        $resource = New Collection( $tasks, new Calendar_Transformer );
        return $this->get_response( $resource );
    }

    public function assigned_users () {
        $roles      =  User_Role::select('user_id')->get()->toArray();
        $user_ids   = wp_list_pluck( $roles, 'user_id' ); //pluck('user_id')->unique();
        $users      = User::find($user_ids);

        $resource = new Collection( $users, new User_Transformer );

        return $this->get_response( $resource );
    }

    public function user_activities ( WP_REST_Request $request ) {
        $id       = $request->get_param( 'id' );
        $page     = $request->get_param( 'mytask_activities_page' );
        $per_page = $request->get_param( 'mytask_activities_per_page' );
        $page     = isset( $page ) ? $page : 1;
        $per_page = isset( $per_page ) ? $per_page : 15;

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

        $activities = User::find($id)->activities()
            ->orderBy( 'created_at', 'DESC' )
            ->paginate( $per_page );

        $activities_collection = $activities->getCollection();
        $resource = New Collection( $activities_collection, new Activity_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $activities ) );

        return $this->get_response( $resource );
    }
}
