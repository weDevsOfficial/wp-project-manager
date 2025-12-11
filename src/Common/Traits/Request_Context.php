<?php

namespace WeDevs\PM\Common\Traits;

/**
 * Request Context Trait
 * 
 * Provides a centralized way to access request parameters that have already
 * been validated through the REST API layer. This eliminates the need for
 * direct $_GET/$_POST access in transformers and other classes.
 * 
 * The context is set by the controller after REST API nonce verification,
 * ensuring all downstream access is secure.
 */
trait Request_Context {

    /**
     * Stored request parameters.
     *
     * @var array
     */
    private static $request_context = [];

    /**
     * Set request context from WP_REST_Request.
     * Should be called by controllers after the request has been authenticated.
     *
     * @param \WP_REST_Request|array $request The REST request object or array of params.
     *
     * @return void
     */
    public static function set_request_context( $request ) {
        if ( $request instanceof \WP_REST_Request ) {
            self::$request_context = $request->get_params();
        } elseif ( is_array( $request ) ) {
            self::$request_context = $request;
        }
    }

    /**
     * Get a parameter from the request context.
     *
     * @param string $key     The parameter key.
     * @param mixed  $default Default value if parameter is not set.
     *
     * @return mixed The parameter value or default.
     */
    public static function get_context_param( $key, $default = null ) {
        if ( isset( self::$request_context[ $key ] ) ) {
            return self::$request_context[ $key ];
        }

        return $default;
    }

    /**
     * Get an integer parameter from the request context.
     *
     * @param string $key     The parameter key.
     * @param int    $default Default value if parameter is not set.
     *
     * @return int The parameter value or default.
     */
    public static function get_context_int( $key, $default = 0 ) {
        error_log( "=== get_context_int called for key: {$key} ===" );
        error_log( 'Current context: ' . print_r( self::$request_context, true ) );
        $value = self::get_context_param( $key, $default );
        error_log( "Returning value: {$value}" );
        return intval( $value );
    }

    /**
     * Check if a parameter exists in the request context.
     *
     * @param string $key The parameter key.
     *
     * @return bool True if parameter exists, false otherwise.
     */
    public static function has_context_param( $key ) {
        return isset( self::$request_context[ $key ] );
    }

    /**
     * Clear the request context.
     *
     * @return void
     */
    public static function clear_request_context() {
        self::$request_context = [];
    }

    /**
     * Get all request context parameters.
     *
     * @return array All stored parameters.
     */
    public static function get_all_context_params() {
        return self::$request_context;
    }
}
