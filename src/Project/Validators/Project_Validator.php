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
       global $wp_rest_server, $wp_query, $wp; 
       //$wp_rest_server->serve_request();
       var_dump($wp); die();
      // $kk = new \WP_REST_Request();

       //$kk->set_body( $wp_rest_server->get_raw_data() );
       
       //echo '<pre>'; print_r( $kk->get_body() ); echo '</pre>';
       // echo '<pre>'; print_r( $wp_rest_server->get_raw_data() ); echo '</pre>'; die();
        // return [
        //     'title'  => 'required',
        //     'status' => 'required'
        // ];
    }
}