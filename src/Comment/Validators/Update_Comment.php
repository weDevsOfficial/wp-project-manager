<?php

namespace WeDevs\PM\Comment\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Comment extends Abstract_Validator {
    public function messages() {
        return [
            'content.required' => __( 'Comment title is required.', 'wedevs-project-manager' ),
            'id.required'      => __( 'Comment ID is required.', 'wedevs-project-manager' ),
            'id.gtz'           => __( 'Comment ID must be greater than zero', 'wedevs-project-manager' ),
        ];
    }

    public function rules() {
        return [
            'content' => 'required',
            'id'      => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}
