<?php

namespace CPM\Core\Lang;

use CPM\Core\Singletonable;

class Lang {
    /**
     * Code associated with making a class singleton.
     */
    use Singletonable;

    /**
     * Static array that will holds all the text used in the system.
     *
     * @var array
     */
    protected static $text_domain = [];

    /**
     * Load lang files from the lang directory and store these
     * values in lang static property.
     */
    protected function load() {
        self::$text_domain = load_lang();
    }

    public static function trans( $key = null, $args = [] ) {
        $lang = Lang::singleton(
            array(),
            array([
                'method' => 'load',
                'params' => [],
                'property' => null
            ])
        );

        $text = self::$text_domain;

        if ( $key ) {
            $keys = explode( '.', $key );
            $text = self::get_value_from_array( $text, $keys );
        }

        return self::named_vsprintf( $text, $args );
    }

    private static function get_value_from_array( $array = [], $keys = [] ) {
        $value = $array;

        foreach ( $keys as $key ) {
            $value = $value[$key];
        }

        return $value;
    }

    private static function named_vsprintf( $text, $args ) {
        $format = $text[0];
        $values = [];

        if ( array_key_exists( 1, $text ) ) {
            $params = $text[1];

            foreach ( $params as $key => $param ) {
                $keys  = explode( '.', $param );
                $value = self::get_value_from_array( $args, $keys );

                $values[$key] = $value;
            }
        }

        return vsprintf( $format, $values );
    }
}