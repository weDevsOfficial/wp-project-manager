<?php

namespace WeDevs\PM\Milestone\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\Task_List\Models\Task_List;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Common\Models\Meta;
use Carbon\Carbon;
use WeDevs\PM\Discussion_Board\Models\Discussion_Board;

class Milestone extends Eloquent {

    use Model_Events;

    protected $table = 'pm_boards';

    const OVERDUE    = 0;
    const INCOMPLETE = 1;
    const COMPLETE   = 2;

    protected $fillable = [
        'title',
        'description',
        'order',
        'status',
        'is_private',
        'project_id',
        'created_by',
        'updated_by',
    ];

    protected $attributes = ['type' => 'milestone'];

    public static $status = [
        0 => 'overdue',
        1 => 'incomplete',
        2 => 'complete',
    ];

    public function newQuery( $except_deleted = true ) {
        return parent::newQuery( $except_deleted )->where( 'type', '=', 'milestone' );
    }

    public function getAchieveDateAttribute() {
    	if( $this->achieve_date_field ) {
    		return wedevs_pm_make_carbon_date( $this->achieve_date_field->meta_value );
    	}
    }

    public function setStatusAttribute( $value ) {

        $value = strtolower( $value );
        $key   = array_search( $value, self::$status );

        if ( array_key_exists( $value, self::$status ) ) {
            $this->attributes['status'] = $value;
        } else {
            $this->attributes['status'] = $key;
        }
    }

    public function getStatusAttribute( $value ) {
        $value = (int) $value;

        if ( array_key_exists( $value, self::$status ) ) {
            return self::$status[(int) $value];
        }

        return self::$status[0];
    }

    public function metas() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Meta', 'entity_id' )
            ->where( 'entity_type', 'milestone' );
    }

    public function achieve_date_field() {
        return $this->belongsTo( 'WeDevs\PM\Common\Models\Meta', 'id', 'entity_id' )
            ->where( 'entity_type', 'milestone' )
            ->where( 'meta_key', 'achieve_date' );
    }

    public function task_lists() {
        return $this->belongsToMany( 'WeDevs\PM\Task_List\Models\Task_List', wedevs_pm_tb_prefix() . 'pm_boardables', 'board_id', 'boardable_id' )
            ->where( 'boardable_type', 'task_list' )
            ->where( 'board_type', 'milestone' );
    }

    public function tasks() {
        return $this->belongsToMany( 'WeDevs\PM\Task\Models\Task', wedevs_pm_tb_prefix() . 'pm_boardables', 'board_id', 'boardable_id' )
            ->where( 'boardable_type', 'task' )
            ->where( 'board_type', 'milestone' );
    }

    public function boardables() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Boardable', 'board_id' )->where( 'board_type', 'milestone' );
    }

    public function discussion_boards() {
        return $this->belongsToMany( 'WeDevs\PM\Discussion_Board\Models\Discussion_Board', wedevs_pm_tb_prefix() . 'pm_boardables', 'board_id', 'boardable_id' )
            ->where( 'board_type', 'milestone' )
            ->where( 'boardable_type', 'discussion_board' );
    }

    public function project() {
        return $this->belongsTo( 'WeDevs\PM\Project\Models\Project', 'project_id' );
    }

    /**
     * Get task counts across all linked task lists.
     * Uses direct SQL to avoid Eloquent collection type-mismatch issues.
     * Cached per-request to avoid duplicate queries from progress/health.
     *
     * @return array{total: int, completed: int}
     */
    public function getTaskCountAttribute() {
        if ( isset( $this->_task_count_cache ) ) {
            return $this->_task_count_cache;
        }

        global $wpdb;

        $tb_tasks      = esc_sql( wedevs_pm_tb_prefix() . 'pm_tasks' );
        $tb_boardables = esc_sql( wedevs_pm_tb_prefix() . 'pm_boardables' );

        $list_ids = $this->task_lists->pluck( 'id' )->toArray();

        if ( empty( $list_ids ) ) {
            $this->_task_count_cache = [ 'total' => 0, 'completed' => 0 ];
            return $this->_task_count_cache;
        }

        $list_ids      = array_map( 'intval', $list_ids );
        $placeholders  = implode( ', ', array_fill( 0, count( $list_ids ), '%d' ) );

        // Count tasks linked to these lists via boardables, parent_id=0 (exclude subtasks)
        // phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- table names are escaped above
        $results = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT
                    COUNT(*) as total,
                    SUM( CASE WHEN t.status = 1 THEN 1 ELSE 0 END ) as completed
                FROM {$tb_boardables} b
                INNER JOIN {$tb_tasks} t ON t.id = b.boardable_id
                WHERE b.board_id IN ({$placeholders})
                    AND b.board_type   = 'task_list'
                    AND b.boardable_type = 'task'
                    AND t.parent_id = 0",
                $list_ids
            )
        );
        // phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared

        $this->_task_count_cache = [
            'total'     => (int) ( $results->total ?? 0 ),
            'completed' => (int) ( $results->completed ?? 0 ),
        ];

        return $this->_task_count_cache;
    }

    /**
     * Computed progress percentage based on linked task list completion.
     * Derives from task_count to avoid duplicate queries.
     *
     * @return int 0-100
     */
    public function getProgressAttribute() {
        $counts = $this->task_count;

        if ( $counts['total'] === 0 ) {
            return 0;
        }

        return (int) round( ( $counts['completed'] / $counts['total'] ) * 100 );
    }

    /**
     * Computed health indicator based on date proximity and progress.
     *
     * @return string on-track|at-risk|overdue|completed|no-date
     */
    public function getHealthAttribute() {
        if ( $this->getOriginal( 'status' ) == self::COMPLETE ) {
            return 'completed';
        }

        $achieve_date = $this->achieve_date;

        if ( ! $achieve_date ) {
            return 'no-date';
        }

        $now = Carbon::now();

        if ( $achieve_date->isPast() ) {
            return 'overdue';
        }

        $progress       = $this->progress;
        $days_remaining = $now->diffInDays( $achieve_date, false );

        if ( $days_remaining <= 3 && $progress < 80 ) {
            return 'at-risk';
        }

        if ( $days_remaining <= 7 && $progress < 50 ) {
            return 'at-risk';
        }

        return 'on-track';
    }
}
