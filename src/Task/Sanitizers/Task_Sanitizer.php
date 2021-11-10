<?php

namespace WeDevs\PM\Task\Sanitizers;

use WeDevs\PM\Core\Sanitizer\Abstract_Sanitizer;

class Task_Sanitizer extends Abstract_Sanitizer {
	public function filters() {
        return [
            'title'       => 'trimer|sanitize_text_field',
            'description' => 'trimer|pm_kses',
        ];
    }
}
