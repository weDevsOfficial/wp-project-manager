<?php
$text_domain = config( 'app.text_domain' );

return [
    'create-project' => __( 'has created a project ', $text_domain ),
    'update-project-title' => __( 'has updated project title from ', $text_domain ) . '\'{$old}\' ' . __( 'to ', $text_domain ) . '\'{$new}\'',
    'update-project-description' => __( 'has updated project description', $text_domain ),
    'update-project-status' => __( 'has updated project status from ', $text_domain ) . '\'{$old}\' ' . __( 'to ', $text_domain ) . '\'{$new}\'',
    'update-project-budget' => __( 'has updated project budget from ', $text_domain ) . '\'{$old}\' ' . __( 'to ', $text_domain ) . '\'{$new}\'',
    'update-project-pay-rate' => __( 'has updated project pay rate from ', $text_domain ) . '\'{$old}\' ' . __( 'to ', $text_domain ) . '\'{$new}\'',
    'update-project-est-completion-date' => __( 'has updated project est completion date from ', $text_domain ) . '\'{$old}\' ' . __( 'to ', $text_domain ) . '\'{$new}\'',
    'update-project-color-code' => __( 'has updated project color code from ', $text_domain ) . '\'{$old}\' ' . __( 'to ', $text_domain ) . '\'{$new}\'',
    // 'update-project-title' => sprintf( __( 'has updated project title from $old to $new', $text_domain ), $old, $new ),
];