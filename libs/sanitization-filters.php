<?php

function absolute( $value ) {
    return abs( $value );
}

function trimer( $value ) {
	return trim( $value );
}

function html_esc( $value ) {
	return esc_html( $value );
}

function pm_kses($value) {
	return wp_kses($value, pm_config('app.allowed_html'), ['http', 'https', 'mailto', 'feed']);
}