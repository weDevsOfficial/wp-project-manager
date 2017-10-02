<?php

return [
    'create-project'                     => [
        __( 'has created a project titled "%s".', config( 'app.text_domain' ) ), ['title']
    ],
    'update-project-title'               => [
        __( 'has updated project title from "%s" to "%s".', config( 'app.text_domain' ) ), ['old', 'new']
    ],
    'update-project-description'         => [
        __( 'has updated project description.', config( 'app.text_domain' ) ),
    ],
    'update-project-status'              => [
        __( 'has updated project status from "%s" to "%s".', config( 'app.text_domain' ) ), ['old', 'new']
    ],
    'update-project-budget'              => [
        __( 'has updated project budget from "%0.2f" to "%0.2f".', config( 'app.text_domain' ) ), ['old', 'new']
    ],
    'update-project-pay-rate'            => [
        __('has updated project pay rate from "%0.2f" to "%0.2f".', config( 'app.text_domain') ), ['old', 'new']
    ],
    'update-project-est-completion-date' => [
        __( 'has updated project est completion date from "%s" to "%s".', config( 'app.text_domain' ) ), ['old.date', 'new.date']
    ],
    'update-project-color-code'          => [
        __( 'has updated project color code from "%s" to "%s".', config( 'app.text_domain' ) ), ['old', 'new']
    ],
];