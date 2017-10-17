<?php

namespace WeDevs\PM\Core\Router;

use WeDevs\PM\Core\Exceptions\Invalid_Route_Handler;
use WeDevs\PM\Core\Exceptions\Class_Not_Found;
use WeDevs\PM\Core\Exceptions\Undefined_Method_Call;

class Uri_Parser {
    /**
     * Separate class namespace and it's method from a given string.
     *
     * @param  string $str (This contains a class namespace and a method
     * name. These two things are separated by @ symbol in the string.)
     *
     * @return array (Array of two elements where first element is a class namespace
     * and second element is a method name if the given name is in valid format;
     * otherwise throws exception.)
     */
    public function class_method_separation( $str ) {
        $handler = explode( '@', $str );

        if (count( $handler ) === 2) {
            return $handler;
        }

        throw new Invalid_Route_Handler( str_replace( '/', '\\', $str ) );
    }

    /**
     * Make class from the given string and check for it's existence.
     *
     * @param  string $str (Namespace for a class given as string.)
     *
     * @return string (Callable namespace of the given string of a class
     * if exists; otherwise throws exception.)
     */
    public function get_controller( $str ) {
        $class = str_replace( '/', '\\', $str );

        if ( class_exists( $class ) ) {
            return $class;
        }

        throw new Class_Not_Found( $class );
    }

    /**
     * Check for existence of a method in a class.
     *
     * @param  string $controller (Namespace for a class.)
     *
     * @param  string $method (Method name in a class.)
     *
     * @return string (Valid method name of the given class if exists;
     * otherwise throws exception.)
     */
    public function get_method( $controller, $method ) {
        $obj = new $controller();

        if ( method_exists( $obj, $method ) ) {
            return $method;
        }

        throw new Undefined_Method_Call( $controller, $method );
    }

    /**
     * Convert uri string (of route files) to WP rest api url.
     *
     * @param  string $uri (This will look like uris defined in the route files.)
     *
     * @return string (WP rest api url like string.)
     */
    public function convert_to_wp_uri( $uri ) {
        // pattern for valid identifier name enclosed by {}
        $pattern = '/\{[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]+\}/';

        $uri = preg_replace_callback( $pattern, function ( $matches ) {
            return '(?P<' . trim( $matches[0], '{}' ) . '>\d+)';
        }, $uri );

        return $uri;
    }
}