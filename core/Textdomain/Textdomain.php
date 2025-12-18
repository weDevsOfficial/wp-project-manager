<?php

namespace WeDevs\PM\Core\Textdomain;

use WeDevs\PM\Core\Singletonable;

class Textdomain {
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
        self::$texts = pm_load_texts();
    }

    public static function get_text( $key ) {
        Textdomain::singleton(
            array(),
            array([
                'method' => 'load',
                'params' => [],
                'property' => null
            ])
        );

        $texts = self::$texts;
        $keys  = explode( '.', $key );
        $text  = self::get_value_from_array( $texts, $keys );

        $localized_text = [];
        if ( count( $keys ) == 1 ) {
            $sub_keys = array_keys( $text );
            foreach ( $sub_keys as $key ) {
                $localized_text[$key] = self::named_sprintf( $text[$key] );
            }
        } else {
            $localized_text = self::named_sprintf( $text );
        }

        return $localized_text;
    }

    private static function get_value_from_array( $array = [], $keys = [] ) {
        $value = $array;

        foreach ( $keys as $key ) {

            if ( !array_key_exists( $key, $value ) ) {
                return null;
            }

            $value = $value[$key];
        }

        return $value;
    }

    private static function named_sprintf( $text = [] ) {
        if ( !is_array( $text ) ) {
            return '';
        }

        $keys = array_keys( $text );
        $arr_differ = array_diff( $keys, [0, 1] );
        if ( !empty( $arr_differ ) ) {
            return '';
        }

        $sprintf_args = [];
        $format = $text[0];

        if ( array_key_exists( 1, $text ) ) {
            $params = $text[1];

            foreach ( $params as $key => $param ) {
                $sprintf_args[$key + 1] = '{{' . $param . '}}';
            }
        }
        array_unshift( $sprintf_args, $format );

        return call_user_func_array( 'sprintf', $sprintf_args );
    }
}