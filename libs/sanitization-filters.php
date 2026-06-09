<?php

function wedevs_pm_absolute( $value ) {
    return ( null === $value || '' === $value ) ? '' : abs( $value );
}

function wedevs_pm_trimer( $value ) {
	return ( null === $value || '' === $value ) ? '' : trim( $value );
}

function wedevs_pm_html_esc( $value ) {
	return ( null === $value || '' === $value ) ? '' : esc_html( $value );
}

// WP core's safecss_filter_attr() only allows the css functions
// calc/clamp/min/max/minmax/repeat/var inside inline styles, so it strips
// `color: rgb(...)` / `rgba(...)` outright. Browsers (and Tiptap on serialize)
// normalize colors to rgb(), which means rich-text colors get dropped on save.
// Convert rgb()/rgba() to hex up front so the value survives wp_kses. Scoped to
// style="..." attributes so literal `rgb(...)` text in comment bodies is left alone.
function wedevs_pm_rgb_to_hex_value( $css ) {
    return preg_replace_callback(
        '#rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([0-9]*\.?[0-9]+)\s*)?\)#i',
        function ( $m ) {
            $r = min( 255, (int) $m[1] );
            $g = min( 255, (int) $m[2] );
            $b = min( 255, (int) $m[3] );
            $hex = sprintf( '#%02x%02x%02x', $r, $g, $b );

            if ( isset( $m[4] ) && '' !== $m[4] ) {
                $a = max( 0, min( 1, (float) $m[4] ) );
                $hex .= sprintf( '%02x', (int) round( $a * 255 ) );
            }

            return $hex;
        },
        $css
    );
}

function wedevs_pm_rgb_to_hex( $value ) {
    return preg_replace_callback(
        '#\bstyle\s*=\s*(["\'])(.*?)\1#is',
        function ( $m ) {
            return 'style=' . $m[1] . wedevs_pm_rgb_to_hex_value( $m[2] ) . $m[1];
        },
        $value
    );
}

function wedevs_pm_kses($value) {
    if ( null === $value || '' === $value ) {
        return '';
    }

    $value = wedevs_pm_rgb_to_hex( $value );

    // Hold valid `data:image/*;base64,...` URIs from <img src=""> aside so
    // wp_kses can strip `data:` from every other context (anchors, iframes,
    // object data, etc.) without losing legitimate inline images.
    $data_img_placeholders = [];
    $value = preg_replace_callback(
        '#<img\b([^>]*?)\bsrc\s*=\s*(["\'])(data:image/(?:png|jpe?g|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=\s]+)\2#i',
        function ( $matches ) use ( &$data_img_placeholders ) {
            $token = '__PM_DATA_IMG_' . count( $data_img_placeholders ) . '__';
            $data_img_placeholders[ $token ] = $matches[3];
            return '<img' . $matches[1] . 'src=' . $matches[2] . $token . $matches[2];
        },
        $value
    );

    $allowed = wp_kses_allowed_html( 'post' );

    // Preserve table styling from Excel / Word paste (bgcolor, borders, widths,
    // merged-cell + header attributes).
    $table_extra = [
        'bgcolor'     => true,
        'width'       => true,
        'height'      => true,
        'border'      => true,
        'cellpadding' => true,
        'cellspacing' => true,
        'align'       => true,
        'valign'      => true,
        'colspan'     => true,
        'rowspan'     => true,
        'scope'       => true,
        'style'       => true,
        'class'       => true,
    ];

    foreach ( [ 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption', 'col', 'colgroup' ] as $tag ) {
        $allowed[ $tag ] = array_merge( $allowed[ $tag ] ?? [], $table_extra );
    }

    // Preserve Tiptap inline formatting. wp_kses still filters the CSS value
    // through WordPress' safe CSS list, so unsafe properties are stripped.
    $rich_text_extra = [
        'style' => true,
        'class' => true,
    ];

    foreach ( [ 'span', 'mark', 'p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ] as $tag ) {
        $allowed[ $tag ] = array_merge( $allowed[ $tag ] ?? [], $rich_text_extra );
    }

    $clean = wp_kses( $value, $allowed, [ 'http', 'https', 'mailto', 'feed' ] );

    if ( ! empty( $data_img_placeholders ) ) {
        $clean = strtr( $clean, $data_img_placeholders );
    }

    return $clean;
}
