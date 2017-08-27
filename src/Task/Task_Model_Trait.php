<?php

namespace CPM\Task;

trait Task_Model_Trait {
    // Allowed status for a task
    private static $status = [
        0 => 'Incomplete',
        1 => 'Complete',
        2 => 'Pending',
    ];

    private static $priorities = [
        1 => 'High',
        2 => 'Medium',
        3 => 'Low',
    ];

    public function getStatusAttribute( $value ) {
        $value = (int) $value;

        if ( array_key_exists( $value, self::$status ) ) {
            return self::$status[(int) $value];
        }

        return self::$status[0];
    }

    public function setStatusAttribute( $value ) {
        $key = array_search( $value, self::$status );

        if( array_key_exists( $value, self::$status ) ) {
            $this->attributes['status'] = $value;
        } elseif ( $key ) {
            $this->attributes['status'] = $key;
        }
    }

    public function getPriorityAttribute( $value ) {
        $value = (int) $value;

        if ( array_key_exists( $value, self::$priorities ) ) {
            return self::$priorities[(int) $value];
        }

        return self::$priorities[0];
    }

    public function setPriorityAttribute( $value ) {
        $key = array_search( $value, self::$priorities );

        if( array_key_exists( $value, self::$priorities ) ) {
            $this->attributes['priority'] = $value;
        } elseif ( $key ) {
            $this->attributes['priority'] = $key;
        }
    }
}