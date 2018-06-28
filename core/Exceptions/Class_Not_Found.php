<?php

namespace WeDevs\PM\Core\Exceptions;

use Exception;

class Class_Not_Found extends Exception
{
    public function __construct( $message )
    {
        $message = $message . ' is not found';

        parent::__construct( $message );
    }
}