<?php

namespace WeDevs\PM\Pusher\core\Permissions;

use WeDevs\PM\Core\Permissions\Abstract_Permission;
use Reflection;
use WP_REST_Request;
use WeDevs\PM\Common\Models\Boardable;

class Kanboard extends Abstract_Permission {

    public function check() {

    	$board_id   = $this->request->get_param( 'board_id' );
        $project_id = $this->request->get_param( 'project_id' );
        $task_id    = $this->request->get_param( 'task_id' );

        $has_task = Boardable::where('board_id', $board_id)
            ->where('board_type', 'kanboard')
            ->where('boardable_id', $task_id)
            ->first();

        if ( $has_task ) {

            return new \WP_Error( 'time_status', __( "This task already exist in this board", "pm" ) );
        }

        return true;
    }
}
