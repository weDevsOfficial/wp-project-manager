<?php

namespace WeDevs\PM\Common\Traits;

use WP_REST_Request;

trait Request_Filter {
    /**
     * Extract non empty fields in a wp rest request object and return them
     * as an associative array where key is the form field name;
     *
     * @param  WP_REST_Request $request
     *
     * @return array
     */
    public function extract_non_empty_values( WP_REST_Request $request ) {
        $data = [];

        foreach ( $request->get_params() as $key => $value ) {
            if ( $value !== '') {
                $data[$key] = $value;
            }
        }

        return $data;
    }
}