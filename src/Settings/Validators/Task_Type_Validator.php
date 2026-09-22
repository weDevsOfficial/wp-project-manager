<?php

namespace WeDevs\PM\Settings\Validators;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Task_Type_Validator extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Type name is required', 'wedevs-project-manager' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
        ];
    }
}
