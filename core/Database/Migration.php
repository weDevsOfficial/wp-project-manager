<?php

namespace Wprl\Core\Database;

interface Migration {
    public function schema();
    public function run();
}