<?php

namespace WeDevs\PM\Comment\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Create_Comment extends Abstract_Validator {
    public function messages() {
        return [
            'content.required' => __( 'Comment title is required.', 'pm' ),
            'project_id.required' => __( 'Project id is required.', 'pm' ),
        ];
    }

    public function rules() {
        return [
            'content'    => 'required',
            'project_id' => 'required'
        ];
    }
}