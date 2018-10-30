<?php

namespace WeDevs\PM\Role\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Create_Role extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Role title is required.', 'wedevs-project-manager' ),
        ];
    }

    public function rules() {
        return [
            'title'  => 'required',
            'description' => 'pm_kses',
        ];
    }
}