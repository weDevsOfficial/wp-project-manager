<?php

namespace WeDevs\PM\User\Controllers;

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

class User_Controller {
    use Transformer_Manager, Request_Filter;

    public function index( WP_REST_Request $request ) {
        $id    = $request->get_param( 'id' );

        $per_page   = $request->get_param( 'per_page' );
        $per_page   = $per_page ? $per_page : 15;

        $page       = $request->get_param( 'page' );
        $page       = $page ? $page : 1;

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });
        if ( $id && is_array( $id ) ) {
            $users = User::find( $id );
            $resource = new Collection( $users, new User_Transformer );
        } else {
            $users = User::paginate( $per_page );
            $user_collection = $users->getCollection();
            $resource = new Collection( $user_collection, new User_Transformer );

            $resource->setPaginator( new IlluminatePaginatorAdapter( $users ) );
        }


        return $this->get_response( $resource );
    }

    public function show( WP_REST_Request $request ) {
        $id       = $request->get_param( 'id' );
        $user     = User::find( $id );
        $resource = new Item( $user, new User_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        // Extraction of user data from inputs
        $user_data = [
            'user_login'           => $request->get_param( 'username' ),
            'user_email'           => $request->get_param( 'email' ),
            'user_pass'            => $request->get_param( 'password' ),
            'user_nicename'        => $request->get_param( 'nicename' ),
            'display_name'         => $request->get_param( 'display_name' ),
            'first_name'           => $request->get_param( 'first_name' ),
            'last_name'            => $request->get_param( 'last_name' ),
            'nickname'             => $request->get_param( 'nickname' ),
            'user_url'             => $request->get_param( 'user_url' ),
            'description'          => $request->get_param( 'description' ),
            'locale'               => $request->get_param( 'locale' ),
            'rich_editing'         => $request->get_param( 'rich_editing' ),
            'comment_shortcuts'    => $request->get_param( 'comment_shortcuts' ),
            'admin_color'          => $request->get_param( 'admin_color' ),
            'show_admin_bar_front' => $request->get_param( 'show_admin_bar_front' ),
            'user_registered'      => $request->get_param( 'user_registered' ),
            'use_ssl'              => $request->get_param( 'use_ssl' ),
        ];
        $user_data = array_filter( $user_data );

        // User password insertion
        if ( !array_key_exists( 'user_pass', $user_data ) ) {
            $user_data['user_pass'] = wp_generate_password(
                $length = 12,
                $include_standard_special_chars = false
            );
        }

        // User creation
        $user_id = wp_insert_user( $user_data );
        wp_send_new_user_notifications( $user_id );
        $user    = User::find( $user_id );

        // Transforming database model instance
        $resource = new Item( $user, new User_Transformer );

        return $this->get_response( $resource );
    }

    public function search( WP_REST_Request $request ) {
        $query_string = $request->get_param( 'query' );
        $limit = $request->get_param( 'limit' );
        $term         = $request->get_param( 'term');

        $users = User::where( 'user_login', 'LIKE', '%' . $query_string . '%' )
            ->orWhere( 'user_nicename', 'LIKE', '%' . $query_string . '%' )
            ->orWhere( 'user_email', 'LIKE', '%' . $query_string . '%' )
            ->orWhere( 'user_url', 'LIKE', '%' . $query_string . '%');
//        var_dump($limit);
        if ( $limit ) {
            $users =  $users->limit( intval( $limit ) )->get();
        } else {
            $users =  $users->get();
        }



//        $user_collection = $users->getCollection();
//        $resource = new Collection( $user_collection, new User_Transformer );
        $resource = new Collection( $users, new User_Transformer );

//        $resource->setPaginator( new IlluminatePaginatorAdapter( $users ) );

        return $this->get_response( $resource );
    }

    public function update_role( WP_REST_Request $request ) {
        // Extract user inputs
        $id         = $request->get_param( 'user_id' );
        $project_id = $request->get_param( 'project_id' );
        $role_ids   = $request->get_param( 'role_ids' );
        $role_ids   = explode( ',', $role_ids );

        // Associate roles and users
        if ( $project_id ) {
            foreach ( $role_ids as $role_id ) {
                $role_project_ids[$role_id] = ['project_id' => $project_id];
            }
            $role_ids = $role_project_ids;
        }

        $user = User::find( $id );
        $user->roles()->sync( $role_ids );

        // Transforming database model instance
        $resource = new Item( $user, new User_Transformer );

        return $this->get_response( $resource );
    }

    public function save_users_map_name(WP_REST_Request $request){
        $usernames = $request->get_params();
        foreach($usernames['usernames'] as $username_key => $username_value){
            $username_key_array = explode('_',$username_key);
            if(in_array('github',$username_key_array) || in_array('bitbucket',$username_key_array)){
                $user_meta_key = $username_key_array[0];
                $user_meta_id = $username_key_array[1];
                $user_meta_value = !empty($username_value) ? $username_value : '' ;
                update_user_meta($user_meta_id,$user_meta_key,$user_meta_value);
            }
        }
    }

    public function get_user_all_projects(WP_REST_Request $request) {
        global $wpdb;
        $type = $request->get_param('user_type');

        $role = '';

        if( $type == 'manager' ) {
            $role = ' AND rus.role_id=1';
        } else if ( $type == 'co_worker') {
            $role = ' AND rus.role_id=2';
        } else if ( $type == 'client' ) {
            $role = ' AND rus.role_id=3';
        }

        $tb_role_users = pm_tb_prefix() . 'pm_role_user';
        $tb_users = pm_tb_prefix() . 'users';

        $sql = "SELECT DISTINCT us.ID as user_id, us.user_email as user_email, us.display_name as display_name
        FROM $tb_role_users as rus
        LEFT JOIN $tb_users as us ON us.ID=rus.user_id

        WHERE 1=1 $role";

        $users = $wpdb->get_results( $sql );

        foreach ( $users as $key => $user ) {
            $user->avatar_url = get_avatar_url( $user->user_email );
        }

        wp_send_json_success( $users );
    }

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
