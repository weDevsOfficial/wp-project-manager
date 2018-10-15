<?php

function required( $value ) {
    return trim( $value );
}

function numeric( $value ) {
    return is_numeric( $value );
}

function email( $value ) {
    return is_email( $value );
}

//Greater than zero (gtz)
function gtz( $value ) {

	$filter_options = array( 
	    'options' => array( 'min_range' => 1 ) 
	);

	if( filter_var( $value, FILTER_VALIDATE_INT, $filter_options ) !== FALSE) {
		return true;
	} 

	return false;
}

function pm_unique ($value, $args){
	// Listing all the variables
	list($model, $collumn) = $args;
	if ( empty( $collumn ) ) {
		$collumn = 'title';
	}

	$calssname = "WeDevs\PM\\" .$args[0]. "\\Models\\" .$args[0];
	if ( class_exists( $calssname ) ) {
		return ! $calssname::where($collumn, $value )->exists();
	}

	return false;
}

