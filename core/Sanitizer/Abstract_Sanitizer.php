<?php

namespace WeDevs\PM\Core\Sanitizer;

use WeDevs\PM\Core\Sanitizer\Sanitizer;
use WP_REST_Request;

abstract class Abstract_Sanitizer implements Sanitizer {
    /**
     * Current WP_REST_Request object to the application.
     *
     * @var WP_REST_Request
     */
    public $request;

    /**
     * Array of sanitized form of requested data.
     *
     * @var array
     */
    protected $sanitized_data = [];

    public function __construct( WP_REST_Request $request = null ) {
        if ( $request ) {
            $this->request = $request;
        }
    }

    /**
     * Perform data filtering(sanitization) for a specific data field.
     * Filters will be collected from an array returned by the filters
     * method using data key and these filters will be applied here.
     *
     * @return mixed (Sanitized data.)
     */
    public function sanitize( WP_REST_Request $request, $key ) {
        $this->request = $request;
        $filters       = $this->filters();

        $filtering_fns = $filters[$key];
        $fns           = $this->get_filtering_fns( $filtering_fns );
        $value         = $this->request->get_param( $key );

        foreach ( $fns as $fn ) {
            $this->sanitized_data[$key] = $this->call_filtering_fn( $value, $fn );
            $value = $this->sanitized_data[$key];
        }

        return $this->sanitized_data[$key];
    }

    /**
     * Sanitized value of a data field that corresponds to the supplied
     * key will be returned from here. If the key (parameter) is missing
     * when calling this method all the sanitized value will be returned
     * from here.
     *
     * @param  string $key (Key is the data field name.)
     *
     * @return mixed (Return type depends on filters applied to the
     * data key supplied as parameter.)
     */
    public function get_sanitized_data( $key = null ) {
        if ( !$key ) {
            return $this->sanitized_data[$key];
        }

        return $this->sanitized_data;
    }

    /**
     * Separation of sanitization functions(filters) from a string
     * where filters are separated by pipe line.
     *
     * @param  string $fns (Piple line separated string of sanitization
     * filters.)
     *
     * @return array (Array of function names that will called when
     * sanitizing or filtering a data field value)
     */
    protected function get_filtering_fns( $fns ) {
        return explode( '|', $fns );
    }

    /**
     * Making of sanitization functions and call them with appropriate
     * parameters.
     *
     * @param  mixed $value (Value of a data field.)
     *
     * @param  string $fn (Name of function. If a function has any parameter
     * other than data field value will be look like 'fn:param1,param2'.These
     * parameters will be passed to that function as an array that will retain
     * the sequence and data field value will be passed as first parameter.)
     *
     * @return mixed (Specified by the filter function.)
     */
    protected function call_filtering_fn( $value, $fn ) {
        $fn_parts = explode( ':', $fn );

        $fn_name = trim( $fn_parts[0] );

        if ( count( $fn_parts ) > 1 ) {
            $fn_params = trim( $fn_parts[1] );
            $fn_params = explode( ',', $fn_params );

            return $fn_name( $value, $fn_params );
        }

        return $fn_name( $value );
    }

    /**
     * Which filters will be applied to which data field will be defined
     * here. This method returns an associative array where key is the
     * data field name and value is a string of filters. If a value
     * contains more than one filter, filters will be separated by pipe
     * line. Filters that accept parameters other than data field value
     * needs to be decleard as 'filter_name:param1, param2'. These
     * parameters will be passed as an array to the second parameter of
     * the filter function and first parameter is for data field value.
     *
     * @return array (Associative array of filters where key is the
     * data field name and value is a string of filters.)
     */
    abstract public function filters();
}