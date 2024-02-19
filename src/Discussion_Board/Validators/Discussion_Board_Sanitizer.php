<?php

namespace WeDevs\PM\Discussion_Board\Validators;

use WeDevs\PM\Core\Sanitizer\Abstract_Sanitizer;

class Discussion_Board_Sanitizer extends Abstract_Sanitizer {
	public function filters() {
        return [
            'title'            => 'trimer|sanitize_text_field',
            'description'      => 'trimer|pm_kses',
            'status'           => 'trimer',
        ];
    }
}
