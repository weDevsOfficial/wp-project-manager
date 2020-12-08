<?php

namespace WeDevs\PM\Project\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Create_Project extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Project title is required.', 'wedevs-project-manager' ),
            'title.pm_unique' => __( 'Project title must be unique.', 'wedevs-project-manager' ),
        ];
    }

    public function rules() {
        
        if ( apply_filters( 'pm_check_project_title_unique', true ) ) {
            return [
                'title'  => 'required|pm_unique:Project,title',
            ];
        } 
        
        return [
            'title'  => 'required',
        ];
    }
}
