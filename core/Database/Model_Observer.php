<?php

namespace WeDevs\PM\Core\Database;

use Reflection;

abstract class Model_Observer {

    public function handle( $resource, $act ) {
        if ( method_exists( $this, $act ) ) {
            $this->$act( $resource );
        }
    }

    public function call_attribute_methods( $resource ) {
        $fillable_attributes = $resource->getFillable();
        $old = $resource->getOriginal();
        $new = $resource->getAttributes();

        foreach ( $fillable_attributes as $attribute ) {
            if ( $old[$attribute] != $new[$attribute]  && method_exists( $this, $attribute ) ) {
                $this->$attribute( $resource, $old[$attribute] );
            }
        }
    }

    abstract protected function created( $resource );

    abstract protected function updated( $resource );
}
