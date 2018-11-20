<?php

return [
    'name'        => 'Project Manager',
    'slug'        => 'pm',
    'version'     => '2.0.7',
    'api'     	  => '2',
    'db_version'  => '2.2',
    'text_domain' => 'pm',
    'comment_per_page' => 200,
    'allowed_html' => [
        'a'      => [ 'href' => [], 'title' => [] ],
        'br'     => [],
        'em'     => [],
        'strong' => [],
        'span'   => ['style' =>[], 'class' => [], 'id' =>[], 'data-pm-user-id' => [], 'data-pm-user' => [], 'name' => [], 'title' => []],
        'b'      => [],
        'em'     => [],
        'p'      => [],
        'code'   => [],
        'pre'    => [],
    ]

];
