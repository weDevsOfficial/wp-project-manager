<?php

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function name is part of public API
function absolute( $value ) {
    return empty($value) ? '' : abs( $value );
}

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function name is part of public API
function trimer( $value ) {
	return empty( $value ) ? '' : trim( $value );
}

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function name is part of public API
function html_esc( $value ) {
	return empty( $value ) ? '' : esc_html( $value );
}

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function name is part of public API
function pm_kses($value) {
	return empty( $value ) ? '' : wp_kses( $value, wp_kses_allowed_html( 'post' ), ['http', 'https', 'mailto', 'feed'] );
}
