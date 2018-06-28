<?php

namespace WeDevs\PM\Common\Traits;

use WeDevs\PM\User\Transformers\User_Transformer;

trait Resource_Editors {

    public function includeCreator( $item ) {
        $creator = $item->creator;
        return $this->item( $creator, new User_Transformer );
    }

    public function includeUpdater( $item ) {
        $updater = $item->updater;

        return $this->item ( $updater, new User_Transformer );
    }
}