<?php

namespace WeDevs\PM\Project\Validators;

use WeDevs\PM\Core\Validator\Abstract_Validator;

class Update_Project extends Abstract_Validator {
    public function messages() {
        return [
            'title.required' => __( 'Project title is required.', 'wedevs-project-manager' ),
            'title.pm_unique' => __( 'Project title must be unique.', 'wedevs-project-manager' ),
            'id.required'    => __( 'Project ID is required.', 'wedevs-project-manager' ),
            'id.gtz'         => __( 'Project ID must be greater than zero', 'wedevs-project-manager' ),
        ];
    }

    public function rules() {
        $id = $this->request->get_param( 'id' );
        if(is_array( $id )) {
            return [];
        }
        return [
            'title' => 'required|pm_unique:Project,title,'.$id,
            'id'    => 'required|gtz', //Greater than zero (gtz)
        ];
    }
}
