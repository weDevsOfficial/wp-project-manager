<?php

namespace WeDevs\PM\Settings\Sanitizers;

use WeDevs\PM\Core\Sanitizer\Abstract_Sanitizer;

class Task_Type_Sanitizer extends Abstract_Sanitizer {
	public function filters() {
        return [
            'title'       => 'trimer|sanitize_text_field',
            'description' => 'trimer|sanitize_text_field',
        ];
    }
}
