<?php
namespace WeDevs\PM\Pusher\Src\Controllers;

use Reflection;
use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\Pusher\Core\Auth\Auth;
use WeDevs\PM\Pusher\Core\Pusher\Pusher;


class Pusher_Controller {

    use Transformer_Manager, Request_Filter;

    private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    public function authentication( WP_REST_Request $request ) {

        $channel_name = $request->get_param( 'channel_name' );
        $socket_id    = $request->get_param( 'socket_id' );

        if ( is_user_logged_in() ) {
            $pusher = new Auth();
            $auth_response = $pusher->socket_auth($channel_name, $socket_id);

            // Return proper JSON response for Pusher authentication
            // $auth_response is already JSON-encoded and validated by socket_auth() method
            header('Content-Type: application/json');
            // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Already JSON-encoded by Pusher library
            echo $auth_response;
            exit;

        } else {
          header('', true, 403);
          echo "Forbidden";
          exit;
        }
    }

    public function test_connection( WP_REST_Request $request ) {
        if ( ! Auth::app_key() || ! Auth::secret() || ! Auth::app_id() || ! Auth::app_cluster() ) {
            wp_send_json_error( [ 'message' => __( 'Pusher credentials are missing. Save settings first.', 'wedevs-project-manager' ) ], 400 );
        }

        $base_channel = wedevs_pm_pusher_channel();
        $user_ids     = get_users( [ 'fields' => 'ID' ] );

        if ( empty( $user_ids ) ) {
            wp_send_json_error( [ 'message' => __( 'No users to notify.', 'wedevs-project-manager' ) ], 400 );
        }

        $channels = array_map( function ( $uid ) use ( $base_channel ) {
            return $base_channel . '-' . $uid;
        }, $user_ids );

        $payload = [
            'title'   => __( 'Pusher Test', 'wedevs-project-manager' ),
            'message' => __( 'Connection successful. Real-time updates are working.', 'wedevs-project-manager' ),
        ];

        // Pusher API limit: 100 channels per trigger call.
        $batches    = array_chunk( $channels, 100 );
        $last_error = null;

        foreach ( $batches as $batch ) {
            $response = Pusher::trigger( $batch, 'pm-pusher-test', $payload );

            if ( is_wp_error( $response ) ) {
                $last_error = $response->get_error_message();
                break;
            }

            $code = wp_remote_retrieve_response_code( $response );
            if ( $code < 200 || $code >= 300 ) {
                $last_error = sprintf( __( 'Pusher API returned %1$d: %2$s', 'wedevs-project-manager' ), $code, wp_remote_retrieve_body( $response ) );
                break;
            }
        }

        if ( $last_error ) {
            wp_send_json_error( [ 'message' => $last_error ], 500 );
        }

        wp_send_json_success( [
            'message' => sprintf( __( 'Test event broadcast to %d users.', 'wedevs-project-manager' ), count( $channels ) ),
        ] );
    }
}


