<?php

namespace WeDevs\PM\Core\Exceptions;

use Exception;

class Undefined_Method_Call extends Exception
{
    public function __construct( $class_name, $method_name )
    {
        $message = 'Method, ' . $method_name . ', is not defined ' . 'in ' . $class_name;

        parent::__construct( $message );
    }
}