<?php

namespace WeDevs\PM\Milestone\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Milestone extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Milestone title is required.', 'pm' ),
            'id.required'    => __( 'Milestone id is required.', 'pm' ),
            'id.gtz'         => __( 'Milestone id must be greater than zero', 'pm' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}