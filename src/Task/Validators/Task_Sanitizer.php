<?php

namespace WeDevs\PM\Task\Validators;

use WeDevs\PM\Core\Sanitizer\Abstract_Sanitizer;

class Task_Sanitizer extends Abstract_Sanitizer {
	public function filters() {
        return [
            'description' => 'pm_kses',
        ];
    }
}
