<?php

namespace WeDevs\PM\Core;

use Reflection;

trait Singletonable {
    /**
     * Returns the *Singleton* instance of this class.
     *
     * @staticvar Singleton $instance The *Singleton* instances of this class.
     *
     * @param array $dependencies Array of external objects that are required
     * to instantiate the singletonable class.
     *
     * @param array $callables An array of callables things that will be
     * called in the process of making a class singleton. This array actually
     * contains associative arrays where keys are 'method', 'params', and
     * 'property'. What we will get with the key 'method' is name of the
     * class method and it will be called with parameters. We will get these
     * parameters in the array location 'params' that is actually an array of
     * parameters. If we need to assign the method call value to a property,
     * we will get that property from the array with the key 'property'.
     *
     * @return Singleton The *Singleton* instance.
     */
    public static function singleton( array $dependencies = [], array $callables = [] ) {
        static $instance = null;

        if ( null === $instance ) {
            $instance = new static;
            $instance->inject_dependecies( $dependencies );
            $instance->apply_callables( $callables );
        }

        return $instance;
    }

    /**
     * Initialization of the external objects that are required
     * in the life cycle of caller class object
     *
     * @param  array  $dependencies In dependency, key is the dependency
     * name and value is the object of the dependency class
     *
     * @return void
     */
    protected function inject_dependecies( array $dependencies = [] ) {
        foreach ( $dependencies as $property => $dependency ) {
            if ( property_exists( $this, $property ) ) {
                $this->$property = $dependency;
            }
        }
    }

    /**
     * Call the callable things that are required to make the calling class
     * singleton.
     *
     * @param array $callables An array of callables things that will be
     * called in the process of making a class singleton. This array actually
     * contains associative arrays where keys are 'method', 'params', and
     * 'property'. What we will get with the key 'method' is name of the
     * class method and it will be called with parameters. We will get these
     * parameters in the array location 'params' that is actually an array of
     * parameters. If we need to assign the method call value to a property,
     * we will get that property from the array with the key 'property'.
     *
     * @return void
     */
    protected function apply_callables( array $callables = [] ) {
        foreach ( $callables as $callable ) {
            $method   = $callable['method'];
            $params   = $callable['params'];
            $property = $callable['property'];

            if ( method_exists( $this, $method ) ) {

                if ( property_exists( $this, $property ) ) {
                    $this->$property = call_user_func_array(
                        array( $this, $method ),
                        $params
                    );
                } else {
                    call_user_func_array( array( $this, $method ), $params );
                }
            }
        }
    }

    /**
     * Protected constructor to prevent creating a new instance of the
     * *Singleton* via the `new` operator from outside of this class.
     */
    protected function __construct() {

    }

    /**
     * Private clone method to prevent cloning of the instance of the
     * *Singleton* instance.
     *
     * @return void
     */
    private function __clone() {

    }

    /**
     * Private unserialize method to prevent unserializing of the *Singleton*
     * instance.
     *
     * @return void
     */
    private function __wakeup() {

    }
}

//Example: singleton() first param
// use WeDevs\PM\Core\Singletonable;

// $obj = test::singleton(['xyz' => 'Hello World!']);

// echo $obj->xyz; //'Hello World!'

// class test {
//     use Singletonable;

//     public $xyz;
// }
//

//Example: singleton() second param
// use WeDevs\PM\Core\Singletonable;

// $obj = test::singleton(['xyz' => 'Hello World!'], [
//     'method' => 'kkk',
//     'params' => 'aaa',
// ]);

//  echo $obj->xyz;//Hello World!'

//  class test {
//     use Singletonable;

//     public $xyz;

//     //for else condition
//     public function kkk( $params ) {
//         // do operation

//         return //something;
//     }
// }
