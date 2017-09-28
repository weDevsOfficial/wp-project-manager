<?php

namespace CPM\Category\Transformer;

use CPM\Category\Models\Category;
use League\Fractal\TransformerAbstract;
use CPM\User\Transformers\User_Transformer;

class Category_Transformer extends TransformerAbstract {

    protected $defaultIncludes = [
        'creator', 'updater',
    ];

    public function transform( Category $item ) {
        return [
            'id' => (int) $item->id,
            'title' => $item->title,
            'description' => $item->description,
            'categorible_type' => $item->categorible_type,
        ];
    }

    public function includeCreator( Category $item ) {
        $creator = $item->creator;

        return $this->item( $creator, new User_Transformer );
    }

    public function includeUpdater ( Category $item ) {
        $updater = $item->updater;

        return $this->item( $updater, new User_Transformer );
    }
}