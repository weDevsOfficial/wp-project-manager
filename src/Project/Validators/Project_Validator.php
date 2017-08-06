<?php

namespace CPM\Project\Validators;

use CPM\Core\Validator\Abstract_Validator;

class Project_Validator extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Title field is required.', 'cpm' ),
            'status.required' => __( 'Status field is required.', 'cpm' )
        ];
    }

    public function rules() {
        return [
            'title'  => 'required',
            'status' => 'required'
        ];
    }
}