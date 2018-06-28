<?php

namespace WeDevs\PM\Core\Database;

use WeDevs\PM\Core\Database\Migration;

abstract class Abstract_Migration implements Migration {
    public function run() {
        $this->schema();
    }

    abstract public function schema();
}