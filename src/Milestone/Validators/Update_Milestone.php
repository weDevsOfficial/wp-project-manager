<?php

namespace WeDevs\PM\Milestone\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Milestone extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Milestone title is required.', 'wedevs-project-manager' ),
            'id.required'    => __( 'Milestone ID is required.', 'wedevs-project-manager' ),
            'id.gtz'         => __( 'Milestone ID must be greater than zero', 'wedevs-project-manager' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}
