<?php

namespace WeDevs\PM\Category\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Create_Category extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Category title is required.', 'wedevs-project-manager' ),
        ];
    }

    public function rules() {
        return [
            'title'  => 'required',
        ];
    }
}