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
}


