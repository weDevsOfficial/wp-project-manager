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

