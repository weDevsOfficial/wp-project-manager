<?php

namespace CPM\Foo\Sanitizers;

use Wprl\Core\Sanitizer\Abstract_Sanitizer;

class Foo_Sanitizer extends Abstract_Sanitizer {
    public function filters() {
        return [
            'id' => 'absolute',
        ];
    }
}