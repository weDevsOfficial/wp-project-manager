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
        
        if ( in_array( $item->key, $hideSettings ) && strpos( $item->key, 'ai_api_key_' ) !== 0 && $item->key !== 'github_access_token' && $item->key !== 'notion_access_token' ) {
            $value = !empty( $value ) ? true : false;
        }
        
        return [
            'id'         => (int) $item->id,
            'key'        => $item->key,
            'value'      => $value,
            'created_at' => wedevs_pm_format_date( $item->created_at ),
        ];
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