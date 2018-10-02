<?php

namespace WeDevs\PM\Core\DB_Connection;
use WeDevs\PM\Activity\Activity_Log;

/**
 * Class Model
 *
 * @package WeDevs\ERP\Framework
 */
class Model extends \WeDevs\ORM\Eloquent\Model {

    protected static $pmFireEvent = true;

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
        
        if ( !static::$pmFireEvent ) {
            return true;
        }

        $user = wp_get_current_user();
        $fillable = $this->getFillable();
        
        switch ( $event ) {
            case 'creating':
                if ( in_array('created_by', $fillable, true) ) {
                    $this->created_by = $user->ID;
                    $this->updated_by = $user->ID;
                }
                break;
            
            case 'created':
                do_action( 'pm_created', $this );
                Activity_Log::entry( $this, 'created' );
                break;
           
            case 'updating': 
                if ( in_array('updated_by', $fillable, true) ) {
                    $this->updated_by = $user->ID;
                }
                break;

            case 'updated':
                do_action( 'pm_updated', $this );
                Activity_Log::entry( $this, 'updated' );
                break;

            case 'deleted':
                
                do_action( 'pm_deleted', $this );
                //Activity_Log::entry( $this, 'deleted' );
                break;

            case 'deleting':

                do_action( 'pm_deleting', $this );
                Activity_Log::entry( $this, 'deleting' );
                break;
        }
        //Do not remove this line
        return parent::fireModelEvent($event, $halt);
    }

    /**
     * Unset the event dispatcher for models.
     *
     * @return void
     */
    public static function unsetEventDispatcher() {
        static::$pmFireEvent = false;

        parent::unsetEventDispatcher();
    }
}
