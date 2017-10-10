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

    public static function get_text_format( $key = null ) {
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

        return self::named_sprintf( $text );
    }

    private static function get_value_from_array( $array = [], $keys = [] ) {
        $value = $array;

        foreach ( $keys as $key ) {
            $value = $value[$key];
        }

        return $value;
    }

    private static function named_sprintf( $text ) {
        $sprintf_args = [];
        $format = $text[0];

        if ( array_key_exists( 1, $text ) ) {
            $params = $text[1];

            foreach ( $params as $key => $param ) {
                $sprintf_args[$key + 1] = '$' . $param;
            }
        }
        array_unshift( $sprintf_args, $format );

        return call_user_func_array( 'sprintf', $sprintf_args );
    }
}