<?php

namespace WeDevs\PM\Dashboard\Services;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Carbon\Carbon;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\User\Models\User_Role;
use WeDevs\PM\User\Helper\Avatar;

/**
 * Open work per person for the dashboard Team workload card.
 *
 * A work item is a task or subtask assigned to the person that is open, or
 * was completed inside the window. Items are read once, per person and per
 * task, so a task assigned twice to the same person or shared by several
 * people is never counted twice for one row. Pro builds its capacity view
 * from the same items.
 */
class Team_Workload {

    /** @var array project ids whose team the viewer sees */
    protected $project_ids;

    /** @var int window in days */
    protected $days;

    /** @var array|null */
    protected $items = null;

    public function __construct( array $project_ids, $days = 7 ) {
        $this->project_ids = array_values( array_filter( array_map( 'intval', $project_ids ) ) );
        $this->days        = max( 1, (int) $days );
    }

    /**
     * The workload a viewer may see, or null when they see no team: admins
     * every project, PM managers the projects they belong to, project
     * managers the projects they manage.
     *
     * @return self|null
     */
    public static function for_viewer( $user_id, $days = 7 ) {
        $user_id = (int) $user_id;

        if ( wedevs_pm_has_admin_capability( $user_id ) ) {
            $project_ids = Project::pluck( 'id' )->all();
        } else {
            $roles = User_Role::where( 'user_id', $user_id );

            if ( ! wedevs_pm_has_manage_capability( $user_id ) ) {
                $roles->where( 'role_id', 1 );
            }

            $project_ids = $roles->distinct()->pluck( 'project_id' )->all();
        }

        return empty( $project_ids ) ? null : new self( $project_ids, $days );
    }

    public function project_ids() {
        return $this->project_ids;
    }

    /**
     * Everyone who belongs to a project in scope, plus anyone holding work in
     * one, so people with nothing on their plate still show.
     */
    public function member_ids() {
        if ( empty( $this->project_ids ) ) {
            return [];
        }

        $ids = User_Role::whereIn( 'project_id', $this->project_ids )
            ->distinct()
            ->pluck( 'user_id' )
            ->map( 'absint' )
            ->all();

        foreach ( $this->items() as $item ) {
            $ids[] = $item['user_id'];
        }

        return array_values( array_filter( array_unique( $ids ) ) );
    }

    /**
     * One row per (person, task): status, dates, estimate in minutes, how many
     * people share the task and whether it has subtasks.
     *
     * @return array
     */
    public function items() {
        if ( null !== $this->items ) {
            return $this->items;
        }

        $this->items = [];

        if ( empty( $this->project_ids ) ) {
            return $this->items;
        }

        global $wpdb;

        $tasks     = $wpdb->prefix . 'pm_tasks';
        $assignees = $wpdb->prefix . 'pm_assignees';
        $in        = implode( ',', array_fill( 0, count( $this->project_ids ), '%d' ) );
        $since     = Carbon::today()->subDays( $this->days )->toDateTimeString();
        $done      = (int) Task::COMPLETE;

        // phpcs:disable WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- table names are prefixed constants; every value is a placeholder.
        $rows = $wpdb->get_results( $wpdb->prepare(
            "SELECT DISTINCT a.assigned_to AS user_id, t.id, t.status, t.due_date, t.completed_at, t.estimation, t.parent_id
            FROM {$assignees} a
            INNER JOIN {$tasks} t ON t.id = a.task_id
            WHERE t.project_id IN ({$in}) AND a.assigned_to > 0
                AND ( t.status <> %d OR t.completed_at >= %s )",
            array_merge( $this->project_ids, [ $done, $since ] )
        ) );

        $children = $wpdb->get_col( $wpdb->prepare(
            "SELECT DISTINCT parent_id FROM {$tasks} WHERE project_id IN ({$in}) AND parent_id > 0",
            $this->project_ids
        ) );
        // phpcs:enable

        $shared = [];

        foreach ( $rows as $row ) {
            $shared[ (int) $row->id ] = isset( $shared[ (int) $row->id ] ) ? $shared[ (int) $row->id ] + 1 : 1;
        }

        $has_children = array_flip( array_map( 'intval', $children ) );

        foreach ( $rows as $row ) {
            $id = (int) $row->id;

            $this->items[] = [
                'user_id'      => (int) $row->user_id,
                'task_id'      => $id,
                'open'         => $done !== (int) $row->status,
                'due_date'     => $row->due_date ? substr( $row->due_date, 0, 10 ) : '',
                'completed_at' => $row->completed_at,
                'estimation'   => (int) $row->estimation,
                'is_subtask'   => (int) $row->parent_id > 0,
                'assignees'    => $shared[ $id ],
                'has_subtasks' => isset( $has_children[ $id ] ),
            ];
        }

        return $this->items;
    }

    /**
     * Which window bucket an open item falls in: overdue, due (inside the
     * window) or later (after it, or no due date).
     */
    public function bucket( array $item ) {
        $today = Carbon::today()->toDateString();
        $until = Carbon::today()->addDays( $this->days )->toDateString();

        if ( '' === $item['due_date'] ) {
            return 'later';
        }

        if ( $item['due_date'] < $today ) {
            return 'overdue';
        }

        return $item['due_date'] <= $until ? 'due' : 'later';
    }

    /**
     * Task counts per person.
     *
     * @return array user_id => [ open, overdue, due_soon, later, completed ]
     */
    public function counts() {
        $counts = [];

        foreach ( $this->items() as $item ) {
            $uid = $item['user_id'];

            if ( ! isset( $counts[ $uid ] ) ) {
                $counts[ $uid ] = [ 'open' => 0, 'overdue' => 0, 'due_soon' => 0, 'later' => 0, 'completed' => 0 ];
            }

            if ( ! $item['open'] ) {
                $counts[ $uid ]['completed']++;
                continue;
            }

            $counts[ $uid ]['open']++;

            $bucket = $this->bucket( $item );
            $key    = 'due' === $bucket ? 'due_soon' : $bucket;

            $counts[ $uid ][ $key ]++;
        }

        return $counts;
    }

    /**
     * Team totals, each task counted once however many people share it.
     */
    public function summary() {
        $open = $overdue = $completed = [];

        foreach ( $this->items() as $item ) {
            if ( ! $item['open'] ) {
                $completed[ $item['task_id'] ] = true;
                continue;
            }

            $open[ $item['task_id'] ] = true;

            if ( 'overdue' === $this->bucket( $item ) ) {
                $overdue[ $item['task_id'] ] = true;
            }
        }

        return [
            'open'      => count( $open ),
            'overdue'   => count( $overdue ),
            'completed' => count( $completed ),
        ];
    }

    /**
     * Card rows: the task counts plus name and avatar, most loaded first.
     */
    public function rows() {
        $counts = $this->counts();
        $ids    = $this->member_ids();

        if ( $ids ) {
            cache_users( $ids );
        }

        $rows = [];

        foreach ( $ids as $uid ) {
            $user = get_userdata( $uid );

            if ( ! $user ) {
                continue;
            }

            $c = isset( $counts[ $uid ] ) ? $counts[ $uid ] : [ 'open' => 0, 'overdue' => 0, 'due_soon' => 0, 'later' => 0, 'completed' => 0 ];

            $rows[] = [
                'id'         => $uid,
                'name'       => $user->display_name,
                'avatar_url' => Avatar::get_url( $uid ),
                'open'       => $c['open'],
                'overdue'    => $c['overdue'],
                'due_soon'   => $c['due_soon'],
                'later'      => $c['later'],
                'completed'  => $c['completed'],
                // Deprecated: overdue + due soon, the old headline.
                'burden'     => $c['overdue'] + $c['due_soon'],
                'active'     => $c['open'],
            ];
        }

        usort( $rows, function ( $a, $b ) {
            return [ $b['open'], $b['overdue'] ] <=> [ $a['open'], $a['overdue'] ];
        } );

        return $rows;
    }
}
