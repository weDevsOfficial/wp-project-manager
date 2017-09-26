<?php

namespace CPM\Core\Database;

use Reflection;

abstract class Model_Observer {

    public function handle( $resource, $act ) {
        if ( method_exists( $this, $act ) ) {
            $this->$act( $resource );
        }
    }

    abstract protected function created( $resource );

    abstract protected function updated( $resource );
}