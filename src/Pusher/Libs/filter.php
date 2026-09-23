<?php

function wedevs_pm_pusher_localize( $localize ) {
    // The browser only needs the app key and cluster; the secret and app ID stay server-side.
    if ( isset( $localize['settings'] ) && ! wedevs_pm_has_manage_capability() ) {
        unset( $localize['settings']['pusher_secret'], $localize['settings']['pusher_app_id'] );
    }

    return $localize;
}
