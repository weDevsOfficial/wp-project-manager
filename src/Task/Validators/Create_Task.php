<?php

namespace WeDevs\PM\Task\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Create_Task extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Task title is required.', 'wedevs-project-manager' ),
            'project_id.required' => __( 'Project ID is required.', 'wedevs-project-manager' ),
        ];
    }

    public function rules() {
        return [
            'title'      => 'required',
            'project_id' => 'required'
        ];
    }
}