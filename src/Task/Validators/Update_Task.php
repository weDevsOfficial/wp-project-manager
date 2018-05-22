<?php

namespace WeDevs\PM\Task\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Task extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Task title is required.', 'pm' ),
            'id.required'    => __( 'Task id is required.', 'pm' ),
            'id.gtz'         => __( 'Task id must be greater than zero', 'pm' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}