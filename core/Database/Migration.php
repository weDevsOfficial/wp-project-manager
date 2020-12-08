<?php

namespace WeDevs\PM\Core\Database;

interface Migration {
    public function schema();
    public function run();
}