<?php

namespace WeDevs\PM\Discussion_Board\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Create_Discussion_Board extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Discussion title is required.', 'wedevs-project-manager' ),
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