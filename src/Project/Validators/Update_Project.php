<?php

namespace WeDevs\PM\Project\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Project extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Project title is required.', 'wedevs-project-manager' ),
            'id.required'    => __( 'Project ID is required.', 'wedevs-project-manager' ),
            'id.gtz'         => __( 'Project ID must be greater than zero', 'wedevs-project-manager' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}
