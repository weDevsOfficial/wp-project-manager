<?php

/**
 * Checking form data under a set of validation rules
 * 
 * @author weDevs
 */
class CPM_Validator {

    protected $rules = array();

    protected $errors = array();

    protected $messages = array();

    function __construct() {
        $this->rules = [
            'required',
            'email',
            'date',
        ];
    }

    public function validate( $data, $rule_set, $messages = array() ) {
        $this->messages = $messages;
        $this->validate_data_keys( $data, $rule_set );
        
        foreach ( $data as $key => $value ) {
            if ( array_key_exists( $key, $rule_set ) ) {
                $this->apply_rules( $key, $value, $rule_set[$key] );
            }
        }

        if ( empty( $this->errors ) ) {
            return true;
        }

        return false;
    }

    public function send_json_errors() {
        $wp_errors = new WP_Error();

        foreach ( $this->errors as $key => $messages ) {
            foreach ( $messages as $message ) {
                $wp_errors->add( $key, $message );
            }
        }

        wp_send_json_error( array( 'error' => $wp_errors->get_error_messages() ) );
    }

    public function get_errors() {
        return $this->errors;
    }

    protected function validate_data_keys( $data, $rule_set ) {
        $data_keys = array_keys( $data );
        $required_keys = $this->find_required_keys( $rule_set );
        
        foreach ( $required_keys as $key ) {
            if (!in_array( $key, $data_keys )) {
                $message = ucfirst( str_replace( '_', ' ', $key ) );
                $this->errors[$key][] =  isset( $this->messages[$key . '.required'] )
                    ? $this->messages[$key . '.required']
                    : $message . __( ' is required.', 'cpm' );
            }
        }
    }

    protected function find_required_keys( $ruleSet ) {
        $required_keys = array();

        foreach ( $ruleSet as $key => $rules ) {
            $rules = $this->explode_rules( $rules );
            if ( in_array('required', $rules ) ) {
                $required_keys[] = $key;
            }
        }
        
        return $required_keys;
    }

    protected function apply_rules( $key, $value, $rules ) {
        foreach ( $this->explode_rules( $rules ) as $rule ) {
            if ( in_array( $rule, $this->rules ) ) {
                $this->$rule($key, $value);
            }
        }
    }

    protected function explode_rules( $rules ) {
        return explode( '|', $rules );
    }

    protected function required( $key, $value ) {
        if ( !trim( $value ) ) {
            $field_name = ucfirst( str_replace( '_', ' ', $key ) );
            $this->errors[$key][] =  isset( $this->messages[$key . '.required'] )
                ? $this->messages[$key . '.required']
                : $field_name . __( ' is required.', 'cpm' );
        }
    }

    protected function email( $key, $value ) {
        if ( !is_email( $value ) ) {
            $field_name = ucfirst( str_replace( '_', ' ', $key ) );
            $this->errors[$key][] =  isset( $this->messages[$key . '.email'] )
                ? $this->messages[$key . '.email']
                : $field_name . __( ' is email field.', 'cpm' );
        }
    }

    protected function date( $key, $value ) {
        $date = trim( $value );
        $d = DateTime::createFromFormat( 'Y-m-d', $date );

        if ( !( $d && $d->format( 'Y-m-d' ) == $date ) ) {
            $field_name = ucfirst( str_replace( '_', ' ', $key ) );
            $this->errors[$key][] =  isset( $this->messages[$key . '.date'] )
                ? $this->messages[$key . '.date']
                : $field_name . __( ' is a date field and should be formated as Y-m-d.', 'cpm' );
        }

    }
}

/**
 * Usage of CPM_Validator class for form data validation
 *
 * $validator = new CPM_Validator();
 * 
 * $rules = [
 *   'tasklist_name' => 'required',
 *   'tasklist_detail' => 'required|email',
 * ];
 * 
 * $error_messages = [
 *   'tasklist_name.required' => __( 'Task list name is required.', 'cpm' ),
 *   'tasklist_detail.required' => __( 'Todo list detail is required.', 'cpm' ),
 *   'tasklist_detail.email' => __( 'Todo list detail is email field.', 'cpm' ),
 * ];

 * if ( !$validator->validate( $posted, $rules ) ) {
 *   $validator->send_json_errors();
 * }
 */