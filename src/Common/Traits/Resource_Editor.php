<?php

namespace CPM\Common\Traits;

use CPM\User\Transformers\User_Transformer;

trait Resource_Editor {

    public function includeCreator( $item ) {
        $creator = $item->creator;

        return $this->item( $creator, new User_Transformer );
    }

    public function includeUpdater( $item ) {
        $updater = $item->updater;

        return $this->item ( $updater, new User_Transformer );
    }
}