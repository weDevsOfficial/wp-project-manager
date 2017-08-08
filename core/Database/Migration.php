<?php

namespace CPM\Core\Database;

interface Migration {
    public function schema();
    public function run();
}