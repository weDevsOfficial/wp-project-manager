<?php

namespace WeDevs\PM\Core\Config;

use WeDevs\PM\Core\Singletonable;

class Config {
    /**
     * Code associated with making a class singleton.
     */
    use Singletonable;

    /**
     * Static array that will holds all the configurations.
     *
     * @var array
     */
    protected static $configs = [];

    /**
     * Load configurations files from the config directory and store these
     * values in config static property.
     */
    protected function load() {
        self::$configs = pm_load_configurations();
    }

    /**
     * Get configuration values on the basis of configuration key if key
     * is supplied; otherwise return all configuration values (key based).
     *
     * @param  string $key This is a string for config key. If a key is
     * compound, successive keys will be glued with the symbol '.'. For
     * example, a simple key is 'api' and a compound key is 'api.namespace'.
     *
     * @return array Associative array of configurations where keys are
     * config keys and corresponding values are config values.
     */
    public static function get( $key = null ) {
        Config::singleton(
            array(),
            array([
                'method' => 'load',
                'params' => [],
                'property' => null
            ])
        );

        $configs = self::$configs;

        if ( $key ) {
            $keys = explode( '.', $key );

            foreach ( $keys as $key ) {

                if ( !array_key_exists( $key, $configs ) ) {
                    return null;
                }

                $configs = $configs[$key];
            }
        }

        return $configs;
    }
}