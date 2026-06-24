<?php
namespace WeDevs\PM\Kanban\Models;

use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Task\Models\Task;

class Kanboard_Boardable extends Boardable {

	public function tasks($project_id = false) {
		if ( $project_id ) {
			return $this->hasOne( 'WeDevs\PM\Task\Models\Task', 'id', 'boardable_id')
				->where( 'project_id', $project_id );
		}

		return $this->hasOne( 'WeDevs\PM\Task\Models\Task', 'id', 'boardable_id');
	}
}
