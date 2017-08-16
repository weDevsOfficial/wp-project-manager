<?php 

namespace CPM\Project;

trait Project_Status {	
    // Allowed project statuses and their keys
    private static $status = [
        0 => 'Incomplete',
        1 => 'Complete',
    ];

    public function getStatusAttribute( $value )
    {
        $value = (int) $value;
        
       if (array_key_exists($value, self::$status)) {
            return self::$status[(int)$value];
        }

       return self::$status[0];
    }

    public function setStatusAttribute( $value )
    {
        $status = array_search(
            strtolower($value), array_map('strtolower', self::$status)
        );
        
       $this->attributes['status'] = $status;
    }
}