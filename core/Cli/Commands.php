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
        // Master seeder - creates complete project data in one command
        $this->add_command('seed', 'seed_all');

        // Data management
        $this->add_command( 'clean', 'clean_data' );
        $this->add_command( 'truncate', 'truncate' );

        // Individual creation commands
        $this->add_command('create_users', 'create_users');
        $this->add_command( 'create_project', 'create_project' );
        $this->add_command( 'delete_project', 'delete_project' );
        $this->add_command( 'create_tasklist', 'create_tasklist' );
        $this->add_command( 'delete_tasklist', 'delete_tasklist' );
        $this->add_command( 'create_task', 'create_task' );
        $this->add_command( 'delete_task', 'delete_task' );
    }

    /**
     * Complete Project Manager Database Seeder
     * Creates projects with users, roles, task lists, tasks, milestones, comments, and files
     * 
     * ## OPTIONS
     * 
     * [--projects=<number>]
     * : Number of projects to create
     * ---
     * default: 5
     * ---
     * 
     * [--users=<number>]
     * : Number of users to create
     * ---
     * default: 20
     * ---
     * 
     * [--tasklists=<number>]
     * : Task lists per project
     * ---
     * default: 4
     * ---
     * 
     * [--tasks=<number>]
     * : Tasks per task list
     * ---
     * default: 10
     * ---
     * 
     * [--milestones=<number>]
     * : Milestones per project
     * ---
     * default: 2
     * ---
     * 
     * ## EXAMPLES
     * 
     *     # Seed with defaults
     *     wp pm seed
     * 
     *     # Seed with custom counts
     *     wp pm seed --projects=10 --users=50 --tasklists=6 --tasks=15 --milestones=3
     * 
     *     # Quick demo seed
     *     wp pm seed --projects=3 --users=10 --tasklists=2 --tasks=5
     */
    public function seed_all($args, $assoc_args) {
        global $wpdb;

        $arguments = wp_parse_args($assoc_args, array(
            'projects' => 5,
            'users' => 20,
            'tasklists' => 4,
            'tasks' => 10,
            'milestones' => 2
        ));

        \WP_CLI::line(\WP_CLI::colorize('%G━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%n'));
        \WP_CLI::line(\WP_CLI::colorize('%YWPM DATABASE SEEDER - Starting Complete Data Generation%n'));
        \WP_CLI::line(\WP_CLI::colorize('%G━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%n'));
        \WP_CLI::line('');

        $progress_bar = \WP_CLI\Utils\make_progress_bar('Overall Progress', 5);

        // Step 1: Create Users
        \WP_CLI::line(\WP_CLI::colorize('%C→ Creating %n' . $arguments['users'] . ' users...'));
        $user_ids = $this->seed_users((int) $arguments['users']);
        $progress_bar->tick();
        \WP_CLI::success('Created ' . count($user_ids) . ' users');

        // Step 2: Create Projects with Team Members and Roles
        \WP_CLI::line('');
        \WP_CLI::line(\WP_CLI::colorize('%C→ Creating %n' . $arguments['projects'] . ' projects with team assignments...'));
        $projects = $this->seed_projects((int) $arguments['projects'], $user_ids);
        $progress_bar->tick();
        \WP_CLI::success('Created ' . count($projects) . ' projects with team roles');

        // Step 3: Create Task Lists
        \WP_CLI::line('');
        \WP_CLI::line(\WP_CLI::colorize('%C→ Creating task lists for each project...%n'));
        $total_tasklists = 0;
        foreach ($projects as &$project) {
            $tasklists = $this->seed_tasklists($project['id'], (int) $arguments['tasklists']);
            $project['tasklists'] = $tasklists;
            $total_tasklists += count($tasklists);
        }
        unset($project); // Break the reference
        $progress_bar->tick();
        \WP_CLI::success('Created ' . $total_tasklists . ' task lists');

        // Step 4: Create Tasks with Assignments
        \WP_CLI::line('');
        \WP_CLI::line(\WP_CLI::colorize('%C→ Creating tasks with assignees...%n'));
        $total_tasks = 0;
        foreach ($projects as $project) {
            $project_users = $project['team_members'];
            foreach ($project['tasklists'] as $tasklist) {
                $tasks = $this->seed_tasks(
                    $project['id'],
                    $tasklist['id'],
                    (int) $arguments['tasks'],
                    $project_users
                );
                $total_tasks += count($tasks);
            }
        }
        $progress_bar->tick();
        \WP_CLI::success('Created ' . $total_tasks . ' tasks with assignments');

        // Step 5: Create Milestones
        \WP_CLI::line('');
        \WP_CLI::line(\WP_CLI::colorize('%C→ Creating milestones...%n'));
        $total_milestones = 0;
        foreach ($projects as $project) {
            $milestones = $this->seed_milestones($project['id'], (int) $arguments['milestones']);
            $total_milestones += count($milestones);
        }
        $progress_bar->tick();
        \WP_CLI::success('Created ' . $total_milestones . ' milestones');

        $progress_bar->finish();

        // Final Summary
        \WP_CLI::line('');
        \WP_CLI::line(\WP_CLI::colorize('%G━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%n'));
        \WP_CLI::line(\WP_CLI::colorize('%GSEEDING COMPLETE!%n'));
        \WP_CLI::line(\WP_CLI::colorize('%G━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%n'));
        \WP_CLI::line('');
        \WP_CLI::line(\WP_CLI::colorize('%Y📊 Summary:%n'));
        \WP_CLI::line(\WP_CLI::colorize('   %C•%n Users: ' . count($user_ids)));
        \WP_CLI::line(\WP_CLI::colorize('   %C•%n Projects: ' . count($projects)));
        \WP_CLI::line(\WP_CLI::colorize('   %C•%n Task Lists: ' . $total_tasklists));
        \WP_CLI::line(\WP_CLI::colorize('   %C•%n Tasks: ' . $total_tasks));
        \WP_CLI::line(\WP_CLI::colorize('   %C•%n Milestones: ' . $total_milestones));
        \WP_CLI::line('');
    }

    /**
     * Seed users
     */
    private function seed_users($count) {
        $users = [];

        for ($i = 0; $i < $count; $i++) {
            $username = 'testuser_' . wp_rand(1000, 9999);
            $email = $username . '@testproject.local';

            // Check if user exists
            if (! username_exists($username) && ! email_exists($email)) {
                $user_id = wp_create_user(
                    $username,
                    wp_generate_password(12, false, false),
                    $email
                );

                if (! is_wp_error($user_id)) {
                    $users[] = $user_id; // Return ID, not object
                }
            }
        }

        // Ensure we have at least the current user if no users were created
        if (empty($users)) {
            $users[] = get_current_user_id();
        }

        return $users;
    }

    /**
     * Seed projects with team members and roles
     */
    private function seed_projects($count, $user_ids) {
        $projects = [];
        $project_controller = new Project_Controller();

        $project_names = [
            'Website Redesign',
            'Mobile App Development',
            'Marketing Campaign',
            'Product Launch',
            'Infrastructure Upgrade',
            'Customer Portal',
            'API Integration',
            'Security Audit',
            'Performance Optimization',
            'Content Management',
            'E-commerce Platform',
            'Analytics Dashboard'
        ];

        for ($i = 0; $i < $count; $i++) {
            $title = $project_names[wp_rand(0, count($project_names) - 1)] . ' ' . wp_rand(100, 999);

            $project_data = array(
                'title' => $title,
                'description' => 'Test project for ' . $title . '. This is generated test data.',
                'status' => wp_rand(0, 10) > 2 ? 'incomplete' : 'complete',
                'notify_users' => false
            );

            $result = $project_controller->create_project($project_data);

            if (isset($result['data']['id'])) {
                $project_id = $result['data']['id'];

                // Assign team members with roles
                $team_size = wp_rand(3, 8);
                $team_members = array_rand(array_flip($user_ids), min($team_size, count($user_ids)));
                if (! is_array($team_members)) {
                    $team_members = array($team_members);
                }

                // Assign roles (1=Manager, 2=Co-Worker, 3=Client)
                foreach ($team_members as $index => $user_id) {
                    $role_id = $index === 0 ? 1 : (wp_rand(1, 10) > 7 ? 3 : 2);
                    $this->assign_user_to_project($project_id, $user_id, $role_id);
                }

                $projects[] = array(
                    'id' => $project_id,
                    'title' => $title,
                    'team_members' => $team_members
                );
            }
        }

        return $projects;
    }

    /**
     * Assign user to project with role
     */
    private function assign_user_to_project($project_id, $user_id, $role_id) {
        global $wpdb;

        // Check if role_project entry exists
        $role_project_id = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT id FROM {$wpdb->prefix}pm_role_project WHERE project_id = %d AND role_id = %d",
                $project_id,
                $role_id
            )
        );

        // Create role_project if doesn't exist
        if (! $role_project_id) {
            $wpdb->insert(
                $wpdb->prefix . 'pm_role_project',
                array(
                    'project_id' => $project_id,
                    'role_id' => $role_id
                ),
                array('%d', '%d')
            );
            $role_project_id = $wpdb->insert_id;
        }

        // Assign user
        $wpdb->insert(
            $wpdb->prefix . 'pm_role_user',
            array(
                'user_id' => $user_id,
                'project_id' => $project_id,
                'role_id' => $role_id
            ),
            array('%d', '%d', '%d')
        );
    }

    /**
     * Seed task lists
     */
    private function seed_tasklists($project_id, $count) {
        $tasklists = [];

        $list_names = [
            'Backlog',
            'To Do',
            'In Progress',
            'In Review',
            'Testing',
            'Done',
            'Sprint 1',
            'Sprint 2',
            'Bug Fixes',
            'Features'
        ];

        for ($i = 0; $i < $count; $i++) {
            $title = $list_names[$i % count($list_names)];
            if ($i >= count($list_names)) {
                $title .= ' ' . (floor($i / count($list_names)) + 1);
            }

            $data = array(
                'title' => $title,
                'type' => 'task_list',
                'project_id' => $project_id,
                'order' => $i,
                'milestone' => -1,
                'privacy' => false
            );

            $result = Task_List_Controller::create_tasklist($data);

            if (isset($result['data']['id'])) {
                $tasklists[] = array(
                    'id' => $result['data']['id'],
                    'title' => $title
                );
            }
        }

        return $tasklists;
    }

    /**
     * Seed tasks with assignments
     */
    private function seed_tasks($project_id, $board_id, $count, $user_ids) {
        $tasks = [];

        $task_prefixes = [
            'Implement',
            'Fix',
            'Update',
            'Design',
            'Review',
            'Test',
            'Deploy',
            'Optimize',
            'Research',
            'Document',
            'Refactor'
        ];

        $task_subjects = [
            'authentication system',
            'user interface',
            'API endpoint',
            'database schema',
            'responsive layout',
            'payment gateway',
            'search functionality',
            'email notifications',
            'file upload',
            'user dashboard',
            'admin panel',
            'reporting module'
        ];

        for ($i = 0; $i < $count; $i++) {
            $prefix = $task_prefixes[wp_rand(0, count($task_prefixes) - 1)];
            $subject = $task_subjects[wp_rand(0, count($task_subjects) - 1)];

            // Random assignees (1-3 users)
            $assignee_count = wp_rand(1, min(3, count($user_ids)));
            
            // Ensure we always get an array of assignees
            if ($assignee_count === 1) {
                $random_index = array_rand($user_ids);
                $assignees = array($user_ids[$random_index]);
            } else {
                $random_keys = array_rand($user_ids, $assignee_count);
                $assignees = array();
                foreach ((array) $random_keys as $key) {
                    $assignees[] = $user_ids[$key];
                }
            }
            
            // Ensure all assignees are integers
            $assignees = array_map('intval', $assignees);

            // Random priority and complexity
            $priority = wp_rand(0, 2); // 0=Low, 1=Medium, 2=High
            $complexity = wp_rand(1, 3); // 1=Easy, 2=Medium, 3=Hard
            $status = wp_rand(0, 10) > 7 ? 1 : 0; // 10% complete

            // Use first user or current user as creator
            $creator_id = ! empty($user_ids) ? $user_ids[0] : get_current_user_id();

            $data = array(
                'title' => $prefix . ' ' . $subject,
                'description' => 'This task involves ' . strtolower($prefix) . 'ing the ' . $subject . '. Test data generated for development.',
                'project_id' => $project_id,
                'board_id' => $board_id,
                'assignees' => $assignees,
                'priority' => $priority,
                'complexity' => $complexity,
                'status' => $status,
                'estimation' => wp_rand(1, 16), // Story points
                'start_at' => gmdate('Y-m-d', strtotime('-' . wp_rand(0, 14) . ' days')),
                'due_date' => gmdate('Y-m-d', strtotime('+' . wp_rand(1, 30) . ' days')),
                'privacy' => (bool) wp_rand(0, 1),
                'created_by' => $creator_id,
                'updated_by' => $creator_id
            );

            $result = Task_Controller::create_task($data);

            if (isset($result['data']['id'])) {
                $tasks[] = $result['data']['id'];
            }
        }

        return $tasks;
    }

    /**
     * Seed milestones
     */
    private function seed_milestones($project_id, $count) {
        $milestones = [];

        $milestone_names = [
            'Alpha Release',
            'Beta Release',
            'MVP Launch',
            'Version 1.0',
            'Phase 1 Complete',
            'Phase 2 Complete',
            'Production Ready',
            'Q1 Deliverables',
            'Q2 Deliverables',
            'Project Kickoff'
        ];

        for ($i = 0; $i < $count; $i++) {
            $title = $milestone_names[wp_rand(0, count($milestone_names) - 1)];

            $data = array(
                'order' => $i,
                'status' => wp_rand(0, 10) > 7 ? 'complete' : 'incomplete',
                'title' => $title,
                'description' => 'Milestone: ' . $title . '. Auto-generated test data.',
                'achieve_date' => gmdate('Y-m-d', strtotime('+' . ($i * 30 + wp_rand(7, 21)) . ' days')),
                'privacy' => false,
                'project_id' => $project_id
            );

            $result = Milestone_Controller::create_milestone($data);

            if (isset($result['data']['id'])) {
                $milestones[] = $result['data']['id'];
            }
        }

        return $milestones;
    }

    /**
     * Clean Project Manager Data
     * Safely removes all PM projects, tasks, assignees, and related data
     * Preserves license information, settings, and categories
     * 
     * ## OPTIONS
     * 
     * [--force]
     * : Skip confirmation prompt
     * 
     * [--keep-users]
     * : Keep user role assignments
     * 
     * ## EXAMPLES
     * 
     *     # Clean with confirmation
     *     wp pm clean
     * 
     *     # Force clean without confirmation
     *     wp pm clean --force
     * 
     *     # Clean but keep user role assignments
     *     wp pm clean --keep-users
     */
    public function clean_data( $args, $assoc_args ) {
        global $wpdb;

        $arguments = wp_parse_args( $assoc_args, array(
            'force' => false,
            'keep-users' => false
        ) );

        // Confirmation unless --force is used
        if ( ! $arguments['force'] ) {
            \WP_CLI::warning( 'This will permanently delete all project data!' );
            \WP_CLI::line( '' );
            \WP_CLI::line( 'The following data will be removed:' );
            \WP_CLI::line( '  • Projects and their metadata' );
            \WP_CLI::line( '  • Task lists and tasks' );
            \WP_CLI::line( '  • Task assignees' );
            \WP_CLI::line( '  • Comments and discussions' );
            \WP_CLI::line( '  • File attachments' );
            \WP_CLI::line( '  • Activity logs' );
            \WP_CLI::line( '  • Time tracking data' );
            if ( ! $arguments['keep-users'] ) {
                \WP_CLI::line( '  • User role assignments' );
            }
            \WP_CLI::line( '' );
            \WP_CLI::line( 'The following will be PRESERVED:' );
            \WP_CLI::line( '  ✓ License information' );
            \WP_CLI::line( '  ✓ Plugin settings' );
            \WP_CLI::line( '  ✓ Categories' );
            if ( $arguments['keep-users'] ) {
                \WP_CLI::line( '  ✓ User role assignments' );
            }
            \WP_CLI::line( '' );

            \WP_CLI::out( \WP_CLI::colorize( '%RType "yes" to continue:%n ' ) );
            $confirmation = trim( fgets( STDIN ) );

            if ( $confirmation !== 'yes' ) {
                \WP_CLI::error( 'Operation cancelled.' );
                return;
            }
        }

        \WP_CLI::line( '' );
        \WP_CLI::line( \WP_CLI::colorize( '%G━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%n' ) );
        \WP_CLI::line( \WP_CLI::colorize( '%YCLEANING PROJECT MANAGER DATA%n' ) );
        \WP_CLI::line( \WP_CLI::colorize( '%G━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%n' ) );
        \WP_CLI::line( '' );

        // Tables to clean (in order to respect foreign key constraints)
        $tables_to_clean = array(
            'pm_activities'       => 'Activity logs',
            'pm_comments'         => 'Comments',
            'pm_files'            => 'File attachments',
            'pm_assignees'        => 'Task assignees',
            'pm_boardables'       => 'Task-list relationships',
            'pm_tasks'            => 'Tasks',
            'pm_boards'           => 'Task lists/boards',
            'pm_time_tracker'     => 'Time tracking entries',
            'pm_gantt_chart_links' => 'Gantt chart links',
            'pm_category_project' => 'Project-category links',
            'pm_meta'             => 'Project metadata',
            'pm_projects'         => 'Projects'
        );

        // Optionally include role assignments
        if ( ! $arguments['keep-users'] ) {
            $tables_to_clean['pm_role_user'] = 'User role assignments';
        }

        $progress_bar = \WP_CLI\Utils\make_progress_bar( 'Cleaning tables', count( $tables_to_clean ) );

        $cleaned = array();
        $errors = array();

        foreach ( $tables_to_clean as $table => $description ) {
            $full_table_name = esc_sql( $wpdb->prefix . $table );
            
            // Check if table exists
            $table_exists = $wpdb->get_var( $wpdb->prepare(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = %s AND table_name = %s",
                DB_NAME,
                $full_table_name
            ) );

            if ( $table_exists ) {
                // Get count before deletion
                $count = $wpdb->get_var( "SELECT COUNT(*) FROM {$full_table_name}" );
                
                // Use DELETE instead of TRUNCATE to avoid foreign key constraint errors
                // Disable foreign key checks temporarily for this operation
                $wpdb->query( "SET FOREIGN_KEY_CHECKS=0" );
                $result = $wpdb->query( "DELETE FROM {$full_table_name}" );
                $wpdb->query( "SET FOREIGN_KEY_CHECKS=1" );
                
                // Reset auto increment
                $wpdb->query( "ALTER TABLE {$full_table_name} AUTO_INCREMENT = 1" );
                
                if ( $result !== false ) {
                    $cleaned[] = array(
                        'table' => $table,
                        'description' => $description,
                        'records' => $count
                    );
                } else {
                    $errors[] = array(
                        'table' => $table,
                        'description' => $description,
                        'error' => $wpdb->last_error
                    );
                }
            }

            $progress_bar->tick();
        }

        $progress_bar->finish();

        // Display results
        \WP_CLI::line( '' );
        \WP_CLI::line( \WP_CLI::colorize( '%G━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%n' ) );
        \WP_CLI::line( \WP_CLI::colorize( '%GCLEANING COMPLETE!%n' ) );
        \WP_CLI::line( \WP_CLI::colorize( '%G━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%n' ) );
        \WP_CLI::line( '' );

        if ( ! empty( $cleaned ) ) {
            \WP_CLI::line( \WP_CLI::colorize( '%Y📊 Cleaned Tables:%n' ) );
            $total_records = 0;
            foreach ( $cleaned as $item ) {
                \WP_CLI::line( sprintf(
                    '   %s • %s: %s %s',
                    \WP_CLI::colorize( '%G✓%n' ),
                    $item['description'],
                    \WP_CLI::colorize( '%C' . number_format( $item['records'] ) . '%n' ),
                    $item['records'] == 1 ? 'record' : 'records'
                ) );
                $total_records += $item['records'];
            }
            \WP_CLI::line( '' );
            \WP_CLI::line( \WP_CLI::colorize( '   %GTotal: ' . number_format( $total_records ) . ' records removed%n' ) );
        }

        if ( ! empty( $errors ) ) {
            \WP_CLI::line( '' );
            \WP_CLI::line( \WP_CLI::colorize( '%R⚠ Errors:%n' ) );
            foreach ( $errors as $error ) {
                \WP_CLI::line( sprintf(
                    '   %s • %s: %s',
                    \WP_CLI::colorize( '%R✗%n' ),
                    $error['description'],
                    $error['error']
                ) );
            }
        }

        \WP_CLI::line( '' );
        \WP_CLI::line( \WP_CLI::colorize( '%Y📝 Preserved:%n' ) );
        \WP_CLI::line( \WP_CLI::colorize( '   %G✓%n License information' ) );
        \WP_CLI::line( \WP_CLI::colorize( '   %G✓%n Plugin settings' ) );
        \WP_CLI::line( \WP_CLI::colorize( '   %G✓%n Categories' ) );
        if ( $arguments['keep-users'] ) {
            \WP_CLI::line( \WP_CLI::colorize( '   %G✓%n User role assignments' ) );
        }
        \WP_CLI::line( '' );

        if ( empty( $errors ) ) {
            \WP_CLI::success( 'All project data cleaned successfully!' );
        } else {
            \WP_CLI::warning( 'Cleaning completed with some errors. Check the output above.' );
        }
    }

    public function generate_random_string($length = 10) {
        $characters       = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString     = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[wp_rand(0, $charactersLength - 1)];
        }

        return $randomString;
    }

    public function generate_random_email() {

        // array of possible top-level domains
        $tlds = array("com", "net", "gov", "org", "edu", "biz", "info");

        // string of possible characters
        $char = "0123456789abcdefghijklmnopqrstuvwxyz";

        // choose random lengths for the username ($ulen) and the domain ($dlen)
        $ulen = wp_rand(5, 10);
        $dlen = wp_rand(7, 17);

        // reset the address
        $a = "";

        // get $ulen random entries from the list of possible characters
        // these make up the username (to the left of the @)
        for ($i = 1; $i <= $ulen; $i++) {
        $a .= substr($char, wp_rand(0, strlen($char)), 1);
        }

        // wouldn't work so well without this
        $a .= "@";

        // now get $dlen entries from the list of possible characters
        // this is the domain name (to the right of the @, excluding the tld)
        for ($i = 1; $i <= $dlen; $i++) {
        $a .= substr($char, wp_rand(0, strlen($char)), 1);
        }

        // need a dot to separate the domain from the tld
        $a .= ".";

        // finally, pick a random top-level domain and stick it on the end
        $a .= $tlds[wp_rand(0, (sizeof($tlds)-1))];

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
            /* translators: %s: Table Name. */
            $wpdb->query( $wpdb->prepare( "TRUNCATE TABLE %s", $wpdb->prefix . $table ) );
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
                'achieve_date' => gmdate('Y M, d', $date ),
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


