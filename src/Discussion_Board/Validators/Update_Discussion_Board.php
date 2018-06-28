<?php

namespace WeDevs\PM\Discussion_Board\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Discussion_Board extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Discuss title is required.', 'wedevs-project-manager' ),
            'id.required'    => __( 'Discuss id is required.', 'wedevs-project-manager' ),
            'id.gtz'         => __( 'Discuss id must be greater than zero', 'wedevs-project-manager' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}