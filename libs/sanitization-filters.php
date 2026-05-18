<?php

function wedevs_pm_absolute( $value ) {
    return empty($value) ? '' : abs( $value );
}

function wedevs_pm_trimer( $value ) {
	return empty( $value ) ? '' : trim( $value );
}

function wedevs_pm_html_esc( $value ) {
	return empty( $value ) ? '' : esc_html( $value );
}

function wedevs_pm_kses($value) {
    if ( empty( $value ) ) {
        return '';
    }

    $allowed = wp_kses_allowed_html( 'post' );

    // Preserve table styling from Excel / Word paste (bgcolor, borders, widths).
    $table_extra = [
        'bgcolor'     => true,
        'width'       => true,
        'height'      => true,
        'border'      => true,
        'cellpadding' => true,
        'cellspacing' => true,
        'align'       => true,
        'valign'      => true,
        'style'       => true,
        'class'       => true,
    ];

    foreach ( [ 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption', 'col', 'colgroup' ] as $tag ) {
        $allowed[ $tag ] = array_merge( $allowed[ $tag ] ?? [], $table_extra );
    }

    return wp_kses( $value, $allowed, [ 'http', 'https', 'mailto', 'feed', 'data' ] );
}
