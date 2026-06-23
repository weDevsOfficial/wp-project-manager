<?php

namespace WeDevs\PM\Dashboard\Controllers;

use WP_REST_Request;
use Carbon\Carbon;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\User\Models\User_Role;
use WeDevs\PM\User\Helper\Avatar;

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

    /**
     * Resolve the caller's scope once per request. Three tiers:
     *   - admin   → full organisation (all projects, all tasks)
     *   - manager → only their projects, all tasks within them
     *   - member  → only their projects, and only tasks assigned to them
     */
    protected function boot() {
        $this->user_id    = get_current_user_id();
        $this->is_admin   = wedevs_pm_has_admin_capability();
        $this->is_manager = wedevs_pm_has_manage_capability();

        // Everyone except a full admin is limited to the projects they belong to.
        if ( ! $this->is_admin ) {
            $this->project_ids = $this->scoped_project_ids();
        }
    }

    public function index( WP_REST_Request $request ) {
        $this->boot();

        // Performance chart window — 7 / 30 days (default 7).
        $range = (int) $request->get_param( 'range' );
        $days  = in_array( $range, [ 7, 30 ], true ) ? $range : 7;

        $data = [
            'user'              => $this->user_block(),
            'range'             => $days,
            'kpis'              => $this->kpis(),
            'projects_status'   => $this->projects_status(),
            'performance'       => $this->performance( $days ),
            'task_distribution' => $this->task_distribution(),
            'upcoming'          => $this->upcoming_tasks(),
            'overdue_list'      => $this->overdue_tasks(),
            'calendar'          => $this->calendar_month(),
            'active_projects'   => $this->active_projects(),
            'recent_activity'   => $this->recent_activity(),
            'milestones'        => $this->upcoming_milestones(),
            'team'              => ( $this->is_admin || $this->is_manager ) ? $this->team_status() : [],
            'generated_at'      => current_time( 'mysql' ),
        ];

        return rest_ensure_response( [ 'data' => $data ] );
    }

    // ──────────────────────────────────────────────────────────────────
    // Scope helpers
    // ──────────────────────────────────────────────────────────────────

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

        // Manager + member: limit to their projects.
        $query->whereIn( 'project_id', $this->scope_ids() );

        // Member only: further limit to tasks assigned to them.
        if ( ! $this->is_manager ) {
            $query->whereHas( 'assignees', function ( $a ) {
                $a->where( 'assigned_to', $this->user_id );
            } );
        }

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
        } else {
            $role_label = __( 'Team Member', 'wedevs-project-manager' );
        }

        return [
            'id'         => $this->user_id,
            'name'       => $user->display_name,
            'role_label' => $role_label,
            'avatar_url' => Avatar::get_url( $this->user_id ),
        ];
    }

    protected function kpis() {
        $today = Carbon::today();

        $total       = (clone $this->task_query())->count();
        $completed   = (clone $this->task_query())->where( 'status', Task::COMPLETE )->count();
        $in_progress = (clone $this->task_query())->where( 'status', Task::INCOMPLETE )->count();
        $pending     = (clone $this->task_query())->where( 'status', Task::PENDING )->count();
        $overdue     = (clone $this->task_query())
            ->where( 'status', '!=', Task::COMPLETE )
            ->whereNotNull( 'due_date' )
            ->whereDate( 'due_date', '<', $today )
            ->count();

        // Trend: tasks completed in the last 7 days vs the prior 7 days.
        $this_week = (clone $this->task_query())
            ->where( 'status', Task::COMPLETE )
            ->whereDate( 'completed_at', '>=', $today->copy()->subDays( 7 ) )
            ->count();
        $last_week = (clone $this->task_query())
            ->where( 'status', Task::COMPLETE )
            ->whereDate( 'completed_at', '>=', $today->copy()->subDays( 14 ) )
            ->whereDate( 'completed_at', '<', $today->copy()->subDays( 7 ) )
            ->count();

        return [
            'total_tasks'     => $total,
            'completed'       => $completed,
            'in_progress'     => $in_progress,
            'pending'         => $pending,
            'overdue'         => $overdue,
            'completion_rate' => $total > 0 ? round( ( $completed / $total ) * 100 ) : 0,
            'completed_trend' => $this->trend( $this_week, $last_week ),
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

        foreach ( $projects as $p ) {
            if ( (int) $p->status === Project::COMPLETE ) {
                $completed++;
            } elseif ( (int) $p->status === Project::ARCHIVED ) {
                $archived++;
            } elseif ( $p->overdue_count > 0 ) {
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

    /**
     * Created vs completed parent tasks per day over the requested window
     * (7 or 30 days) for the bar chart.
     */
    protected function performance( $days = 7 ) {
        $rows  = [];
        $label = $days > 7 ? 'M j' : 'D';

        for ( $i = $days - 1; $i >= 0; $i-- ) {
            $day   = Carbon::today()->subDays( $i );
            $start = $day->copy()->startOfDay();
            $end   = $day->copy()->endOfDay();

            $created = (clone $this->task_query())
                ->whereBetween( 'created_at', [ $start, $end ] )
                ->count();

            $completed = (clone $this->task_query())
                ->where( 'status', Task::COMPLETE )
                ->whereBetween( 'completed_at', [ $start, $end ] )
                ->count();

            $rows[] = [
                'label'     => $day->format( $label ),
                'date'      => $day->format( 'Y-m-d' ),
                'created'   => $created,
                'completed' => $completed,
            ];
        }

        return $rows;
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
            ->limit( 6 )
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
     * Activity counts per day (productivity heatmap).
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

        $query = \WeDevs\PM\Activity\Models\Activity::query()
            ->where( 'created_at', '>=', $start->copy()->startOfDay() )
            ->where( 'created_at', '<=', $end->copy()->endOfDay() );

        if ( ! $this->is_admin ) {
            $query->whereIn( 'project_id', $this->scope_ids() );
        }

        $rows = $query->get( [ 'created_at' ] );

        $counts = [];
        foreach ( $rows as $r ) {
            $d = Carbon::parse( $r->created_at )->format( 'Y-m-d' );
            $counts[ $d ] = isset( $counts[ $d ] ) ? $counts[ $d ] + 1 : 1;
        }

        $days   = [];
        $total  = 0;
        $cursor = $start->copy();
        while ( $cursor->lte( $end ) ) {
            $d = $cursor->format( 'Y-m-d' );
            $c = isset( $counts[ $d ] ) ? $counts[ $d ] : 0;
            $days[] = [ 'date' => $d, 'count' => $c ];
            if ( $c > 0 ) {
                $total++;
            }
            $cursor->addDay();
        }

        return [
            'days'          => $days,
            'active_days'   => $total,
            'selected_year' => $year,
            'years'         => $this->heatmap_years(),
        ];
    }

    /** Distinct years that have activity in scope (desc), incl. current year. */
    protected function heatmap_years() {
        $query = \WeDevs\PM\Activity\Models\Activity::query();

        if ( ! $this->is_admin ) {
            $query->whereIn( 'project_id', $this->scope_ids() );
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
        return [
            'completed'   => (clone $this->task_query())->where( 'status', Task::COMPLETE )->count(),
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
            ->limit( 6 )
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
    protected function recent_activity() {
        $query = \WeDevs\PM\Activity\Models\Activity::with( [ 'actor', 'project' ] )
            ->orderBy( 'created_at', 'DESC' );

        if ( ! $this->is_admin ) {
            $query->whereIn( 'project_id', $this->scope_ids() );
        }

        $items = $query->limit( 10 )->get();

        return $items->map( function ( $a ) {
            $actor = $a->actor ? $a->actor->display_name : __( 'Someone', 'wedevs-project-manager' );

            return [
                'id'         => absint( $a->id ),
                'actor'      => $actor,
                'avatar_url' => $a->actor_id ? Avatar::get_url( $a->actor_id ) : '',
                'action'     => $this->humanize_action( (string) $a->action, (string) $a->action_type ),
                'project'    => $a->project ? $a->project->title : '',
                'time'       => $this->human_time( $a->created_at ),
            ];
        } )->all();
    }

    /**
     * Upcoming, not-yet-complete milestones with completion progress.
     */
    protected function upcoming_milestones() {
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

        $rows = [];
        foreach ( $milestones as $m ) {
            $achieve = $m->achieve_date; // Carbon|null via accessor
            $total   = (int) $m->total_tasks;
            $done    = (int) $m->completed_tasks;

            $rows[] = [
                'id'        => absint( $m->id ),
                'title'     => $m->title,
                'project'   => $m->project ? $m->project->title : '',
                'due_date'  => $achieve ? $achieve->format( 'M j, Y' ) : null,
                'ts'        => $achieve ? $achieve->timestamp : PHP_INT_MAX,
                'progress'  => $total > 0 ? (int) round( ( $done / $total ) * 100 ) : 0,
            ];
        }

        usort( $rows, function ( $a, $b ) {
            return $a['ts'] <=> $b['ts'];
        } );

        $rows = array_slice( $rows, 0, 5 );
        foreach ( $rows as &$r ) {
            unset( $r['ts'] );
        }

        return $rows;
    }

    /**
     * Turn raw activity action keys (e.g. "create_task" / "create") into a
     * readable phrase like "created a task".
     */
    protected function humanize_action( $action, $action_type ) {
        $source = $action ?: $action_type;
        $parts  = explode( '_', $source );
        $verb   = array_shift( $parts );
        $noun   = trim( str_replace( '_', ' ', implode( ' ', $parts ) ) );

        $past = [
            'create'   => __( 'created', 'wedevs-project-manager' ),
            'update'   => __( 'updated', 'wedevs-project-manager' ),
            'delete'   => __( 'deleted', 'wedevs-project-manager' ),
            'complete' => __( 'completed', 'wedevs-project-manager' ),
            'new'      => __( 'added', 'wedevs-project-manager' ),
            'add'      => __( 'added', 'wedevs-project-manager' ),
            'assign'   => __( 'assigned', 'wedevs-project-manager' ),
        ];

        $verb = isset( $past[ $verb ] ) ? $past[ $verb ] : $verb;

        return trim( $verb . ( $noun ? ' ' . $noun : '' ) );
    }

    protected function human_time( $datetime ) {
        if ( empty( $datetime ) ) {
            return '';
        }
        $ts = is_numeric( $datetime ) ? $datetime : strtotime( $datetime );
        return sprintf(
            /* translators: %s: human-readable time difference */
            __( '%s ago', 'wedevs-project-manager' ),
            human_time_diff( $ts, current_time( 'timestamp' ) )
        );
    }

    /**
     * Per-member active/completed task counts (managers only).
     */
    protected function team_status() {
        // Admin → all projects; manager → their projects (project_query scopes it).
        $project_ids = (clone $this->project_query())->pluck( 'id' )->all();

        if ( empty( $project_ids ) ) {
            return [];
        }

        $members = User_Role::whereIn( 'project_id', $project_ids )
            ->distinct()
            ->pluck( 'user_id' )
            ->map( 'absint' )
            ->take( 12 )
            ->all();

        $team = [];

        foreach ( $members as $uid ) {
            $base = Task::parent()
                ->whereIn( 'project_id', $project_ids )
                ->whereHas( 'assignees', function ( $a ) use ( $uid ) {
                    $a->where( 'assigned_to', $uid );
                } );

            $active    = (clone $base)->where( 'status', '!=', Task::COMPLETE )->count();
            $completed = (clone $base)->where( 'status', Task::COMPLETE )->count();

            if ( $active === 0 && $completed === 0 ) {
                continue;
            }

            $wp_user = get_userdata( $uid );
            if ( ! $wp_user ) {
                continue;
            }

            $team[] = [
                'id'         => $uid,
                'name'       => $wp_user->display_name,
                'avatar_url' => Avatar::get_url( $uid ),
                'active'     => $active,
                'completed'  => $completed,
            ];
        }

        // Busiest first.
        usort( $team, function ( $a, $b ) {
            return $b['active'] <=> $a['active'];
        } );

        return array_slice( $team, 0, 8 );
    }

    protected function trend( $current, $previous ) {
        if ( $previous <= 0 ) {
            return [
                'direction' => $current > 0 ? 'up' : 'flat',
                'percent'   => $current > 0 ? 100 : 0,
            ];
        }

        $delta = ( ( $current - $previous ) / $previous ) * 100;

        return [
            'direction' => $delta > 0 ? 'up' : ( $delta < 0 ? 'down' : 'flat' ),
            'percent'   => abs( round( $delta ) ),
        ];
    }
}
