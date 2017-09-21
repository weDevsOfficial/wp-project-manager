<?php

namespace CPM\Task;

use Carbon\Carbon;

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
        $key   = array_search( $value, self::$status );

        if ( array_key_exists( $value, self::$status ) ) {
            $this->attributes['status'] = $value;
        } else {
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
        $value = strtolower( $value );
        $key   = array_search( $value, self::$priorities );

        if ( array_key_exists( $value, self::$priorities ) ) {
            $this->attributes['priority'] = $value;
        } else {
            $this->attributes['priority'] = $key;
        }
    }

    public function setStartAtAttribute( $date ) {
        $this->attributes['start_at'] = make_carbon_date( $date );
    }

    public function setDueDateAttribute( $date ) {
        $this->attributes['due_date'] = make_carbon_date( $date );
    }
}