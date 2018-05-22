<?php

namespace WeDevs\PM\Category\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Category extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Category title is required.', 'pm' ),
            'id.required'    => __( 'Category id is required.', 'pm' ),
            'id.gtz'         => __( 'Category id must be greater than zero', 'pm' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}