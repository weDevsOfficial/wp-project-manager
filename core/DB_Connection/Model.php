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

    protected function fireModelEvent($event, $halt = true){
        $wp_event = 'pm_'. $event;
        if ( $event == 'creating' ) {
            $filable =  $this->getFillable();

            if( in_array('created_by', $filable ) ) {
                $user = get_current_user();
                $this->created_by = $user->ID;
                $this->updated_by = $user->ID;
            }

        } elseif ( $event == 'created' ) {
            Activity_Log::entry( $this, 'created' );
        }

        //do_action( $wp_event, $this );
        return parent::fireModelEvent($event, $halt);
    }
}