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
    protected static $lang = [];

    /**
     * Load lang files from the lang directory and store these
     * values in lang static property.
     */
    protected function load() {
        self::$lang = load_lang();
    }

    public static function trans( $key, $values = [] ) {
        Lang::singleton(
            array(),
            array([
                'method' => 'load',
                'params' => [],
                'property' => null
            ])
        );

        $lang = self::$lang;

        if ( $key ) {
            $keys = explode( '.', $key );

            foreach ( $keys as $key ) {
                $lang = $lang[$key];
            }
        }

        extract( $values );
        eval( "\$lang = \"$lang\";" );

        return $lang;
    }
}