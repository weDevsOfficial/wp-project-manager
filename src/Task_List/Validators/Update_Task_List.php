<?php

namespace WeDevs\PM\Task_List\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Task_List extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Task list title is required.', 'pm' ),
            'id.required'    => __( 'Task list id is required.', 'pm' ),
            'id.gtz'         => __( 'Task list id must be greater than zero', 'pm' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}