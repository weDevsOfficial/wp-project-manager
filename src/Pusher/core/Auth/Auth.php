<?php

namespace WeDevs\PM\Pusher\core\Auth;

use WeDevs\PM\Pusher\core\Auth\Pusher_Crypto as PusherCrypto;

class Auth {

    public static function app_key() {
        return pm_get_setting( 'pusher_app_key' );
    }

    public static function secret() {
        return pm_get_setting( 'pusher_secret' );
    }

    public static function app_id() {
        return pm_get_setting( 'pusher_app_id' );
    }

    public static function app_cluster() {
        return pm_get_setting( 'pusher_cluster' );
    }

    /**
     * Creates a socket signature.
     *
     * @param string $channel
     * @param string $socket_id
     * @param string $custom_data
     *
     * @throws PusherException Throws exception if $channel is invalid or above or $socket_id is invalid
     *
     * @return string Json encoded authentication string.
     */
    public function socket_auth( $channel, $socket_id, $custom_data = null ) {
        $this->validate_channel($channel);
        $this->validate_socket_id($socket_id);

        if ($custom_data) {
            $signature = hash_hmac('sha256', $socket_id.':'.$channel.':'.$custom_data, $this->secret(), false);
        } else {
            $signature = hash_hmac('sha256', $socket_id.':'.$channel, $this->secret(), false);
        }

        $signature = array('auth' => $this->app_key().':'.$signature);
        // add the custom data if it has been supplied
        if ($custom_data) {
            $signature['channel_data'] = $custom_data;
        }
        // var_dump( PusherCrypto::is_encrypted_channel($channel) ); die();
        // if (PusherCrypto::is_encrypted_channel($channel)) {
        //     if (!is_null($this->crypto)) {
        //         $signature['shared_secret'] = base64_encode($this->crypto->generate_shared_secret($channel));
        //     } else {
        //         throw new PusherException('You must specify an encryption master key to authorize an encrypted channel');
        //     }
        // }

        return json_encode($signature, JSON_UNESCAPED_SLASHES);
    }

    /**
     * Ensure a channel name is valid based on our spec.
     *
     * @param string $channel The channel name to validate
     *
     * @throws PusherException If $channel is invalid
     *
     * @return void
     */
    private function validate_channel($channel)
    {
        if (!preg_match('/\A[-a-zA-Z0-9_=@,.;]+\z/', $channel)) {
            return false;
        }
    }

    /**
     * Ensure a socket_id is valid based on our spec.
     *
     * @param string $socket_id The socket ID to validate
     *
     * @throws PusherException If $socket_id is invalid
     */
    private function validate_socket_id($socket_id)
    {
        if ($socket_id !== null && !preg_match('/\A\d+\.\d+\z/', $socket_id)) {
            return false;
        }
    }
}
