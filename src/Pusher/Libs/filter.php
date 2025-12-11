<?php

function wedevs_pm_pusher_localize( $localize ) {
    if( isset( $localize['settings']['pusher_secret'] ) ) {
        if ( ! wedevs_pm_has_manage_capability() ) {
            unset( $localize['settings']['pusher_secret'] );
        }

    }

    return $localize;
}
