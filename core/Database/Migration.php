<?php

namespace PM\Core\Database;

interface Migration {
    public function schema();
    public function run();
}