<?php

namespace WeDevs\PM\Kanban;

if ( ! defined( 'ABSPATH' ) ) { exit; }

use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Kanban\Controllers\Kanboard_Controller;

/**
 * Kanban (Kanboard) feature bootstrap.
 *
 * Moved from the Pro plugin's Kanboard module into Free core. Routes auto-load
 * from routes/kanban.php; this class only wires the task lifecycle hooks the
 * board relies on. Data lives in the shared pm_boards / pm_boardables / pm_meta
 * tables (board type "kanboard").
 */
class Kanban {

    public function __construct() {
        add_action( 'wedevs_pm_after_create_task', [ Kanboard_Controller::class, 'after_create_task' ], 10, 2 );
        add_action( 'wedevs_pm_changed_task_status', [ Kanboard_Controller::class, 'before_change_task_status' ], 10, 3 );
        add_action( 'wedevs_pm_after_new_comment', [ Kanboard_Controller::class, 'after_new_comment' ], 10, 2 );
        add_action( 'wedevs_pm_after_create_task', [ $this, 'attach_task_to_board' ], 10, 2 );
    }

    /**
     * When a task is created with a target kanban column (kan_board_id), drop it
     * onto that column as the next card.
     */
    public function attach_task_to_board( $task, $request ) {
        if ( empty( $request['kan_board_id'] ) ) {
            return;
        }

        $kanboard_id = $request['kan_board_id'];

        $boardable = Boardable::where( 'board_id', $kanboard_id )
            ->where( 'board_type', 'kanboard' )
            ->where( 'boardable_type', 'task' )
            ->orderBy( 'order', 'DESC' )
            ->first();

        $order = $boardable ? $boardable->order + 1 : 0;

        Boardable::create( [
            'board_id'       => $kanboard_id,
            'board_type'     => 'kanboard',
            'boardable_id'   => $task->id,
            'boardable_type' => 'task',
            'order'          => $order,
        ] );
    }
}
