<?php

namespace WeDevs\PM\Settings\Transformers;

use WeDevs\PM\Settings\Models\Settings;
use League\Fractal\TransformerAbstract;
use WeDevs\PM\Common\Traits\Resource_Editors;

class Settings_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $availableIncludes = [
        'creator', 'updater'
    ];

    public function transform( Settings $item ) {
        // Check if this is a hidden setting that should be masked
        $hideSettings = \WeDevs\PM\Settings\Models\Settings::$hideSettings;
        $value = $item->value;
        
        if ( in_array( $item->key, $hideSettings ) ) {
            // Mask the value for security
            // Handle API keys for all providers (ai_api_key_openai, ai_api_key_anthropic, ai_api_key_google)
            if ( $item->key === 'ai_api_key' || strpos( $item->key, 'ai_api_key_' ) === 0 ) {
                // For API key, we need to decrypt first, then mask
                $decrypted_key = \WeDevs\PM\Settings\Controllers\AI_Settings_Controller::decrypt_api_key_static( $value );
                if ( !empty( $decrypted_key ) ) {
                    $value = $this->mask_api_key( $decrypted_key );
                } else {
                    $value = '';
                }
            } else {
                // For other hidden settings, return boolean
                $value = !empty( $value ) ? true : false;
            }
        }
        
        return [
            'id'         => (int) $item->id,
            'key'        => $item->key,
            'value'      => $value,
            'created_at' => wedevs_pm_format_date( $item->created_at ),
        ];
    }

    /**
     * Mask API key showing only first 2 and last 2 characters
     * Example: "api_key" becomes "ap***ey"
     * Maximum length: 30 characters
     *
     * @param string $api_key
     * @return string
     */
    private function mask_api_key( $api_key ) {
        if ( empty( $api_key ) || strlen( $api_key ) <= 4 ) {
            // If key is too short, just return asterisks (max 30)
            $mask_length = min( strlen( $api_key ), 30 );
            return str_repeat( '*', $mask_length );
        }

        $first_two = substr( $api_key, 0, 2 );
        $last_two = substr( $api_key, -2 );
        
        // Maximum total length is 30 chars: first 2 + asterisks + last 2
        // So maximum asterisks = 30 - 2 - 2 = 26
        $max_asterisks = 26;
        $middle_asterisks = str_repeat( '*', $max_asterisks );

        $masked = $first_two . $middle_asterisks . $last_two;
        
        // Ensure it's exactly 30 characters
        return substr( $masked, 0, 30 );
    }

    /**
     * Getter for defaultIncludes.
     *
     * @return array
     */
    public function getDefaultIncludes()
    {
        return apply_filters( "wedevs_pm_setting_transformer_default_includes", $this->defaultIncludes );
    }
}