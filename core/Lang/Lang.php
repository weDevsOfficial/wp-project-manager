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

    public static function trans( $key, $values = [] ) {
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

            foreach ( $keys as $key ) {
                $text = $text[$key];
            }
        }

        return self::named_vsprintf( $text, $values );
    }

    public static function named_vsprintf( $format, $args ) {
        $names  = preg_match_all( '/%\((.*?)\)/', $format[0], $matches, PREG_SET_ORDER );

        $values = array();
        foreach ( $matches as $match ) {
            $values[] = $args[$match[1]];
        }

        return vsprintf( $format[1], $values );
    }
}