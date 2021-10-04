<?php

namespace WeDevs\PM\File\Sanitizers;

use WeDevs\PM\Core\Sanitizer\Abstract_Sanitizer;

class File_Sanitizer extends Abstract_Sanitizer {
	public function filters() {
        return [
            'title'       => 'trimer|pm_kses',
            'description' => 'trimer|pm_kses',
            'type'        => 'trimer|pm_kses',
        ];
    }
}
