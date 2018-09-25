<?php 

namespace WeDevs\PM\Common\Traits;

trait Board_Status {
        // Allowed status for a task list
        public static $status = [
            0 => 'archived',
            1 => 'current',
            2 => 'complete',
        ];
    
    
        public function getStatusAttribute( $value ) {
            $value = (int) $value;
    
            if ( array_key_exists( $value, self::$status ) ) {
                return self::$status[(int) $value];
            }
    
            return self::$status[1];
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
}