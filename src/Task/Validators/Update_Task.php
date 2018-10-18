<?php

namespace WeDevs\PM\Task\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Task extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Task title is required.', 'wedevs-project-manager' ),
            'id.required'    => __( 'Task ID is required.', 'wedevs-project-manager' ),
            'id.gtz'         => __( 'Task ID must be greater than zero', 'wedevs-project-manager' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}
