<?php

namespace WeDevs\PM\Core\DB_Connection;
use WeDevs\PM\Activity\Activity_Log;

/**
 * Class Model
 *
 * @package WeDevs\ERP\Framework
 */
class Model extends \WeDevs\ORM\Eloquent\Model {

    /**
     * Get the table name with WP prefix
     *
     * @return string
     */
    public function getTable() {
        return $this->getConnection()->db->prefix . $this->table;
    }

    /**
     * Set the value of the "created at" attribute.
     *
     * @param  mixed  $value
     * @return void
     */
    public function setCreatedAt( $value ) {
        $this->{static::CREATED_AT} = current_time( 'mysql' );
    }

    /**
     * Set the value of the "updated at" attribute.
     *
     * @param  mixed  $value
     * @return void
     */
    public function setUpdatedAt( $value ) {
        $this->{static::UPDATED_AT} = current_time( 'mysql' );
    }

    protected function fireModelEvent($event, $halt = true) {
        $user = wp_get_current_user();

        switch ( $event ) {
            case 'creating':
                if ( !empty( $this->created_by )  ) {
                    $this->created_by = $user->ID;
                    $this->updated_by = $user->ID;
                }
                break;
            
            case 'created':
                Activity_Log::entry( $this, 'created' );
                break;
           
            case 'updating': 
                if ( !empty( $this->updated_by )  ) {
                    $this->updated_by = $user->ID;
                }
                break;

            case 'updated':
                Activity_Log::entry( $this, 'updated' );
                break;
        }

        //Do not remove this line
        return parent::fireModelEvent($event, $halt);
    }
}