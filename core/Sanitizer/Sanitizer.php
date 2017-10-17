<?php

namespace WeDevs\PM\Core\Sanitizer;

use WP_REST_Request;

interface Sanitizer {
    /**
     * Perform data filtering(sanitization) for a specific data field.
     * Filters will be collected from an array returned by the filters
     * method using data key and these filters will be applied here.
     *
     * @return mixed (Sanitized data.)
     */
    public function sanitize( WP_REST_Request $request, $key );

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
    public function get_sanitized_data( $key = null );

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
    public function filters();
}