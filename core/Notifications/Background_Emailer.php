<?php 

namespace WeDevs\PM\Core\Notifications;

/**
* class background email email processing
*
* @class    Background_Emailer
* @version  2.0.0
* @package  WeDevs\PM\Core
* @category Class
* @author   weDevs
*/
use WP_Background_Process;
use WeDevs\PM\Core\Notifications\Notification;

class Background_Emailer extends WP_Background_Process
{

    /**
     * @var string
     */
    protected $action = 'pm_emailer';
    
    function __construct() {
        parent::__construct();
        add_action( 'shutdown', array( $this, 'dispatch_queue' ) );
    }


    /**
     * Task
     *
     * Override this method to perform any actions required on each
     * queue item. Return the modified item for further processing
     * in the next pass through. Or, return false to remove the
     * item from the queue.
     *
     * @param array $callback Update callback function
     * @return mixed
     */
    protected function task( $callback ) {
        if ( isset( $callback['filter'], $callback['args'] ) ) {
            try {
                Notification::send_queued_transactional_email( $callback['filter'], $callback['args'] );
            } catch ( Exception $e ) {
                if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
                    trigger_error( 'Transactional email triggered fatal error for callback ' . $callback['filter'], E_USER_WARNING );
                }
            }
        }
        return false;
    }

    /**
    * Save and run queue.
    */
    public function dispatch_queue() {
        if ( ! empty( $this->data ) ) {
            $this->save()->dispatch();
        }
    }


    /**
     * Handle
     *
     * Pass each queue item to the task handler, while remaining
     * within server memory and time limit constraints.
     */
    protected function handle() {
        $this->lock_process();

        do {
            $batch = $this->get_batch();

            if ( empty( $batch->data ) ) {
                break;
            }

            foreach ( $batch->data as $key => $value ) {
                $task = $this->task( $value );

                if ( false !== $task ) {
                    $batch->data[ $key ] = $task;
                } else {
                    unset( $batch->data[ $key ] );
                }

                // Update batch before sending more to prevent duplicate email possibility.
                $this->update( $batch->key, $batch->data );

                if ( $this->time_exceeded() || $this->memory_exceeded() ) {
                    // Batch limits reached.
                    break;
                }
            }
            if ( empty( $batch->data ) ) {
                $this->delete( $batch->key );
            }
        } while ( ! $this->time_exceeded() && ! $this->memory_exceeded() && ! $this->is_queue_empty() );

        $this->unlock_process();

        // Start next batch or complete process.
        if ( ! $this->is_queue_empty() ) {
            $this->dispatch();
        } else {
            $this->complete();
        }
    }
}