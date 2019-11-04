<?php

function PM_pusher_localize( $localize ) {
    if( isset( $localize['settings']['pusher_secret'] ) ) {
        if ( ! pm_has_manage_capability() ) {
            unset( $localize['settings']['pusher_secret'] );
        }

    }

    return $localize;
}
