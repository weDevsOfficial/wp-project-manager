<?php

namespace WeDevs\PM\Role\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Role extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Role title is required.', 'wedevs-project-manager' ),
            'id.required'    => __( 'Role id is required.', 'wedevs-project-manager' ),
            'id.gtz'         => __( 'Role id must be greater than zero', 'wedevs-project-manager' ),
        ];
    }

    public function rules() {
        return [
            'title' => 'required',
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}