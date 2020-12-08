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
        return [
            'id'         => (int) $item->id,
            'key'        => $item->key,
            'value'      => $item->value,
            'created_at' => format_date( $item->created_at ),
        ];
    }

    /**
     * Getter for defaultIncludes.
     *
     * @return array
     */
    public function getDefaultIncludes()
    {
        return apply_filters( "pm_setting_transformer_default_includes", $this->defaultIncludes );
    }
}