<?php

namespace CPM\Foo\Validators;

use CPM\Core\Validator\Abstract_Validator;

class Foo_Validator extends Abstract_Validator {
    public function messages() {
        return [
            'title.required'       => 'Title field is required.',
            'description.required' => 'Description field is required.',
            'email.required'       => 'Email field is required.',
            'email.email'          => 'Email field should contain a valid email address.',
        ];
    }

    public function rules() {
        return [
            'title'       => 'required',
            'description' => 'required',
            'email'       => 'required|email'
        ];
    }
}