<?php

namespace WeDevs\PM\User\Helper;

class Avatar {

    /**
     * Fallback chain: local plugin avatar → Gravatar → empty string.
     * Empty string signals frontend to render initials.
     */
    public static function get_url( $user_id_or_email, $size = 96 ) {
        $user_id = self::resolve_user_id( $user_id_or_email );

        $local = self::get_local_avatar( $user_id, $size );
        if ( $local ) {
            return $local;
        }

        $email = self::resolve_email( $user_id_or_email, $user_id );
        if ( $email ) {
            return get_avatar_url( $email, [ 'size' => $size ] );
        }

        return '';
    }

    private static function get_local_avatar( $user_id, $size ) {
        if ( ! $user_id ) {
            return null;
        }

        // Simple Local Avatars plugin
        $sla = get_user_meta( $user_id, 'simple_local_avatar', true );
        if ( ! empty( $sla['full'] ) ) {
            return $sla['full'];
        }

        // WP User Avatars plugin
        $wua = get_user_meta( $user_id, 'wp_user_avatars', true );
        if ( ! empty( $wua['full'] ) ) {
            return $wua['full'];
        }

        // ProfilePress / WP User Avatar (stores attachment ID)
        $attachment_id = get_user_meta( $user_id, 'wp_user_avatar', true );
        if ( ! empty( $attachment_id ) ) {
            $url = wp_get_attachment_url( (int) $attachment_id );
            if ( $url ) {
                return $url;
            }
        }

        // Allow other plugins to provide a local avatar URL
        $custom = apply_filters( 'wedevs_pm_user_avatar_url', null, $user_id, $size );
        if ( $custom ) {
            return $custom;
        }

        return null;
    }

    private static function resolve_user_id( $user_id_or_email ) {
        if ( is_numeric( $user_id_or_email ) ) {
            return (int) $user_id_or_email;
        }
        if ( is_string( $user_id_or_email ) && is_email( $user_id_or_email ) ) {
            $user = get_user_by( 'email', $user_id_or_email );
            return $user ? $user->ID : null;
        }
        if ( is_object( $user_id_or_email ) && isset( $user_id_or_email->ID ) ) {
            return (int) $user_id_or_email->ID;
        }
        return null;
    }

    private static function resolve_email( $user_id_or_email, $user_id ) {
        if ( is_string( $user_id_or_email ) && is_email( $user_id_or_email ) ) {
            return $user_id_or_email;
        }
        if ( $user_id ) {
            $user = get_userdata( $user_id );
            return $user ? $user->user_email : null;
        }
        return null;
    }
}
