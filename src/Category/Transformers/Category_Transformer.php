<?php

namespace WeDevs\PM\Category\Transformers;

use WeDevs\PM\Category\Models\Category;
use League\Fractal\TransformerAbstract;
use WeDevs\PM\Common\Traits\Resource_Editors;

class Category_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        'creator', 'updater',
    ];

    public function transform( Category $item ) {
        return [
            'id'               => (int) $item->id,
            'title'            => $item->title,
            'description'      => $item->description,
            'categorible_type' => $item->categorible_type,
            'created_at'       => format_date( $item->created_at ),
        ];
    }

    /**
     * Getter for defaultIncludes.
     *
     * @return array
     */
    public function getDefaultIncludes()
    {
        // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- Hook name is part of public API
        return apply_filters( "pm_category_transformer_default_includes", $this->defaultIncludes );
    }
}