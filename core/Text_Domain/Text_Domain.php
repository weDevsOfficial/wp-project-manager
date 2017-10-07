<?php

namespace CPM\Core\Text_Domain;

use CPM\Core\Singletonable;

class Text_Domain {
    /**
     * Code associated with making a class singleton.
     */
    use Singletonable;

    /**
     * Static array that will holds all the text used in the system.
     *
     * @var array
     */
    protected static $texts = [];

    /**
     * Load lang files from the lang directory and store these
     * values in lang static property.
     */
    protected function load() {
        self::$texts = load_texts();
    }

    public static function get_text( $key = null, $args = [] ) {
        Text_Domain::singleton(
            array(),
            array([
                'method' => 'load',
                'params' => [],
                'property' => null
            ])
        );

        $texts = self::$texts;
        $text  = $texts;

        if ( $key ) {
            $keys = explode( '.', $key );
            $text = self::get_value_from_array( $texts, $keys );
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
        $values = [];
        $values[0] = $text[0];

        if ( array_key_exists( 1, $text ) ) {
            $params = $text[1];

            foreach ( $params as $key => $param ) {
                $keys  = explode( '.', $param );
                $value = self::get_value_from_array( $args, $keys );

                $values[$key + 1] = $value;
            }
        }

        return call_user_func_array( 'sprintf', $values );
    }
}