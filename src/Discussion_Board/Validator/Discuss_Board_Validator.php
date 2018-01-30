<?php
namespace WeDevs\PM\Core\Validator;

use WeDevs\PM_Pro\Core\Validator\Abstract_Validator;

Class Time_Tracker_Validator extends Abstract_Validator {

    public function messages() {
        return [
            'title.required' => 'Title field is required.',
        ];
    }
    public function rules() {
        return [
            'title' => 'required',
        ];
    }
}