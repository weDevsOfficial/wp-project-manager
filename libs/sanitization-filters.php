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
    return empty( $value ) ? '' : wp_kses( $value, wp_kses_allowed_html( 'post' ), ['http', 'https', 'mailto', 'feed'] );
}
