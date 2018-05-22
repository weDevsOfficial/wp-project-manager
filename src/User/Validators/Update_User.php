<?php

namespace WeDevs\PM\Project\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Project extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Project title is required.', 'pm' ),
            'id.required'    => __( 'Project id is required.', 'pm' ),
            'id.gtz'         => __( 'Project id must be greater than zero', 'pm' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}