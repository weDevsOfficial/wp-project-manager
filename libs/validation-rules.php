<?php

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function name is part of public API
function required( $value ) {
    return trim( $value );
}

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function name is part of public API
function numeric( $value ) {
    return is_numeric( $value );
}

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function name is part of public API
function email( $value ) {
    return is_email( $value );
}

//Greater than zero (gtz)
// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function name is part of public API
function gtz( $value ) {

	$filter_options = array( 
	    'options' => array( 'min_range' => 1 ) 
	);

	if( filter_var( $value, FILTER_VALIDATE_INT, $filter_options ) !== FALSE) {
		return true;
	} 

	return false;
}

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function name is part of public API
function pm_unique ($value, $args) {
	// Listing all the variables
	list($model, $collumn) = $args;
	if ( empty( $collumn ) ) {
		$collumn = 'title';
	}

	
	$id = empty( $args[2] ) ? 0 : intval( $args[2] );
	

	$calssname = "WeDevs\PM\\" .$model. "\\Models\\" .$model;
	if ( class_exists( $calssname ) ) {
		return ! $calssname::where($collumn, $value )->where('id', '!=', $id)->exists();
	}

	return false;
}

