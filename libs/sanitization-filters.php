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

function wedevs_pm_kses($value) {
    if ( null === $value || '' === $value ) {
        return '';
    }

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

    $clean = wp_kses( $value, $allowed, [ 'http', 'https', 'mailto', 'feed' ] );

    if ( ! empty( $data_img_placeholders ) ) {
        $clean = strtr( $clean, $data_img_placeholders );
    }

    return $clean;
}
