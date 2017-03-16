<?php

/**
 * Checking form data under a set of validation rules
 * 
 * @author weDevs
 */

// $validator = new CPM_Validator();

// $rules = [
//     'tasklist_name' => 'required',
//     'tasklist_detail' => 'required|email',
// ];

// $errorMessages = [
//     'tasklist_name.required' => __( 'Todo list name is required.', 'cpm' ),
//     'tasklist_detail.required' => __( 'Todo list detail is required.', 'cpm' ),
//     'tasklist_detail.email' => __( 'Todo list detail is email field.', 'cpm' ),
// ];

// if ( !$validator->validate( $posted, $rules ) ) {
//     $validator->sendJsonErrors();
// }

class CPM_Validator {

    protected $rules = [];

    protected $errors = [];

    protected $messages;

    function __construct() {
        $this->rules = [
            'required',
            'email',
        ];
    }

    public function validate( $data, $ruleSet, $messages = null ) {
        $this->messages = $messages;
        $this->validateDataKeys( $data, $ruleSet );
        
        foreach ( $data as $key => $value ) {
            if ( array_key_exists( $key, $ruleSet ) ) {
                $this->applyRules( $key, $value, $ruleSet[$key] );
            }
        }

        if ( empty( $this->errors ) ) {
            return true;
        }

        return false;
    }

    public function sendJsonErrors() {
        $wpErrors = new WP_Error();

        foreach ( $this->errors as $key => $messages ) {
            foreach ( $messages as $message ) {
                $wpErrors->add( $key, $message );
            }
        }

        wp_send_json_error( array( 'error' => $wpErrors->get_error_messages() ) );
    }

    public function getErrors() {
        return $this->errors;
    }

    protected function validateDataKeys( $data, $ruleSet ) {
        $dataKeys = array_keys( $data );
        $requiredKeys = array_keys( $ruleSet );

        foreach ( $requiredKeys as $key ) {
            if (!in_array( $key, $dataKeys )) {
                $message = ucfirst( str_replace( '_', ' ', $key ) );
                $this->errors[$key][] =  isset( $this->messages[$key . '.required'] )
                    ? $this->messages[$key . '.required']
                    : $message . __( ' is required.', 'cpm' );
            }
        }
    }

    public function applyRules( $key, $value, $rules ) {
        foreach ( $this->explodeRules( $rules ) as $rule ) {
            if ( in_array( $rule, $this->rules ) ) {
                $this->$rule($key, $value);
            }
        }
    }

    protected function explodeRules( $rules ) {
        return explode( '|', $rules );
    }

    protected function required( $key, $value ) {
        if ( !trim( $value ) ) {
            $message = ucfirst( str_replace( '_', ' ', $key ) );
            $this->errors[$key][] =  isset( $this->messages[$key . '.required'] )
                ? $this->messages[$key . '.required']
                : $message . __( ' is required.', 'cpm' );
        }
    }

    protected function email( $key, $value ) {
        if ( !is_email( $value ) ) {
            $message = ucfirst( str_replace( '_', ' ', $key ) );
            $this->errors[$key][] =  isset( $this->messages[$key . '.email'] )
                ? $this->messages[$key . '.email']
                : $message . __( ' is email field.', 'cpm' );
        }
    }
}