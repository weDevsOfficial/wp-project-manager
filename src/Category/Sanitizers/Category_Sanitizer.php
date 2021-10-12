<?php

namespace WeDevs\PM\Category\Sanitizers;

use WeDevs\PM\Core\Sanitizer\Abstract_Sanitizer;

class Category_Sanitizer extends Abstract_Sanitizer {
	public function filters() {
        return [
            'title'       => 'trimer|pm_kses',
            'description' => 'trimer|pm_kses',
        ];
    }
}
