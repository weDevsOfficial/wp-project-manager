<?php

namespace WeDevs\PM\Dashboard\Controllers;

use WP_REST_Request;
use Carbon\Carbon;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\User\Models\User_Role;
use WeDevs\PM\User\Helper\Avatar;
use WeDevs\PM\Dashboard\Services\Activity_Feed;
use WeDevs\PM\Dashboard\Services\Team_Workload;

/**
 * Aggregated data for the specialized PM Dashboard (home page).
 *
 * Everything is role-scoped:
 *   - Managers / admins (manage capability) see organisation-wide figures.
 *   - Co-workers / clients see only the projects they belong to, and only the
 *     tasks assigned to them.
 *
 * The single `index` endpoint returns every widget's data in one request so the
 * React dashboard mounts with one round-trip.
 */
class Dashboard_Controller {

    use Transformer_Manager;

    /** @var int */
    protected $user_id;

    /** @var bool full org-wide view (WP admin / manage_options) */
    protected $is_admin;

    /** @var bool PM manage capability (project manager) */
    protected $is_manager;

    /** @var array|null cached scoped project ids (null = all, admin only) */
    protected $project_ids = null;

    /** @var array|null projects the caller manages (null = all, admin only) */
    protected $managed_ids = null;

    /** @var string admin | manager | member | client */
    protected $tier = 'member';

    /**
     * Resolve the caller's scope once per request. Three tiers:
     *   - admin   → full organisation (all projects, all tasks)
     *   - manager → only their projects, all tasks within them
     *   - member  → only their projects, and only tasks assigned to them
     */
    protected function boot() {
        $this->user_id  = get_current_user_id();
        $this->is_admin = wedevs_pm_has_admin_capability();

        // Everyone except a full admin is limited to the projects they belong to.
        if ( ! $this->is_admin ) {
            $this->project_ids = $this->scoped_project_ids();
            $this->managed_ids = $this->managed_project_ids();
        }

        // PM roles are per project: someone can manage project A and merely
        // belong to project B. A global capability still means manager
        // everywhere, but holding the manager role on any project is enough
        // to get the manager view — scoped to those projects.
        $this->is_manager = wedevs_pm_has_manage_capability()
            || ! empty( $this->managed_ids );

        if ( $this->is_admin ) {
            $this->tier = 'admin';
        } elseif ( $this->is_manager ) {
            $this->tier = 'manager';
        } elseif ( $this->is_client_only() ) {
            $this->tier = 'client';
        } else {
            $this->tier = 'member';
        }
    }

    /** Client (role 3) in every project the caller belongs to. */
    protected function is_client_only() {
        $roles = User_Role::where( 'user_id', $this->user_id )
            ->distinct()
            ->pluck( 'role_id' )
            ->map( 'absint' )
            ->all();

        return ! empty( $roles ) && ! array_diff( $roles, [ 3 ] );
    }

    /**
     * Projects whose team figures the caller sees: all (null) for admins,
     * every project they belong to for a global PM manager, the projects they
     * manage for a project manager.
     */
    protected function team_project_ids() {
        if ( $this->is_admin ) {
            return null;
        }

        return wedevs_pm_has_manage_capability() ? $this->scope_ids() : $this->managed_scope_ids();
    }

    public function index( WP_REST_Request $request ) {
        $this->boot();

        // Dashboard-wide window — 7 / 30 / 90 days (default 7). Every
        // time-based figure on the page reads from this one value.
        $range = (int) $request->get_param( 'range' );
        $days  = in_array( $range, [ 7, 30, 90 ], true ) ? $range : 7;

        $data = [
            'user'              => $this->user_block(),
            'range'             => $days,
            'kpis'              => $this->kpis( $days ),
            'projects_status'   => $this->projects_status(),
            'performance'       => $this->performance( $days ),
            'performance_mode'  => $this->performance_mode(),
            'task_distribution' => $this->task_distribution(),
            'upcoming'          => $this->upcoming_tasks(),
            'upcoming_total'    => $this->upcoming_total(),
            'overdue_list'      => $this->overdue_tasks(),
            'overdue_total'     => $this->overdue_total(),
            'calendar'          => $this->calendar_month(),
            'active_projects'   => $this->active_projects(),
            'recent_activity'   => $this->recent_activity( $days ),
            'milestones'        => $this->upcoming_milestones(),
            'overdue_milestones' => $this->overdue_milestones(),
            'team'              => ( $this->is_admin || $this->is_manager ) ? $this->team_status( $days ) : null,
            'my_workload'       => $this->my_workload( $days ),
            'generated_at'      => current_time( 'mysql' ),
        ];

        return rest_ensure_response( [ 'data' => $data ] );
    }

    // ──────────────────────────────────────────────────────────────────
    // Scope helpers
    // ──────────────────────────────────────────────────────────────────

    /** Projects where the caller holds the Manager role (role_id 1). */
    protected function managed_project_ids() {
        return User_Role::where( 'user_id', $this->user_id )
            ->where( 'role_id', 1 )
            ->distinct()
            ->pluck( 'project_id' )
            ->map( 'absint' )
            ->all();
    }

    /** @return array projects the caller manages (admin = every project). */
    protected function managed_scope_ids() {
        return empty( $this->managed_ids ) ? [ 0 ] : $this->managed_ids;
    }

    protected function scoped_project_ids() {
        return User_Role::where( 'user_id', $this->user_id )
            ->distinct()
            ->pluck( 'project_id' )
            ->map( 'absint' )
            ->all();
    }

    /** @return array project ids the caller is limited to (admin = no limit). */
    protected function scope_ids() {
        return empty( $this->project_ids ) ? [ 0 ] : $this->project_ids;
    }

    /**
     * Base parent-task query honouring the caller's scope tier.
     */
    protected function task_query() {
        $query = Task::parent();

        if ( $this->is_admin ) {
            return $query;
        }

        // Limited to the projects they belong to either way.
        $query->whereIn( 'project_id', $this->scope_ids() );

        // A global manager sees every task in those projects. Otherwise the
        // tier is per project: all tasks where they manage, only their own
        // where they are just a member.
        if ( wedevs_pm_has_manage_capability() ) {
            return $query;
        }

        $managed = $this->managed_ids;
        $user_id = $this->user_id;

        $query->where( function ( $q ) use ( $managed, $user_id ) {
            $q->whereHas( 'assignees', function ( $a ) use ( $user_id ) {
                $a->where( 'assigned_to', $user_id );
            } );

            if ( ! empty( $managed ) ) {
                $q->orWhereIn( 'project_id', $managed );
            }
        } );

        return $query;
    }

    protected function project_query() {
        $query = Project::query();

        if ( ! $this->is_admin ) {
            $query->whereIn( 'id', $this->scope_ids() );
        }

        return $query;
    }

    // ──────────────────────────────────────────────────────────────────
    // Widgets
    // ──────────────────────────────────────────────────────────────────

    protected function user_block() {
        $user = wp_get_current_user();

        if ( wedevs_pm_has_admin_capability() ) {
            $role_label = __( 'Administrator', 'wedevs-project-manager' );
        } elseif ( $this->is_manager || wedevs_pm_current_user_is_manager_anywhere() ) {
            $role_label = __( 'Project Manager', 'wedevs-project-manager' );
        } elseif ( 'client' === $this->tier ) {
            $role_label = __( 'Client', 'wedevs-project-manager' );
        } else {
            $role_label = __( 'Team Member', 'wedevs-project-manager' );
        }

        return [
            'id'         => $this->user_id,
            'tier'       => $this->tier,
            'name'       => $user->display_name,
            'role_label' => $role_label,
            'avatar_url' => Avatar::get_url( $this->user_id ),
        ];
    }

    protected function kpis( $days = 7 ) {
        $today = Carbon::today();

        $total       = (clone $this->task_query())->count();
        $completed   = (clone $this->task_query())->where( 'status', Task::COMPLETE )->count();
        $in_progress = (clone $this->task_query())->where( 'status', Task::INCOMPLETE )->count();
        $pending     = (clone $this->task_query())->where( 'status', Task::PENDING )->count();
        $overdue     = (clone $this->task_query())
            ->where( 'status', '!=', Task::COMPLETE )
            ->whereNotNull( 'due_date' )
            ->where( 'due_date', '<', $today->toDateString() )
            ->count();
        // Open = not done and not past due, so Completed + Open + Overdue = Total
        // (the same split as My Tasks' Current and Outstanding tabs).
        $open        = (clone $this->task_query())
            ->where( 'status', '!=', Task::COMPLETE )
            ->where( function ( $q ) use ( $today ) {
                $q->whereNull( 'due_date' )->orWhere( 'due_date', '>=', $today->toDateString() );
            } )
            ->count();

        // Trend: this window vs the window immediately before it.
        $this_period = (clone $this->task_query())
            ->where( 'status', Task::COMPLETE )
            ->whereDate( 'completed_at', '>=', $today->copy()->subDays( $days ) )
            ->count();
        $last_period = (clone $this->task_query())
            ->where( 'status', Task::COMPLETE )
            ->whereDate( 'completed_at', '>=', $today->copy()->subDays( $days * 2 ) )
            ->whereDate( 'completed_at', '<', $today->copy()->subDays( $days ) )
            ->count();

        return [
            'total_tasks'     => $total,
            'completed'       => $completed,
            'open'            => $open,
            // Deprecated: every open task (overdue included) and status 2, which nothing writes.
            'in_progress'     => $in_progress,
            'pending'         => $pending,
            'overdue'         => $overdue,
            'completion_rate' => $total > 0 ? round( ( $completed / $total ) * 100 ) : 0,
            'completed_trend' => $this->trend( $this_period, $last_period ),
            'completed_in_range' => $this_period,
            'range_days'      => $days,
        ];
    }

    protected function projects_status() {
        $today    = Carbon::today();
        $projects = (clone $this->project_query())
            ->withCount( [
                'tasks as overdue_count' => function ( $q ) use ( $today ) {
                    $q->where( 'parent_id', 0 )
                        ->where( 'status', '!=', Task::COMPLETE )
                        ->whereNotNull( 'due_date' )
                        ->whereDate( 'due_date', '<', $today );
                },
            ] )
            ->get( [ 'id', 'status' ] );

        $total = $projects->count();
        $completed = $on_track = $at_risk = $archived = 0;

        $late_milestone_projects = array_flip( array_column( $this->milestone_rows( true, 0 ), 'project_id' ) );

        foreach ( $projects as $p ) {
            // The Project_Status accessor returns the status key ('complete'), not the stored int.
            if ( 'complete' === $p->status ) {
                $completed++;
            } elseif ( 'archived' === $p->status ) {
                $archived++;
            } elseif ( $p->overdue_count > 0 || isset( $late_milestone_projects[ $p->id ] ) ) {
                $at_risk++;
            } else {
                $on_track++;
            }
        }

        return [
            'total'     => $total,
            'on_track'  => $on_track,
            'at_risk'   => $at_risk,
            'completed' => $completed,
            'archived'  => $archived,
        ];
    }

    /** Which pair of series the Task Performance chart shows (#508). */
    protected function performance_mode() {
        $modes = [
            'admin'   => 'created',
            'manager' => 'team',
            'member'  => 'self',
            'client'  => 'hidden',
        ];

        return $modes[ $this->tier ];
    }

    /**
     * Two series per bucket over the window, by who is looking (#508):
     *   admin   created vs completed, whole workspace
     *   manager assigned to the team vs completed, projects they manage
     *   member  completed vs assigned to them
     *   client  nothing (the card is hidden)
     * Grouped queries replace the two COUNTs per bucket (up to 60 before).
     */
    protected function performance( $days = 7 ) {
        $mode = $this->performance_mode();

        if ( 'hidden' === $mode ) {
            return [];
        }

        // Past 30 days a daily bar per day is unreadable, so bucket by week.
        $bucket  = $days > 30 ? 7 : 1;
        $buckets = (int) ceil( $days / $bucket );
        $label   = $days > 7 ? 'M j' : 'D';
        $first   = Carbon::today()->subDays( $buckets * $bucket - 1 )->startOfDay();
        $last    = Carbon::today()->endOfDay();

        $completed = $this->count_by_day( (clone $this->task_query())->where( 'status', Task::COMPLETE ), 'completed_at', $first, $last );
        $created   = 'created' === $mode ? $this->count_by_day( clone $this->task_query(), 'created_at', $first, $last ) : [];
        $assigned  = 'created' === $mode ? [] : $this->assigned_by_day( $mode, $first, $last );

        $sum = function ( $series, $from, $to ) {
            $n      = 0;
            $cursor = $from->copy();

            while ( $cursor->lte( $to ) ) {
                $key     = $cursor->format( 'Y-m-d' );
                $n      += isset( $series[ $key ] ) ? (int) $series[ $key ] : 0;
                $cursor->addDay();
            }

            return $n;
        };

        $rows = [];

        for ( $i = $buckets - 1; $i >= 0; $i-- ) {
            $day   = Carbon::today()->subDays( $i * $bucket );
            $start = $day->copy()->subDays( $bucket - 1 );

            $rows[] = [
                'label'     => $day->format( $label ),
                'date'      => $day->format( 'Y-m-d' ),
                'created'   => $sum( $created, $start, $day ),
                'completed' => $sum( $completed, $start, $day ),
                'assigned'  => $sum( $assigned, $start, $day ),
            ];
        }

        return $rows;
    }

    /** [ 'Y-m-d' => count ] for a scoped task query, grouped by the given date column. */
    protected function count_by_day( $query, $column, $first, $last ) {
        return $query->whereBetween( $column, [ $first->toDateTimeString(), $last->toDateTimeString() ] )
            ->selectRaw( "DATE({$column}) as d, COUNT(*) as n" )
            ->groupBy( 'd' )
            ->pluck( 'n', 'd' )
            ->all();
    }

    /**
     * Parent tasks newly assigned per day: to the caller ('self') or to anyone
     * in the projects whose team they see ('team'). Older rows without
     * assigned_at fall back to the task's creation date.
     */
    protected function assigned_by_day( $mode, $first, $last ) {
        global $wpdb;

        $tasks = esc_sql( wedevs_pm_tb_prefix() . 'pm_tasks' );
        $asg   = esc_sql( wedevs_pm_tb_prefix() . 'pm_assignees' );
        $sql   = "SELECT DATE(COALESCE(a.assigned_at, t.created_at)) AS d, COUNT(DISTINCT t.id) AS n
            FROM {$asg} a
            JOIN {$tasks} t ON t.id = a.task_id
            WHERE t.parent_id = 0
            AND COALESCE(a.assigned_at, t.created_at) BETWEEN %s AND %s";
        $args  = [ $first->toDateTimeString(), $last->toDateTimeString() ];

        if ( 'self' === $mode ) {
            $sql   .= ' AND a.assigned_to = %d';
            $args[] = $this->user_id;
        } else {
            $ids = $this->team_project_ids();

            if ( null !== $ids ) {
                $ids   = $this->ids_or_zero( $ids );
                $sql  .= ' AND a.project_id IN (' . implode( ',', array_fill( 0, count( $ids ), '%d' ) ) . ')';
                $args  = array_merge( $args, $ids );
            }
        }

        $sql .= ' GROUP BY d';

        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- table names are prefixed constants, values are placeholders.
        return wp_list_pluck( $wpdb->get_results( $wpdb->prepare( $sql, $args ) ), 'n', 'd' );
    }

    protected function ids_or_zero( $ids ) {
        $ids = array_values( array_filter( array_map( 'absint', (array) $ids ) ) );

        return empty( $ids ) ? [ 0 ] : $ids;
    }

    /**
     * Past-due, not-complete tasks (actionable priority list).
     */
    protected function overdue_tasks() {
        $today = Carbon::today();

        $tasks = (clone $this->task_query())
            ->with( 'projects:id,title' )
            ->where( 'status', '!=', Task::COMPLETE )
            ->whereNotNull( 'due_date' )
            ->whereDate( 'due_date', '<', $today )
            ->orderBy( 'priority', 'DESC' )
            ->orderBy( 'due_date', 'ASC' )
            ->limit( 10 )
            ->get( [ 'id', 'title', 'due_date', 'priority', 'project_id' ] );

        return $tasks->map( function ( $t ) use ( $today ) {
            $due       = Carbon::parse( $t->due_date )->startOfDay();
            $days_over = $due->diffInDays( $today );

            return [
                'id'            => absint( $t->id ),
                'title'         => $t->title,
                'priority'      => $t->priority,
                'days_overdue'  => $days_over,
                'project_id'    => absint( $t->project_id ),
                'project_title' => $t->projects ? $t->projects->title : '',
            ];
        } )->all();
    }

    /** Total overdue tasks in scope — the list above is capped. */
    protected function overdue_total() {
        return (clone $this->task_query())
            ->where( 'status', '!=', Task::COMPLETE )
            ->whereNotNull( 'due_date' )
            ->whereDate( 'due_date', '<', Carbon::today() )
            ->count();
    }

    /** Total upcoming tasks in scope — the list above is capped. */
    protected function upcoming_total() {
        return (clone $this->task_query())
            ->where( 'status', '!=', Task::COMPLETE )
            ->whereNotNull( 'due_date' )
            ->whereDate( 'due_date', '>=', Carbon::today() )
            ->count();
    }

    /**
     * REST endpoint: productivity heatmap, optionally for a specific calendar
     * year. No `year` → rolling last 53 weeks.
     */
    public function heatmap_data( WP_REST_Request $request ) {
        $this->boot();

        $year = $request->get_param( 'year' );
        $year = ( $year && intval( $year ) > 1970 ) ? intval( $year ) : null;

        return rest_ensure_response( [ 'data' => $this->heatmap( $year ) ] );
    }

    /**
     * Contributions per day for the heatmap (#521): tasks created, tasks
     * completed and comments. Field edits and other activity rows do not count.
     * Admins see everything, managers their team's projects, members their own
     * work; clients get nothing (the card is hidden for them).
     *
     * @param int|null $year  Calendar year, or null for the rolling 53 weeks.
     */
    protected function heatmap( $year = null ) {
        if ( $year ) {
            // Full calendar year — future days render as empty cells.
            $start = Carbon::create( $year, 1, 1 )->startOfDay();
            $end   = Carbon::create( $year, 12, 31 )->startOfDay();
        } else {
            $end   = Carbon::today();
            $start = $end->copy()->subDays( 7 * 53 - 1 )->startOfDay();
        }

        if ( 'client' === $this->tier ) {
            return [
                'visible'       => false,
                'definition'    => 'contributions',
                'days'          => [],
                'active_days'   => 0,
                'selected_year' => $year,
                'years'         => [],
            ];
        }

        $from      = $start->copy()->startOfDay()->toDateTimeString();
        $to        = $end->copy()->endOfDay()->toDateTimeString();
        $created   = $this->contributions( 'created', $from, $to );
        $completed = $this->contributions( 'completed', $from, $to );
        $comments  = $this->contributions( 'comments', $from, $to );

        $days   = [];
        $total  = 0;
        $cursor = $start->copy();
        while ( $cursor->lte( $end ) ) {
            $d  = $cursor->format( 'Y-m-d' );
            $cr = isset( $created[ $d ] ) ? (int) $created[ $d ] : 0;
            $co = isset( $completed[ $d ] ) ? (int) $completed[ $d ] : 0;
            $cm = isset( $comments[ $d ] ) ? (int) $comments[ $d ] : 0;
            $c  = $cr + $co + $cm;

            $days[] = [
                'date'      => $d,
                'count'     => $c,
                'created'   => $cr,
                'completed' => $co,
                'comments'  => $cm,
            ];

            if ( $c > 0 ) {
                $total++;
            }
            $cursor->addDay();
        }

        return [
            'visible'       => true,
            'definition'    => 'contributions',
            'scope'         => 'member' === $this->tier ? 'self' : 'team',
            'days'          => $days,
            'active_days'   => $total,
            'selected_year' => $year,
            'years'         => $this->heatmap_years(),
        ];
    }

    /**
     * [ 'Y-m-d' => count ] of one contribution kind in the caller's scope.
     *
     * @param string $kind created | completed | comments
     */
    protected function contributions( $kind, $from, $to ) {
        global $wpdb;

        $prefix   = wedevs_pm_tb_prefix();
        $tasks    = esc_sql( $prefix . 'pm_tasks' );
        $asg      = esc_sql( $prefix . 'pm_assignees' );
        $comments = esc_sql( $prefix . 'pm_comments' );
        $self     = 'member' === $this->tier;
        $args     = [ $from, $to ];

        if ( 'created' === $kind ) {
            $sql    = "SELECT DATE(t.created_at) AS d, COUNT(*) AS n FROM {$tasks} t WHERE t.created_at BETWEEN %s AND %s";
            $column = 't.project_id';

            if ( $self ) {
                $sql   .= ' AND t.created_by = %d';
                $args[] = $this->user_id;
            }
        } elseif ( 'completed' === $kind ) {
            $sql    = "SELECT DATE(t.completed_at) AS d, COUNT(*) AS n FROM {$tasks} t WHERE t.status = 1 AND t.completed_at BETWEEN %s AND %s";
            $column = 't.project_id';

            if ( $self ) {
                $sql   .= " AND EXISTS (SELECT 1 FROM {$asg} a WHERE a.task_id = t.id AND a.assigned_to = %d)";
                $args[] = $this->user_id;
            }
        } else {
            // task_activity rows are the automatic "marked as done" notes, not comments.
            $sql    = "SELECT DATE(c.created_at) AS d, COUNT(*) AS n FROM {$comments} c WHERE c.created_at BETWEEN %s AND %s AND c.commentable_type <> 'task_activity'";
            $column = 'c.project_id';

            if ( $self ) {
                $sql   .= ' AND c.created_by = %d';
                $args[] = $this->user_id;
            }
        }

        $ids = $self ? null : $this->team_project_ids();

        if ( null !== $ids ) {
            $ids  = $this->ids_or_zero( $ids );
            $sql .= " AND {$column} IN (" . implode( ',', array_fill( 0, count( $ids ), '%d' ) ) . ')';
            $args = array_merge( $args, $ids );
        }

        $sql .= ' GROUP BY d';

        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- table names are prefixed constants, values are placeholders.
        return wp_list_pluck( $wpdb->get_results( $wpdb->prepare( $sql, $args ) ), 'n', 'd' );
    }

    /** Years that have tasks in scope (desc), always including the current year. */
    protected function heatmap_years() {
        $query = Task::query();

        if ( 'member' === $this->tier ) {
            $query->where( 'created_by', $this->user_id );
        } else {
            $ids = $this->team_project_ids();

            if ( null !== $ids ) {
                $query->whereIn( 'project_id', $this->ids_or_zero( $ids ) );
            }
        }

        $earliest = $query->min( 'created_at' );
        $current  = (int) Carbon::today()->format( 'Y' );
        $first    = $earliest ? (int) Carbon::parse( $earliest )->format( 'Y' ) : $current;

        $years = [];
        for ( $y = $current; $y >= $first; $y-- ) {
            $years[] = $y;
        }

        return $years;
    }

    protected function task_distribution() {
        $today   = Carbon::today()->toDateString();
        $overdue = (clone $this->task_query())
            ->where( 'status', '!=', Task::COMPLETE )
            ->whereNotNull( 'due_date' )
            ->where( 'due_date', '<', $today )
            ->count();
        $open    = (clone $this->task_query())->where( 'status', '!=', Task::COMPLETE )->count() - $overdue;

        return [
            'completed'   => (clone $this->task_query())->where( 'status', Task::COMPLETE )->count(),
            'open'        => $open,
            'overdue'     => $overdue,
            // Deprecated keys, kept for older clients.
            'in_progress' => (clone $this->task_query())->where( 'status', Task::INCOMPLETE )->count(),
            'pending'     => (clone $this->task_query())->where( 'status', Task::PENDING )->count(),
        ];
    }

    protected function upcoming_tasks() {
        $today = Carbon::today();

        $tasks = (clone $this->task_query())
            ->with( 'projects:id,title' )
            ->where( 'status', '!=', Task::COMPLETE )
            ->whereNotNull( 'due_date' )
            ->whereDate( 'due_date', '>=', $today )
            ->orderBy( 'due_date', 'ASC' )
            ->limit( 10 )
            ->get( [ 'id', 'title', 'due_date', 'status', 'priority', 'project_id' ] );

        return $tasks->map( function ( $t ) {
            $due = $t->due_date ? wedevs_pm_format_date( $t->due_date ) : null;

            return [
                'id'            => absint( $t->id ),
                'title'         => $t->title,
                'due_date'      => is_array( $due ) ? ( $due['formatted_date'] ?? $due['date'] ?? null ) : $due,
                'priority'      => $t->priority,
                'project_id'    => absint( $t->project_id ),
                'project_title' => $t->projects ? $t->projects->title : '',
            ];
        } )->all();
    }

    /**
     * Due-task load per day for the current month (for the mini calendar).
     * Returns each day that has incomplete tasks due, with totals and an
     * overdue marker so the widget can colour past-due days.
     */
    protected function calendar_month() {
        $today       = Carbon::today();
        $month_start = $today->copy()->startOfMonth();
        $month_end   = $today->copy()->endOfMonth();

        $tasks = (clone $this->task_query())
            ->where( 'status', '!=', Task::COMPLETE )
            ->whereNotNull( 'due_date' )
            ->whereBetween( 'due_date', [ $month_start, $month_end->copy()->endOfDay() ] )
            ->get( [ 'id', 'due_date' ] );

        $days = [];

        foreach ( $tasks as $t ) {
            $date = Carbon::parse( $t->due_date )->format( 'Y-m-d' );

            if ( ! isset( $days[ $date ] ) ) {
                $days[ $date ] = [ 'total' => 0, 'overdue' => false ];
            }

            $days[ $date ]['total']++;

            if ( Carbon::parse( $date )->lt( $today ) ) {
                $days[ $date ]['overdue'] = true;
            }
        }

        $out = [];
        foreach ( $days as $date => $info ) {
            $out[] = [
                'date'    => $date,
                'total'   => $info['total'],
                'overdue' => $info['overdue'],
            ];
        }

        return [
            'month' => $today->format( 'Y-m' ),
            'today' => $today->format( 'Y-m-d' ),
            'days'  => $out,
        ];
    }

    /**
     * Scoped projects with completion progress + risk flag (Critical Projects).
     */
    protected function active_projects() {
        $today = Carbon::today();

        $projects = (clone $this->project_query())
            ->where( 'status', '!=', Project::COMPLETE )
            ->where( 'status', '!=', Project::ARCHIVED )
            ->withCount( [
                'tasks as total_tasks' => function ( $q ) {
                    $q->where( 'parent_id', 0 );
                },
                'tasks as completed_tasks' => function ( $q ) {
                    $q->where( 'parent_id', 0 )->where( 'status', Task::COMPLETE );
                },
                'tasks as overdue_tasks' => function ( $q ) use ( $today ) {
                    $q->where( 'parent_id', 0 )
                        ->where( 'status', '!=', Task::COMPLETE )
                        ->whereNotNull( 'due_date' )
                        ->whereDate( 'due_date', '<', $today );
                },
            ] )
            ->get( [ 'id', 'title', 'status', 'color_code' ] );

        $rows = $projects->map( function ( $p ) {
            $total = (int) $p->total_tasks;
            $done  = (int) $p->completed_tasks;
            $pct   = $total > 0 ? (int) round( ( $done / $total ) * 100 ) : 0;

            return [
                'id'         => absint( $p->id ),
                'title'      => $p->title,
                'color'      => $p->color_code ?: '',
                'progress'   => $pct,
                'total'      => $total,
                'completed'  => $done,
                'overdue'    => (int) $p->overdue_tasks,
                'risk'       => $p->overdue_tasks > 0 ? 'at_risk' : 'on_track',
            ];
        } )->all();

        // Busiest / riskiest first.
        usort( $rows, function ( $a, $b ) {
            return ( $b['overdue'] <=> $a['overdue'] ) ?: ( $b['total'] <=> $a['total'] );
        } );

        return array_slice( $rows, 0, 6 );
    }

    /**
     * Latest activity across scoped projects (timeline feed).
     */
    protected function recent_activity( $days = 7 ) {
        $feed = new Activity_Feed( $this->user_id, $this->is_admin, $this->is_admin ? null : $this->scope_ids() );

        return $feed->items( $days, 10 );
    }

    /**
     * Upcoming, not-yet-complete milestones with completion progress.
     */
    protected function upcoming_milestones() {
        return $this->milestone_rows( false );
    }

    /**
     * Past-due, not-complete milestones, most overdue first.
     */
    protected function overdue_milestones() {
        return $this->milestone_rows( true );
    }

    /**
     * Not-complete milestones in scope, split by whether the due date has passed.
     * Upcoming ones (and undated) sort soonest first; overdue ones most overdue first.
     */
    protected function milestone_rows( $overdue, $limit = 5 ) {
        $query = \WeDevs\PM\Milestone\Models\Milestone::with( [ 'achieve_date_field', 'project' ] )
            ->where( 'status', '!=', \WeDevs\PM\Milestone\Models\Milestone::COMPLETE )
            ->withCount( [
                'tasks as total_tasks',
                'tasks as completed_tasks' => function ( $q ) {
                    $q->where( 'status', Task::COMPLETE );
                },
            ] );

        if ( ! $this->is_admin ) {
            $query->whereIn( 'project_id', $this->scope_ids() );
        }

        $milestones = $query->get();
        $today      = Carbon::today();

        $rows = [];
        foreach ( $milestones as $m ) {
            $achieve = $m->achieve_date; // Carbon|null via accessor
            $is_late = $achieve && $achieve->copy()->startOfDay()->lt( $today );

            if ( $is_late !== (bool) $overdue ) {
                continue;
            }

            $total = (int) $m->total_tasks;
            $done  = (int) $m->completed_tasks;

            $rows[] = [
                'id'           => absint( $m->id ),
                'title'        => $m->title,
                'project'      => $m->project ? $m->project->title : '',
                'project_id'   => absint( $m->project_id ),
                'due_date'     => $achieve ? $achieve->format( 'M j, Y' ) : null,
                'days_overdue' => $is_late ? $achieve->copy()->startOfDay()->diffInDays( $today ) : 0,
                'ts'           => $achieve ? $achieve->timestamp : PHP_INT_MAX,
                'progress'     => $total > 0 ? (int) round( ( $done / $total ) * 100 ) : 0,
            ];
        }

        usort( $rows, function ( $a, $b ) {
            return $a['ts'] <=> $b['ts'];
        } );

        if ( $limit ) {
            $rows = array_slice( $rows, 0, $limit );
        }

        foreach ( $rows as &$r ) {
            unset( $r['ts'] );
        }
        unset( $r );

        return $rows;
    }

    /**
     * Per-member workload for the selected window: open tasks and subtasks
     * split into overdue, due inside the window and later, plus what each
     * person completed in the same span (see Team_Workload).
     */
    protected function team_status( $days = 7 ) {
        // Admin -> every project. A manager only sees workload for projects
        // they manage, not every project they happen to belong to.
        $project_ids = $this->is_admin
            ? (clone $this->project_query())->pluck( 'id' )->all()
            : ( wedevs_pm_has_manage_capability() ? $this->scope_ids() : $this->managed_scope_ids() );

        if ( empty( $project_ids ) ) {
            return [];
        }

        $workload = new Team_Workload( $project_ids, $days );
        $team     = $workload->rows();

        // An admin is looking at the whole organisation and needs the full
        // roster; a manager gets a slice of their own projects.
        $cap = $this->is_admin ? 100 : 25;

        return [
            'members' => array_slice( $team, 0, $cap ),
            'total'   => count( $team ),
            'scope'   => $this->is_admin ? 'organisation' : 'projects',
            'summary' => $workload->summary(),
        ];
    }

    /**
     * The caller's own load, in the same shape as one team row. Members do not
     * get the team card, so this gives them the same read on their own work.
     */
    protected function my_workload( $days = 7 ) {
        $today = Carbon::today();
        $mine  = function () {
            return (clone $this->task_query())->whereHas( 'assignees', function ( $a ) {
                $a->where( 'assigned_to', $this->user_id );
            } );
        };

        $open = $mine()->where( 'status', '!=', Task::COMPLETE )->count();

        $overdue = $mine()->where( 'status', '!=', Task::COMPLETE )
            ->whereNotNull( 'due_date' )
            ->whereDate( 'due_date', '<', $today )
            ->count();

        $due_soon = $mine()->where( 'status', '!=', Task::COMPLETE )
            ->whereNotNull( 'due_date' )
            ->whereDate( 'due_date', '>=', $today )
            ->whereDate( 'due_date', '<=', $today->copy()->addDays( $days ) )
            ->count();

        $completed = $mine()->where( 'status', Task::COMPLETE )
            ->whereDate( 'completed_at', '>=', $today->copy()->subDays( $days ) )
            ->count();

        return [
            'open'      => $open,
            'overdue'   => $overdue,
            'due_soon'  => $due_soon,
            'completed' => $completed,
            'burden'    => $overdue + $due_soon,
        ];
    }


    protected function trend( $current, $previous ) {
        // No base to compare against: say so instead of inventing a percentage.
        if ( $previous <= 0 ) {
            return [
                'direction' => $current > 0 ? 'up' : 'flat',
                'percent'   => null,
                'state'     => $current > 0 ? 'new' : 'none',
            ];
        }

        $delta = ( ( $current - $previous ) / $previous ) * 100;

        return [
            'direction' => $delta > 0 ? 'up' : ( $delta < 0 ? 'down' : 'flat' ),
            'percent'   => abs( round( $delta ) ),
        ];
    }
}
