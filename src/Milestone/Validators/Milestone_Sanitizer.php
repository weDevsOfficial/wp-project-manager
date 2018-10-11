<?php

namespace WeDevs\PM\Milestone\Validators;

use WeDevs\PM\Core\Sanitizer\Abstract_Sanitizer;

class Milestone_Sanitizer extends Abstract_Sanitizer {
	public function filters() {
        return [
            'description' => 'pm_kses',
        ];
    }
}
