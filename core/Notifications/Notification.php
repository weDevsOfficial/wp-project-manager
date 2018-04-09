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
use WeDevs\PM\Core\Notifications\Emails\New_Project_Notification;
use WeDevs\PM\Core\Notifications\Emails\Update_Project_Notification;
use WeDevs\PM\Core\Notifications\Emails\New_Message_Notification;
use WeDevs\PM\Core\Notifications\Emails\New_Comment_Notification;
use WeDevs\PM\Core\Notifications\Emails\Update_Comment_Notification;
use WeDevs\PM\Core\Notifications\Emails\New_Task_Notification;
use WeDevs\PM\Core\Notifications\Emails\Update_Task_Notification;
use WeDevs\PM\Core\Notifications\Emails\Complete_Task_Notification;

 class Notification
 {

    /** @var Notification The single instance of the class */
    protected static $_instance = null;

    /**
    * Background emailer class.
    */
    protected static $background_emailer;  

    /**
     * Hook in all transactional emails.
     */
    public static function init_transactional_emails() {
        $email_actions = apply_filters( 'pm_notification_action', array(
            'pm_after_new_project',
            'pm_after_update_project',
            'pm_after_new_message',
            'pm_after_create_task',
            'pm_after_update_task',
            'pm_changed_task_status',
            'pm_after_new_comment',
            'pm_after_update_comment'
        ) );

        if ( apply_filters( 'pm_transactional_emails', true ) ) {
            self::$background_emailer = new Background_Emailer();

            foreach ( $email_actions as $action ) {
                add_action( $action, array( __CLASS__, 'queue_transactional_email' ), 10, 10 );
            }
        } else {
            foreach ( $email_actions as $action ) {
                add_action( $action, array( __CLASS__, 'send_transactional_email' ), 10, 10 );
            }
        }
    }


    /**
     * Queues transactional email so it's not sent in current request if enabled,
     * otherwise falls back to send now.
     */
    public static function queue_transactional_email() {
        if ( is_a( self::$background_emailer, 'WeDevs\PM\Core\Notifications\Background_Emailer' ) ) {
            self::$background_emailer->push_to_queue( array(
                'filter' => current_filter(),
                'args'   => func_get_args(),
            ) );
        } else {
            call_user_func_array( array( __CLASS__, 'send_transactional_email' ), func_get_args() );
        }
    }

    /**
     * Init the mailer instance and call the notifications for the current filter.
     *
     * @internal
     *
     * @param string $filter Filter name.
     * @param array  $args Email args (default: []).
     */
    public static function send_queued_transactional_email( $filter = '', $args = array() ) {
        if ( apply_filters( 'pm_allow_send_queued_transactional_email', true, $filter, $args ) ) {
            self::instance(); // Init self so emails exist.

            do_action_ref_array( $filter . '_notification', $args );
        }
    }


    /**
     * Init the mailer instance and call the notifications for the current filter.
     *
     * @internal
     *
     * @param array $args Email args (default: []).
     */
    public static function send_transactional_email( $args = array() ) {
        try {
            $args = func_get_args();
            self::instance(); // Init self so emails exist.
            do_action_ref_array( current_filter() . '_notification', $args );
        } catch ( Exception $e ) {
            if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
                trigger_error( 'Transactional email triggered fatal error for callback ' . current_filter(), E_USER_WARNING );
            }
        }
    }
    
    /**
     * Main Notification Instance.
     *
     * Ensures only one instance of Notification is loaded or can be loaded.
     *
     * @since 2.0.0
     * @static
     * @return Notification Main instance
     */
    public static function instance() {
        if ( is_null( self::$_instance ) ) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

     
    function __construct() {
        new New_Project_Notification();
        new Update_Project_Notification();
        new New_Message_Notification();
        new New_Comment_Notification();
        new Update_Comment_Notification();
        new New_Task_Notification();
        new Update_Task_Notification();
        new Complete_Task_Notification();
    }

 }