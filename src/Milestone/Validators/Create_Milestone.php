<?php

namespace WeDevs\PM\Milestone\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Create_Milestone extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Milestone title is required.', 'wedevs-project-manager' ),
            'project_id.required' => __( 'Project id is required.', 'wedevs-project-manager' ),
        ];
    }

    public function rules() {
        return [
            'title'      => 'required',
            'project_id' => 'required'
        ];
    }
}