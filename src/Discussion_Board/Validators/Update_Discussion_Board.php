<?php

namespace WeDevs\PM\Discussion_Board\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Discussion_Board extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Discussion title is required.', 'wedevs-project-manager' ),
            'id.required'    => __( 'Discussion ID is required.', 'wedevs-project-manager' ),
            'id.gtz'         => __( 'Discussion ID must be greater than zero', 'wedevs-project-manager' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}
