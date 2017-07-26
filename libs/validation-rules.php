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