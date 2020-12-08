<?php
namespace WeDevs\PM\Core\Cli;

use WeDevs\PM\Core\Cli\Cli;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Task_List\Models\Task_List;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\Project\Controllers\Project_Controller;
use WeDevs\PM\Category\Controllers\Category_Controller as Category;
use WeDevs\PM\Task_List\Controllers\Task_List_Controller;
use WeDevs\PM\Task\Controllers\Task_Controller;
use WeDevs\PM\Milestone\Controllers\Milestone_Controller;
/**
 * Accounting CLI class
 */
class Commands extends Cli {

    public $project;
    public $tasklist;

    function __construct() {
        $this->add_command( 'truncate', 'truncate' );
        $this->add_command( 'create_users', 'create_users' );
        //$this->add_command( 'background', 'background' );
        $this->add_command( 'create_project', 'create_project' );
        $this->add_command( 'delete_project', 'delete_project' );
        $this->add_command( 'create_tasklist', 'create_tasklist' );
        $this->add_command( 'delete_tasklist', 'delete_tasklist' );
        $this->add_command( 'create_task', 'create_task' );
        $this->add_command( 'delete_task', 'delete_task' );
        //$this->add_command( 'create_discussion', 'create_discussion' );
        //$this->add_command( 'delete_discussion', 'delete_discussion' );
        //$this->add_command( 'create_milestone', 'create_milestone' );
        //$this->add_command( 'delete_milestone', 'delete_milestone' );
    }

    public function generate_random_string($length = 10) {
        $characters       = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString     = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }

        return $randomString;
    }

    public function generate_random_email() {

        // array of possible top-level domains
        $tlds = array("com", "net", "gov", "org", "edu", "biz", "info");

        // string of possible characters
        $char = "0123456789abcdefghijklmnopqrstuvwxyz";

        // choose random lengths for the username ($ulen) and the domain ($dlen)
        $ulen = mt_rand(5, 10);
        $dlen = mt_rand(7, 17);

        // reset the address
        $a = "";

        // get $ulen random entries from the list of possible characters
        // these make up the username (to the left of the @)
        for ($i = 1; $i <= $ulen; $i++) {
        $a .= substr($char, mt_rand(0, strlen($char)), 1);
        }

        // wouldn't work so well without this
        $a .= "@";

        // now get $dlen entries from the list of possible characters
        // this is the domain name (to the right of the @, excluding the tld)
        for ($i = 1; $i <= $dlen; $i++) {
        $a .= substr($char, mt_rand(0, strlen($char)), 1);
        }

        // need a dot to separate the domain from the tld
        $a .= ".";

        // finally, pick a random top-level domain and stick it on the end
        $a .= $tlds[mt_rand(0, (sizeof($tlds)-1))];

        return $a;
    }

    public function create_users () {
        for ($i=0; $i <= 100; $i++) {

            $user_name  = wp_generate_password(8, false, false);
            $password   = wp_generate_password(12, false, false);
            $user_email = $this->generate_random_email();

            wp_create_user( $user_name, $password, $user_email );
        }
    }

    public function truncate() {

        global $wpdb;
        // truncate table
        $tables = [
            'pm_activities',
            'pm_assignees',
            'pm_boardables',
            'pm_boards',
            'pm_categories',
            'pm_category_project',
            'pm_comments',
            'pm_files',
            'pm_meta',
            'pm_projects',
            'pm_role_user',
            'pm_settings',
            'pm_tasks',
            'pm_time_tracker',
            'pm_gantt_chart_links'
        ];
        foreach ($tables as $table) {
            $wpdb->query( "TRUNCATE TABLE {$wpdb->prefix}{$table}" );
        }

        delete_option('pm_start_migration');
        delete_option('pm_db_migration');
        delete_option('pm_observe_migration');
        delete_option('pm_migration_notice');
        delete_option('pm_task_migration');
        delete_option('pm_db_version');
        delete_option('cpm_db_version');

        \WP_CLI::success( "Table truncate successfully!" );
    }

    // public function background() {

    //     global $wpdb;
    //     // truncate table
    //     $tables = [
    //         'pm_capabilities',
    //         'pm_role_project',
    //         'pm_role_project_capabilities',
    //         'pm_role_project_users',
    //     ];
    //     foreach ($tables as $table) {
    //         $del_tb = $wpdb->prefix . $table;
    //         $wpdb->query( "DROP TABLE $del_tb" );
    //     }

    //     $wpdb->query("DELETE FROM wp_options WHERE option_name LIKE 'wp\_pm\_tasks\_boards\_update\_2\_3\_batch\_%'");

    //     delete_option( 'pm_migration_start_2_3' );
    //     delete_option( 'pm_migration_notice_2_3' );
    //     delete_option( 'pm_db_migration_2_3' );
    //     delete_option( 'pm_total_queue_2_3' );
    //     delete_option( 'pm_queue_complete_2_3' );
    //     update_option( 'pm_db_version', '2.2.2' );
    //     delete_option('pm_capabilities');
    //     delete_option('update_role_project_table');
    //     delete_option('update_role_project_capabilities');
    //     delete_option('update_role_project_users');

    //     \WP_CLI::success( "Table truncate successfully!" );
    // }

    public function create_project( $args, $assoc_args ) {
        $arguments = wp_parse_args( $assoc_args, array(
            'count_generate' => 1
        ) );
        if( $arguments['count_generate'] > 0 ) {
            $faker = \Faker\Factory::create();
            $count = $arguments['count_generate'];

            for ( $i=0; $i<$count; $i++  ) {
                $project_data = array( "title" => $faker->name, "description" => $faker->text,
                    "notify_users" => true, "status" => "incomplete"
                );
                $project_controller = new Project_Controller();
                $response = $project_controller->create_project( $project_data );
            }

            \WP_CLI::success( "Project Created successfully!" );

        } else {
            \WP_CLI::error( 'Invalid arguments.' );
        }

    }

    public function delete_project( $args, $assoc_args ) {
        $projects           = Project::all();
        $proejcts           = $projects->pluck('id');
        $project_controller = new Project_Controller();
        $project_controller->delete_projects_all( );
        \WP_CLI::success( "Project Deleted successfully!" );
    }

    public function create_tasklist( $args, $assoc_args ) {
        $faker = \Faker\Factory::create();

        $arguments = wp_parse_args( $assoc_args, array(
            'count_generate' => 1,
        ) );

        if( !empty( $arguments['project_id'] ) && $arguments['count_generate'] > 0  ) {
            $count      = $arguments['count_generate'];
            $project_id = $arguments['project_id'];
            $project    =  Project::find( $project_id );

            if( $project ) {
                for ( $i=0; $i< $count; $i++  ) {
                    $task_list_data = array(
                        'title' => $faker->name,
                        'type' => 'task_list',
                        'project_id' => $project->id,
                        'order' => 0,
                        'milestone' => -1,
                        'privacy' => false
                    );

                   // $listobj = new Task_List_Controller();
                    $tasklist = Task_List_Controller::create_tasklist( $task_list_data );
                }

                \WP_CLI::success( "Task List Created successfully!" );
            } else {
                \WP_CLI::error( 'Invalid arguments.' );
            }
        }
    }

    public function delete_tasklist( $args, $assoc_args ) {
        $arguments = wp_parse_args( $assoc_args, array(
            'project_id' => 0,
        ) );

        if(  !empty( $arguments['project_id'] )  ) {
            $project_id =  $arguments['project_id'];
            $lists = Task_List::where( 'project_id', $project_id )->get();
            foreach ($lists as $list) {
                $data = array( 'project_id' => $list->project_id, 'task_list_id' => $list->id  );
                //$listobj = new Task_List_Controller();
                $tasklist = Task_List_Controller::delete_tasklist( $data );
            }
            \WP_CLI::success( "Task List Deleted successfully!" );
        } else {
            \WP_CLI::error( 'Invalid arguments.' );
        }
    }

    public function create_task( $args, $assoc_args ) {
        $faker = \Faker\Factory::create();

        $arguments = wp_parse_args( $assoc_args, array(
            'project_id'     => 0,
            'board_id'       => 0,
            'assignees'      => 0,
            'privacy'        => true,
            'count_generate' => 1,
            'assignees' => array( 0 )
        ) );

        if(  !empty( $arguments['project_id'] ) &&  !empty( $arguments['board_id'] )   ) {

            $project  = Project::find( $arguments['project_id'] );
            $tasklist = Task_List::find( $arguments['board_id'] );
            $count    = $arguments['count_generate'];

            for ( $i=0; $i<$count; $i++  ) {

                $task_data = array(
                    'title' => $faker->name,
                    'project_id' => $project->id,
                    'board_id'   => $tasklist->id,
                    'assignees'  => array( 1 ),
                    'privacy'    => true,
                    'created_by' => 1,
                    'updated_by' => 1
                );

                Task_Controller::create_task( $task_data );
            }

            \WP_CLI::success( "Task  Created successfully!" . $project->title );
        } else {
            \WP_CLI::error( 'Invalid arguments.' );
        }

    }

    public function delete_task(  $args, $assoc_args ) {
        $arguments = wp_parse_args( $assoc_args, array(
            'project_id' => 0,
            'task_id'    => 0
        ) );

        if(  !empty( $arguments['project_id'] ) && !empty( $arguments['task_id'] )  ) {
            Task_Controller::delete_task( $arguments );
            \WP_CLI::success( "Task  deleted successfully!");
        } else {
            \WP_CLI::error( 'Invalid arguments.' );
        }
    }

    public function create_discussion( $args, $assoc_args ) {
        $arguments = wp_parse_args( $assoc_args, array(
            'project_id' => 0
        ) );

        // if() {

        // } else {
        //     \WP_CLI::error( 'Invalid arguments.' );
        // }
    }

    public function delete_discussion( $args, $assoc_args ) {
        $arguments = wp_parse_args( $assoc_args, array(
            'project_id' => 0
        ) );

        // if() {
        // } else {
        //     \WP_CLI::error( 'Invalid arguments.' );
        // }
    }

    public function create_milestone( $args, $assoc_args ) {
        $faker = \Faker\Factory::create();
        $arguments = wp_parse_args( $assoc_args, array(
            'project_id' => 0,
            'count_generate' => 1,
        ) );

        if(  !empty( $arguments['project_id'] ) && $arguments['project_id'] > 0  ) {
            $count = $arguments['count_generate'];
            $date = strtotime("+7 day");
            $milestone_data = array(
                'order'        => 0,
                'status'       => 'incomplete',
                'title'        => $faker->name,
                'description'  => $faker->text,
                'achieve_date' => date('Y M, d', $date ),
                'privacy'      => false,
                'project_id'   => $arguments['project_id']
            );

            for( $i=0; $i< $count; $i++ ) {
                Milestone_Controller::create_milestone( $milestone_data );
            }

            \WP_CLI::success( " Milestone  Created successfully!");
        } else {
            \WP_CLI::error( 'Invalid arguments.' );
        }
    }

    public function delete_milestone( $args, $assoc_args ) {
        $arguments = wp_parse_args( $assoc_args, array(
            'project_id' => 0
        ) );

        // if() {
        // } else {
        //     \WP_CLI::error( 'Invalid arguments.' );
        // }
    }
}


