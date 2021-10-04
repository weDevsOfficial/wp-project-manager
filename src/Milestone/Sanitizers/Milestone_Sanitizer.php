<?php

namespace WeDevs\PM\Milestone\Sanitizers;

use WeDevs\PM\Core\Sanitizer\Abstract_Sanitizer;

class Milestone_Sanitizer extends Abstract_Sanitizer {
	public function filters() {
        return [
            'title'       => 'trimer|pm_kses',
            'description' => 'trimer|pm_kses',
        ];
    }
}
