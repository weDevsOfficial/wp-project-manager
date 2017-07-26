<?php

namespace Wprl\Core\Database;

use Wprl\Core\Database\Migration;

abstract class Abstract_Migration implements Migration {
    public function run() {
        $this->schema();
    }

    abstract public function schema();
}