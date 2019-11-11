<?php
namespace WeDevs\PM\Pusher\core\Pusher;

use WeDevs\PM\Pusher\core\Auth\Auth;

class Pusher {

    private $channels;
    private $event;
    private $data;

    private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    public static function trigger( $channels, $event, $data ) {
        $self = self::getInstance();

        return $self->set_channels( $channels )
            ->set_event( $event )
            ->set_data( $data )
            ->remote_post();
    }

    private function remote_post() {
        return wp_remote_post( $this->get_full_url(), array(
            'method'  => $this->get_request_method(),
            'timeout' => 30,
            'headers' => $this->get_remote_post_header(),
            'body'    => $this->get_remote_post_body()
        ));
    }

    public function get_full_url() {
        $build_query = $this->build_auth_query_string(
            Auth::app_key(),
            Auth::secret(),
            $this->get_request_method(),
            $this->get_required_path(),
            $this->get_query_params()
        );

        return $this->get_domain() . $build_query;
    }

    private function get_domain() {

        return 'https://api-' . Auth::app_cluster() . '.pusher.com:443' . $this->get_required_path() . '?';
    }

    /**
     * Implode an array with the key and value pair giving
     * a glue, a separator between pairs and the array
     * to implode.
     *
     * @param string       $glue      The glue between key and value
     * @param string       $separator Separator between pairs
     * @param array|string $array     The array to implode
     *
     * @return string The imploded array
     */
    function array_implode($glue, $separator, $array) {
        if (!is_array($array)) {
            return $array;
        }

        $string = array();
        foreach ($array as $key => $val) {
            if (is_array($val)) {
                $val = implode(',', $val);
            }
            $string[] = "{$key}{$glue}{$val}";
        }

        return implode($separator, $string);
    }

    private function get_request_method() {
        return 'POST';
    }

    private function get_query_params() {

        $post_params = [
            'name' => $this->event,
            'data' => is_array( $this->data ) ? json_encode( $this->data ) : $this->data,
            'channels' => $this->channels
        ];

        $post_value = json_encode($post_params);

        $query_params['body_md5'] = md5( $post_value );

        return $query_params;
    }

    private function set_channels( $channels ) {
        $this->channels = is_array( $channels ) ? $channels : [$channels];
        return $this;
    }

    private function set_event( $event ) {
        $this->event = $event;
        return $this;
    }

    private function set_data( $data ) {
        $this->data = $data;
        return $this;
    }

    private function get_remote_post_header() {
        return [
            'Content-Type' => 'application/json',
            'Expect' => '',
            'X-Pusher-Library' => 'pusher-http-php 3.4.1',
        ];
    }

    private function get_remote_post_body() {
        $body_data = [
            'name'     => $this->event,
            'data'     => is_array( $this->data ) ? json_encode( $this->data ) : $this->data,
            'channels' => $this->channels
        ];


        return json_encode( $body_data );
    }

    private function get_required_path() {
        return '/apps/' . Auth::app_id() . '/events';
    }

    /**
     * Build the required HMAC'd auth string.
     *
     * @param string $app_key
     * @param string $auth_secret
     * @param string $request_method
     * @param string $request_path
     * @param array  $query_params   [optional]
     * @param string $auth_version   [optional]
     * @param string $auth_timestamp [optional]
     *
     * @return string
     */
    function build_auth_query_string($app_key, $auth_secret, $request_method, $request_path,
    $query_params = array(), $auth_version = '1.0', $auth_timestamp = null) {
        $params = array();
        $params['auth_key'] = $app_key;
        $params['auth_timestamp'] = (is_null($auth_timestamp) ? time() : $auth_timestamp);
        $params['auth_version'] = $auth_version;

        $params = array_merge( $params, $query_params );
        ksort($params);

        $string_to_sign = "$request_method\n".$request_path."\n". $this->array_implode('=', '&', $params);

        $auth_signature = hash_hmac('sha256', $string_to_sign, $auth_secret, false);

        $params['auth_signature'] = $auth_signature;
        ksort($params);

        $auth_query_string = $this->array_implode('=', '&', $params);

        return $auth_query_string;
    }
}
