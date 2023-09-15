<?php
namespace WeDevs\PM\Task\Helper;

use WP_REST_Request;

// data: {
// 	with: 'assignees,categories, total_comments, task_type',
// 	per_page: '10',
// 	select: ['id, title']
// 	categories: [2, 4],
// 	users: [1,2],
// 	lists: [1,2]
// 	id: [1,2],
// 	project_id: [1,2]
// 	title: 'Rocket',
// 	status: '0',
// 	page: 1
// 	due_date_operator = ['less_than|or','greater_than|or', 'null|or', 'empty|or'];
// 	orderby:'id:desc,created_at:asc
// },

class Task {

	private static $_instance;
	private $tb_projects;
	private $tb_lists;
	private $tb_tasks;
	private $query_params;
	private $select;
	private $join;
	private $where;
	private $orderby;
	private $limit;
	private $with = ['task_list','project'];
	private $tasks;
	private $task_ids;
	private $user_id = false;
	private $found_rows = 0;
	private $per_page;

	/**
	 * Class instance
	 * 
	 * @return Object
	 */
	public static function getInstance() {
        // if ( !self::$_instance ) {
        //     self::$_instance = new self();
        // }

        return new self();
    }

    /**
     * Class constructor
     */
    public function __construct() {
    	$this->set_table_name();
    	$this->set_login_user();
    }

    private function set_login_user() {

    	$this->user_id = empty( $this->query_params['login_user'] ) ? 
    		get_current_user_id() : (int) $user_id;
    }

    /**
     * AJAX Get tasks
     * 
     * @param  array $request
     * 
     * @return Object
     */
	public static function get_tasks( WP_REST_Request $request ) {
		$self  = self::getInstance();
		$tasks = self::get_results( $request->get_params() );
		
		wp_send_json( $tasks );
	}


	/**
     * AJAX Get tasks Csv.
     * 
     * @param array $request
     *
     * @return void
     */
	public static function get_taskscsv( WP_REST_Request $request ) {
		$self = self::getInstance();
		$tasks = self::get_results( $request->get_params() );
		header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=data.csv');
        $output = fopen("php://output", "w");

        fputcsv(
            $output,
            [
                __( 'Tasks', 'wedevs-project-manager' ),
                __( 'Task List', 'wedevs-project-manager' ),
                __( 'Project Name', 'wedevs-project-manager' ),
        	    __( 'Due Date', 'wedevs-project-manager' ),
                __( 'Created At', 'wedevs-project-manager' )
            ]
        );

        foreach ( $tasks['data'] as $key => $result ) {
	        fputcsv(
                $output,
                [
                    $result['title'],
                    $result['task_list']->title,
                    $result['project']->title,
                    $result['due_date'],
                    $result['created_at'],
                ]
            );
        }

        fclose( $output );
        exit();
	}

	/**
	 * Get tasks
	 * 
	 * @param  array $params
	 * 
	 * @return array
	 */
	public static function get_results( $params ) {
		$self = self::getInstance();
		$self->query_params = $params;

		$self
            ->select()
			->join()
			->where()
			->limit()
			->orderby()
			->get()
			->with();

		$response = $self->format_tasks( $self->tasks );

//        $response = $array = [
//            "data" => [
//                [
//                    "id" => 30,
//                    "title" => "Project",
//                    "description" => [
//                        "html" => "",
//                        "content" => ""
//                    ],
//                    "estimation" => 0,
//                    "comparable_estimation" => 0,
//                    "formated_com_est" => [
//                        "hour" => "00",
//                        "minute" => "00",
//                        "second" => "00",
//                        "total_second" => 0
//                    ],
//                    "start_at" => [
//                        "date" => "",
//                        "time" => "",
//                        "datetime" => "",
//                        "timezone" => "Etc/UTC",
//                        "timestamp" => ""
//                    ],
//                    "due_date" => [
//                        "date" => "",
//                        "time" => "",
//                        "datetime" => "",
//                        "timezone" => "Etc/UTC",
//                        "timestamp" => ""
//                    ],
//                    "complexity" => "basic",
//                    "priority" => "medium",
//                    "order" => 2,
//                    "payable" => "no",
//                    "recurrent" => 0,
//                    "parent_id" => 0,
//                    "status" => "incomplete",
//                    "category_id" => "",
//                    "created_at" => [
//                        "date" => "2023-08-23",
//                        "time" => "05:27:37",
//                        "datetime" => "2023-08-23 05:27:37",
//                        "timezone" => "Etc/UTC",
//                        "timestamp" => "2023-08-23T05:27:37+00:00"
//                    ],
//                    "created_by" => 3,
//                    "completed_at" => [
//                        "date" => "",
//                        "time" => "",
//                        "datetime" => "",
//                        "timezone" => "Etc/UTC",
//                        "timestamp" => ""
//                    ],
//                    "updated_at" => [
//                        "date" => "2023-08-23",
//                        "time" => "05:27:37",
//                        "datetime" => "2023-08-23 05:27:37",
//                        "timezone" => "Etc/UTC",
//                        "timestamp" => "2023-08-23T05:27:37+00:00"
//                    ],
//                    "creator" => [
//                        "data" => [
//                            "id" => 3,
//                            "username" => "selygyh@email.com",
//                            "nicename" => "selygyhemail-com",
//                            "email" => "vicebeqy@mailinator.com",
//                            "profile_url" => "https://www.zovahoky.ws",
//                            "display_name" => "Pandora Best",
//                            "manage_capability" => 1,
//                            "create_capability" => 1,
//                            "avatar_url" => "http://1.gravatar.com/avatar/10537eacc2681ca27cdc42dc1f370c34?s=96&d=mm&r=g",
//                            "github" => "",
//                            "bitbucket" => ""
//                        ]
//                    ],
//                    "updater" => [
//                        "data" => [
//                            "id" => 3,
//                            "username" => "selygyh@email.com",
//                            "nicename" => "selygyhemail-com",
//                            "email" => "vicebeqy@mailinator.com",
//                            "profile_url" => "https://www.zovahoky.ws",
//                            "display_name" => "Pandora Best",
//                            "manage_capability" => 1,
//                            "create_capability" => 1,
//                            "avatar_url" => "http://1.gravatar.com/avatar/10537eacc2681ca27cdc42dc1f370c34?s=96&d=mm&r=g",
//                            "github" => "",
//                            "bitbucket" => ""
//                        ]
//                    ],
//                    "project" => [
//                        "data" => [
//                            "id" => 6,
//                            "project_id" => 6,
//                            "title" => "48# - Test Product",
//                            "description" => [
//                                "html" => "",
//                                "content" => ""
//                            ],
//                            "status" => 0,
//                            "budget" => "",
//                            "pay_rate" => "",
//                            "est_completion_date" => "",
//                            "order" => "",
//                            "projectable_type" => "",
//                            "favourite" => "",
//                            "created_at" => [
//                                "date" => "2023-08-23",
//                                "time" => "05:26:33",
//                                "datetime" => "2023-08-23 05:26:33",
//                                "timezone" => "Etc/UTC",
//                                "timestamp" => "2023-08-23T05:26:33+00:00"
//                            ],
//                            "updated_at" => [
//                                "date" => "2023-08-23",
//                                "time" => "05:26:33",
//                                "datetime" => "2023-08-23 05:26:33",
//                                "timezone" => "Etc/UTC",
//                                "timestamp" => "2023-08-23T05:26:33+00:00"
//                            ],
//                            "created_by" => 3,
//                            "list_inbox" => 23,
//                            "role_capabilities" => [
//                                "manager" => [
//                                    "create_message" => 1,
//                                    "view_private_message" => 1,
//                                    "create_list" => 1,
//                                    "view_private_list" => 1,
//                                    "create_task" => 1,
//                                    "view_private_task" => 1,
//                                    "create_milestone" => 1,
//                                    "view_private_milestone" => 1,
//                                    "create_file" => 1,
//                                    "view_private_file" => 1
//                                ],
//                                "co_worker" => [
//                                    "create_message" => 1,
//                                    "view_private_message" => 1,
//                                    "create_list" => 1,
//                                    "view_private_list" => 1,
//                                    "create_task" => 1,
//                                    "view_private_task" => 1,
//                                    "create_milestone" => 1,
//                                    "view_private_milestone" => 1,
//                                    "create_file" => 1,
//                                    "view_private_file" => 1
//                                ],
//                                "client" => [
//                                    "create_message" => 1,
//                                    "view_private_message" => "",
//                                    "create_list" => 1,
//                                    "view_private_list" => "",
//                                    "create_task" => 1,
//                                    "view_private_task" => "",
//                                    "create_milestone" => 1,
//                                    "view_private_milestone" => "",
//                                    "create_file" => 1,
//                                    "view_private_file" => ""
//                                ]
//                            ],
//                            "meta" => [
//                                "data" => [
//                                    "total_task_lists" => 3,
//                                    "total_tasks" => 5,
//                                    "total_complete_tasks" => 0,
//                                    "total_incomplete_tasks" => 5,
//                                    "total_discussion_boards" => 0,
//                                    "total_milestones" => 0,
//                                    "total_comments" => 0,
//                                    "total_files" => 0,
//                                    "total_activities" => 9
//                                ]
//                            ]
//                        ]
//                    ],
//                    "task_list" => [
//                        "data" => [
//                            "id" => 24,
//                            "title" => "Test Project"
//                        ]
//                    ],
//                    "activities" => [
//                        "data" => [
//                            [
//                                "id" => 74,
//                                "message" => "{{actor.data.display_name}} has created a task, {{meta.task_title}}.",
//                                "action" => "create_task",
//                                "action_type" => "create",
//                                "project_id" => 6,
//                                "meta" => [
//                                    "task_title" => "Project"
//                                ],
//                                "committed_at" => [
//                                    "date" => "2023-08-23",
//                                    "time" => "05:27:37",
//                                    "datetime" => "2023-08-23 05:27:37",
//                                    "timezone" => "Etc/UTC",
//                                    "timestamp" => "2023-08-23T05:27:37+00:00"
//                                ],
//                                "resource_id" => 30,
//                                "resource_type" => "task",
//                                "actor" => [
//                                    "data" => [
//                                        "id" => 3,
//                                        "username" => "selygyh@email.com",
//                                        "nicename" => "selygyhemail-com",
//                                        "email" => "vicebeqy@mailinator.com",
//                                        "profile_url" => "https://www.zovahoky.ws",
//                                        "display_name" => "Pandora Best",
//                                        "manage_capability" => 1,
//                                        "create_capability" => 1,
//                                        "avatar_url" => "http://1.gravatar.com/avatar/10537eacc2681ca27cdc42dc1f370c34?s=96&d=mm&r=g",
//                                        "github" => "",
//                                        "bitbucket" => ""
//                                    ]
//                                ],
//                                "project" => [
//                                    "data" => [
//                                        "id" => 6,
//                                        "project_id" => 6,
//                                        "title" => "48# - Test Product",
//                                        "description" => [
//                                            "html" => "",
//                                            "content" => ""
//                                        ],
//                                        "status" => 0,
//                                        "budget" => "",
//                                        "pay_rate" => "",
//                                        "est_completion_date" => "",
//                                        "order" => "",
//                                        "projectable_type" => "",
//                                        "favourite" => "",
//                                        "created_at" => [
//                                            "date" => "2023-08-23",
//                                            "time" => "05:26:33",
//                                            "datetime" => "2023-08-23 05:26:33",
//                                            "timezone" => "Etc/UTC",
//                                            "timestamp" => "2023-08-23T05:26:33+00:00"
//                                        ],
//                                        "updated_at" => [
//                                            "date" => "2023-08-23",
//                                            "time" => "05:26:33",
//                                            "datetime" => "2023-08-23 05:26:33",
//                                            "timezone" => "Etc/UTC",
//                                            "timestamp" => "2023-08-23T05:26:33+00:00"
//                                        ],
//                                        "created_by" => 3,
//                                        "list_inbox" => 23,
//                                        "role_capabilities" => [
//                                            "manager" => [
//                                                "create_message" => 1,
//                                                "view_private_message" => 1,
//                                                "create_list" => 1,
//                                                "view_private_list" => 1,
//                                                "create_task" => 1,
//                                                "view_private_task" => 1,
//                                                "create_milestone" => 1,
//                                                "view_private_milestone" => 1,
//                                                "create_file" => 1,
//                                                "view_private_file" => 1
//                                            ],
//                                            "co_worker" => [
//                                                "create_message" => 1,
//                                                "view_private_message" => 1,
//                                                "create_list" => 1,
//                                                "view_private_list" => 1,
//                                                "create_task" => 1,
//                                                "view_private_task" => 1,
//                                                "create_milestone" => 1,
//                                                "view_private_milestone" => 1,
//                                                "create_file" => 1,
//                                                "view_private_file" => 1
//                                            ],
//                                            "client" => [
//                                                "create_message" => 1,
//                                                "view_private_message" => "",
//                                                "create_list" => 1,
//                                                "view_private_list" => "",
//                                                "create_task" => 1,
//                                                "view_private_task" => "",
//                                                "create_milestone" => 1,
//                                                "view_private_milestone" => "",
//                                                "create_file" => 1,
//                                                "view_private_file" => ""
//                                            ]
//                                        ],
//                                        "meta" => [
//                                            "data" => [
//                                                "total_task_lists" => 3,
//                                                "total_tasks" => 5,
//                                                "total_complete_tasks" => 0,
//                                                "total_incomplete_tasks" => 5,
//                                                "total_discussion_boards" => 0,
//                                                "total_milestones" => 0,
//                                                "total_comments" => 0,
//                                                "total_files" => 0,
//                                                "total_activities" => 9
//                                            ]
//                                        ]
//                                    ]
//                                ]
//                            ]
//                        ]
//                    ],
//                    "comments" => [
//                        "data" => []
//                    ],
//                    "time" => [
//                        "data" => [],
//                        "all_data" => [],
//                        "users_data" => [],
//                        "meta" => [
//                            "running" => "",
//                            "totalTaskTime" => [],
//                            "totalTime" => [
//                                "hour" => "00",
//                                "minute" => "00",
//                                "second" => "00",
//                                "total_second" => 0
//                            ]
//                        ]
//                    ],
//                    "labels" => [
//                        "data" => []
//                    ],
//                    "project_id" => 6,
//                    "project_title" => "48# - Test Product",
//                    "type" => "",
//                    "assignees" => [
//                        "data" => []
//                    ],
//                    "task_list_id" => 24,
//                    "task_list_title" => "Test Project",
//                    "meta" => [
//                        "total_comment" => 0,
//                        "can_complete_task" => 1,
//                        "total_files" => 0,
//                        "total_assignee" => 0,
//                        "privacy" => 0
//                    ]
//                ]
//            ],
//            "meta" => [
//                "total_tasks" => 1,
//                "total_page" => 1,
//                "per_page" => 10
//            ]
//        ];

//        error_log( var_export( $params, 1 ) );
//        error_log( var_export( $response, 1 ) );
		if ( pm_is_single_query( $params ) ) {
			return ['data' => $response['data'][0]] ;
		}

		return $response;
	}

	/**
	 * Format tasks data
	 * 
	 * @param array $tasks
	 * 
	 * @return array
	 */
	public function format_tasks( $tasks ) {

		$response = [
			'data' => [],
			'meta' => []
		];

		// if ( ! is_array( $tasks ) ) {
		// 	$response['data'] = $this->fromat_task( $tasks );
		// 	$response['meta'] = $this->set_meta();
		// 	return $response;
		// }

		foreach ( $tasks as $key => $task ) {
			$tasks[$key] = $this->fromat_task( $task );
		}
		
		$response['data'] = $tasks;
		$response['meta'] = $this->set_meta();
		
		return $response;
	}

	/**
	 * Set meta data
	 */
	private function set_meta() {
		return [
			'total_tasks'  => (int) $this->found_rows,
			'total_page'   => ceil( $this->found_rows/$this->get_per_page() ),
			'per_page'     => $this->get_per_page()
		];
	}

	/**
	 * Format task data
	 *
	 * @param  Object $task
	 *
	 * @return array
	 */
	public function fromat_task( $task ) {

		$items = [
			'id'                    => (int) $task->id,
			'title'                 => (string) $task->title,
			'description'           => [ 'html' => pm_get_content( $task->description ), 'content' => $task->description ],
			'estimation'            => $task->estimation * 60,
			'comparable_estimation' => $task->comparable_estimation,
			'formated_com_est'      => pm_second_to_time( $task->comparable_estimation * 60 ),
			'start_at'              => format_date( $task->start_at ),
			'due_date'              => format_date( $task->due_date ),
			'complexity'            => $this->complexity( $task->complexity ),
			'priority'              => $this->priorities( $task->priority ),
			'order'                 => empty( $task->order ) ? 0 : intval( $task->order ),
			'payable'               => $this->payability( $task->payable ),
			'recurrent'             => $this->recurrency( $task->recurrent ),
			'parent_id'             => (int) $task->parent_id,
			'status'                => $this->status( $task->status ),
			'category_id'           => empty( $task->type['id'] ) ? '' : (int) $task->type['id'],
			'created_at'            => format_date( $task->created_at ),
			'created_by'            => (int) $task->created_by,
			'completed_at'          => format_date( $task->completed_at ),
			'updated_at'            => format_date( $task->updated_at ),
			'creator'               => [ 'data' => $this->user_info( $task->created_by ) ],
			'updater'               => [ 'data' => $this->user_info( $task->updated_by ) ],
        ];

  //       $select_items = empty( $this->query_params['select'] ) ? false : $this->query_params['select'];

		// if ( $select_items && ! is_array( $select_items ) ) {
		// 	$select_items = str_replace( ' ', '', $select_items );
		// 	$select_items = explode( ',', $select_items );
		// }
		
		// if ( empty( $select_items ) ) {
		// 	$items = $this->set_with_items( $items, $task );
		// 	$items = $this->set_fixed_items( $items, $task );
		// 	$items = $this->set_item_meta( $items, $task );
			
		// 	return $items;
		// }

		// foreach ( $items as $item_key => $item ) {
			
		// 	if ( ! in_array( $item_key, $select_items ) ) {
		// 		unset( $items[$item_key] );
		// 	}
		// }
		
		$items = $this->set_with_items( $items, $task );
		$items = $this->set_fixed_items( $items, $task );
		$items = $this->set_item_meta( $items, $task );
		
		return $items;
	}

	private function set_item_meta( $item, $task ) {
		$item['meta'] = empty( $task->meta ) ? [] : $task->meta;
		
		$item['meta']['total_comment']     = $task->total_comments;
		$item['meta']['can_complete_task'] = $this->pm_user_can_complete_task( $task );
		$item['meta']['total_files']       = $task->total_files;
		$item['meta']['total_assignee']    = count( $task->assignees['data'] );
		$item['meta']['privacy']           = $task->is_private;
		
		return $item;
	}

	function pm_user_can_complete_task( $task, $user_id = false ) {
	    if(!$task) {
	        return false;
	    }
	    $user_id = $user_id ? $user_id: get_current_user_id();

	    if ( pm_has_manage_capability( $user_id ) ) {
	        return true;
	    }

	    if ( pm_is_manager( $task->project_id, $user_id ) ) {
	        return true;
	    }

	    if ( (int) $task->created_by == $user_id ) {
	        return true;
	    }
	    //pmpr($task); die();
	    $assignees = $task->assignees['data']; //pluck( 'assigned_to' )->all();
	    $assignees = wp_list_pluck( $assignees, 'id' );
	    $in_array = in_array( $user_id, $assignees );

	    if ( !empty( $in_array ) ) {
	        return true;
	    }

	    return false;
	}

	private function set_with_items( $items, $task ) {

		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];

		if ( ! is_array( $with ) ) {
			$with = explode( ',', str_replace( ' ', '', $with ) );
		}

		$with = array_merge( $this->with, $with );

		$task_with_items =  array_intersect_key( (array) $task, array_flip( $with ) );
		$items = array_merge( $items, $task_with_items );

		return $items;
	}

	private function set_fixed_items( $items, $task ) {
		
		$items['id']           = (int) $task->id;
		$items['project_id']   = (int) $task->project_id;
		$items['project_title']   = $task->project_title;
		$items['type']         = $task->type;
		$items['order']        = $task->order;
		$items['assignees']    = $task->assignees;
		$items['task_list_id'] = (int) $task->task_list_id;
		$items['task_list_title'] = $task->task_list_title;
		
		if ( isset( $task->is_stop_watch_visible ) ) {
			$items['is_stop_watch_visible'] = $task->is_stop_watch_visible;
		}

		if ( isset( $task->custom_time_form ) ) {
			$items['custom_time_form'] = $task->custom_time_form;
		}

		return $items;
	}

	public function user_info( $user_id ) {
		$user = get_user_by( 'id', $user_id );

		$data = [
			'id'                => (int) $user->ID,
			'username'          => $user->user_login,
			'nicename'          => $user->user_nicename,
			'email'             => $user->user_email,
			'profile_url'       => $user->user_url,
			'display_name'      => $user->display_name,
			'manage_capability' => (int) pm_has_manage_capability($user->ID),
			'create_capability' => (int) pm_has_project_create_capability($user->ID),
			'avatar_url'        => get_avatar_url( $user->user_email ),
			'github'            => get_user_meta($user->ID,'github' ,true),
			'bitbucket'         => get_user_meta($user->ID,'bitbucket', true)
        ];

        return $data;
	}

	public static function complexity( $complexity ) {
		$complexity = empty( intval( $complexity ) ) ? 0 : intval( $complexity );

        $items = [
        	0 => 'basic',
	        1 => 'intermediate',
	        2 => 'advance'
	    ];

	    return $items[$complexity];
    }

    public static function priorities( $priorities ) {
		$priorities = empty( intval( $priorities ) ) ? 0 : intval( $priorities );

        $items = [
        	0 => 'low',
	        1 => 'medium',
	        2 => 'high',
	    ];

	    return $items[$priorities];
    }

    public static function status( $status ) {
		$status = empty( intval( $status ) ) ? 0 : intval( $status );

        $items = [
        	0 => 'incomplete',
	        1 => 'complete',
	        2 => 'pending',
	    ];

	    return $items[$status];
    }

    public static function recurrency( $recurrency ) {
		$recurrency = empty( intval( $recurrency ) ) ? 0 : intval( $recurrency );

        $items = [
        	0 => '0', // no repeat
	        1 => '1', // weekly
	        2 => '2', // Monthly
	        3 => '3', // Annually
	        4 => '4', // daily
	        9 => '9', // never
	    ];

	    return $items[$recurrency];
    }

    public static function payability( $payability ) {
		$payability = empty( intval( $payability ) ) ? 0 : intval( $payability );

        $items = [
        	0 => 'no',
        	1 => 'yes'
	    ];

	    return $items[$payability];
    }

	/**
	 * Join others table information
	 * 
	 * @return Object
	 */
	private function with() {
		$this->include_project()
			->include_subtasks()
			->include_list()
			->include_assignees()
			->include_total_comments()
			->include_total_files()
			->include_task_type()
			->include_task_order()
			->include_estimation_time()
			->include_default_meta()
			->include_activities()
			->include_comments()
			->include_time()
			->include_label()
			->include_milestone();

		$this->tasks = apply_filters( 'pm_task_with',$this->tasks, $this->task_ids, $this->query_params );

		return $this;
	}

	private function include_milestone() {
		global $wpdb;

		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		$with = pm_get_prepare_data( $with );

		if ( ! in_array( 'milestone', $with ) || empty( $this->task_ids ) ) {
			return $this;
		}

		$list_ids = wp_list_pluck( $this->tasks, 'task_list_id' );
		$tb_boardable = pm_tb_prefix() . 'pm_boardables';

		if ( empty( $list_ids ) ) {
			foreach ( $this->tasks as $key => $task ) {
				$task->milestone['data'] = [];
			}

			return $this;
		}

		$list_format = pm_get_prepare_format( $list_ids );
		$format_data = array_merge( $list_ids, ['task_list', 'milestone'] );

		$query = $wpdb->prepare( "SELECT board_id as milestone_id, boardable_id as list_id
			FROM $tb_boardable
			WHERE $tb_boardable.boardable_id IN ($list_format)  
			AND $tb_boardable.boardable_type = %s
			AND $tb_boardable.board_type = %s", 
			$format_data 
		);

		$results       = $wpdb->get_results( $query );
		$milestone_ids = wp_list_pluck( $results, 'milestone_id' );
		$milestone_ids = empty( $milestone_ids ) ? [0] : $milestone_ids;
		$milestones    = pm_get_milestones([ 'id' => $milestone_ids]);

		$mis_key_id = [];
		$list_mils  = [];

		foreach ( $milestones['data'] as $key => $milestone ) {
			$id              = $milestone['id'];
			$mis_key_id[$id] = $milestone;
		}
		
		foreach ( $results as $key => $result ) {
			$milestone_id = $result->milestone_id;
			$list_id      = $result->list_id;

			if( empty( $mis_key_id[$milestone_id] ) ) {
				continue;
			}

			$list_mils[$list_id] = $mis_key_id[$milestone_id];
		}
		
		foreach ( $this->tasks as $key => $task ) {
			if ( empty( $list_mils[$task->task_list_id] ) ) {
				$task->milestone['data'] = [];
			} else {
				$task->milestone['data'] = $list_mils[$task->task_list_id];
			}
		}

		return $this;
	}

	private function include_label() {
		global $wpdb;
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		$with = pm_get_prepare_data( $with );

		if ( ! in_array( 'labels', $with ) || empty( $this->task_ids ) ) {
			return $this;
		}

		if ( ! function_exists( 'pm_pro_get_labels' ) ) {
			return $this;
		}

		$results = pm_pro_get_labels([ 
			'task_id' => $this->task_ids
		]);

		$labels = [];

		foreach ( $results['data'] as $key => $result ) {
			$task_id = $result['task_id'];
			$labels[$task_id][] = $result;
		}
		
		foreach ( $this->tasks as $key => $task ) {
			$task->labels['data'] = empty( $labels[$task->id] ) ? [] : $labels[$task->id]; 
		}

		return $this;
	}

	private function include_time() {
		global $wpdb;
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		$with = pm_get_prepare_data( $with );

		if ( ! in_array( 'time', $with ) || empty( $this->task_ids ) ) {
			return $this;
		}
		
		if ( ! pm_is_active_time_tracker_module() ) {
			return $this;
		}

		if ( ! function_exists( 'pm_pro_get_times' ) ) {
			return $this;
		}

		$results = pm_pro_get_times([
			'task_id' => $this->task_ids
		]);
		
		$times = [];
		$user_times = [];
		$meta = [];
		$all_data = [];

		foreach ( $results['data'] as $key => $result ) {
			if ( empty( $result['task_id'] ) ) {
				continue;
			}

			$task_id = $result['task_id'];
			$times[$task_id][] = $result;
		}

		foreach ( $results['all_data'] as $key => $result ) {
			if ( empty( $result['task_id'] ) ) {
				continue;
			}

			$task_id = $result['task_id'];
			$all_data[$task_id][] = $result;
		}

		foreach ( $results['users_data'] as $task_id => $result ) {
			$user_times[$task_id] = $result;
		}

		foreach ( $results['meta']['tasks_total_time'] as $task_id => $result ) {
			$meta[$task_id] = $result;
		}
		
		foreach ( $this->tasks as $key => $task ) {
			$task->time['data'] = empty( $times[$task->id] ) ? [] : $times[$task->id]; 
			$task->time['all_data'] = empty( $all_data[$task->id] ) ? [] : $all_data[$task->id]; 
			$task->time['users_data'] = empty( $user_times[$task->id] ) ? [] : $user_times[$task->id]; 
			$task->time['meta'] = empty( $meta[$task->id] ) ? [] : $meta[$task->id]; 
		}

		$task->time['meta']['running'] = $results['meta']['running'];
		$task->time['meta']['totalTaskTime'] = $results['meta']['totalTaskTime'];
		$task->time['meta']['totalTime'] = $results['meta']['totalTime'];
		
		return $this;
	}

	private function include_comments() {
		global $wpdb;
		
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		$with = pm_get_prepare_data( $with );

		if ( ! in_array( 'comments', $with ) || empty( $this->task_ids ) ) {
			return $this;
		}
		
		$comments = pm_get_comments([
			'commentable_id' => array_unique( $this->task_ids ),
			'commentable_type' => 'task'
		]);

		$items  = [];

        foreach ( $comments['data'] as $key => $comment ) {
        	if ( empty( $comment['id'] ) ) {
        		continue;
        	}

        	$task_id = $comment['commentable_id'];
            $items[$task_id][] = $comment;
        }
       
        foreach ( $this->tasks as $key => $task ) {
            $task->comments['data'] = empty( $items[$task->id] ) ? [] : $items[$task->id];
        }

        return $this;
	}

	private function include_activities() {
		global $wpdb;
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		$with = pm_get_prepare_data( $with );

		if ( ! in_array( 'activities', $with ) || empty( $this->task_ids ) ) {
			return $this;
		}

		$results = pm_get_activities([
			'resource_id' => $this->task_ids,
			'resource_type' => 'task'
		]);

		$activities = [];

		foreach ( $results['data'] as $key => $result ) {
			$task_id = $result['resource_id'];
			$activities[$task_id][] = $result;
		}
		
		foreach ( $this->tasks as $key => $task ) {
			$task->activities['data'] = empty( $activities[$task->id] ) ? [] : $activities[$task->id]; 
		}
		
		return $this;
	}

	private function include_default_meta() {
		if ( empty( $this->task_ids ) ) {
			return $this;
		}

		global $wpdb;

		$metas          = [];
		$tb_tasks    = pm_tb_prefix() . 'pm_tasks';
		$tb_meta        = pm_tb_prefix() . 'pm_meta';
		$task_format = pm_get_prepare_format( $this->task_ids );
		$query_data     = $this->task_ids;

		$query = "SELECT DISTINCT $tb_meta.meta_key, $tb_meta.meta_value, $tb_meta.entity_id as task_id
			FROM $tb_meta
			WHERE $tb_meta.entity_id IN ($task_format)  
			AND $tb_meta.entity_type = %s";

		array_push( $query_data, 'task' );
		
		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		
		foreach ( $results as $key => $result ) {
			$task_id = $result->task_id;
			unset( $result->task_id );
			$metas[$task_id][] = $result;
		}

		foreach ( $this->tasks as $key => $task ) {
			$filter_metas = empty( $metas[$task->id] ) ? [] : $metas[$task->id];
			foreach ( $filter_metas as $key => $filter_meta ) {
				$meta_value = @unserialize( $filter_meta->meta_value );
				
				if ($meta_value === false && $filter_meta->meta_value !== 'b:0;') {
				    $task->meta[$filter_meta->meta_key] = $filter_meta->meta_value;
				} else {
					$task->meta[$filter_meta->meta_key] = maybe_unserialize( $filter_meta->meta_value );
				}
			}
		}
		
		return $this;
	}

	private function include_estimation_time() {
		global $wpdb; 

		if ( empty( $this->task_ids ) ) {
			return $this;
		}

		if ( pm_get_estimation_type() == 'task' ) {
			
			foreach ( $this->tasks as $key => $task ) {
				$task->comparable_estimation = $task->estimation;
			}

			return $this;
		}

		$tb_tasks  = pm_tb_prefix() . 'pm_tasks';
		$tk_ids_format = $this->get_prepare_format( $this->task_ids );
		$query_data    = $this->task_ids;

        $query ="SELECT sum(estimation) as estimation, parent_id
            FROM $tb_tasks
            WHERE parent_id IN ( $tk_ids_format )
            GROUP BY parent_id";

        $results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
        //$results = wp_list_pluck( $results, 'estimation', 'parent_id' );
        $estimations   = [];

        

        foreach ( $results as $key => $result ) {
			$parent_id = $result->parent_id;
			unset( $result->parent_id );
			$estimations[$parent_id] = $result;
		}
		
		foreach ( $this->tasks as $key => $task ) {
			$task->comparable_estimation = empty( $estimations[$task->id] ) ? 0 : $estimations[$task->id]->estimation; 
		}

		return $this;
	}

	private function include_task_order() {
		global $wpdb;
		// $with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		// if ( ! is_array( $with ) ) {
		// 	$with = explode( ',', str_replace(' ', '', $with ) );
		// }

		// if ( ! in_array( 'task_type', $with ) || empty( $this->task_ids ) ) {
		// 	return $this;
		// }
		
		if ( empty( $this->task_ids ) ) {
			return $this;
		}

		$tb_boardable  = pm_tb_prefix() . 'pm_boardables';
		$tk_ids_format = $this->get_prepare_format( $this->task_ids );
		$query_data    = $this->task_ids;

		$query = "SELECT DISTINCT bor.order, bor.boardable_id as task_id
			FROM $tb_boardable as bor
			where bor.boardable_id IN ($tk_ids_format)
			AND bor.boardable_type=%s";

		array_push( $query_data, 'task' );
		
		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		$orders   = [];
		
		foreach ( $results as $key => $result ) {
			$task_id = $result->task_id;
			unset( $result->task_id );
			$orders[$task_id] = $result;
		}
		
		foreach ( $this->tasks as $key => $task ) {
			$task->order = empty( $orders[$task->id] ) ? 0 : intval( $orders[$task->id]->order ); 
		}
		
		return $this;
	}

	private function include_subtasks() {
		global $wpdb;
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', str_replace(' ', '', $with ) );
		}

		if ( ! in_array( 'subtasks', $with ) || empty( $this->task_ids ) ) {
			return $this;
		}

		$tb_tasks = pm_tb_prefix() . 'pm_tasks';
		$tk_ids_format = $this->get_prepare_format( $this->task_ids );

		$query = "SELECT DISTINCT *
			FROM $tb_tasks 
			where parent_id IN ($tk_ids_format)";


		$results = $wpdb->get_results( $wpdb->prepare( $query, $this->task_ids ) );
		$subtasks = [];

		foreach ( $results as $key => $result ) {
			$task_id = $result->parent_id;
			unset( $result->task_id );
			$subtasks[$task_id][] = $result;
		}
		
		foreach ( $this->tasks as $key => $task ) {
			$task->subtasks = empty( $subtasks[$task->id] ) ? [] : $subtasks[$task->id]; 
		}
		
		return $this;
	}

	private function include_task_type() {

		global $wpdb;
		// $with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		// if ( ! is_array( $with ) ) {
		// 	$with = explode( ',', str_replace(' ', '', $with ) );
		// }

		// if ( ! in_array( 'task_type', $with ) || empty( $this->task_ids ) ) {
		// 	return $this;
		// }
		
		if ( empty( $this->task_ids ) ) {
			return $this;
		}

		$tb_task_types     = pm_tb_prefix() . 'pm_task_types';
		$tb_task_type_task = pm_tb_prefix() . 'pm_task_type_task';
		$tk_ids_format     = $this->get_prepare_format( $this->task_ids );

		$query = "SELECT DISTINCT typ.id as type_id, typ.title, typ.description, tk.id as task_id
			FROM $tb_task_types as typ
			LEFT JOIN $tb_task_type_task as typt ON typ.id = typt.type_id 
			LEFT JOIN $this->tb_tasks as tk ON tk.id = typt.task_id 
			where tk.id IN ($tk_ids_format)";
		
		$results = $wpdb->get_results( $wpdb->prepare( $query, $this->task_ids ) );
		$types   = [];

		foreach ( $results as $key => $result ) {
			$task_id    = $result->task_id;
			$result->id = (int) $result->type_id;
			
			unset( $result->task_id );
			unset( $result->type_id );
			
			$types[$task_id] = $result;
		}
		
		foreach ( $this->tasks as $key => $task ) {
			$task->type = empty( $types[$task->id] ) ? '' : (array) $types[$task->id]; 
		}
		
		return $this;
	}

	/**
	 * Set project ssignees
	 * 
	 * @return class object
	 */
	private function include_list() {
		global $wpdb;
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', str_replace(' ', '', $with ) );
		}

		if ( ! in_array( 'task_list', $with ) || empty( $this->task_ids ) ) {
			return $this;
		}

		$tb_list       = pm_tb_prefix() . 'pm_boards';
		$tb_boardable  = pm_tb_prefix() . 'pm_boardables';
		$tk_ids_format = $this->get_prepare_format( $this->task_ids );

		$query = "SELECT DISTINCT bo.id as id, bo.title, tk.id as task_id
			FROM $tb_list as bo
			LEFT JOIN $tb_boardable as bor ON bor.board_id = bo.id 
			LEFT JOIN $this->tb_tasks as tk ON tk.id = bor.boardable_id 
			where tk.id IN ($tk_ids_format)";

		$results = $wpdb->get_results( $wpdb->prepare( $query, $this->task_ids ) );
		$lists   = [];

		foreach ( $results as $key => $result ) {
			$task_id = $result->task_id;
			unset( $result->task_id );
			$lists[$task_id] = $result;
		}
		
		foreach ( $this->tasks as $key => $task ) {
			$task->task_list = empty( $lists[$task->id] ) ? ['data' => []] : [ 'data' => $lists[$task->id] ]; 
		}
		
		return $this;
	}

	/**
	 * Set project ssignees
	 * 
	 * @return class object
	 */
	private function include_project() {
		global $wpdb;
		
		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		$with = pm_get_prepare_data( $with );

		if ( empty( $this->task_ids ) ) {
			return $this;
		}

		$tb_project = pm_tb_prefix() . 'pm_projects';
		$tk_ids_format = $this->get_prepare_format( $this->task_ids );

		$query = "SELECT DISTINCT pr.id as project_id, pr.title, tk.id as task_id
			FROM $tb_project as pr
			LEFT JOIN $this->tb_tasks as tk ON tk.project_id = pr.id 
			where tk.id IN ($tk_ids_format)";


		$results = $wpdb->get_results( $wpdb->prepare( $query, $this->task_ids ) );
		$projects = [];

		foreach ( $results as $key => $result ) {
			$task_id = $result->task_id;
			unset( $result->task_id );
			$projects[$task_id] = $result;
		}
		
		if ( in_array( 'project', $with ) ) {

			$pjs_by_id = [];
			$project_ids = wp_list_pluck( $results, 'project_id' );
			$db_projects = pm_get_projects( [ 'id' => array_unique( $project_ids ) ] );

			foreach ( $db_projects['data'] as $key => $db_project ) {
				$pjs_by_id[$db_project['id']] = $db_project;
			}


			foreach ( $this->tasks as $key => $task ) {
				$task->project = empty( $pjs_by_id[$task->project_id] ) ? ['data' => []] : [ 'data' => $pjs_by_id[$task->project_id] ]; 
			}
		}
		
		foreach ( $this->tasks as $key => $task ) {
			$task->project_title = empty( $projects[$task->id] ) ? '' : $projects[$task->id]->title; 
		}
		
		return $this;
	}

	private function include_assignees() {
		global $wpdb;
		// $with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		// if ( ! is_array( $with ) ) {
		// 	$with = explode( ',', $with );
		// }

		// if ( ! in_array( 'assignees', $with ) || empty( $this->task_ids ) ) {
		// 	return $this;
		// }
		
		if ( empty( $this->task_ids ) ) {
			return $this;
		}

		$tb_assignees   = pm_tb_prefix() . 'pm_assignees';
		$tb_users       = $wpdb->base_prefix . 'users';
		$tb_user_meta   = $wpdb->base_prefix . 'usermeta';
		$task_format 	= pm_get_prepare_format( $this->task_ids );
		$query_data     = $this->task_ids;

		if ( is_multisite() ) {
			$meta_key = pm_user_meta_key();

			$query = "SELECT DISTINCT usr.ID as id, usr.display_name, usr.user_email as email, asin.project_id, asin.role_id
				FROM $tb_users as usr
				LEFT JOIN $tb_assignees as asin ON usr.ID = asin.user_id
				LEFT JOIN $tb_user_meta as umeta ON umeta.user_id = usr.ID
				where asin.project_id IN ($project_format) 
				AND umeta.meta_key='$meta_key'";
		} else {
			$query = "SELECT DISTINCT usr.ID as id, usr.display_name, usr.user_email as email, asin.task_id
				FROM $tb_users as usr
				LEFT JOIN $tb_assignees as asin ON usr.ID = asin.assigned_to
				where asin.task_id IN ($task_format)";
		} 

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		
		foreach ( $results as $key => $result ) {
			$task_id = $result->task_id;
			unset( $result->task_id );
			
			$result->avatar_url = get_avatar_url( $result->id );

			$users[$task_id][] = $result;
		}
		
		foreach ( $this->tasks as $key => $task ) {
			$task->assignees['data'] = empty( $users[$task->id] ) ? [] : $users[$task->id];
		}

		return $this;
	}

	private function include_total_comments() {
		global $wpdb;
		// $with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		// if ( ! is_array( $with ) ) {
		// 	$with = explode( ',', str_replace(' ', '', $with ) );
		// }
		
		// if ( ! in_array( 'total_comments', $with ) || empty( $this->task_ids ) ) {
		// 	return $this;
		// }
		
		if ( empty( $this->task_ids ) ) {
			return $this;
		}

		$metas          = [];
		$tb_pm_comments = pm_tb_prefix() . 'pm_comments';
		$tb_tasks       = pm_tb_prefix() . 'pm_tasks';
		$task_format    = pm_get_prepare_format( $this->task_ids );
		$query_data     = $this->task_ids;

		$query ="SELECT DISTINCT count($tb_pm_comments.id) as comment_count,
			$tb_tasks.id as task_id
			FROM $tb_pm_comments
			LEFT JOIN $tb_tasks  ON $tb_tasks.id = $tb_pm_comments.commentable_id
			WHERE $tb_tasks.id IN ($task_format)
			AND $tb_pm_comments.commentable_type = %s
			group by $tb_tasks.id
		";

		array_push( $query_data, 'task' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		
		foreach ( $results as $key => $result ) {
			$task_id = $result->task_id;
			unset($result->task_id);
			$metas[$task_id] = $result->comment_count;
		}

		foreach ( $this->tasks as $key => $task ) {
			$task->total_comments = empty( $metas[$task->id] ) ? 0 : $metas[$task->id];
		}

		return $this;
	}

	private function include_total_files() {
		global $wpdb;

		if ( empty( $this->task_ids ) ) {
			return $this;
		}

		$tb_pm_files  = pm_tb_prefix() . 'pm_files';
		$tb_tasks     = pm_tb_prefix() . 'pm_tasks';
		
		$task_format  = pm_get_prepare_format( $this->task_ids );
		$query_data   = $this->task_ids;

		$query = "SELECT DISTINCT count(fl.id) as count,  fl.fileable_id as task_id
			from $tb_pm_files as fl
			where fl.fileable_id IN ($task_format)
			AND fl.fileable_type = %s
			group by fl.fileable_id";
		
		array_push( $query_data, 'task' );

		$results = $wpdb->get_results( $wpdb->prepare( $query, $query_data ) );
		
		foreach ( $results as $key => $result ) {
			$task_id = $result->task_id;
			unset($result->task_id);
			$metas[$task_id] = (int) $result->count;
		}

		foreach ( $this->tasks as $key => $task ) {
			$task->total_files = empty( $metas[$task->id] ) ? 0 : $metas[$task->id];
		}

		return $this;
		
	}

	/**
	 * Choose table select item
	 * 
	 * @param  string $tb
	 * @param  string $key
	 * 
	 * @return string
	 */
	private function get_selectable_items( $tb, $key ) {
		$select = '';
		$select_items = $this->query_params[$key];
		
		if ( empty( $select_items ) ) {
			$select = $tb . '.*';
		}

		$select_items = str_replace( ' ', '', $select_items );
		$select_items = explode( ',', $select_items );

		foreach ( $select_items as $key => $item ) {
			$select .= $tb . '.' . $item . ',';
		}

		return substr( $select, 0, -1 );
	}

	private function select() {
		$select = '';
		
		if ( empty( $this->query_params['select'] ) ) {
			$this->select = $this->tb_tasks . '.*';

			return $this;
		}

		$select_items = $this->query_params['select'];

		if ( ! is_array( $select_items ) ) {
			$select_items = str_replace( ' ', '', $select_items );
			$select_items = explode( ',', $select_items );
		}

		foreach ( $select_items as $key => $item ) {
			$item = str_replace( ' ', '', $item );
			$select .= $this->tb_tasks . '.' . $item . ',';
		}
		
		$this->select = substr( $select, 0, -1 );
		
		return $this;
	}

	private function join() {

		$this->join = apply_filters( 'pm_task_join', $this->join );

		return $this;
	}

	/**
	 * Set task where condition
	 * 
	 * @return class object
	 */
	private function where() {
		
		$this->where_id()
			->where_title()
			->where_status()
			->where_start_at()
			->where_due_date()
			->where_completed_at()
			->where_project_id()
			->where_users()
			->where_lists()
			->where_milestone()
			->where_recurrent();

		$this->where = apply_filters( 'pm_task_where', $this->where, $this->user_id );

		return $this;
	}

	public function get_prepare_format( $ids, $is_string = false ) {

		
		$ids = $this->get_prepare_data( $ids );

        // how many entries will we select?
        $how_many = count( $ids );

        // prepare the right amount of placeholders
        // if you're looing for strings, use '%s' instead
        if( $is_string ) {
            $placeholders = array_fill( 0, $how_many, '%s' );
        } else {
            $placeholders = array_fill( 0, $how_many, '%d' );
        }

        // glue together all the placeholders...
        // $format = '%d, %d, %d, %d, %d, [...]'
        $format = implode( ', ', $placeholders );

        return $format;
    }

    public function get_prepare_data( $args, $delimiter = ',' ) {

    	$new = [];

    	if ( is_array( $args ) ) {
    		foreach ( $args as $date_key => $value ) {
    			$new[trim($date_key)] = trim( $value );
    		}
    	}

    	if ( ! is_array( $args ) ) {
			$args = explode( $delimiter, $args );

			foreach ( $args as $date_key => $value ) {
    			$new[trim($date_key)] = trim( $value );
    		}
		}

		return $new;
    }

    public function where_lists() {
    	$lists = isset( $this->query_params['lists'] ) ? $this->query_params['lists'] : false;

		if ( empty( $lists ) ) {
			return $this;
		}

		$format = $this->get_prepare_format( $lists );
		$lists  = $this->get_prepare_data( $lists );
			
		global $wpdb;
		
		$this->where .= $wpdb->prepare( " AND list.id IN ($format)", $lists );

		return $this;
    }

	private function where_users() {
		$users = isset( $this->query_params['users'] ) ? $this->query_params['users'] : false;
		$is_user_null = false;

		if ( empty( $users ) ) {
			return $this;
		}

		if ( is_null( $users ) || $users == 'null' ) {
			$users = 0;
			$is_user_null = true;
		}

		$format = $this->get_prepare_format( $users );
		$users = $this->get_prepare_data( $users );
		
		global $wpdb;
		$tb_asin = pm_tb_prefix() . 'pm_assignees';

		if ( $is_user_null ) {
			$this->join .= " LEFT JOIN {$tb_asin} ON $tb_asin.task_id={$this->tb_tasks}.id";
			$this->where .= $wpdb->prepare( " AND ( $tb_asin.assigned_to IN ($format) OR $tb_asin.assigned_to is null ) ) ", $users );
		} else {
			$this->join .= " LEFT JOIN {$tb_asin} ON $tb_asin.task_id={$this->tb_tasks}.id";
			$this->where .= $wpdb->prepare( " AND $tb_asin.assigned_to IN ($format)", $users );
		}

		return $this;
	}

	private function where_milestone() {
		if ( !isset( $this->query_params['milestone'] ) ) {
			return $this;
		}

		global $wpdb;

		$milestone = $this->query_params['milestone'];
		$tb_milestone   = pm_tb_prefix() . 'pm_boards';
		$tb_boardables   = pm_tb_prefix() . 'pm_boardables';

		if ( empty( $milestone ) ) {
			$data_milestone = $wpdb->get_results( $wpdb->prepare( "SELECT id FROM {$tb_milestone} WHERE %d=%d AND type='milestone'", 1, 1 ) );
			$milestone_ids = wp_list_pluck( $data_milestone, 'id' );

		} else {
			$milestone_ids = pm_get_prepare_data( $milestone );
		}

		$milestone_ids = empty( $milestone_ids ) ? [-1] : $milestone_ids;

		$format      = pm_get_prepare_format( $milestone_ids );
		$format_data = array_merge( $milestone_ids, ['milestone', 'task_list']  );
		
		$milestone_lists = $wpdb->get_results( 
			$wpdb->prepare( "SELECT boardable_id as list_id 
				FROM {$tb_boardables} 
				WHERE board_id IN ($format) 
				
				AND board_type=%s 
				AND boardable_type=%s", 

				$format_data
			) 
		);

		$list_ids = wp_list_pluck( $milestone_lists, 'list_id' );
		$list_ids = empty( $list_ids ) ? [-1] : $list_ids;
		$format   = pm_get_prepare_format( $list_ids );

		$this->where .= $wpdb->prepare( " AND list.id IN ($format)", $list_ids );

		return $this;
	}

	private function where_project_id() {
		$project_id = isset( $this->query_params['project_id'] ) ? $this->query_params['project_id'] : false;

		if ( empty( $project_id ) ) {
			return $this;
		}

		global $wpdb;
		$format     = $this->get_prepare_format( $project_id );
		$project_id = $this->get_prepare_data( $project_id );

		$this->where .= $wpdb->prepare( " AND {$this->tb_tasks}.project_id IN ($format)", $project_id );

		return $this;
	}

	private function where_start_at() {

		if ( 
			empty( pm_get_setting( 'task_start_field' ) ) 
				||
			pm_get_setting( 'task_start_field' ) == 'false'
		 ) {
			return $this;
		}
		
		$start_at   = !empty( $this->query_params['start_at'] ) ? $this->query_params['start_at'] : false;
		$ope_params = !empty( $this->query_params['start_at_operator'] ) ? $this->query_params['start_at_operator'] : false;
		$ope_params = $this->get_prepare_data( $ope_params );
		
		if ( $start_at === false ) {
			return $this;
		}

		if ( empty( $ope_params ) ) {
			return $this;
		}
 
		global $wpdb;
		
		$q = [];

		$keys = array_keys( $ope_params );
		$last_key = end( $keys );
		
		foreach ( $ope_params as $key => $ope_param ) {
			$explode = explode( '|', str_replace( ' ', '', $ope_param ) );
			$operator = $this->get_operator( $explode[0] );

			if ( empty( $operator ) ) {
				continue;
			}

			if ( ! empty( $explode[1] ) ) {
				$relation = $explode[1];
			} else {
				$relation = 'AND';
			}
			
			if ( $last_key == $key ) {
				$relation = '';
			}

			
			$start_at = date( 'Y-m-d', strtotime( $start_at ) );
			
			if( $explode[0] == 'null' || $explode[0] == 'empty' ) {
				$q[] = "({$this->tb_tasks}.start_at $operator) $relation";
			} else {
				$q[] = $wpdb->prepare( "
					( {$this->tb_tasks}.start_at $operator %s ) 
						OR 
					( {$this->tb_tasks}.start_at is null AND {$this->tb_tasks}.created_at $operator %s ) ", 
					$start_at, $start_at 
				) .' '. $relation;
			}
		}

		$q = implode( ' ', $q );
			
		if ( ! empty( $q ) ) {
			$this->where .= " AND ( $q ) ";
		}

		return $this;
	}

	function explode( $data, $delimiter ) {

		if ( is_array( $data ) ) {
			return $data;
		}

		$data = explode( $delimiter, $data );
	}

	private function where_completed_at() {
		global $wpdb;

		$completed_at         = !empty( $this->query_params['completed_at'] ) ? $this->query_params['completed_at'] : false;
		$completed_at_start   = !empty( $this->query_params['completed_at_start'] ) ? $this->query_params['completed_at_start'] : false;
		$completed_at_between = !isset( $this->query_params['completed_at_between'] ) ? true : pm_is_true( $this->query_params['completed_at_between'] );
		$ope_params           = !empty( $this->query_params['completed_at_operator'] ) ? $this->query_params['completed_at_operator'] : false;
		$ope_params           = pm_get_prepare_data( $ope_params );

		if ( empty( $ope_params ) ) {
            if ( empty( $completed_at ) ) {
                return $this;
            }
        }

		if ( $completed_at_start ) {
			$com_start_reduce = date('Y-m-d', strtotime ( $completed_at_start) );
			$com_add          = date('Y-m-d', strtotime ( $completed_at) );
		}
	
		//If its contain between condition
		if ( $completed_at_start ) {

			if ( $completed_at_between ) {
				$query = $wpdb->prepare( " DATE({$this->tb_tasks}.completed_at) BETWEEN %s AND %s ", $com_start_reduce, $com_add );
			} else {
				$query = $wpdb->prepare( " DATE({$this->tb_tasks}.completed_at) NOT BETWEEN %s AND %s ", $com_start_reduce, $com_add );
			}
			
			$this->where .= " AND ( $query ) ";

			return $this;
		}
		//close between condition

		$q = [];
		
		$keys = array_keys( $ope_params );
		$last_key = end( $keys );
		
		foreach ( $ope_params as $key => $ope_param ) {
			$explode = explode( '|', str_replace( ' ', '', $ope_param ) );

			if ( ! empty( $explode[1] ) ) {
				$relation = $explode[1];
			} else {
				$relation = 'AND';
			}
			
			if ( $last_key == $key ) {
				$relation = '';
			}

			$operator = $this->get_operator( $explode[0] );
			$completed_at = date( 'Y-m-d', strtotime( $completed_at ) );
			
			if( $explode[0] == 'null' || $explode[0] == 'empty' ) {

				$due_q = "{$this->tb_tasks}.completed_at $operator";

				$q[] = "($due_q) {$relation}";
			} else {

				$due_q = $wpdb->prepare( " {$this->tb_tasks}.completed_at $operator %s", $completed_at );

				$q[] = " ( {$due_q} ) {$relation} ";
			}
		}

		$q = implode( ' ', $q );
	
		if ( ! empty( $q ) ) {
			$this->where .= " AND ( $q ) ";
		}

		return $this;
	}

	private function where_due_date() {
		global $wpdb;

		$due_date         = !empty( $this->query_params['due_date'] ) ? $this->query_params['due_date'] : false;
		$due_date_start   = !empty( $this->query_params['due_date_start'] ) ? $this->query_params['due_date_start'] : false;
		$due_date_between = !isset( $this->query_params['due_date_between'] ) ? true : pm_is_true( $this->query_params['due_date_between'] );
		$ope_params       = !empty( $this->query_params['due_date_operator'] ) ? $this->query_params['due_date_operator'] : false;
		$ope_params       = pm_get_prepare_data( $ope_params );

        if ( empty( $due_date ) ) {
            return $this;
        }

		if ( $due_date_start ) {
			$due_start_reduce = date('Y-m-d', strtotime ( $due_date_start) );
			$due_add          = date('Y-m-d', strtotime ( $due_date ) );
		}

		//If its contain between condition
		if ( $due_date_start ) {

			if ( $due_date_between ) {
				$query = $wpdb->prepare( " DATE({$this->tb_tasks}.due_date) BETWEEN %s AND %s ", $due_start_reduce, $due_add );
			} else {
				$query = $wpdb->prepare( " DATE({$this->tb_tasks}.due_date) NOT BETWEEN %s AND %s ", $due_start_reduce, $due_add );
			}
			
			$this->where .= " AND ( $query ) ";

			return $this;
		}
		//close between condition
		
		$q = [];
		
		$keys = array_keys( $ope_params );
		$last_key = end( $keys );
		
		foreach ( $ope_params as $key => $ope_param ) {
			$explode = explode( '|', str_replace( ' ', '', $ope_param ) );

			if ( ! empty( $explode[1] ) ) {
				$relation = $explode[1];
			} else {
				$relation = 'AND';
			}
			
			if ( $last_key == $key ) {
				$relation = '';
			}

			$operator = $this->get_operator( $explode[0] );
			$due_date = date( 'Y-m-d', strtotime( $due_date ) );

			if ( $operator !== "= ''" ) {
				if( $explode[0] == 'null' || $explode[0] == 'empty' ) {
					$due_q = "{$this->tb_tasks}.due_date $operator";
	
					$q[] = "($due_q) $relation";
				} else {
					$due_q = $wpdb->prepare( " {$this->tb_tasks}.due_date $operator %s", $due_date );
	
					$q[] = " ( {$due_q} ) {$relation} ";
				}
			}
		}

		$q = implode( ' ', $q );
		$q = substr( $q, 0, -2 ); // Remove `or` text from last sql string
		
		if ( ! empty( $q ) ) {
			$this->where .= " AND ( $q ) ";
		}

		return $this;
	}

	private function get_operator( $param ) {

		$default = [
			'less_than'          => '<',
			'less_than_equal'    => '<=',
			'greater_than'       => '>',
			'greater_than_equal' => '>=',
			'null'               => 'is null',
			'empty'              => "= ''",
		];

		return empty( $default[$param] ) ? '' : $default[$param]; 
	}

	/**
	 * Filter task by ID
	 * 
	 * @return class object
	 */
	private function where_id() {
		$id = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false; 

		if ( empty( $id ) ) {
			return $this;
		}

		global $wpdb;
		$format     = $this->get_prepare_format( $id );
		$format_ids = $this->get_prepare_data( $id );

		$this->where .= $wpdb->prepare( " AND {$this->tb_tasks}.id IN ($format)", $format_ids );

		return $this;
	}

	/**
	 * Filter task by recurrent
	 * 
	 * @return class object
	 */
	private function where_recurrent() {
		$recurrent = isset( $this->query_params['recurrent'] ) ? $this->query_params['recurrent'] : false; 

		if ( empty( $recurrent ) ) {
			return $this;
		}

		global $wpdb;
		$format     = $this->get_prepare_format( $recurrent );
		$format_recurrents = $this->get_prepare_data( $recurrent );

		$this->where .= $wpdb->prepare( " AND {$this->tb_tasks}.recurrent IN ($format)", $format_recurrents );

		return $this;
	}

	/**
	 * Filter porject by status
	 * 
	 * @return class object
	 */
	private function where_status() {
		$status = isset( $this->query_params['status'] ) ? $this->query_params['status'] : false;

		if ( $status === false ) {
			return $this;
		}

		global $wpdb;

		$this->where .= $wpdb->prepare( " AND {$this->tb_tasks}.status=%s", $status );

		return $this;
	}

	/**
	 * Filter task by title
	 * 
	 * @return class object
	 */
	private function where_title() {
		$title = isset( $this->query_params['title'] ) ? $this->query_params['title'] : false;

		if ( empty( $title ) ) {
			return $this;
		}

		global $wpdb;

		$this->where .= $wpdb->prepare( " AND {$this->tb_tasks}.title LIKE %s", '%' . $title . '%'  );

		return $this;
	}

	/**
	 * Generate task query limit
	 * 
	 * @return class object
	 */
	private function limit() {
		$per_page = isset( $this->query_params['per_page'] ) ? $this->query_params['per_page'] : false;
		
		if ( $per_page === false || $per_page == '-1' ) {
			return $this;
		}

		global $wpdb;

		$this->limit = $wpdb->prepare( " LIMIT %d,%d", $this->get_offset(), $this->get_per_page() );

		return $this;
	}

	/**
	 * Get offset
	 * 
	 * @return int
	 */
	private function get_offset() {
		$page = isset( $this->query_params['pages'] ) ? $this->query_params['pages'] : false;

		$page   = empty( $page ) ? 1 : absint( $page );
		$limit  = $this->get_per_page();
		$offset = ( $page - 1 ) * $limit;

		return $offset;
	}

	/**
	 * Get the number for tasks per page
	 * 
	 * @return class instance
	 */
	private function get_per_page() {
		$per_page = isset( $this->query_params['per_page'] ) ? $this->query_params['per_page'] : false;
		
		if ( ! empty( $per_page ) && intval( $per_page ) ) {
			return (int) $per_page;
		}

		$with = empty( $this->query_params['with'] ) ? [] : $this->query_params['with'];
		
		if ( ! is_array( $with ) ) {
			$with = explode( ',', str_replace(' ', '', $with ) );
		}

		if ( in_array( 'incomplete_tasks_per_page', $with ) ) {
			$per_page = pm_get_setting( 'incomplete_tasks_per_page' );
		}

		if ( in_array( 'complete_tasks_per_page', $with ) ) {
			$per_page = pm_get_setting( 'complete_tasks_per_page' );
		}

		return empty( $per_page ) ? 10 : (int) $per_page;
	}

	/**
	 * Execute the tasks query
	 * 
	 * @return class instance
	 */
	private function get() {
		global $wpdb;
		
		$id        = isset( $this->query_params['id'] ) ? $this->query_params['id'] : false;
		$boardable = pm_tb_prefix() . 'pm_boardables';
		$tasks = [];

		$query = $wpdb->prepare( "SELECT SQL_CALC_FOUND_ROWS DISTINCT {$this->tb_tasks}.*, 
			list.id as task_list_id,
			list.title as task_list_title
			
			FROM {$this->tb_tasks}

			Left join $boardable as boardable ON boardable.boardable_id = {$this->tb_tasks}.id
			Left join {$this->tb_lists} as list ON list.id = boardable.board_id
			
			{$this->join}
			
			WHERE %d=%d {$this->where} 

			AND boardable.board_type=%s 
			AND boardable.boardable_type=%s
			
			{$this->orderby} 
			
			{$this->limit}", 

			1, 1, 'task_list', 'task'
		);
		//echo $query; die();
		$results = $wpdb->get_results( $query );

		// If task has not boardable_id mean no list
		foreach ( $results as $key => $result ) {
			if( empty( $result->task_list_id ) ) {
				continue;
			}

			$tasks[] = $result;
		}
		
		
		$this->found_rows = $wpdb->get_var( "SELECT FOUND_ROWS()" );
		
		$this->tasks = $tasks;

		if ( ! empty( $results ) && is_array( $results ) ) {
			$this->task_ids = wp_list_pluck( $results, 'id' );
		} 

		if ( ! empty( $results ) && !is_array( $results ) ) {
			$this->task_ids = [$results->id];
		} 

		return $this;
	}

	private function orderby() {
		global $wpdb;

		$tb_pj   = $wpdb->prefix . 'pm_tasks';
		$odr_prms = isset( $this->query_params['orderby'] ) ? $this->query_params['orderby'] : false;
		
		if ( $odr_prms === false && !is_array( $odr_prms ) ) {
			$this->orderby = ' ORDER BY boardable.order DESC';

			return $this;
		}

		$orders = [];

		$odr_prms = str_replace( ' ', '', $odr_prms );
		$odr_prms = explode( ',', $odr_prms );

		foreach ( $odr_prms as $key => $orderStr ) {
			$orderStr = str_replace( ' ', '', $orderStr );
			$orderStr = explode( ':', $orderStr );

			$orderby = $orderStr[0];
			$order = empty( $orderStr[1] ) ? 'asc' : $orderStr[1];

			$orders[$orderby] = $order;
		}

		$order = [];

	    foreach ( $orders as $key => $value ) {
	    	$order[] =  $tb_pj .'.'. $key . ' ' . $value;
	    }

	    $this->orderby = "ORDER BY " . implode( ', ', $order);
	    
		return $this;
	}

	/**
	 * Set table name as class object
	 */
	private function set_table_name() {
		$this->tb_tasks    = pm_tb_prefix() . 'pm_tasks';
		$this->tb_lists    = pm_tb_prefix() . 'pm_boards';
		$this->tb_projects = pm_tb_prefix() . 'pm_projects';
	}
}
