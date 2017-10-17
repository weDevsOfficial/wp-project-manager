<?php

namespace PM\Project\Validators;

use PM\Core\Validator\Abstract_Validator;

class Update_Project extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Project title is required.', 'cpm' ),
            'id.required'    => __( 'Project id is required.', 'cpm' ),
            'id.gtz'         => __( 'Project id must be greater than zero', 'cpm' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}