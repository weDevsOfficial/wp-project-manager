<?php

namespace CPM\Project\Validators;

use CPM\Core\Validator\Abstract_Validator;

class Create_Project extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Project title is required.', 'cpm' ),
        ];
    }

    public function rules() {
        return [
            'title'  => 'required',
        ];
    }
}