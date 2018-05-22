<?php

namespace WeDevs\PM\Discussion_Board\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Discussion_Board extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Discuss title is required.', 'pm' ),
            'id.required'    => __( 'Discuss id is required.', 'pm' ),
            'id.gtz'         => __( 'Discuss id must be greater than zero', 'pm' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}