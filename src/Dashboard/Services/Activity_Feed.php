<?php

namespace WeDevs\PM\Dashboard\Services;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Carbon\Carbon;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\Common\Models\Board;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Common\Models\Meta;
use WeDevs\PM\File\Models\File;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\User\Helper\Avatar;

/**
 * Dashboard "Recent Activity" feed.
 *
 * Only real work is listed (an allowlist of action keys), every line is a
 * translated phrase, and each line carries the item it opens. Rows about
 * private tasks, lists, milestones, discussions or files are left out for
 * viewers without the matching view_private_* capability, and deletes are
 * shown to managers only.
 */
class Activity_Feed {

    /** Rows read per round; rounds stop once enough visible rows are found. */
    const BATCH = 30;

    const ROUNDS = 4;

    /** @var int */
    protected $user_id;

    /** @var bool */
    protected $is_admin;

    /** @var array|null project ids in scope, null = every project */
    protected $project_ids;

    protected $tasks        = [];
    protected $task_lists   = [];
    protected $boards       = [];
    protected $files        = [];
    protected $private      = [];
    protected $capabilities = [];

    public function __construct( $user_id, $is_admin, $project_ids = null ) {
        $this->user_id     = (int) $user_id;
        $this->is_admin    = (bool) $is_admin;
        $this->project_ids = $project_ids;
    }

    /**
     * Latest visible entries, newest first.
     *
     * @param int $days  Window in days.
     * @param int $limit Entries to return.
     * @return array
     */
    public function items( $days = 7, $limit = 10 ) {
        $definitions = $this->definitions();
        $from        = Carbon::today()->subDays( (int) $days )->toDateTimeString();
        $items       = [];

        for ( $round = 0; $round < self::ROUNDS && count( $items ) < $limit; $round++ ) {
            $query = Activity::with( [ 'actor', 'project' ] )
                ->whereIn( 'action', array_keys( $definitions ) )
                ->where( 'created_at', '>=', $from )
                ->orderBy( 'created_at', 'DESC' )
                ->orderBy( 'id', 'DESC' )
                ->skip( $round * self::BATCH )
                ->take( self::BATCH );

            if ( null !== $this->project_ids ) {
                $query->whereIn( 'project_id', empty( $this->project_ids ) ? [ 0 ] : $this->project_ids );
            }

            $rows = $query->get();

            $this->prime( $rows, $definitions );

            foreach ( $rows as $row ) {
                $item = $this->item( $row, $definitions[ $row->action ] );

                if ( $item ) {
                    $items[] = $item;
                }

                if ( count( $items ) >= $limit ) {
                    break;
                }
            }

            if ( $rows->count() < self::BATCH ) {
                break;
            }
        }

        return $items;
    }

    /**
     * Action key => [ resource type, phrase, flag ]. The phrase has one %s for
     * the item title. Flags: delete (managers only, never clickable), managers
     * (managers only). Budget, pay rate, colour, permission changes and comment
     * or reply deletes are left out on purpose.
     *
     * @return array
     */
    protected function definitions() {
        $definitions = [
            /* translators: %s: task title */
            'create_task'                        => [ 'task', __( 'created the task %s', 'wedevs-project-manager' ) ],
            /* translators: %s: new task title */
            'update_task_title'                  => [ 'task', __( 'renamed a task to %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task title */
            'update_task_description'            => [ 'task', __( 'updated the description of %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task title */
            'update_task_status'                 => [ 'task', __( 'completed the task %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task title */
            'update_task_priority'               => [ 'task', __( 'changed the priority of %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task title */
            'update_task_complexity'             => [ 'task', __( 'changed the complexity of %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task title */
            'update_task_estimation'             => [ 'task', __( 'changed the estimate of %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task title */
            'update_task_due_date'               => [ 'task', __( 'changed the due date of %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task title */
            'update_task_start_at_date'          => [ 'task', __( 'changed the start date of %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task title */
            'update_task_recurrent'              => [ 'task', __( 'changed the recurring setting of %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task title */
            'update_task_payable_status'         => [ 'task', __( 'changed the payable status of %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task title */
            'delete_task'                        => [ 'task', __( 'deleted the task %s', 'wedevs-project-manager' ), 'delete' ],
            /* translators: %s: task title */
            'attach_drive_file'                  => [ 'task', __( 'attached a Google Drive file to %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task title */
            'detach_drive_file'                  => [ 'task', __( 'removed a Google Drive file from %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task or discussion title */
            'create_meet'                        => [ '', __( 'started a Google Meet meeting on %s', 'wedevs-project-manager' ) ],

            /* translators: %s: task list title */
            'create_task_list'                   => [ 'task_list', __( 'created the list %s', 'wedevs-project-manager' ) ],
            /* translators: %s: new task list title */
            'update_task_list_title'             => [ 'task_list', __( 'renamed a list to %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task list title */
            'update_task_list_description'       => [ 'task_list', __( 'updated the description of %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task list title */
            'update_task_list_order'             => [ 'task_list', __( 'reordered the list %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task list title */
            'archived_task_list'                 => [ 'task_list', __( 'archived the list %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task list title */
            'restore_task_list'                  => [ 'task_list', __( 'restored the list %s', 'wedevs-project-manager' ) ],
            /* translators: %s: task list title */
            'delete_task_list'                   => [ 'task_list', __( 'deleted the list %s', 'wedevs-project-manager' ), 'delete' ],
            /* translators: %s: title of the new task list */
            'duplicate_list'                     => [ 'task_list', __( 'duplicated a list as %s', 'wedevs-project-manager' ), 'managers' ],

            /* translators: %s: milestone title */
            'create_milestone'                   => [ 'milestone', __( 'created the milestone %s', 'wedevs-project-manager' ) ],
            /* translators: %s: new milestone title */
            'update_milestone_title'             => [ 'milestone', __( 'renamed a milestone to %s', 'wedevs-project-manager' ) ],
            /* translators: %s: milestone title */
            'update_milestone_description'       => [ 'milestone', __( 'updated the description of %s', 'wedevs-project-manager' ) ],
            /* translators: %s: milestone title */
            'update_milestone_order'             => [ 'milestone', __( 'reordered the milestone %s', 'wedevs-project-manager' ) ],
            /* translators: %s: milestone title */
            'delete_milestone'                   => [ 'milestone', __( 'deleted the milestone %s', 'wedevs-project-manager' ), 'delete' ],

            /* translators: %s: discussion title */
            'create_discussion_board'            => [ 'discussion_board', __( 'started the discussion %s', 'wedevs-project-manager' ) ],
            /* translators: %s: new discussion title */
            'update_discussion_board_title'      => [ 'discussion_board', __( 'renamed a discussion to %s', 'wedevs-project-manager' ) ],
            /* translators: %s: discussion title */
            'update_discussion_board_description' => [ 'discussion_board', __( 'updated the description of %s', 'wedevs-project-manager' ) ],
            /* translators: %s: discussion title */
            'update_discussion_board_order'      => [ 'discussion_board', __( 'reordered the discussion %s', 'wedevs-project-manager' ) ],
            /* translators: %s: discussion title */
            'delete_discussion_board'            => [ 'discussion_board', __( 'deleted the discussion %s', 'wedevs-project-manager' ), 'delete' ],

            /* translators: %s: project title */
            'create_project'                     => [ 'project', __( 'created the project %s', 'wedevs-project-manager' ) ],
            /* translators: %s: new project title */
            'update_project_title'               => [ 'project', __( 'renamed a project to %s', 'wedevs-project-manager' ) ],
            /* translators: %s: project title */
            'update_project_description'         => [ 'project', __( 'updated the description of %s', 'wedevs-project-manager' ) ],
            /* translators: %s: project title */
            'update_project_status'              => [ 'project', __( 'changed the status of %s', 'wedevs-project-manager' ) ],
            /* translators: %s: project title */
            'update_project_est_completion_date' => [ 'project', __( 'changed the estimated completion date of %s', 'wedevs-project-manager' ) ],
            /* translators: %s: title of the new project */
            'duplicate_project'                  => [ 'project', __( 'duplicated a project as %s', 'wedevs-project-manager' ), 'managers' ],
        ];

        $comment_phrases = [
            /* translators: %s: title of the commented item */
            'comment_on_'              => __( 'commented on %s', 'wedevs-project-manager' ),
            /* translators: %s: title of the commented item */
            'update_comment_on_'       => __( 'edited a comment on %s', 'wedevs-project-manager' ),
            /* translators: %s: title of the commented item */
            'reply_comment_on_'        => __( 'replied to a comment on %s', 'wedevs-project-manager' ),
            /* translators: %s: title of the commented item */
            'update_reply_comment_on_' => __( 'edited a reply on %s', 'wedevs-project-manager' ),
        ];

        foreach ( [ 'task', 'task_list', 'milestone', 'discussion_board', 'file', 'project' ] as $type ) {
            foreach ( $comment_phrases as $prefix => $phrase ) {
                $definitions[ $prefix . $type ] = [ $type, $phrase ];
            }
        }

        return apply_filters( 'pm_dashboard_activity_actions', $definitions );
    }

    /**
     * Load the items the rows point at in a few queries, so privacy and
     * existence checks do not query per row.
     */
    protected function prime( $rows, $definitions ) {
        $ids = [ 'task' => [], 'board' => [], 'file' => [] ];

        foreach ( $rows as $row ) {
            $type = $this->resource_type( $row, $definitions[ $row->action ] );
            $id   = (int) $row->resource_id;

            if ( 'task' === $type ) {
                $ids['task'][] = $id;
            } elseif ( in_array( $type, [ 'task_list', 'milestone', 'discussion_board' ], true ) ) {
                $ids['board'][] = $id;
            } elseif ( 'file' === $type ) {
                $ids['file'][] = $id;
            }
        }

        $task_ids = array_diff( array_unique( $ids['task'] ), array_keys( $this->tasks ) );

        if ( $task_ids ) {
            foreach ( Task::whereIn( 'id', $task_ids )->get( [ 'id', 'title', 'is_private', 'project_id' ] ) as $task ) {
                $this->tasks[ (int) $task->id ] = $task;
            }

            $links = Boardable::whereIn( 'boardable_id', $task_ids )
                ->where( 'boardable_type', 'task' )
                ->where( 'board_type', 'task_list' )
                ->get( [ 'board_id', 'boardable_id' ] );

            foreach ( $links as $link ) {
                $this->task_lists[ (int) $link->boardable_id ] = (int) $link->board_id;
                $ids['board'][] = (int) $link->board_id;
            }
        }

        $board_ids = array_diff( array_unique( $ids['board'] ), array_keys( $this->boards ) );

        if ( $board_ids ) {
            foreach ( Board::whereIn( 'id', $board_ids )->get( [ 'id', 'title', 'type', 'project_id' ] ) as $board ) {
                $this->boards[ (int) $board->id ] = $board;
            }

            $this->prime_private( 'board', $board_ids, [ 'task_list', 'milestone', 'discussion_board' ], 'privacy' );
        }

        $file_ids = array_diff( array_unique( $ids['file'] ), array_keys( $this->files ) );

        if ( $file_ids ) {
            foreach ( File::whereIn( 'id', $file_ids )->pluck( 'id' )->all() as $file_id ) {
                $this->files[ (int) $file_id ] = true;
            }

            $this->prime_private( 'file', $file_ids, [ 'file' ], 'private' );
        }
    }

    protected function prime_private( $group, $ids, $entity_types, $meta_key ) {
        $private = Meta::whereIn( 'entity_id', $ids )
            ->whereIn( 'entity_type', $entity_types )
            ->where( 'meta_key', $meta_key )
            ->where( 'meta_value', 1 )
            ->pluck( 'entity_id' )
            ->all();

        foreach ( $private as $id ) {
            $this->private[ $group . ':' . (int) $id ] = true;
        }
    }

    protected function resource_type( $row, $definition ) {
        if ( '' !== $definition[0] ) {
            return $definition[0];
        }

        $type = (string) $row->resource_type;

        return in_array( $type, [ 'task', 'discussion_board' ], true ) ? $type : '';
    }

    protected function item( $row, $definition ) {
        $type       = $this->resource_type( $row, $definition );
        $flag       = isset( $definition[2] ) ? $definition[2] : '';
        $project_id = (int) $row->project_id;
        $manager    = $this->manages( $project_id );

        if ( '' === $type || ( $flag && ! $manager ) ) {
            return null;
        }

        // duplicate_list stores the project id as its resource id, so it can
        // only open the project's lists.
        $id     = 'duplicate_list' === $row->action ? 0 : (int) $row->resource_id;
        $exists = $id ? $this->exists( $type, $id, $row ) : 'duplicate_list' === $row->action;

        // A removed item's privacy is unknown, so only managers see lines about it.
        if ( ( ! $exists && ! $manager ) || ( $exists && $id && ! $this->visible( $type, $id, $project_id ) ) ) {
            return null;
        }

        $meta     = is_array( $row->meta ) ? $row->meta : [];
        $title    = $this->title( $type, $id, $row, $meta, $exists );
        $template = $definition[1];

        $completed = isset( $meta['task_status_new'] ) && in_array( (string) $meta['task_status_new'], [ '1', 'complete' ], true );

        if ( 'update_task_status' === $row->action && ! $completed ) {
            /* translators: %s: task title */
            $template = __( 'reopened the task %s', 'wedevs-project-manager' );
        }

        $clickable = $exists && 'delete' !== $flag;
        $actor     = $row->actor ? $row->actor->display_name : __( 'Someone', 'wedevs-project-manager' );

        return [
            'id'              => absint( $row->id ),
            'actor'           => $actor,
            'actor_id'        => absint( $row->actor_id ),
            'avatar_url'      => $row->actor_id ? Avatar::get_url( $row->actor_id ) : '',
            'action'          => sprintf( $template, $title ),
            'action_template' => $template,
            'action_key'      => (string) $row->action,
            'resource_type'   => $type,
            'resource_id'     => $clickable ? $id : 0,
            'resource_title'  => $title,
            'clickable'       => $clickable,
            'list_id'         => ( 'task' === $type && isset( $this->task_lists[ $id ] ) ) ? $this->task_lists[ $id ] : 0,
            'project'         => $row->project ? $row->project->title : '',
            'project_id'      => $project_id,
            'task_id'         => ( $clickable && 'task' === $type ) ? $id : 0,
            'time'            => $this->human_time( $row->created_at ),
            'created_at'      => $row->created_at ? Carbon::parse( $row->created_at )->toIso8601String() : '',
        ];
    }

    protected function exists( $type, $id, $row ) {
        switch ( $type ) {
            case 'task':
                return isset( $this->tasks[ $id ] );

            case 'task_list':
            case 'milestone':
            case 'discussion_board':
                return isset( $this->boards[ $id ] ) && $type === $this->boards[ $id ]->type;

            case 'file':
                return isset( $this->files[ $id ] );

            case 'project':
                return (bool) $row->project;
        }

        return false;
    }

    protected function visible( $type, $id, $project_id ) {
        $caps = [
            'task_list'        => 'view_private_list',
            'milestone'        => 'view_private_milestone',
            'discussion_board' => 'view_private_message',
            'file'             => 'view_private_file',
        ];

        if ( 'task' === $type ) {
            if ( 1 === (int) $this->tasks[ $id ]->is_private && ! $this->can( 'view_private_task', $project_id ) ) {
                return false;
            }

            $list_id = isset( $this->task_lists[ $id ] ) ? $this->task_lists[ $id ] : 0;

            return ! $list_id || ! isset( $this->private[ 'board:' . $list_id ] ) || $this->can( 'view_private_list', $project_id );
        }

        if ( ! isset( $caps[ $type ] ) ) {
            return true;
        }

        $group = 'file' === $type ? 'file' : 'board';

        return ! isset( $this->private[ $group . ':' . $id ] ) || $this->can( $caps[ $type ], $project_id );
    }

    protected function title( $type, $id, $row, $meta, $exists ) {
        if ( $exists ) {
            if ( 'task' === $type ) {
                return (string) $this->tasks[ $id ]->title;
            }

            if ( isset( $this->boards[ $id ] ) ) {
                return (string) $this->boards[ $id ]->title;
            }

            if ( 'project' === $type && 'duplicate_project' !== $row->action ) {
                return (string) $row->project->title;
            }
        }

        foreach ( [ "{$type}_title_new", "new_{$type}_title", "{$type}_title", "deleted_{$type}_title" ] as $key ) {
            if ( ! empty( $meta[ $key ] ) && is_scalar( $meta[ $key ] ) ) {
                return (string) $meta[ $key ];
            }
        }

        return __( '(untitled)', 'wedevs-project-manager' );
    }

    protected function manages( $project_id ) {
        if ( $this->is_admin ) {
            return true;
        }

        $key = 'manage:' . $project_id;

        if ( ! isset( $this->capabilities[ $key ] ) ) {
            $this->capabilities[ $key ] = wedevs_pm_has_manage_capability( $this->user_id )
                || wedevs_pm_is_manager( $project_id, $this->user_id );
        }

        return $this->capabilities[ $key ];
    }

    protected function can( $cap, $project_id ) {
        if ( $this->is_admin ) {
            return true;
        }

        $key = $cap . ':' . $project_id;

        if ( ! isset( $this->capabilities[ $key ] ) ) {
            $this->capabilities[ $key ] = (bool) wedevs_pm_user_can( $cap, $project_id, $this->user_id );
        }

        return $this->capabilities[ $key ];
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
}
