<?php

namespace WeDevs\PM\Task;

use Carbon\Carbon;

trait Task_Model_Trait {
    // Allowed status for a task
    public static $status = [
        0 => 'incomplete',
        1 => 'complete',
        2 => 'pending',
    ];

    public static $priorities = [
        0 => 'low',
        1 => 'medium',
        2 => 'high',
    ];

    public static $recurrency = [
        0 => '0', // no repeat
        1 => '1', // weekly
        2 => '2', // Monthly
        3 => '3', // Annually
        9 => '9', // never
    ];

    public static $payability = [
        0 => 'no',
        1 => 'yes'
    ];

    public static $complexity = [
        0 => 'basic',
        1 => 'intermediate',
        2 => 'advance'
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

    public function getRecurrentAttribute( $value ) {
        $value = (int) $value;

        if ( array_key_exists( $value, self::$recurrency ) ) {
            return self::$recurrency[(int) $value];
        }

        return self::$recurrency[0];
    }

    public function setRecurrentAttribute( $value ) {
        $value = strtolower( $value );
        $key   = array_search( $value, self::$recurrency );

        if ( array_key_exists( $value, self::$recurrency ) ) {
            $this->attributes['recurrent'] = $value;
        } else {
            $this->attributes['recurrent'] = $key;
        }
    }

    public function getPayableAttribute( $value ) {
        $value = (int) $value;

        if ( array_key_exists( $value, self::$payability ) ) {
            return self::$payability[(int) $value];
        }

        return self::$payability[0];
    }

    public function setPayableAttribute( $value ) {
        $value = strtolower( $value );
        $key   = array_search( $value, self::$payability );

        if ( array_key_exists( $value, self::$payability ) ) {
            var_dump( $value );
            $this->attributes['payable'] = $value;
        } else {
            $this->attributes['payable'] = $key;
        }
    }

    public function getComplexityAttribute( $value ) {
        $value = (int) $value;

        if ( array_key_exists( $value, self::$complexity ) ) {
            return self::$complexity[(int) $value];
        }

        return self::$complexity[0];
    }

    public function setComplexityAttribute( $value ) {
        $value = strtolower( $value );
        $key   = array_search( $value, self::$complexity );

        if ( array_key_exists( $value, self::$complexity ) ) {
            $this->attributes['complexity'] = $value;
        } else {
            $this->attributes['complexity'] = $key;
        }
    }


    public function getPrivacyAtAttribute() {
        return $this->mates()->where('meta_key', 'privacy')->first()->meta_value === 1;
    }

    public function getTaskListAttribute() {
        $task_list = $this->task_lists()->first();
        if ($task_list) {
            return $task_list->id;
        }
    }
}
