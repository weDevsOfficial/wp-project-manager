<?php
$text_domain = config( 'app.text_domain' );

return [
    'update-project-title' => __( 'has updated project title ', $text_domain ) . '{$old} ' . __( 'to ', $text_domain ) . '{$new}',
    // 'update-project-title' => sprintf( __( 'has updated project title from $old to $new', $text_domain ), $old, $new ),
];