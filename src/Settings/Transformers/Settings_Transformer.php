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
        $hideSettings = \WeDevs\PM\Settings\Models\Settings::$hideSettings;
        $value = $item->value;

        // Never expose secrets in the standard settings response. Frontend
        // gets a boolean "is set" flag for hidden keys; clear values are only
        // available via Settings_Controller::reveal (manage_options + nonce).
        if ( in_array( $item->key, $hideSettings, true ) ) {
            $value = ! empty( $value );
        }

        return [
            'id'         => (int) $item->id,
            'key'        => $item->key,
            'value'      => $value,
            'created_at' => wedevs_pm_format_date( $item->created_at ),
        ];
    }

    /**
     * Mask a secret showing first 2 + last 2 chars, max 30 chars total.
     *
     * @param string $secret
     * @return string
     */
    public static function mask_secret( $secret ) {
        $secret = (string) $secret;
        $len    = strlen( $secret );

        if ( $len === 0 ) {
            return '';
        }

        if ( $len <= 4 ) {
            return str_repeat( '*', min( $len, 30 ) );
        }

        $masked = substr( $secret, 0, 2 ) . str_repeat( '*', 26 ) . substr( $secret, -2 );

        return substr( $masked, 0, 30 );
    }

    public function getDefaultIncludes()
    {
        return apply_filters( "wedevs_pm_setting_transformer_default_includes", $this->defaultIncludes );
    }
}
