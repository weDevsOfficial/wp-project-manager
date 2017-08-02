<?php

namespace CPM\Core\Database;

use CPM\Core\Database\Migration;

abstract class Abstract_Migration implements Migration {
    public function run() {
        $this->schema();
    }

    abstract public function schema();
}