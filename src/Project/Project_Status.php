<?php

namespace WeDevs\PM\Project;

trait Project_Status {
    // Allowed project statuses and their keys
    public static $status = [
        0 => 'incomplete',
        1 => 'complete',
        2 => 'pending',
        3 => 'archived'
    ];

    public function getStatusAttribute( $value ) {
        $value = (int) $value;

        if (array_key_exists($value, self::$status)) {
            return self::$status[(int)$value];
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

    public function setEstCompletionDateAttribute( $date ) {
        $this->attributes['est_completion_date'] = make_carbon_date( $date );
    }

}