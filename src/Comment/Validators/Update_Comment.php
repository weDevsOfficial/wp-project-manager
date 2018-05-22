<?php

namespace WeDevs\PM\Comment\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Comment extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Comment title is required.', 'pm' ),
            'id.required'    => __( 'Comment id is required.', 'pm' ),
            'id.gtz'         => __( 'Comment id must be greater than zero', 'pm' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}