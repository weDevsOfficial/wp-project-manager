<?php

namespace CPM\Task;

trait Task_Model_Trait {
    // Allowed status for a task
    private static $status = [
        0 => 'incomplete',
        1 => 'complete',
        2 => 'pending',
    ];

    private static $priorities = [
        1 => 'high',
        2 => 'medium',
        3 => 'low',
    ];

    public function getStatusAttribute( $value ) {
        $value = (int) $value;

        if ( array_key_exists( $value, self::$status ) ) {
            return self::$status[(int) $value];
        }

        return self::$status[0];
    }

    public function setStatusAttribute( $value ) {
        $value = strtolower( $value );
        $key = array_search( $value, self::$status );

        if ( in_array( $value, self::$status ) ) {
            $this->attributes['status'] = $key;
        } elseif ( array_key_exists( $value, self::$status ) ) {
            $this->attributes['status'] = $value;
        } else {
            $this->attributes['status'] = 0;
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
        $value = strtolower( $value );
        $key = array_search( $value, self::$priorities );

        if ( in_array( $value, self::$priorities ) ) {
            $this->attributes['priority'] = $key;
        } elseif ( array_key_exists( $value, self::$priorities ) ) {
            $this->attributes['priority'] = $value;
        } else {
            $this->attributes['priority'] = 0;
        }
    }
}